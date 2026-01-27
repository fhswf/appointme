import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import * as authServices from '../helpers/services/auth_services';

// Mock dependencies
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useLocation: () => ({ search: '' })
}));

const mockGoogleLogin = vi.fn();
vi.mock('@react-oauth/google', () => ({
    useGoogleLogin: (options: any) => {
        mockGoogleLogin.mockImplementation((loginOptions: any) => {
            if (options.onSuccess) {
                // Simulate success callback with the state passed in loginOptions
                options.onSuccess({ code: 'test-code', state: loginOptions?.state });
            }
        });
        return mockGoogleLogin;
    }
}));

vi.mock('../components/ui/button', () => ({
    Button: ({ children, onClick, ...props }: any) => (
        <button onClick={onClick} {...props}>{children}</button>
    )
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key
    })
}));

const mockRefreshAuth = vi.fn();
vi.mock('../components/AuthProvider', () => ({
    useAuth: () => ({
        refreshAuth: mockRefreshAuth
    })
}));

// Mock toast
vi.mock('sonner', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn()
    }
}));

describe('Login Page', () => {
    const mockRandomUUID = vi.fn(() => 'mock-uuid-state');

    beforeEach(() => {
        vi.clearAllMocks();
        // Default mocks
        vi.spyOn(authServices, 'getAuthConfig').mockResolvedValue({});
        vi.spyOn(authServices, 'postGoogleLogin').mockResolvedValue({ success: true });
        vi.spyOn(authServices, 'getOidcAuthUrl').mockResolvedValue({ url: 'http://oidc-url.com' });
        // Mock global location
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { href: '' },
        });

        // Mock crypto.randomUUID
        Object.defineProperty(global, 'crypto', {
            value: {
                randomUUID: mockRandomUUID
            }
        });
    });

    it('should render nothing if config is empty', async () => {
        render(<Login />);
        await waitFor(() => expect(authServices.getAuthConfig).toHaveBeenCalled());
        expect(screen.queryByText('login_with')).not.toBeInTheDocument();
    });

    it('should render Google login button when enabled', async () => {
        vi.spyOn(authServices, 'getAuthConfig').mockResolvedValue({ googleEnabled: true });
        render(<Login />);
        await waitFor(() => expect(screen.getByText('login_with google')).toBeInTheDocument());
    });

    it('should render OIDC login button when enabled', async () => {
        vi.spyOn(authServices, 'getAuthConfig').mockResolvedValue({ oidcEnabled: true, oidcName: 'MySSO' });
        render(<Login />);
        await waitFor(() => expect(screen.getByText('login_with MySSO')).toBeInTheDocument());
    });

    it('should handle Google login flow success with valid state', async () => {
        vi.spyOn(authServices, 'getAuthConfig').mockResolvedValue({ googleEnabled: true });
        render(<Login />);
        await waitFor(() => expect(screen.getByText('login_with google')).toBeInTheDocument());

        fireEvent.click(screen.getByText('login_with google'));

        await waitFor(() => expect(mockGoogleLogin).toHaveBeenCalledWith({ state: 'mock-uuid-state' }));
        await waitFor(() => expect(authServices.postGoogleLogin).toHaveBeenCalledWith('test-code'));
        await waitFor(() => expect(mockRefreshAuth).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'));
    });

    it('should fail Google login flow when state mismatches', async () => {
        vi.spyOn(authServices, 'getAuthConfig').mockResolvedValue({ googleEnabled: true });

        let capturedOptions: any;
        mockGoogleLogin.mockImplementation((options: any) => {
            capturedOptions = options;
            return (loginOptions: any) => {
                // Trigger success but with WRONG state
                if (capturedOptions && capturedOptions.onSuccess) {
                    capturedOptions.onSuccess({ code: 'test-code', state: 'wrong-state' });
                }
            }
        });

        render(<Login />);
        await waitFor(() => expect(screen.getByText('login_with google')).toBeInTheDocument());

        fireEvent.click(screen.getByText('login_with google'));

        // Should verify postGoogleLogin should NOT be called
        await waitFor(() => expect(authServices.postGoogleLogin).not.toHaveBeenCalled());
    });

    it('should handle Google login flow failure from API', async () => {
        vi.spyOn(authServices, 'getAuthConfig').mockResolvedValue({ googleEnabled: true });
        vi.spyOn(authServices, 'postGoogleLogin').mockRejectedValue({ response: { data: { message: 'Invalid code' } } });
        render(<Login />);

        await waitFor(() => expect(screen.getByText('login_with google')).toBeInTheDocument());
        fireEvent.click(screen.getByText('login_with google'));

        await waitFor(() => expect(authServices.postGoogleLogin).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled());
    });

    it('should handle OIDC login flow', async () => {
        vi.spyOn(authServices, 'getAuthConfig').mockResolvedValue({ oidcEnabled: true });
        render(<Login />);

        await waitFor(() => expect(screen.getByText('login_with SSO')).toBeInTheDocument());
        fireEvent.click(screen.getByText('login_with SSO'));

        await waitFor(() => expect(authServices.getOidcAuthUrl).toHaveBeenCalled());
        await waitFor(() => expect(window.location.href).toBe('http://oidc-url.com'));
    });

    it('should handle OIDC login failure', async () => {
        vi.spyOn(authServices, 'getAuthConfig').mockResolvedValue({ oidcEnabled: true });
        vi.spyOn(authServices, 'getOidcAuthUrl').mockRejectedValue(new Error('OIDC Error'));
        render(<Login />);

        await waitFor(() => expect(screen.getByText('login_with SSO')).toBeInTheDocument());
        fireEvent.click(screen.getByText('login_with SSO'));

        await waitFor(() => expect(authServices.getOidcAuthUrl).toHaveBeenCalled());
        await waitFor(() => expect(screen.getByText('login_with SSO')).toBeInTheDocument());
    });
});
