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
        vi.spyOn(console, 'log').mockImplementation(() => {});
        vi.spyOn(console, 'error').mockImplementation(() => {});
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
            expect(screen.getByText('Login with SSO')).toBeInTheDocument();
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
            expect(screen.getByText('Login with SSO')).toBeInTheDocument();
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
            expect(screen.queryByText('Login with SSO')).not.toBeInTheDocument();
        });
    });

    it('should handle successful Google login', async () => {
        vi.mocked(authServices.getAuthConfig).mockResolvedValue({
            googleEnabled: true,
            oidcEnabled: false
        });
        vi.mocked(authServices.postGoogleLogin).mockResolvedValue({ data: { success: true } });

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
            expect(mockNavigate).toHaveBeenCalledWith('/app');
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
            expect(toast.error).toHaveBeenCalledWith('Google login failed: Invalid credentials');
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
            expect(toast.error).toHaveBeenCalledWith('Google login failed: Network error');
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
            expect(screen.getByText('Login with SSO')).toBeInTheDocument();
        });

        const oidcButton = screen.getByText('Login with SSO');
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
            expect(screen.getByText('Login with SSO')).toBeInTheDocument();
        });

        const oidcButton = screen.getByText('Login with SSO');
        fireEvent.click(oidcButton);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Failed to start SSO login');
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
        vi.mocked(authServices.postGoogleLogin).mockResolvedValue({ data: {} });

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
});
