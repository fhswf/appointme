
import { afterAll, beforeAll, afterEach, describe, expect, it, vi } from 'vitest';

import request from "supertest";
import jsonwebtoken from "jsonwebtoken";
import { USER } from './USER.js';
import { EVENT } from './EVENT.js';


let status = null;


describe("Server Start", () => {
    let app: any;
    let jwt = null;

    vi.mock("../models/User.js", () => {
        return {
            UserModel: {
                findOne: vi.fn((query) => {
                    console.log("mocked findOne");
                    return {
                        lean: vi.fn(() => {
                            return {
                                exec: vi.fn(() => {
                                    return Promise.resolve(USER);
                                })
                            }
                        }),
                        exec: vi.fn(() => {
                            return Promise.resolve(USER);
                        })
                    }
                }),
                findById: vi.fn((id) => {
                    console.log("mocked findById");
                    return {
                        exec: vi.fn(() => {
                            return Promise.resolve(USER);
                        })
                    }
                }),
                findByIdAndUpdate: vi.fn((id, user) => {
                    console.log("mocked findByIdAndUpdate");
                    const updatedUser = { ...USER, ...user.$set };
                    return {
                        exec: vi.fn(() => {
                            return Promise.resolve(updatedUser);
                        })
                    }
                })
            }
        }
    })

    vi.mock("../models/Event.js", () => {
        return {
            UserModel: {
                findOne: vi.fn((query) => {
                    console.log("mocked findOne");
                    return {
                        exec: vi.fn(() => {
                            return Promise.resolve(EVENT);
                        })
                    }
                })
            }
        }
    })

    beforeAll(async () => {
        process.env.JWT_SECRET = "test";
        const { init } = await import("../server.js");
        app = init(0);

        // Create a JWT 
        jwt = jsonwebtoken.sign({
            _id: "1234",
            name: "test",
            email: "test@fh-swf.de"
        }, process.env.JWT_SECRET)
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

    it("should return unauthorized", async () => {
        status = 401;
        const res = await request(app).get("/api/v1/user/me");
        expect(res.status).toEqual(401);
    })

    it("should return unauthorized", async () => {
        status = 401;
        const res = await request(app)
            .get("/api/v1/user/me")
            .set({ "Authorization": "Bearer" })
        expect(res.status).toEqual(401);
    })

    it("should return unauthorized", async () => {
        status = 401;
        const res = await request(app)
            .get("/api/v1/user/me")
            .set({ "Authorization": "Bearer invalid" })
        expect(res.status).toEqual(401);
    })

    it("should return the user", async () => {
        const res = await request(app)
            .get("/api/v1/user/me")
            .set({ "Cookie": `access_token=${jwt}` })
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual("Christian Gawron");
        console.log(res.body);
    })

    it("should update the user", async () => {
        // Get CSRF token
        const csrfRes = await request(app)
            .get("/api/v1/csrf-token")
            .set({ "Cookie": `access_token=${jwt}` });
        const csrfToken = csrfRes.body.csrfToken;
        const csrfCookie = csrfRes.headers["set-cookie"] ? csrfRes.headers["set-cookie"][0] : null;

        let newUser = {
            ...USER,
            name: "updated",
        }
        const res = await request(app)
            .put("/api/v1/user/me")
            .set({ "Cookie": [`access_token=${jwt}`, csrfCookie] })
            .set({ "x-csrf-token": csrfToken })
            .send({ data: newUser })
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual("updated");
        console.log(res.body);
    })
});
