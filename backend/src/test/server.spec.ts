
import { afterAll, beforeAll, afterEach, describe, expect, it, vi } from 'vitest';
import { middleware } from "../handlers/middleware.js";

import request from "supertest";
import { Request, Response, NextFunction } from 'express';
import { USER } from './USER.js';
import { EVENT } from './EVENT.js';
import dotenv from 'dotenv';
import { calendar } from 'googleapis/build/src/apis/calendar/index.js';
import { events, freeBusy } from 'src/controller/google_controller.js';

dotenv.config({ path: '.env' });

Object.keys(process.env).forEach(element => {
  if (element.startsWith("REACT_APP")) {
    const key = element.replace("REACT_APP_", "");
    process.env[key] = process.env[element];
  }

});

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
          console.log("UserModel: mocked findOne");
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
    const exec = vi.fn(() => {
      console.log("mocked findOne exec");
      return Promise.resolve(EVENT);
    });

    return {
      EventModel: {
        findOne: vi.fn((query) => {
          console.log("EventModel: mocked findOne");
          return {
            exec,
            select: vi.fn(() => {
              console.log("mocked findOne select");
              return {
                exec
              }
            })
          }
        })
      }
    }
  })

  vi.mock("googleapis", () => {
    return {
      google: {
        calendar: vi.fn(() => {
          console.log("mocked google.calendar");
          return {
            freebusy: {
              query: vi.fn(() => {
                console.log("mocked query");
                return Promise.resolve({
                  data: {
                  }
                });
              })
            },
            events: vi.fn(() => {
              return {
                list: vi.fn(() => {
                  return Promise.resolve({
                    data: {
                      items: []
                    }
                  });
                })
              }
            })
          }
        }),
        auth: {
          OAuth2: vi.fn(() => {
            return {
              verifyIdToken: vi.fn(() => {
                return Promise.resolve({
                  getAttributes: vi.fn(() => {
                    return {
                      payload: {
                        email_verified: true,
                        name: "Christian Gawron",
                        email: "christian.gawron@gmail.com",
                      }
                    }
                  })
                })
              })
            }
          })
        }
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
    const res = await request(app).get("/api/v1/users/user?url=christian-gawron");
    expect(res.status).toEqual(200);
    expect(middleware.requireAuth).toHaveBeenCalled();
    expect(res.body).toEqual(USER);
    console.log(res.body);
  })

  it("should get available slots for 'sprechstunde'", async () => {
    const res = await request(app).get("/api/v1/events/getAvailable?timeMin=2024-10-13T15:51:00.529Z&timeMax=2025-04-14T15:51:00.529Z&url=sprechstunde&userid=109150731150582581691");
    expect(res.status).toEqual(200);
    console.log(res.body);
  })

  it("should get the event by url", async () => {
    const res = await request(app).get("/api/v1/events/getEventBy?url=sprechstunde&user=109150731150582581691");
    expect(res.status).toEqual(200);
    console.log(res.body);
  })
});
