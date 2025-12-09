import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import OidcCallback from './OidcCallback';
import { MemoryRouter } from 'react-router-dom';
import * as authServices from '../helpers/services/auth_services';
import { toast } from 'sonner';

// Mock postOidcLogin
vi.mock('../helpers/services/auth_services', () => ({
    postOidcLogin: vi.fn()
}));

// Mock sonner toast
vi.mock('sonner', () => ({
    toast: {
        error: vi.fn(),
        promise: vi.fn((promise, { success, error, loading }) => {
            return promise.then(success).catch(error);
        })
    }
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('OidcCallback', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render authenticating message', () => {
        render(
            <MemoryRouter initialEntries={['/callback?code=test']}>
                <OidcCallback />
            </MemoryRouter>
        );

        expect(screen.getByText('Authenticating...')).toBeInTheDocument();
    });

    it('should redirect to /login if no code is provided', () => {
        render(
            <MemoryRouter initialEntries={['/callback']}>
                <OidcCallback />
            </MemoryRouter>
        );

        expect(toast.error).toHaveBeenCalledWith("No authorization code found");
        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    it('should call postOidcLogin with code', async () => {
        const mockPostOidcLogin = vi.mocked(authServices.postOidcLogin).mockResolvedValue({ success: true });

        render(
            <MemoryRouter initialEntries={['/callback?code=test_code']}>
                <OidcCallback />
            </MemoryRouter>
        );

        expect(mockPostOidcLogin).toHaveBeenCalledWith("test_code");
    });

    it('should redirect to /app on successful login', async () => {
        vi.mocked(authServices.postOidcLogin).mockResolvedValue({ success: true });

        render(
            <MemoryRouter initialEntries={['/callback?code=test_code']}>
                <OidcCallback />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/app");
        });
    });

    it('should handle login failure', async () => {
        const error = new Error('Login failed');
        vi.mocked(authServices.postOidcLogin).mockRejectedValue(error);

        render(
            <MemoryRouter initialEntries={['/callback?code=test_code']}>
                <OidcCallback />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(authServices.postOidcLogin).toHaveBeenCalled();
        });
    });

    it('should handle error with response data', async () => {
        const error: any = {
            response: {
                data: {
                    error: 'Invalid authorization code'
                }
            },
            message: 'Request failed'
        };
        vi.mocked(authServices.postOidcLogin).mockRejectedValue(error);

        render(
            <MemoryRouter initialEntries={['/callback?code=bad_code']}>
                <OidcCallback />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(authServices.postOidcLogin).toHaveBeenCalledWith('bad_code');
        });
    });

    it('should prevent duplicate processing with useRef', async () => {
        vi.mocked(authServices.postOidcLogin).mockResolvedValue({ success: true });

        const { rerender } = render(
            <MemoryRouter initialEntries={['/callback?code=test_code']}>
                <OidcCallback />
            </MemoryRouter>
        );

        // Rerender should not trigger another login attempt
        rerender(
            <MemoryRouter initialEntries={['/callback?code=test_code']}>
                <OidcCallback />
            </MemoryRouter>
        );

        await waitFor(() => {
            // Should only be called once despite rerender
            expect(authServices.postOidcLogin).toHaveBeenCalledTimes(1);
        });
    });

    it('should show toast promise with loading state', async () => {
        vi.mocked(authServices.postOidcLogin).mockResolvedValue({ data: { user: 'test' } });

        render(
            <MemoryRouter initialEntries={['/callback?code=test_code']}>
                <OidcCallback />
            </MemoryRouter>
        );

        expect(toast.promise).toHaveBeenCalledWith(
            expect.any(Promise),
            expect.objectContaining({
                loading: 'Authenticating...'
            })
        );
    });

    it('should handle empty code parameter', () => {
        render(
            <MemoryRouter initialEntries={['/callback?code=']}>
                <OidcCallback />
            </MemoryRouter>
        );

        expect(toast.error).toHaveBeenCalledWith("No authorization code found");
        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    it('should log success response', async () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
        const mockResponse = { data: { user: { id: '123' } } };
        vi.mocked(authServices.postOidcLogin).mockResolvedValue(mockResponse);

        render(
            <MemoryRouter initialEntries={['/callback?code=test_code']}>
                <OidcCallback />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith("OIDC Login Success", mockResponse);
        });

        consoleSpy.mockRestore();
    });

    it('should log error on failure', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        const error = new Error('Authentication failed');
        vi.mocked(authServices.postOidcLogin).mockRejectedValue(error);

        render(
            <MemoryRouter initialEntries={['/callback?code=test_code']}>
                <OidcCallback />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith("OIDC Login Error", error);
        });

        consoleErrorSpy.mockRestore();
    });
});
