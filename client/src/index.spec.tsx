import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import * as Sentry from '@sentry/react';

// Mock Sentry
vi.mock('@sentry/react', () => ({
    init: vi.fn(),
    browserTracingIntegration: vi.fn(),
    replayIntegration: vi.fn(),
    feedbackIntegration: vi.fn(),
    setUser: vi.fn(),
}));

// Mock ReactDOM
const mockRender = vi.fn();
const mockCreateRoot = vi.fn(() => ({
    render: mockRender,
}));
vi.mock('react-dom/client', () => ({
    createRoot: mockCreateRoot,
}));

// Mock Config
vi.mock('./helpers/config', () => ({
    CONFIG: {
        SENTRY_DSN: 'https://example@sentry.io/123',
        CLIENT_ID: 'test-client-id',
        BASE_PATH: '/',
        API_URL: 'http://localhost:3000',
    },
}));

// Mock Components and Pages to avoid deep rendering
vi.mock('./pages/App', () => ({ default: () => <div>App</div> }));
vi.mock('./pages/Login', () => ({ default: () => <div>Login</div> }));
vi.mock('./pages/Landing', () => ({ default: () => <div>Landing</div> }));
vi.mock('./components/AuthLayout', () => ({ AuthLayout: () => <div>AuthLayout</div> }));
vi.mock('./components/PrivateRoute', () => ({ default: ({ children }: any) => <div>PrivateRoute {children}</div> }));

describe('Index Entry Point', () => {
    beforeEach(() => {
        // Setup DOM element
        document.body.innerHTML = '<div id="root"></div>';
    });

    afterEach(() => {
        vi.clearAllMocks();
        document.body.innerHTML = '';
        vi.resetModules();
    });

    it('initializes Sentry and renders the app', async () => {
        // Import index to trigger execution
        await import('./index');

        expect(Sentry.init).toHaveBeenCalledWith(expect.objectContaining({
            dsn: 'https://example@sentry.io/123',
        }));

        expect(mockCreateRoot).toHaveBeenCalled();
        expect(mockRender).toHaveBeenCalled();
    }, 10000);
});
