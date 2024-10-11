
import { afterAll, beforeAll, afterEach, describe, expect, it, vi } from 'vitest';
import { middleware } from "../handlers/middleware.js";

import request from "supertest";
import { V } from 'vitest/dist/chunks/reporters.DAfKSDh5.js';

const USER = {
  "_id": "109150731150582581691",
  "email": "christian.gawron@gmail.com",
  "name": "Christian Gawron",
  "picture_url": "https://lh3.googleusercontent.com/a/ACg8ocL0Ob8tDn2tEvCfdg4OfH8g_hMqcf_IGBRulp0PuBXVNf8PdJ6OyA=s96-c",
  "pull_calendars": [
    "christian.gawron@gmail.com",
    "fj2g7ii3on2elc092n3tbd1nmv48mb3n@import.calendar.google.com",
    "family10045043731026254769@group.calendar.google.com",
    "de.german.official#holiday@group.v.calendar.google.com",
    "t6hldgptmgr36ctkm1720bvcfg@group.calendar.google.com",
    "gawron.christian@fh-swf.de"
  ],
  "updatedAt": "2024-10-10T12:04:24.769Z",
  "user_url": "christian-gawron",
  "push_calendar": "t6hldgptmgr36ctkm1720bvcfg@group.calendar.google.com",
  "google_tokens": {
    "access_token": "ya29.a0AcM612xTO2HcmaSxOzyMlf3hje-CL8WGmBrfUtM_mrOTWOfj6gbFgFtr6jSRI4GGmwK9fCS4paZroX9Wq3JPt-Q0oC0Hbx2WUSpufG2gU98Y2ZkK0TcVNhi72vFkr60vU7ROpi55csAHmgQM8onpGfy51x8iGdZDdH1KSBg1aCgYKAZcSARMSFQHGX2Mi0IhuHlo5kYzESZHe0G5l-w0175"
  }
}

const EVENT = {

  "available": {
    "0": [],
    "1": [
      {
        "start": "09:00",
        "end": "17:00"
      }
    ],
    "2": [
      {
        "start": "09:00",
        "end": "17:00"
      }
    ],
    "3": [],
    "4": [],
    "5": [],
    "6": []
  },
  "_id": "66e41e641f4f81ece1828ab5",
  "user": "109150731150582581691",
  "name": "Sprechstunde",
  "location": "https://fh-swf.zoom.us/my/cgawron",
  "description": "30 Minuten online",
  "duration": 30,
  "url": "sprechstunde",
  "isActive": true,
  "bufferbefore": 5,
  "bufferafter": 15,
  "minFuture": 172800,
  "maxFuture": 5184000,
  "maxPerDay": 2,
  "__v": 0
}

let status = null;


describe("Server", () => {
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

  it("should start the server", async () => {
    const res = await request(app).get("/api/v1/ping");
    expect(res.status).toEqual(200);
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
});
