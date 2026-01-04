import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import * as openIdClient from 'openid-client';
import { UserModel } from '../models/User.js';
import { init } from '../server.js';
import pkg from 'jsonwebtoken';

const { sign } = pkg;

// Mock dependencies
// Mock openid-client exports
vi.mock('openid-client', async (importOriginal) => {
    const actual = await importOriginal<typeof openIdClient>();
    return {
        ...actual,
        Configuration: vi.fn(),
        buildAuthorizationUrl: vi.fn(),
        authorizationCodeGrant: vi.fn(),
        ClientSecretBasic: vi.fn(),
        None: vi.fn(),
    };
});

vi.mock('../models/User.js');
vi.mock('../logging.js', () => ({
    logger: {
        info: vi.fn(),
        debug: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
    }
}));
vi.mock('jsonwebtoken', () => ({
    default: {
        sign: vi.fn()
    }
}));

vi.mock('express-rate-limit', () => ({
    default: vi.fn(() => (req: any, res: any, next: any) => next()),
}));

describe('OIDC Controller', () => {
    let app: any;
    let csrfToken: string;
    let csrfCookie: string;


    beforeEach(async () => {
        vi.clearAllMocks();
        vi.unstubAllEnvs();

        // Reset environment variables
        vi.stubEnv('OIDC_ISSUER', 'https://issuer.example.com');
        vi.stubEnv('OIDC_CLIENT_ID', 'client_id');
        vi.stubEnv('OIDC_CLIENT_SECRET', 'client_secret');
        vi.stubEnv('BASE_URL', 'http://localhost:3000');
        vi.stubEnv('JWT_SECRET', 'test_secret');
        vi.stubEnv('NODE_ENV', 'test');

        // Setup Configuration mock
        (openIdClient.Configuration as any).mockImplementation(function () {
            return {
                serverMetadata: () => ({}),
                clientMetadata: () => ({}),
            };
        });

        // Re-initialize app for each test
        app = init(0);
    });

    afterEach(async () => {
        vi.unstubAllEnvs();
        await app.close();
    });

    const getCsrfToken = async () => {
        const res = await request(app).get("/api/v1/csrf-token");
        csrfToken = res.body.csrfToken;
        csrfCookie = res.headers["set-cookie"][0];
    };

    describe('getAuthUrl', () => {
        it('should return 503 if OIDC is not configured', async () => {
            vi.resetModules();
            vi.stubEnv('OIDC_ISSUER', '');
            const { init } = await import('../server.js');
            app = init(0);

            const res = await request(app).get('/api/v1/oidc/url');

            expect(res.status).toBe(503);
            expect(res.body).toEqual({ error: "OIDC not configured" });
        });

        it('should return authorization URL when configured', async () => {
            // Need to re-init app to pick up env vars if not picked up dynamically
            vi.resetModules();
            const { init } = await import('../server.js');
            app = init(0);

            const authUrl = new URL('https://issuer.example.com/auth?scope=openid');
            (openIdClient.buildAuthorizationUrl as any).mockResolvedValue(authUrl);

            const res = await request(app).get('/api/v1/oidc/url');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ url: authUrl.href });
            expect(openIdClient.buildAuthorizationUrl).toHaveBeenCalled();
        });
    });

    describe('oidcLoginController', () => {
        it('should return 400 if authorization code is missing', async () => {
            await getCsrfToken();
            const res = await request(app)
                .post('/api/v1/oidc/login')
                .set("x-csrf-token", csrfToken)
                .set("Cookie", csrfCookie)
                .send({}); // No code

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "Authorization code missing" });
        });

        it('should return 503 if OIDC not configured', async () => {
            vi.resetModules();
            vi.stubEnv('OIDC_ISSUER', '');
            const { init } = await import('../server.js');
            app = init(0);

            // We need a fresh CSRF token from the new app instance
            const resCsrf = await request(app).get("/api/v1/csrf-token");
            csrfToken = resCsrf.body.csrfToken;
            csrfCookie = resCsrf.headers["set-cookie"][0];

            const res = await request(app)
                .post('/api/v1/oidc/login')
                .set("x-csrf-token", csrfToken)
                .set("Cookie", csrfCookie)
                .send({ code: 'some-code' });

            expect(res.status).toBe(503);
            expect(res.body).toEqual({ error: "OIDC not configured" });
        });

        it('should login successfully with valid code', async () => {
            await getCsrfToken();
            const code = 'valid_code';
            const claims = {
                sub: 'user123',
                email: 'test@example.com',
                name: 'Test User',
                picture: 'http://pic.com/1.jpg'
            };

            (openIdClient.authorizationCodeGrant as any).mockResolvedValue({
                claims: vi.fn().mockReturnValue(claims)
            });

            // Mock findOne to return null (user not found, proceed to create)
            (UserModel.findOne as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue(null)
            });

            (UserModel.findOneAndUpdate as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue({
                    _id: 'user123',
                    name: 'Test User',
                    email: 'test@example.com',
                    picture_url: 'http://pic.com/1.jpg'
                })
            });

            (sign as any).mockReturnValue('mock_access_token');

            const res = await request(app)
                .post('/api/v1/oidc/login')
                .set("x-csrf-token", csrfToken)
                .set("Cookie", csrfCookie)
                .send({ code });

            expect(res.status).toBe(200);
            expect(res.body.user).toEqual({
                _id: 'user123',
                email: 'test@example.com',
                name: 'Test User',
                picture_url: 'http://pic.com/1.jpg'
            });
            // Check cookie
            expect(res.headers['set-cookie']).toBeDefined();
            // Note: Use a loop or find to check for access_token as there might be multiple cookies (including CSRF)
            const cookies = res.headers['set-cookie'];
            const accessTokenCookie = cookies.find((c: string) => c.startsWith('access_token='));
            expect(accessTokenCookie).toContain('access_token=mock_access_token');
        });

        it('should fail if email is missing in claims', async () => {
            await getCsrfToken();
            const code = 'valid_code_no_email';
            const claims = {
                sub: 'user123',
                // no email
                name: 'Test User',
            };

            (openIdClient.authorizationCodeGrant as any).mockResolvedValue({
                claims: vi.fn().mockReturnValue(claims)
            });

            const res = await request(app)
                .post('/api/v1/oidc/login')
                .set("x-csrf-token", csrfToken)
                .set("Cookie", csrfCookie)
                .send({ code });

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "Email not provided by ID provider" });
        });

        it('should handle user creation failure', async () => {
            await getCsrfToken();
            const code = 'valid_code';
            const claims = {
                sub: 'user123',
                email: 'test@example.com',
            };

            (openIdClient.authorizationCodeGrant as any).mockResolvedValue({
                claims: vi.fn().mockReturnValue(claims)
            });

            (UserModel.findOne as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue(null)
            });

            (UserModel.findOneAndUpdate as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue(null) // Fail to create/find
            });

            const res = await request(app)
                .post('/api/v1/oidc/login')
                .set("x-csrf-token", csrfToken)
                .set("Cookie", csrfCookie)
                .send({ code });

            expect(res.status).toBe(401);
            expect(res.body.error).toBe("Authentication failed");
        });



        it('should login successfully if user with email already exists', async () => {
            await getCsrfToken();
            const code = 'valid_code_existing_user';
            const claims = {
                sub: 'new_sub_id',
                email: 'existing@example.com',
                name: 'Existing User',
                picture: 'http://pic.com/existing.jpg'
            };

            (openIdClient.authorizationCodeGrant as any).mockResolvedValue({
                claims: vi.fn().mockReturnValue(claims)
            });

            // Mock findOne to return an existing user
            (UserModel.findOne as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue({
                    _id: 'existing_user_id',
                    name: 'Existing User',
                    email: 'existing@example.com',
                    picture_url: 'http://pic.com/existing.jpg',
                    save: vi.fn()
                })
            });

            // findOneAndUpdate should NOT be called (or we don't care, but for this test flow it matters)
            // But wait, the code calls findOne first. If it returns user, we skip creation.

            (sign as any).mockReturnValue('mock_access_token');

            const res = await request(app)
                .post('/api/v1/oidc/login')
                .set("x-csrf-token", csrfToken)
                .set("Cookie", csrfCookie)
                .send({ code });

            expect(res.status).toBe(200);
            expect(res.body.user).toEqual({
                _id: 'existing_user_id',
                email: 'existing@example.com',
                name: 'Existing User',
                picture_url: 'http://pic.com/existing.jpg'
            });
        });

        it('should retry and succeed if user_url collision occurs', async () => {
            await getCsrfToken();
            const code = 'valid_code_collision';
            const claims = {
                sub: 'user_collision',
                email: 'collision@example.com',
                name: 'Collision User',
            };

            (openIdClient.authorizationCodeGrant as any).mockResolvedValue({
                claims: vi.fn().mockReturnValue(claims)
            });

            // first findOne returns null (user not found)
            (UserModel.findOne as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue(null)
            });

            // findOneAndUpdate mocks
            const execMock = vi.fn();

            // First call fails with 11000 for user_url
            execMock.mockRejectedValueOnce({
                code: 11000,
                keyPattern: { user_url: 1 }
            });

            // Second call succeeds
            execMock.mockResolvedValueOnce({
                _id: 'user_collision',
                name: 'Collision User',
                email: 'collision@example.com',
                user_url: 'collision-user-1234'
            });

            (UserModel.findOneAndUpdate as any).mockReturnValue({
                exec: execMock
            });

            (sign as any).mockReturnValue('mock_access_token');

            const res = await request(app)
                .post('/api/v1/oidc/login')
                .set("x-csrf-token", csrfToken)
                .set("Cookie", csrfCookie)
                .send({ code });

            expect(res.status).toBe(200);
            expect(execMock).toHaveBeenCalledTimes(2);
        });

        it('should handle duplicate user error (11000) for other keys', async () => {
            await getCsrfToken();
            const code = 'valid_code';
            const claims = { sub: 'u', email: 'e@e.com' };
            (openIdClient.authorizationCodeGrant as any).mockResolvedValue({
                claims: vi.fn().mockReturnValue(claims)
            });

            (UserModel.findOne as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue(null)
            });

            const execMock = vi.fn();
            // Error without keyPattern (or different key)
            execMock.mockRejectedValue({ code: 11000 });

            (UserModel.findOneAndUpdate as any).mockReturnValue({
                exec: execMock
            });

            const res = await request(app)
                .post('/api/v1/oidc/login')
                .set("x-csrf-token", csrfToken)
                .set("Cookie", csrfCookie)
                .send({ code });

            expect(res.status).toBe(409);
            expect(res.body.error).toContain("already exists");
        });

        it('should handle generic callback error', async () => {
            await getCsrfToken();
            const code = 'invalid_code';
            (openIdClient.authorizationCodeGrant as any).mockRejectedValue(new Error("OIDC Error"));

            const res = await request(app)
                .post('/api/v1/oidc/login')
                .set("x-csrf-token", csrfToken)
                .set("Cookie", csrfCookie)
                .send({ code });

            expect(res.status).toBe(401);
            expect(res.body.details).toBe("OIDC Error");
        });
    });

    describe('GET /api/v1/oidc/config', () => {
        it('should return enabled true when OIDC is configured', async () => {
            const res = await request(app).get('/api/v1/oidc/config');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ enabled: true });
        });

        it('should return enabled false when OIDC_ISSUER is not set', async () => {
            vi.resetModules();
            vi.stubEnv('OIDC_ISSUER', '');
            vi.stubEnv('OIDC_CLIENT_ID', 'client_id');
            const { init } = await import('../server.js');
            app = init(0);

            const res = await request(app).get('/api/v1/oidc/config');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ enabled: false });
        });

        it('should return enabled false when OIDC_CLIENT_ID is not set', async () => {
            vi.resetModules();
            vi.stubEnv('OIDC_ISSUER', 'https://issuer.example.com');
            vi.stubEnv('OIDC_CLIENT_ID', '');
            const { init } = await import('../server.js');
            app = init(0);

            const res = await request(app).get('/api/v1/oidc/config');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ enabled: false });
        });

        it('should return enabled false when both OIDC vars are not set', async () => {
            vi.resetModules();
            vi.stubEnv('OIDC_ISSUER', '');
            vi.stubEnv('OIDC_CLIENT_ID', '');
            const { init } = await import('../server.js');
            app = init(0);

            const res = await request(app).get('/api/v1/oidc/config');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ enabled: false });
        });
    });
});


