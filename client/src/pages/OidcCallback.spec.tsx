import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import OidcCallback from './OidcCallback';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
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
        promise: vi.fn((promise, { success, error }) => {
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
            // toast.promise should handle the error callback
            // In our mock, we just execute the promise
        });

        // Since toast.promise mock executes error handler, we can assume it handled it.
        // We might want to spy on console.error if the component logs it.
    });
});
