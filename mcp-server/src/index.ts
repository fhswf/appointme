import "dotenv/config";
import "./instrument.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios from "axios";
import { z } from "zod";

function createServer(): McpServer {
    return new McpServer({
        name: "appoint-me-mcp",
        version: "1.0.0",
    });
}

// Singleton used for stdio transport and tests.
const server = createServer();

function registerTools(s: McpServer): void {

    const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";

    // Register Tools

    s.registerTool(
        "list_event_types",
        {
            description: "Get active event types for a given user.",
            inputSchema: {
                userId: z.string().describe("The ID of the user to fetch active event types for"),
            },
        },
        async ({ userId }) => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/v1/event/active/${userId}`);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(response.data, null, 2),
                        },
                    ],
                };
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const errorMessage = error.response?.data?.error || error.message;
                    return {
                        content: [
                            {
                                type: "text",
                                text: `API Error: ${errorMessage}`,
                            },
                        ],
                        isError: true,
                    }
                }
                return {
                    content: [
                        {
                            type: "text",
                            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                        },
                    ],
                    isError: true,
                };
            }
        }
    );

    s.registerTool(
        "get_free_slots",
        {
            description: "Get available slots for a specific event type.",
            inputSchema: {
                eventId: z.string().describe("The ID of the event type"),
                timeMin: z.string().describe("Start time (ISO 8601)"),
                timeMax: z.string().describe("End time (ISO 8601)"),
            },
        },
        async ({ eventId, timeMin, timeMax }) => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/v1/event/${eventId}/slot`, {
                    params: { timeMin, timeMax, slots: "true" },
                });
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(response.data, null, 2),
                        },
                    ],
                };
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const errorMessage = error.response?.data?.error || error.message;
                    return {
                        content: [
                            {
                                type: "text",
                                text: `API Error: ${errorMessage}`,
                            },
                        ],
                        isError: true,
                    }
                }
                throw error;
            }
        }
    );

    s.registerTool(
        "book_appointment",
        {
            description: "Book an appointment for a specific slot.",
            inputSchema: {
                eventId: z.string().describe("The ID of the event type"),
                slotStart: z.string().describe("Start time of the slot as ISO 8601 string"),
                attendeeName: z.string().describe("Name of the person booking"),
                attendeeEmail: z.string().email().describe("Email of the person booking"),
                description: z.string().optional().describe("Additional notes or comment"),
            },
        },
        async ({ eventId, slotStart, attendeeName, attendeeEmail, description }) => {
            try {
                const response = await axios.post(`${API_BASE_URL}/api/v1/event/${eventId}/slot`, {
                    start: slotStart,
                    attendeeName,
                    attendeeEmail,
                    description,
                });
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(response.data, null, 2),
                        },
                    ],
                };
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const errorMessage = error.response?.data?.error || error.message;
                    return {
                        content: [
                            {
                                type: "text",
                                text: `API Error: ${errorMessage}`,
                            },
                        ],
                        isError: true,
                    }
                }
                throw error;
            }
        }
    );

    s.registerTool(
        "search_users",
        {
            description: "Search for users in the AppointMe system by partial name match or email address. This tool is useful for finding a user's ID to subsequently list their event types or availabilities.",
            inputSchema: {
                query: z.string().describe("The search string to look for in user names or emails (e.g. 'John', 'john@example.com')"),
            },
        },
        async ({ query }) => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/v1/user`, {
                    params: { q: query },
                });
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(response.data, null, 2),
                        },
                    ],
                };
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const errorMessage = error.response?.data?.error || error.message;
                    return {
                        content: [
                            {
                                type: "text",
                                text: `API Error: ${errorMessage}`,
                            },
                        ],
                        isError: true,
                    }
                }
                throw error;
            }
        }
    );
}

import express from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import cors from "cors";

// Apply tools to the singleton server used by stdio and tests.
registerTools(server);

// Start server
async function main() {
    const transportType = process.env.TRANSPORT || "stdio";

    if (transportType === "sse" || process.env.PORT) {
        const app = express();
        const port = process.env.PORT || 3000;

        app.use(cors());

        // FIX (GHSA-345p-7cg4-v4c7): Create a fresh McpServer and
        // StreamableHTTPServerTransport per request to prevent cross-client
        // data leaks introduced in SDK 1.26.0.
        app.all("/mcp", async (req, res) => {
            const requestServer = createServer();
            registerTools(requestServer);
            const transport = new StreamableHTTPServerTransport();
            await requestServer.connect(transport);
            try {
                await transport.handleRequest(req, res);
            } finally {
                await requestServer.close();
            }
        });

        app.get("/healthz", (req, res) => {
            res.status(200).send("OK");
        });

        app.listen(port, () => {
            console.log(`MCP Server running on HTTP/SSE transport at http://localhost:${port}/mcp`);
        });
    } else {
        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.error("AppointMe MCP Server running on stdio");
    }
}

if (import.meta.url.startsWith("file:") && process.argv[1] === new URL(import.meta.url).pathname) {
    main().catch((error) => {
        console.error("Fatal error:", error);
        process.exit(1);
    });
}

export { server, main };
