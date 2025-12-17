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
        mockGoogleLogin.mockImplementation(() => {
            if (options.onSuccess) {
                options.onSuccess({ code: 'test-code' });
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
    });

    it('should render nothing if config is empty', async () => {
        render(<Login />);
        await waitFor(() => expect(authServices.getAuthConfig).toHaveBeenCalled());
        expect(screen.queryByText('login_with')).not.toBeInTheDocument();
    });

    it('should render Google login button when enabled', async () => {
        vi.spyOn(authServices, 'getAuthConfig').mockResolvedValue({ googleEnabled: true });
        render(<Login />);
        await waitFor(() => expect(screen.getByText('login_with Google')).toBeInTheDocument());
    });

    it('should render OIDC login button when enabled', async () => {
        vi.spyOn(authServices, 'getAuthConfig').mockResolvedValue({ oidcEnabled: true, oidcName: 'MySSO' });
        render(<Login />);
        await waitFor(() => expect(screen.getByText('login_with MySSO')).toBeInTheDocument());
    });

    it('should handle Google login flow success', async () => {
        vi.spyOn(authServices, 'getAuthConfig').mockResolvedValue({ googleEnabled: true });
        render(<Login />);
        await waitFor(() => expect(screen.getByText('login_with Google')).toBeInTheDocument());

        fireEvent.click(screen.getByText('login_with Google'));

        await waitFor(() => expect(mockGoogleLogin).toHaveBeenCalled());
        await waitFor(() => expect(authServices.postGoogleLogin).toHaveBeenCalledWith('test-code'));
        await waitFor(() => expect(mockRefreshAuth).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'));
    });

    it('should handle Google login flow failure', async () => {
        vi.spyOn(authServices, 'getAuthConfig').mockResolvedValue({ googleEnabled: true });
        vi.spyOn(authServices, 'postGoogleLogin').mockRejectedValue({ response: { data: { message: 'Invalid code' } } });
        render(<Login />);

        await waitFor(() => expect(screen.getByText('login_with Google')).toBeInTheDocument());
        fireEvent.click(screen.getByText('login_with Google'));

        await waitFor(() => expect(authServices.postGoogleLogin).toHaveBeenCalled());
        // Should show error toast? (Not checking implementation details of toast here, but could spy on it)
        // Check valid error handling flow - e.g. NOT navigating
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
});
