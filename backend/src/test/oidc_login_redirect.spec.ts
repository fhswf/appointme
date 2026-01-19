import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import * as openIdClient from 'openid-client';
import { UserModel } from '../models/User.js';
import { init } from '../server.js';
import pkg from 'jsonwebtoken';

const { sign } = pkg;

// Mock dependencies
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

vi.mock('jose', () => ({
    createRemoteJWKSet: vi.fn(),
    jwtVerify: vi.fn(),
}));

vi.mock('express-rate-limit', () => ({
    default: vi.fn(() => (req: any, res: any, next: any) => next()),
}));

describe('OIDC Login Redirect', () => {
    let app: any;
    let csrfToken: string;
    let csrfCookie: string;

    beforeEach(async () => {
        vi.clearAllMocks();
        vi.unstubAllEnvs();

        vi.stubEnv('OIDC_ISSUER', 'https://issuer.example.com');
        vi.stubEnv('OIDC_CLIENT_ID', 'client_id');
        vi.stubEnv('BASE_URL', 'http://localhost:3000');
        vi.stubEnv('JWT_SECRET', 'test_secret');
        vi.stubEnv('LTI_ISSUER', 'https://lti.example.com');
        vi.stubEnv('LTI_CLIENT_ID', 'lti_client_id');
        vi.stubEnv('LTI_JWKS_URI', 'https://lti.example.com/jwks');

        const { init } = await import('../server.js');
        app = init(0);

        const res = await request(app).get("/api/v1/csrf-token");
        csrfToken = res.body.csrfToken;
        csrfCookie = res.headers["set-cookie"][0];
    });

    afterEach(async () => {
        vi.unstubAllEnvs();
        await app.close();
    });

    const setupMocks = async (claims: any) => {
        const jose = await import('jose');
        (jose.jwtVerify as any).mockResolvedValue({ payload: claims });
        (jose.createRemoteJWKSet as any).mockReturnValue({});

        // Mock User finding - return NULL for transient user (simplify test)
        (UserModel.findOne as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(null) });
        (UserModel.findOneAndUpdate as any).mockReturnValue({ exec: vi.fn() });
        (sign as any).mockReturnValue('mock_access_token');
    };

    it('should redirect to default BASE_URL if target_link_uri is missing', async () => {
        const claims = {
            sub: 'user',
            email: 'user@example.com',
            iss: 'https://lti.example.com',
            aud: 'lti_client_id'
        };
        await setupMocks(claims);

        const res = await request(app)
            .post('/api/v1/oidc/login')
            .set("x-csrf-token", csrfToken)
            .set("Cookie", csrfCookie)
            .send({ id_token: 'token' });

        expect(res.status).toBe(302);
        // Default redirect behavior in setAuthCookie (res.redirect(redirectUrl || '/'))
        // If passed undefined, setAuthCookie does something? 
        // In the code: setAuthCookie(res, user, process.env.BASE_URL || '/', req);
        // My change: setAuthCookie(res, user, redirectUrl, req); which defaults to BASE_URL or '/'
        expect(res.header.location).toBe('http://localhost:3000');
    });

    it('should parse u and e parameters and redirect to /u/e', async () => {
        const claims = {
            sub: 'user',
            email: 'user@example.com',
            iss: 'https://lti.example.com',
            aud: 'lti_client_id',
            'https://purl.imsglobal.org/spec/lti/claim/target_link_uri': 'https://myschool.moodle.com/mod/lti/launch?u=myslug&e=myevent'
        };
        await setupMocks(claims);

        const res = await request(app)
            .post('/api/v1/oidc/login')
            .set("x-csrf-token", csrfToken)
            .set("Cookie", csrfCookie)
            .send({ id_token: 'token' });

        expect(res.status).toBe(302);
        expect(res.header.location).toBe('https://myschool.moodle.com/mod/lti/launch/myslug/myevent');
    });

    it('should parse user and event parameters and redirect to /user/event', async () => {
        const claims = {
            sub: 'user',
            email: 'user@example.com',
            iss: 'https://lti.example.com',
            aud: 'lti_client_id',
            'https://purl.imsglobal.org/spec/lti/claim/target_link_uri': 'https://myschool.moodle.com/mod/lti/launch?user=biguser&event=bigevent'
        };
        await setupMocks(claims);

        const res = await request(app)
            .post('/api/v1/oidc/login')
            .set("x-csrf-token", csrfToken)
            .set("Cookie", csrfCookie)
            .send({ id_token: 'token' });

        expect(res.status).toBe(302);
        expect(res.header.location).toBe('https://myschool.moodle.com/mod/lti/launch/biguser/bigevent');
    });

    it('should handle just user parameter', async () => {
        const claims = {
            sub: 'user',
            email: 'user@example.com',
            iss: 'https://lti.example.com',
            aud: 'lti_client_id',
            'https://purl.imsglobal.org/spec/lti/claim/target_link_uri': 'https://lms.com?u=justuser'
        };
        await setupMocks(claims);

        const res = await request(app)
            .post('/api/v1/oidc/login')
            .set("x-csrf-token", csrfToken)
            .set("Cookie", csrfCookie)
            .send({ id_token: 'token' });

        expect(res.status).toBe(302);
        expect(res.header.location).toBe('https://lms.com/justuser');
    });

    it('should handle url parameter as alias for event', async () => {
        const claims = {
            sub: 'user',
            email: 'user@example.com',
            iss: 'https://lti.example.com',
            aud: 'lti_client_id',
            'https://purl.imsglobal.org/spec/lti/claim/target_link_uri': 'https://lms.com?u=user1&url=event1'
        };
        await setupMocks(claims);

        const res = await request(app)
            .post('/api/v1/oidc/login')
            .set("x-csrf-token", csrfToken)
            .set("Cookie", csrfCookie)
            .send({ id_token: 'token' });

        expect(res.status).toBe(302);
        expect(res.header.location).toBe('https://lms.com/user1/event1');
    });

    it('should ignore target_link_uri if parsing fails', async () => {
        const claims = {
            sub: 'user',
            email: 'user@example.com',
            iss: 'https://lti.example.com',
            aud: 'lti_client_id',
            'https://purl.imsglobal.org/spec/lti/claim/target_link_uri': 'not-a-url'
        };
        await setupMocks(claims);

        const res = await request(app)
            .post('/api/v1/oidc/login')
            .set("x-csrf-token", csrfToken)
            .set("Cookie", csrfCookie)
            .send({ id_token: 'token' });

        expect(res.status).toBe(302);
        expect(res.header.location).toBe('http://localhost:3000');
    });

    it('should prioritize u/e over user/event', async () => {
        const claims = {
            sub: 'user',
            email: 'user@example.com',
            iss: 'https://lti.example.com',
            aud: 'lti_client_id',
            'https://purl.imsglobal.org/spec/lti/claim/target_link_uri': 'https://lms.com?u=short&user=long&e=ev&event=eventlong'
        };
        await setupMocks(claims);

        const res = await request(app)
            .post('/api/v1/oidc/login')
            .set("x-csrf-token", csrfToken)
            .set("Cookie", csrfCookie)
            .send({ id_token: 'token' });

        expect(res.status).toBe(302);
        expect(res.header.location).toBe('https://lms.com/short/ev');
    });

    it('should use custom claims for redirection', async () => {
        const claims = {
            sub: 'user',
            email: 'user@example.com',
            iss: 'https://lti.example.com',
            aud: 'lti_client_id',
            'https://purl.imsglobal.org/spec/lti/claim/target_link_uri': 'https://custom-host.com/launch',
            'https://purl.imsglobal.org/spec/lti/claim/custom': {
                u: 'customUser',
                e: 'customEvent'
            }
        };
        await setupMocks(claims);

        const res = await request(app)
            .post('/api/v1/oidc/login')
            .set("x-csrf-token", csrfToken)
            .set("Cookie", csrfCookie)
            .send({ id_token: 'token' });

        expect(res.status).toBe(302);
        expect(res.header.location).toBe('https://custom-host.com/launch/customUser/customEvent');
    });

    it('should prioritize custom claims over target_link_uri', async () => {
        const claims = {
            sub: 'user',
            email: 'user@example.com',
            iss: 'https://lti.example.com',
            aud: 'lti_client_id',
            'https://purl.imsglobal.org/spec/lti/claim/custom': {
                u: 'customUser'
            },
            'https://purl.imsglobal.org/spec/lti/claim/target_link_uri': 'https://lms.com?u=uriUser&e=uriEvent'
        };
        await setupMocks(claims);

        const res = await request(app)
            .post('/api/v1/oidc/login')
            .set("x-csrf-token", csrfToken)
            .set("Cookie", csrfCookie)
            .send({ id_token: 'token' });

        // Custom has u=customUser, uri has e=uriEvent. Result should be customUser/uriEvent (mixed)
        // because precedence is per-field check?
        // Logic: 
        // userSlug = custom.u || custom.user; -> 'customUser'
        // eventSlug = custom.e ... -> undedined
        // if (!userSlug) -> skipped (already has one)
        // if (!eventSlug) -> takes from uri -> 'uriEvent'

        expect(res.status).toBe(302);
        expect(res.header.location).toBe('https://lms.com/customUser/uriEvent');
    });
});
