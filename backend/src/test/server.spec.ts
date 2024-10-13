
import { afterAll, beforeAll, afterEach, describe, expect, it, vi } from 'vitest';
import { middleware } from "../handlers/middleware.js";

import request from "supertest";
import { V } from 'vitest/dist/chunks/reporters.DAfKSDh5.js';
import { Request, Response, NextFunction } from 'express';
import { USER } from './USER.js';
import { EVENT } from './EVENT.js';

let status = null;


describe("Server routes", () => {
  let app: any;
  vi.mock("../handlers/middleware.js", () => {
    return {
      middleware: {
        requireAuth: vi.fn((req: Request, res: Response, next: NextFunction) => {
          console.log("mocked requireAuth");
          if (!status) {
            req["user_id"] = USER._id;
            next();
          }
          else {
            res.status(status).json({ error: "Unauthorized" });
          }
        })
      }
    }
  });

  vi.mock("../models/User.js", () => {
    return {
      UserModel: {
        findOne: vi.fn((query) => {
          console.log("mocked findOne");
          return {
            exec: vi.fn(() => {
              return Promise.resolve(USER);
            }),
            select: vi.fn(() => {
              return {
                exec: vi.fn(() => {
                  return Promise.resolve(USER);
                })
              }
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
    const { init } = await import("../server.js");
    app = init();
  });

  afterEach(() => {
    status = null;
  })

  afterAll(async () => {
    await app.close();
  });


  it("should return unauthorized", async () => {
    status = 401;
    const res = await request(app).get("/api/v1/users/user");
    expect(res.status).toEqual(401);
    expect(middleware.requireAuth).toHaveBeenCalled();
    console.log(res.body);
  })

  it("should return the user", async () => {
    const res = await request(app).get("/api/v1/users/user");
    expect(res.status).toEqual(200);
    expect(middleware.requireAuth).toHaveBeenCalled();
    console.log(res.body);
  })

  it("should get the user by url", async () => {
    const res = await request(app).get("/api/v1/users/findUserByUrl?url=christian-gawron");
    expect(res.status).toEqual(200);
    expect(middleware.requireAuth).toHaveBeenCalled();
    expect(res.body).toEqual(USER);
    console.log(res.body);
  })
});
