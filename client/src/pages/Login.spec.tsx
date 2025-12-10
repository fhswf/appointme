import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import * as authServices from '../helpers/services/auth_services';
import { toast } from 'sonner';

// Mock auth services
vi.mock('../helpers/services/auth_services', () => ({
    postGoogleLogin: vi.fn(),
    getAuthConfig: vi.fn(),
    getOidcAuthUrl: vi.fn()
}));

// Mock sonner toast
vi.mock('sonner', () => ({
    toast: {
        error: vi.fn()
    }
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

// Mock Google OAuth
vi.mock('@react-oauth/google', () => ({
    GoogleLogin: ({ onSuccess, onError }: any) => (
        <div data-testid="google-login">
            <button onClick={() => onSuccess({ credential: 'mock-credential' })}>
                Sign in with Google
            </button>
            <button onClick={() => onError()}>Trigger Error</button>
        </div>
    )
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

describe('Login Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Suppress console.log for cleaner test output
        vi.spyOn(console, 'log').mockImplementation(() => { });
        vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    it('should render with Google login when enabled', async () => {
        vi.mocked(authServices.getAuthConfig).mockResolvedValue({
            googleEnabled: true,
            oidcEnabled: false
        });

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('google-login')).toBeInTheDocument();
        });
    });

    it('should render with OIDC login when enabled', async () => {
        vi.mocked(authServices.getAuthConfig).mockResolvedValue({
            googleEnabled: false,
            oidcEnabled: true
        });

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('login-sso')).toBeInTheDocument();
        });
    });

    it('should render both login options when both enabled', async () => {
        vi.mocked(authServices.getAuthConfig).mockResolvedValue({
            googleEnabled: true,
            oidcEnabled: true
        });

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('google-login')).toBeInTheDocument();
            expect(screen.getByTestId('login-sso')).toBeInTheDocument();
        });
    });

    it('should not render login options when both disabled', async () => {
        vi.mocked(authServices.getAuthConfig).mockResolvedValue({
            googleEnabled: false,
            oidcEnabled: false
        });

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('google-login')).not.toBeInTheDocument();
            expect(screen.queryByTestId('login-sso')).not.toBeInTheDocument();
        });
    });

    it('should handle successful Google login', async () => {
        vi.mocked(authServices.getAuthConfig).mockResolvedValue({
            googleEnabled: true,
            oidcEnabled: false
        });
        vi.mocked(authServices.postGoogleLogin).mockResolvedValue({ data: { success: true }, status: 200, statusText: 'OK', headers: {}, config: {} as any });

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('google-login')).toBeInTheDocument();
        });

        const googleButton = screen.getByText('Sign in with Google');
        fireEvent.click(googleButton);

        await waitFor(() => {
            expect(authServices.postGoogleLogin).toHaveBeenCalledWith('mock-credential');
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    it('should handle Google login failure', async () => {
        vi.mocked(authServices.getAuthConfig).mockResolvedValue({
            googleEnabled: true,
            oidcEnabled: false
        });
        const error = {
            response: {
                data: {
                    message: 'Invalid credentials'
                }
            },
            message: 'Login failed'
        };
        vi.mocked(authServices.postGoogleLogin).mockRejectedValue(error);

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('google-login')).toBeInTheDocument();
        });

        const googleButton = screen.getByText('Sign in with Google');
        fireEvent.click(googleButton);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('google_login_failed: Invalid credentials');
        });
    });

    it('should handle Google login error without response data', async () => {
        vi.mocked(authServices.getAuthConfig).mockResolvedValue({
            googleEnabled: true,
            oidcEnabled: false
        });
        const error = new Error('Network error');
        vi.mocked(authServices.postGoogleLogin).mockRejectedValue(error);

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('google-login')).toBeInTheDocument();
        });

        const googleButton = screen.getByText('Sign in with Google');
        fireEvent.click(googleButton);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('google_login_failed: Network error');
        });
    });

    it('should handle OIDC login button click', async () => {
        vi.mocked(authServices.getAuthConfig).mockResolvedValue({
            googleEnabled: false,
            oidcEnabled: true
        });
        vi.mocked(authServices.getOidcAuthUrl).mockResolvedValue({
            url: 'https://oidc.example.com/auth'
        });

        // Mock globalThis.location
        const originalLocation = globalThis.location;
        delete (globalThis as any).location;
        globalThis.location = { href: '' } as any;

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('login-sso')).toBeInTheDocument();
        });

        const oidcButton = screen.getByTestId('login-sso');
        fireEvent.click(oidcButton);

        await waitFor(() => {
            expect(authServices.getOidcAuthUrl).toHaveBeenCalled();
            expect(globalThis.location.href).toBe('https://oidc.example.com/auth');
        });

        // Restore location
        globalThis.location = originalLocation;
    });

    it('should handle OIDC login failure', async () => {
        vi.mocked(authServices.getAuthConfig).mockResolvedValue({
            googleEnabled: false,
            oidcEnabled: true
        });
        vi.mocked(authServices.getOidcAuthUrl).mockRejectedValue(new Error('OIDC not configured'));

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('login-sso')).toBeInTheDocument();
        });

        const oidcButton = screen.getByTestId('login-sso');
        fireEvent.click(oidcButton);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('login_failed');
        });
    });

    it('should handle auth config fetch error', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error');
        vi.mocked(authServices.getAuthConfig).mockRejectedValue(new Error('Config error'));

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalled();
        });
    });

    it('should log credential response on Google success', async () => {
        const consoleSpy = vi.spyOn(console, 'log');
        vi.mocked(authServices.getAuthConfig).mockResolvedValue({
            googleEnabled: true,
            oidcEnabled: false
        });
        vi.mocked(authServices.postGoogleLogin).mockResolvedValue({ data: {}, status: 200, statusText: 'OK', headers: {}, config: {} as any });

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('google-login')).toBeInTheDocument();
        });

        const googleButton = screen.getByText('Sign in with Google');
        fireEvent.click(googleButton);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith({ credential: 'mock-credential' });
        });
    });

    it('should log Google login failure', async () => {
        const consoleSpy = vi.spyOn(console, 'log');
        vi.mocked(authServices.getAuthConfig).mockResolvedValue({
            googleEnabled: true,
            oidcEnabled: false
        });

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('google-login')).toBeInTheDocument();
        });

        const errorButton = screen.getByText('Trigger Error');
        fireEvent.click(errorButton);

        expect(consoleSpy).toHaveBeenCalledWith('Login Failed');
    });

    it('should log postGoogleLogin response', async () => {
        const consoleSpy = vi.spyOn(console, 'log');
        const mockResponse = { data: { user: { id: '123' } } };
        vi.mocked(authServices.getAuthConfig).mockResolvedValue({
            googleEnabled: true,
            oidcEnabled: false
        });
        vi.mocked(authServices.postGoogleLogin).mockResolvedValue({ ...mockResponse, status: 200, statusText: 'OK', headers: {}, config: {} as any });

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('google-login')).toBeInTheDocument();
        });

        const googleButton = screen.getByText('Sign in with Google');
        fireEvent.click(googleButton);

        await waitFor(() => {
            // The third call is the response logging
            expect(consoleSpy).toHaveBeenCalledWith('postGoogleLogin: %o', expect.objectContaining({
                data: { user: { id: '123' } }
            }));
        });
    });

    it('should handle OIDC auth URL without url property', async () => {
        vi.mocked(authServices.getAuthConfig).mockResolvedValue({
            googleEnabled: false,
            oidcEnabled: true
        });
        vi.mocked(authServices.getOidcAuthUrl).mockResolvedValue({} as any);

        const originalLocation = globalThis.location;
        delete (globalThis as any).location;
        globalThis.location = { href: '' } as any;

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('login-sso')).toBeInTheDocument();
        });

        const oidcButton = screen.getByTestId('login-sso');
        fireEvent.click(oidcButton);

        await waitFor(() => {
            expect(authServices.getOidcAuthUrl).toHaveBeenCalled();
        });

        // Should not redirect if url is not present
        expect(globalThis.location.href).toBe('');

        globalThis.location = originalLocation;
    });

    it('should log credential on Google success', async () => {
        const consoleSpy = vi.spyOn(console, 'log');
        vi.mocked(authServices.getAuthConfig).mockResolvedValue({
            googleEnabled: true,
            oidcEnabled: false
        });
        vi.mocked(authServices.postGoogleLogin).mockResolvedValue({ data: {}, status: 200, statusText: 'OK', headers: {}, config: {} as any });

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('google-login')).toBeInTheDocument();
        });

        const googleButton = screen.getByText('Sign in with Google');
        fireEvent.click(googleButton);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('postGoogleLogin: code=%s', 'mock-credential');
        });
    });
});

