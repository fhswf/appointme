
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../../pages/Login';
import * as authServices from '../../helpers/services/auth_services';
import { toast } from 'sonner';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

// Mock @react-oauth/google
vi.mock('@react-oauth/google', () => ({
    GoogleLogin: ({ onSuccess, onError }) => (
        <button
            data-testid="google-login-button"
            onClick={() => onSuccess({ credential: 'mock-google-token' })}
        >
            Google Login
        </button>
    ),
}));

// Mock auth_services
vi.mock('../../helpers/services/auth_services');

// Mock sonner
vi.mock('sonner', () => ({
    toast: {
        error: vi.fn(),
    },
}));
describe('Login Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (authServices.getAuthConfig as any).mockResolvedValue({
            oidcEnabled: false,
            googleEnabled: true
        });
    });

    it('should render Google Login button', async () => {
        render(<Login />);
        const button = await screen.findByTestId('google-login-button');
        expect(button).toBeInTheDocument();
    });

    it('should call postGoogleLogin and navigate on success', async () => {
        (authServices.postGoogleLogin as any).mockResolvedValue({ data: 'success' });

        render(<Login />);

        const button = await screen.findByTestId('google-login-button');
        fireEvent.click(button);

        expect(authServices.postGoogleLogin).toHaveBeenCalledWith('mock-google-token');

        // Wait for promise resolution
        await new Promise(process.nextTick);

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should handle login error', async () => {
        const consoleSpy = vi.spyOn(console, 'log');
        (authServices.postGoogleLogin as any).mockRejectedValue({ response: 'error' });

        render(<Login />);

        const button = await screen.findByTestId('google-login-button');
        fireEvent.click(button);

        expect(authServices.postGoogleLogin).toHaveBeenCalledWith('mock-google-token');

        // Wait for promise resolution
        await new Promise(process.nextTick);

        expect(consoleSpy).toHaveBeenCalledWith('GOOGLE SIGNIN ERROR', 'error');
        expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('Google login failed'));
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
