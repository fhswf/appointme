import "dotenv/config";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import { z } from "zod";

// Initialize server
const server = new Server(
    {
        name: "book-me-mcp",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";

// Define Zod schemas for tool arguments
const ListEventTypesSchema = z.object({
    userId: z.string().describe("The ID of the user to fetch active event types for"),
});

const GetFreeSlotsSchema = z.object({
    eventId: z.string().describe("The ID of the event type"),
    timeMin: z.string().describe("Start time (ISO 8601)"),
    timeMax: z.string().describe("End time (ISO 8601)"),
});

const BookAppointmentSchema = z.object({
    eventId: z.string().describe("The ID of the event type"),
    slotStart: z.string().describe("Start time of the slot as ISO 8601 string"),
    attendeeName: z.string().describe("Name of the person booking"),
    attendeeEmail: z.string().email().describe("Email of the person booking"),
    description: z.string().optional().describe("Additional notes or comment"),
});



const SearchUsersSchema = z.object({
    query: z.string().describe("Search query to find users by name or email"),
});
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "list_event_types",
                description: "Get active event types for a given user.",
                inputSchema: {
                    type: "object",
                    properties: {
                        userId: {
                            type: "string",
                            description: "The ID of the user to fetch active event types for"
                        }
                    },
                    required: ["userId"]
                }
            },
            {
                name: "get_free_slots",
                description: "Get available slots for a specific event type.",
                inputSchema: {
                    type: "object",
                    properties: {
                        eventId: {
                            type: "string",
                            description: "The ID of the event type"
                        },
                        timeMin: {
                            type: "string",
                            description: "Start time (ISO 8601)"
                        },
                        timeMax: {
                            type: "string",
                            description: "End time (ISO 8601)"
                        }
                    },
                    required: ["eventId", "timeMin", "timeMax"]
                }
            },


            {
                name: "book_appointment",
                description: "Book an appointment for a specific slot.",
                inputSchema: {
                    type: "object",
                    properties: {
                        eventId: {
                            type: "string",
                            description: "The ID of the event type"
                        },
                        slotStart: {
                            type: "string",
                            description: "Start time of the slot as ISO 8601 string"
                        },
                        attendeeName: {
                            type: "string",
                            description: "Name of the person booking"
                        },
                        attendeeEmail: {
                            type: "string",
                            description: "Email of the person booking"
                        },
                        description: {
                            type: "string",
                            description: "Additional notes or comment"
                        }
                    },
                    required: ["eventId", "slotStart", "attendeeName", "attendeeEmail"]
                }
            },
            {
                name: "search_users",
                description: "Search for users in the AppointMe system by partial name match or email address. This tool is useful for finding a user's ID to subsequently list their event types or availabilities.",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: {
                            type: "string",
                            description: "The search string to look for in user names or emails (e.g. 'John', 'john@example.com')"
                        }
                    },
                    required: ["query"]
                }
            },
        ],
    };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        switch (name) {
            case "list_event_types": {
                const { userId } = ListEventTypesSchema.parse(args);
                const response = await axios.get(`${API_BASE_URL}/api/v1/event/active/${userId}`);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(response.data, null, 2),
                        },
                    ],
                };
            }

            case "get_free_slots": {
                const { eventId, timeMin, timeMax } = GetFreeSlotsSchema.parse(args);
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
            }

            case "book_appointment": {
                const { eventId, slotStart, attendeeName, attendeeEmail, description } = BookAppointmentSchema.parse(args);
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
            }

            case "search_users": {
                const { query } = SearchUsersSchema.parse(args);
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
            }

            default:
                throw new Error(`Unknown tool: ${name}`);
        }
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
});

import express from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import cors from "cors";

// Start server
async function main() {
    const transportType = process.env.TRANSPORT || "stdio";

    if (transportType === "sse" || process.env.PORT) {
        const app = express();
        const port = process.env.PORT || 3000;

        app.use(cors());

        // Create transport
        const transport = new StreamableHTTPServerTransport();

        // Connect server to transport
        await server.connect(transport);

        // Handle both GET (connection) and POST (message) on /sse
        app.all("/sse", async (req, res) => {
            await transport.handleRequest(req, res);
        });

        // Also handle legacy /messages for POST if needed, or just map everything to transport
        app.post("/messages", async (req, res) => {
            await transport.handleRequest(req, res);
        });

        app.get("/healthz", (req, res) => {
            res.status(200).send("OK");
        });

        app.listen(port, () => {
            console.log(`MCP Server running on HTTP/SSE transport at http://localhost:${port}/sse`);
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
