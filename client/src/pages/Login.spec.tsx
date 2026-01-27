import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import * as authServices from '../helpers/services/auth_services';
import { useGoogleLogin } from '@react-oauth/google';

// Mock dependencies
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useLocation: () => ({ search: '' })
}));

// Mock @react-oauth/google
vi.mock('@react-oauth/google', () => ({
    useGoogleLogin: vi.fn(),
    GoogleOAuthProvider: ({ children }: any) => <>{children}</>
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
    const mockGoogleLoginFn = vi.fn();

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
            },
            writable: true
        });

        // Setup default useGoogleLogin behavior
        vi.mocked(useGoogleLogin).mockImplementation((options: any) => {
            mockGoogleLoginFn.mockImplementation((loginOptions: any) => {
                if (options.onSuccess) {
                    // Default behavior: echo state back
                    options.onSuccess({ code: 'test-code', state: loginOptions?.state });
                }
            });
            return mockGoogleLoginFn;
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

        await waitFor(() => expect(mockGoogleLoginFn).toHaveBeenCalledWith({ state: 'mock-uuid-state' }));
        await waitFor(() => expect(authServices.postGoogleLogin).toHaveBeenCalledWith('test-code'));
        await waitFor(() => expect(mockRefreshAuth).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'));
    });

    it('should fail Google login flow when state mismatches', async () => {
        vi.spyOn(authServices, 'getAuthConfig').mockResolvedValue({ googleEnabled: true });

        // Override the hook implementation for this specific test
        vi.mocked(useGoogleLogin).mockImplementation((options: any) => {
            return (loginOptions: any) => {
                // Trigger success with mismatching state
                if (options.onSuccess) {
                    options.onSuccess({ code: 'test-code', state: 'wrong-state' });
                }
            }
        });

        render(<Login />);
        await waitFor(() => expect(screen.getByText('login_with google')).toBeInTheDocument());

        fireEvent.click(screen.getByText('login_with google'));

        // postGoogleLogin should NOT be called because of state mismatch
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
    it('should handle config fetch error', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        vi.spyOn(authServices, 'getAuthConfig').mockRejectedValue(new Error('Config Error'));
        render(<Login />);
        await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error)));
        await waitFor(() => expect(screen.queryByText('login_with')).not.toBeInTheDocument());
        consoleSpy.mockRestore();
    });

    it('should log google login errors', async () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
        vi.spyOn(authServices, 'getAuthConfig').mockResolvedValue({ googleEnabled: true });

        // Override hook to trigger onError
        vi.mocked(useGoogleLogin).mockImplementation((options: any) => {
            return () => {
                if (options.onError) {
                    options.onError('Google Error');
                }
            }
        });

        render(<Login />);
        await waitFor(() => expect(screen.getByText('login_with google')).toBeInTheDocument());
        fireEvent.click(screen.getByText('login_with google'));

        await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Login Failed:', 'Google Error'));
        consoleSpy.mockRestore();
    });

    it('should render specific OIDC icon when provided', async () => {
        vi.spyOn(authServices, 'getAuthConfig').mockResolvedValue({
            oidcEnabled: true,
            oidcName: 'MySSO',
            oidcIcon: 'http://icon.url/icon.png'
        });
        render(<Login />);

        await waitFor(() => expect(screen.getByAltText('sso_icon_alt')).toBeInTheDocument());
        expect(screen.getByAltText('sso_icon_alt')).toHaveAttribute('src', 'http://icon.url/icon.png');
    });

    it('should render divider when both methods are enabled', async () => {
        vi.spyOn(authServices, 'getAuthConfig').mockResolvedValue({
            oidcEnabled: true,
            googleEnabled: true
        });
        render(<Login />);

        await waitFor(() => expect(screen.getByText('or')).toBeInTheDocument());
    });

    it('should prevent race condition on double click', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        vi.spyOn(authServices, 'getAuthConfig').mockResolvedValue({ googleEnabled: true });

        // Setup unique UUIDs
        const mockRandomUUID = vi.fn()
            .mockReturnValueOnce('uuid-1')
            .mockReturnValueOnce('uuid-2');

        Object.defineProperty(global, 'crypto', {
            value: {
                randomUUID: mockRandomUUID
            },
            writable: true
        });

        let triggerLogin: any;
        let hookOptions: any;
        const loginMockFn = vi.fn((loginOptions: any) => {
            triggerLogin = loginOptions;
        });

        vi.mocked(useGoogleLogin).mockImplementation((options: any) => {
            hookOptions = options;
            return loginMockFn;
        });

        render(<Login />);
        await waitFor(() => expect(screen.getByText('login_with google')).toBeInTheDocument());

        // First click
        fireEvent.click(screen.getByText('login_with google'));
        expect(loginMockFn).toHaveBeenCalledTimes(1);
        const state1 = triggerLogin?.state;
        expect(state1).toBe('uuid-1');

        // Second click (should be ignored due to loading state)
        fireEvent.click(screen.getByText('login_with google'));

        // Assertions for fix
        expect(loginMockFn).toHaveBeenCalledTimes(1); // Should still be 1
        expect(mockRandomUUID).toHaveBeenCalledTimes(1); // Should still be 1 (uuid-2 not generated)

        // Complete the flow
        hookOptions.onSuccess({ code: 'test-code', state: state1 });

        // Should NOT log error
        expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('State mismatch'), expect.anything(), expect.anything());
        // Should navigate
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'));

        consoleSpy.mockRestore();
    });
});

