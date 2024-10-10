
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { server } from "../server.js";
import request from "supertest";

describe("Server", () => {
  let app: any;

  beforeAll(async () => {
    app = await server;
  });

  afterAll(async () => {
    await app.close();
  });

  it("should start the server", async () => {
    const res = await request(app).get("/api/v1/ping");
    expect(res.status).toEqual(200);
  });

  it("should return the user", async () => {
    const res = await request(app).get("/api/v1/users/user");
    expect(res.status).toEqual(401);
    console.log(res.body);
  })
});
