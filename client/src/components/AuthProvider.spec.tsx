import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AuthProvider, AuthContext } from './AuthProvider';
import * as userServices from '../helpers/services/user_services';
import * as helpers from '../helpers/helpers';
import * as Sentry from '@sentry/react';

// Mock dependencies
vi.mock('../helpers/services/user_services');
vi.mock('../helpers/helpers');
vi.mock('@sentry/react', () => ({
    setUser: vi.fn(),
}));

const mockUser = {
    _id: '123',
    email: 'test@example.com',
    name: 'Test User',
    preferences: {},
    googleId: 'g123'
};

const TestConsumer = () => {
    const { user, isAuthenticated, logout } = React.useContext(AuthContext);
    return (
        <div>
            <div data-testid="auth-status">{isAuthenticated === undefined ? 'loading' : isAuthenticated ? 'authenticated' : 'unauthenticated'}</div>
            <div data-testid="user-name">{user ? user.name : 'no user'}</div>
            <button onClick={() => logout()}>Logout</button>
        </div>
    );
};

import React from 'react';

describe('AuthProvider Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('initializes with loading state and then authenticates user', async () => {
        (userServices.getUser as any).mockResolvedValue({ status: 200, data: mockUser });

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        // Initially undefined (loading)
        expect(screen.getByTestId('auth-status')).toHaveTextContent('loading');

        // Wait for auth to complete
        await waitFor(() => {
            expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
        });

        expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
        expect(Sentry.setUser).toHaveBeenCalledWith({
            id: mockUser._id,
            email: mockUser.email,
            username: mockUser.name,
        });
    });

    it('handles unauthenticated state (401)', async () => {
        (userServices.getUser as any).mockResolvedValue({ status: 401, data: { success: false } });

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('auth-status')).toHaveTextContent('unauthenticated');
        });
        expect(screen.getByTestId('user-name')).toHaveTextContent('no user');
        expect(Sentry.setUser).toHaveBeenCalledWith(null);
    });

    it('handles api error', async () => {
        (userServices.getUser as any).mockRejectedValue({ response: { status: 500 } });

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('auth-status')).toHaveTextContent('unauthenticated');
        });
        expect(Sentry.setUser).toHaveBeenCalledWith(null);
    });

    it('handles logout', async () => {
        (userServices.getUser as any).mockResolvedValue({ status: 200, data: mockUser });
        (helpers.signout as any).mockResolvedValue({});

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
        });

        const logoutBtn = screen.getByText('Logout');
        await act(async () => {
            logoutBtn.click();
        });

        expect(helpers.signout).toHaveBeenCalled();
        expect(screen.getByTestId('auth-status')).toHaveTextContent('unauthenticated');
        expect(Sentry.setUser).toHaveBeenCalledWith(null);
    });
});
