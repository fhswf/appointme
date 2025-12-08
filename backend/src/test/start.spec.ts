
import { afterAll, beforeAll, afterEach, describe, expect, it } from 'vitest';

import request from "supertest";


let status = null;


describe("Server Start", () => {
    let app: any;

    beforeAll(async () => {
        const { init } = await import("../server.js");
        app = init(0);
    });

    afterEach(() => {
        status = null;
    })

    afterAll(async () => {
        await app.close();
    });

    it("should start the server", async () => {
        const res = await request(app).get("/api/v1/ping");
        expect(res.status).toEqual(200);
    });


});
