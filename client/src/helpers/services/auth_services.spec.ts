import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import {
    postToRegister,
    postToActivate,
    postGoogleLogin,
    postLogin,
    getOidcConfig,
    getOidcAuthUrl,
    postOidcLogin,
    getAuthConfig
} from './auth_services';
import * as csrfService from './csrf_service';

// Mock axios
vi.mock('axios');

// Mock csrf service
vi.mock('./csrf_service', () => ({
    getCsrfToken: vi.fn()
}));

// Mock config
vi.mock('../config', () => ({
    CONFIG: {
        API_URL: 'http://localhost:3001'
    }
}));

describe('auth_services', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Suppress console.log for cleaner test output
        vi.spyOn(console, 'log').mockImplementation(() => { });
    });

    describe('postToRegister', () => {
        it('should register user with CSRF token', async () => {
            const mockCsrfToken = 'csrf-123';
            vi.mocked(csrfService.getCsrfToken).mockResolvedValue(mockCsrfToken);
            vi.mocked(axios.post).mockResolvedValue({ data: { success: true } });

            const result = await postToRegister('John Doe', 'john@example.com', 'password123');

            expect(csrfService.getCsrfToken).toHaveBeenCalled();
            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:3001/auth/register',
                {
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: 'password123'
                },
                {
                    headers: {
                        'x-csrf-token': mockCsrfToken
                    }
                }
            );
            expect(result.data.success).toBe(true);
        });

        it('should handle registration errors', async () => {
            vi.mocked(csrfService.getCsrfToken).mockResolvedValue('token');
            vi.mocked(axios.post).mockRejectedValue(new Error('Email already exists'));

            await expect(postToRegister('Name', 'email@test.com', 'pass')).rejects.toThrow('Email already exists');
        });
    });

    describe('postToActivate', () => {
        it('should activate account with CSRF token', async () => {
            const mockCsrfToken = 'csrf-456';
            vi.mocked(csrfService.getCsrfToken).mockResolvedValue(mockCsrfToken);
            vi.mocked(axios.post).mockResolvedValue({ data: { activated: true } });

            const result = await postToActivate('activation-token');

            expect(csrfService.getCsrfToken).toHaveBeenCalled();
            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:3001/auth/activate',
                {},
                {
                    headers: {
                        'x-csrf-token': mockCsrfToken
                    },
                    withCredentials: true
                }
            );
            expect(result.data.activated).toBe(true);
        });

        it('should handle invalid activation token', async () => {
            vi.mocked(csrfService.getCsrfToken).mockResolvedValue('token');
            vi.mocked(axios.post).mockRejectedValue(new Error('Invalid token'));

            await expect(postToActivate('invalid-token')).rejects.toThrow('Invalid token');
        });
    });

    describe('postGoogleLogin', () => {
        it('should send Google OAuth code with CSRF token', async () => {
            const mockCsrfToken = 'csrf-789';
            const authCode = 'google-auth-code-123';
            vi.mocked(csrfService.getCsrfToken).mockResolvedValue(mockCsrfToken);
            vi.mocked(axios.post).mockResolvedValue({ data: { user: { id: 'user1' } } });

            const result = await postGoogleLogin(authCode);

            expect(csrfService.getCsrfToken).toHaveBeenCalled();
            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:3001/auth/google_oauth2_code',
                {
                    code: authCode
                },
                {
                    headers: {
                        'x-csrf-token': mockCsrfToken
                    },
                    withCredentials: true
                }
            );
            expect(result.data.user.id).toBe('user1');
        });

        it('should handle Google login errors', async () => {
            vi.mocked(csrfService.getCsrfToken).mockResolvedValue('token');
            vi.mocked(axios.post).mockRejectedValue(new Error('Google authentication failed'));

            await expect(postGoogleLogin('bad-code')).rejects.toThrow('Google authentication failed');
        });
    });

    describe('postLogin', () => {
        it('should login with email and password', async () => {
            const mockCsrfToken = 'csrf-login';
            vi.mocked(csrfService.getCsrfToken).mockResolvedValue(mockCsrfToken);
            vi.mocked(axios.post).mockResolvedValue({ data: { token: 'session-token' } });

            const result = await postLogin('user@example.com', 'password123');

            expect(csrfService.getCsrfToken).toHaveBeenCalled();
            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:3001/auth/login',
                {
                    email: 'user@example.com',
                    password: 'password123'
                },
                {
                    headers: {
                        'x-csrf-token': mockCsrfToken
                    },
                    withCredentials: true
                }
            );
            expect(result.data.token).toBe('session-token');
        });

        it('should handle invalid credentials', async () => {
            vi.mocked(csrfService.getCsrfToken).mockResolvedValue('token');
            vi.mocked(axios.post).mockRejectedValue(new Error('Invalid credentials'));

            await expect(postLogin('wrong@email.com', 'wrongpass')).rejects.toThrow('Invalid credentials');
        });
    });

    describe('getOidcConfig', () => {
        it('should fetch OIDC configuration', async () => {
            const mockConfig = { enabled: true, issuer: 'https://oidc.example.com' };
            vi.mocked(axios.get).mockResolvedValue({ data: mockConfig });

            const result = await getOidcConfig();

            expect(axios.get).toHaveBeenCalledWith('http://localhost:3001/oidc/config');
            expect(result).toEqual(mockConfig);
        });

        it('should handle OIDC not configured', async () => {
            vi.mocked(axios.get).mockResolvedValue({ data: { enabled: false } });

            const result = await getOidcConfig();

            expect(result.enabled).toBe(false);
        });

        it('should handle errors', async () => {
            vi.mocked(axios.get).mockRejectedValue(new Error('Config unavailable'));

            await expect(getOidcConfig()).rejects.toThrow('Config unavailable');
        });
    });

    describe('getOidcAuthUrl', () => {
        it('should fetch OIDC auth URL', async () => {
            const mockResponse = { url: 'https://oidc.example.com/auth?client_id=123' };
            vi.mocked(axios.get).mockResolvedValue({ data: mockResponse });

            const result = await getOidcAuthUrl();

            expect(axios.get).toHaveBeenCalledWith('http://localhost:3001/oidc/url');
            expect(result).toEqual(mockResponse);
        });

        it('should handle URL generation errors', async () => {
            vi.mocked(axios.get).mockRejectedValue(new Error('OIDC not configured'));

            await expect(getOidcAuthUrl()).rejects.toThrow('OIDC not configured');
        });
    });

    describe('postOidcLogin', () => {
        it('should send OIDC code with CSRF token', async () => {
            const mockCsrfToken = 'csrf-oidc';
            const oidcCode = 'oidc-auth-code';
            vi.mocked(csrfService.getCsrfToken).mockResolvedValue(mockCsrfToken);
            vi.mocked(axios.post).mockResolvedValue({ data: { user: { id: 'user2' } } });

            const result = await postOidcLogin(oidcCode);

            expect(csrfService.getCsrfToken).toHaveBeenCalled();
            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:3001/oidc/login',
                {
                    code: oidcCode
                },
                {
                    headers: {
                        'x-csrf-token': mockCsrfToken
                    },
                    withCredentials: true
                }
            );
            expect(result.data.user.id).toBe('user2');
        });

        it('should handle OIDC login errors', async () => {
            vi.mocked(csrfService.getCsrfToken).mockResolvedValue('token');
            vi.mocked(axios.post).mockRejectedValue(new Error('OIDC authentication failed'));

            await expect(postOidcLogin('invalid-code')).rejects.toThrow('OIDC authentication failed');
        });
    });

    describe('getAuthConfig', () => {
        it('should fetch auth configuration', async () => {
            const mockConfig = {
                googleEnabled: true,
                oidcEnabled: true
            };
            vi.mocked(axios.get).mockResolvedValue({ data: mockConfig });

            const result = await getAuthConfig();

            expect(axios.get).toHaveBeenCalledWith('http://localhost:3001/auth/config');
            expect(result).toEqual(mockConfig);
        });

        it('should handle partial configuration', async () => {
            const mockConfig = {
                googleEnabled: false,
                oidcEnabled: true
            };
            vi.mocked(axios.get).mockResolvedValue({ data: mockConfig });

            const result = await getAuthConfig();

            expect(result.googleEnabled).toBe(false);
            expect(result.oidcEnabled).toBe(true);
        });

        it('should handle errors', async () => {
            vi.mocked(axios.get).mockRejectedValue(new Error('Config error'));

            await expect(getAuthConfig()).rejects.toThrow('Config error');
        });
    });
});
