
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { middleware } from "../handlers/middleware.js";
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

describe("Middleware Security: JWT without _id", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: any;

    beforeEach(() => {
        process.env.JWT_SECRET = 'test_secret';
        req = {
            headers: {},
            cookies: {}
        };
        res = {
            status: vi.fn().mockReturnThis(),
            set: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        };
        next = vi.fn();
    });

    it("should reject a token that is missing the _id field", () => {
        // Create a token that has 'sub' but no '_id' (simulating transient LTI user)
        const payload = {
            sub: 'lti_user_123',
            email: 'test@example.com',
            roles: ['student']
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET as string);

        req.headers = {
            authorization: `Bearer ${token}`
        };

        middleware.requireAuth(req as Request, res as Response, next);

        // CURRENT BUG BEHAVIOR:
        // verify() passes because the signature is valid.
        // It extracts _id (which is undefined).
        // It sets req['user_id'] = undefined.
        // It calls next().

        // EXPECTED FIX BEHAVIOR:
        // It should check for _id existence.
        // It should call res.status(401).
        // It should NOT call next().

        // We assert the CORRECT behavior, checking if the test FAILS effectively.
        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it("should accept a valid token with _id", () => {
        const payload = {
            _id: 'user_123',
            email: 'test@example.com'
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET as string);

        req.headers = {
            authorization: `Bearer ${token}`
        };

        middleware.requireAuth(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
        expect((req as any).user_id).toBe('user_123');
    });
});
