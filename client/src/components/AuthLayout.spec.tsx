
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthLayout } from './AuthLayout';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Mock AuthProvider
vi.mock('./AuthProvider', () => ({
    AuthProvider: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="mock-auth-provider">{children}</div>
    ),
    useAuth: () => ({ isAuthenticated: true, user: { name: 'Test User' } }) // Mock context if needed by children
}));

describe('AuthLayout', () => {
    it('should render children wrapped in AuthProvider', () => {
        render(
            <MemoryRouter>
                <Routes>
                    <Route element={<AuthLayout />}>
                        <Route path="/" element={<div data-testid="child-component">Child</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        // Check if AuthLayout renders the mock AuthProvider
        expect(screen.getByTestId('mock-auth-provider')).toBeInTheDocument();

        // Check if the Outlet (child route) is rendered inside
        expect(screen.getByTestId('child-component')).toBeInTheDocument();

        // Ensure nesting
        const provider = screen.getByTestId('mock-auth-provider');
        const child = screen.getByTestId('child-component');
        expect(provider).toContainElement(child);
    });
});
