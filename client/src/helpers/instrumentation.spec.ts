import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import * as Sentry from '@sentry/react';
import { setupSentryInstrumentation } from './instrumentation';

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@sentry/react', () => ({
    startInactiveSpan: vi.fn(),
}));

vi.mock('axios', () => ({
    default: {
        interceptors: {
            request: { use: vi.fn() },
            response: { use: vi.fn() },
        },
    },
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

function captureInterceptors() {
    let requestHandler!: (config: any) => any;
    let responseSuccessHandler!: (response: any) => any;
    let responseErrorHandler!: (error: any) => Promise<never>;

    vi.mocked(axios.interceptors.request.use).mockImplementation((handler: any) => {
        requestHandler = handler;
        return 0;
    });

    vi.mocked(axios.interceptors.response.use).mockImplementation((success: any, error: any) => {
        responseSuccessHandler = success;
        responseErrorHandler = error;
        return 0;
    });

    setupSentryInstrumentation();

    return { requestHandler, responseSuccessHandler, responseErrorHandler };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('setupSentryInstrumentation', () => {
    let mockSpan: {
        setAttribute: ReturnType<typeof vi.fn>;
        setStatus: ReturnType<typeof vi.fn>;
        end: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockSpan = {
            setAttribute: vi.fn(),
            setStatus: vi.fn(),
            end: vi.fn(),
        };
        vi.mocked(Sentry.startInactiveSpan).mockReturnValue(mockSpan as any);
    });

    // ── Request interceptor ────────────────────────────────────────────────

    describe('request interceptor', () => {
        it('starts a span with correct name, op, and http attributes', () => {
            const { requestHandler } = captureInterceptors();

            requestHandler({ method: 'get', url: '/api/v1/user/me' });

            expect(Sentry.startInactiveSpan).toHaveBeenCalledWith({
                name: 'GET /api/v1/user/me',
                op: 'http.client',
                attributes: {
                    'http.method': 'GET',
                    'http.url': '/api/v1/user/me',
                },
            });
        });

        it('upper-cases the HTTP method', () => {
            const { requestHandler } = captureInterceptors();

            requestHandler({ method: 'post', url: '/api/v1/event' });

            expect(Sentry.startInactiveSpan).toHaveBeenCalledWith(
                expect.objectContaining({ name: 'POST /api/v1/event' })
            );
        });

        it('attaches the span to the request config', () => {
            const { requestHandler } = captureInterceptors();
            const config = { method: 'get', url: '/api/v1/user/me' };

            const result = requestHandler(config);

            expect(result._sentrySpan).toBe(mockSpan);
        });

        it('defaults to GET when method is absent', () => {
            const { requestHandler } = captureInterceptors();

            requestHandler({ url: '/api/v1/csrf-token' });

            expect(Sentry.startInactiveSpan).toHaveBeenCalledWith(
                expect.objectContaining({ name: 'GET /api/v1/csrf-token' })
            );
        });

        it('handles a missing url gracefully', () => {
            const { requestHandler } = captureInterceptors();

            expect(() => requestHandler({ method: 'get' })).not.toThrow();
        });
    });

    // ── Success response interceptor ───────────────────────────────────────

    describe('response success interceptor', () => {
        it('sets http.status_code attribute and ends the span on success', () => {
            const { requestHandler, responseSuccessHandler } = captureInterceptors();
            const config = requestHandler({ method: 'get', url: '/api/v1/user/me' });

            responseSuccessHandler({ config, status: 200, data: {} });

            expect(mockSpan.setAttribute).toHaveBeenCalledWith('http.status_code', 200);
            expect(mockSpan.end).toHaveBeenCalledTimes(1);
        });

        it('returns the response unchanged', () => {
            const { requestHandler, responseSuccessHandler } = captureInterceptors();
            const config = requestHandler({ method: 'get', url: '/api/v1/event' });
            const response = { config, status: 200, data: [{ id: '1' }] };

            const result = responseSuccessHandler(response);

            expect(result).toBe(response);
        });

        it('does not throw when config has no span attached', () => {
            const { responseSuccessHandler } = captureInterceptors();

            expect(() =>
                responseSuccessHandler({ config: {}, status: 200, data: null })
            ).not.toThrow();
        });
    });

    // ── Error response interceptor ─────────────────────────────────────────

    describe('response error interceptor', () => {
        it('sets status code, marks span as error, and ends it on HTTP error', async () => {
            const { requestHandler, responseErrorHandler } = captureInterceptors();
            const config = requestHandler({ method: 'get', url: '/api/v1/user/me' });
            const error = {
                config,
                response: { status: 401 },
                message: 'Request failed with status code 401',
            };

            await expect(responseErrorHandler(error)).rejects.toBe(error);

            expect(mockSpan.setAttribute).toHaveBeenCalledWith('http.status_code', 401);
            expect(mockSpan.setStatus).toHaveBeenCalledWith({
                code: 2,
                message: 'Request failed with status code 401',
            });
            expect(mockSpan.end).toHaveBeenCalledTimes(1);
        });

        it('ends span without status code on network error (no response)', async () => {
            const { requestHandler, responseErrorHandler } = captureInterceptors();
            const config = requestHandler({ method: 'get', url: '/api/v1/user/me' });
            const error = { config, response: undefined, message: 'Network Error' };

            await expect(responseErrorHandler(error)).rejects.toBe(error);

            expect(mockSpan.setAttribute).not.toHaveBeenCalledWith(
                'http.status_code',
                expect.anything()
            );
            expect(mockSpan.setStatus).toHaveBeenCalledWith({
                code: 2,
                message: 'Network Error',
            });
            expect(mockSpan.end).toHaveBeenCalledTimes(1);
        });

        it('handles errors with no config gracefully', async () => {
            const { responseErrorHandler } = captureInterceptors();
            const error = { message: 'Unknown error' };

            // No span to end — must not throw
            await expect(responseErrorHandler(error)).rejects.toBe(error);
            expect(mockSpan.end).not.toHaveBeenCalled();
        });

        it('always rejects so that callers receive the original error', async () => {
            const { requestHandler, responseErrorHandler } = captureInterceptors();
            const config = requestHandler({ method: 'delete', url: '/api/v1/event/123' });
            const error = { config, response: { status: 500 }, message: 'Server Error' };

            const rejected = responseErrorHandler(error);

            await expect(rejected).rejects.toBe(error);
        });
    });
});
