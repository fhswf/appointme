import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { server } from './index.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';

vi.mock('axios');

class MockTransport implements Transport {
    other?: MockTransport;
    onmessage?: (message: any) => void;
    onclose?: () => void;
    onerror?: (error: Error) => void;

    connect(other: MockTransport) {
        this.other = other;
        other.other = this;
    }

    async start() { }

    async send(message: any) {
        if (this.other?.onmessage) {
            // Simulate async network
            await Promise.resolve();
            this.other.onmessage(message);
        }
    }

    async close() {
        if (this.onclose) this.onclose();
    }
}

describe('MCP Server Tools', () => {
    let client: Client;
    let clientTransport: MockTransport;
    let serverTransport: MockTransport;

    beforeEach(async () => {
        vi.resetAllMocks();

        clientTransport = new MockTransport();
        serverTransport = new MockTransport();
        clientTransport.connect(serverTransport);

        // SDK 1.26.0 enforces that connect() cannot be called on an already-connected server.
        // We must await the connection so errors surface properly.
        await server.connect(serverTransport);

        client = new Client({ name: "test-client", version: "1.0.0" }, { capabilities: {} });
        await client.connect(clientTransport);
    });

    afterEach(async () => {
        await client.close();
        // Close the server transport so the next test can reconnect.
        // SDK 1.26.0+ requires calling close() before connecting a new transport.
        await server.close();
    });

    it('should list event types', async () => {
        const mockResponse = { data: [{ id: '1', title: 'Test Event' }] };
        vi.mocked(axios.get).mockResolvedValue(mockResponse);

        const result = await client.callTool({
            name: 'list_event_types',
            arguments: { userId: 'user123' },
        });

        expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/api/v1/event/active/user123'));
        expect(result).toBeDefined();
        // @ts-ignore
        const content = JSON.parse(result.content[0].text);
        expect(content).toEqual(mockResponse.data);
    });

    it('should get free slots', async () => {
        const mockResponse = { data: { slots: [] } };
        vi.mocked(axios.get).mockResolvedValue(mockResponse);

        const result = await client.callTool({
            name: 'get_free_slots',
            arguments: {
                eventId: 'event123',
                timeMin: '2023-01-01T00:00:00Z',
                timeMax: '2023-01-02T00:00:00Z',
            },
        });

        expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/api/v1/event/event123/slot'), {
            params: {
                timeMin: '2023-01-01T00:00:00Z',
                timeMax: '2023-01-02T00:00:00Z',
                slots: 'true',
            },
        });
        // @ts-ignore
        const content = JSON.parse(result.content[0].text);
        expect(content).toEqual(mockResponse.data);
    });

    it('should book appointment', async () => {
        const mockResponse = { data: { success: true } };
        vi.mocked(axios.post).mockResolvedValue(mockResponse);

        const result = await client.callTool({
            name: 'book_appointment',
            arguments: {
                eventId: 'event123',
                slotStart: '2023-01-01T12:00:00Z',
                attendeeName: 'John Doe',
                attendeeEmail: 'john@example.com',
            },
        });

        expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining('/api/v1/event/event123/slot'),
            expect.objectContaining({
                start: '2023-01-01T12:00:00Z',
                attendeeName: 'John Doe',
                attendeeEmail: 'john@example.com',
            })
        );
        // @ts-ignore
        const content = JSON.parse(result.content[0].text);
        expect(content).toEqual(mockResponse.data);
    });

    it('should search users', async () => {
        const mockResponse = { data: [{ id: 'u1', name: 'Test User' }] };
        vi.mocked(axios.get).mockResolvedValue(mockResponse);

        const result = await client.callTool({
            name: 'search_users',
            arguments: { query: 'Test' },
        });

        expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/api/v1/user'), {
            params: { q: 'Test' },
        });
        expect(result).toBeDefined();
        // @ts-ignore
        const content = JSON.parse(result.content[0].text);
        expect(content).toEqual(mockResponse.data);
    });

    it('should handle API errors', async () => {
        const errorMessage = "Slot not available";
        const mockError = new Error("Request failed with status code 400");
        // @ts-ignore
        mockError.response = { data: { error: errorMessage } };
        // @ts-ignore
        mockError.isAxiosError = true;

        vi.mocked(axios.post).mockRejectedValue(mockError);
        vi.mocked(axios.isAxiosError).mockReturnValue(true);

        const result = await client.callTool({
            name: 'book_appointment',
            arguments: {
                eventId: 'event123',
                slotStart: '2023-01-01T12:00:00Z',
                attendeeName: 'John Doe',
                attendeeEmail: 'john@example.com',
            },
        });

        expect(result.isError).toBe(true);
        // @ts-ignore
        expect(result.content[0].text).toContain(errorMessage);
    });
});
