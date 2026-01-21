
import { describe, it, expect, afterAll, beforeAll } from 'vitest';
import request from 'supertest';
import { init } from '../server.js';
import { Server } from 'http';

describe("Booking CSRF Reproduction", () => {
    let server: Server;

    beforeAll(async () => {
        // Start server on random port
        server = init(0);
    });

    afterAll((done) => {
        server.close(done);
    });

    it("POST /api/v1/event/:id/slot should NOT fail with 403 CSRF error", async () => {
        const res = await request(server)
            .post("/api/v1/event/123/slot")
            .send({
                name: "John Doe",
                email: "john@example.com",
                slots: ["2024-01-01T10:00:00Z"]
            });

        // We expect it to bypass CSRF, so it should NOT be 403.
        // It will likely be 400 (Bad Request) or 404 depending on mock state,
        // but definitely not 403.
        expect(res.status).not.toBe(403);
    });
});
