import axios, { InternalAxiosRequestConfig } from 'axios';
import * as Sentry from '@sentry/react';

/**
 * Extends Axios request config to carry the associated Sentry span across
 * request and response interceptors.
 */
interface InstrumentedConfig extends InternalAxiosRequestConfig {
    _sentrySpan?: ReturnType<typeof Sentry.startInactiveSpan>;
}

/**
 * Registers Axios request/response interceptors that wrap every outgoing API
 * call in a Sentry span.
 *
 * Span attributes set:
 *   - http.method  – upper-cased HTTP verb
 *   - http.url     – request URL (relative or absolute)
 *   - http.status_code – response/error status code when available
 *
 * The span status is set to "error" (OTel code 2) for non-2xx responses and
 * network failures. All spans are always ended, even on error.
 *
 * Call this once at application startup, after Sentry.init().
 */
export function setupSentryInstrumentation(): void {
    // ── Request interceptor ────────────────────────────────────────────────
    axios.interceptors.request.use((config: InstrumentedConfig) => {
        const method = (config.method ?? 'GET').toUpperCase();
        const url = config.url ?? '';

        const span = Sentry.startInactiveSpan({
            name: `${method} ${url}`,
            op: 'http.client',
            attributes: {
                'http.method': method,
                'http.url': url,
            },
        });

        config._sentrySpan = span;
        return config;
    });

    // ── Response interceptors ──────────────────────────────────────────────
    axios.interceptors.response.use(
        // Success (2xx)
        (response) => {
            const config = response.config as InstrumentedConfig;
            const span = config._sentrySpan;
            if (span) {
                span.setAttribute('http.status_code', response.status);
                span.end();
            }
            return response;
        },
        // Error (non-2xx or network failure)
        (error) => {
            const config = (error?.config ?? {}) as InstrumentedConfig;
            const span = config._sentrySpan;
            if (span) {
                if (error?.response?.status != null) {
                    span.setAttribute('http.status_code', error.response.status);
                }
                span.setStatus({
                    code: 2, // SpanStatusCode.ERROR
                    message: error?.message ?? 'Request failed',
                });
                span.end();
            }
            return Promise.reject(error);
        }
    );
}
