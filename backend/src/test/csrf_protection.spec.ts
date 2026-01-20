import { describe, it, expect, afterAll, beforeAll } from 'vitest';
import request from 'supertest';
import { init } from '../server.js';
import { Server } from 'http';

describe("CSRF Protection Middleware", () => {
    let server: Server;

    beforeAll(async () => {
        // Start server on random port
        server = init(0);
    });

    afterAll((done) => {
        server.close(done);
    });

    it("GET /api/v1/csrf-token should return a token", async () => {
        const res = await request(server).get("/api/v1/csrf-token");
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("csrfToken");
    });

    it("POST /api/v1/random-path should fail with CSRF error without token", async () => {
        const res = await request(server)
            .post("/api/v1/random-path")
            .send({ foo: "bar" });

        // csrf-csrf usually returns 403 "invalid csrf token"
        expect(res.status).toBe(403);
        // Depending on configuration, it might return a specific message
        // We just want to ensure it's NOT 404 (which would mean it bypassed CSRF and hit the end of routes)
    });

    it("POST /api/v1/oidc/login should be excluded from CSRF (return 404 or process)", async () => {
        // This path is explicitly excluded in server.ts
        // Since we are not mocking the full OIDC flow, it might 404 or fail with 500/400 later in the chain.
        // But it should definitely NOT be 403 CSRF error.

        const res = await request(server)
            .post("/api/v1/oidc/login")
            .send({ foo: "bar" });

        expect(res.status).not.toBe(403);
    });
});
