
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import AppNavbar from '../../components/AppNavbar';

import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../../components/AuthProvider';

// Mock dependencies
vi.mock('../../helpers/helpers');
vi.mock('sonner');
vi.mock('../../components/AuthProvider', () => ({
    useAuth: vi.fn(),
}));
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            language: 'en',
            changeLanguage: vi.fn()
        }
    })
}));

// ... (other mocks)

// Helper to render with Auth
const logoutMock = vi.fn();
const renderWithUser = (user: any, isAuthenticated: boolean = !!user) => {
    (useAuth as any).mockReturnValue({ user, isAuthenticated, logout: logoutMock });
    return render(
        <BrowserRouter>
            <AppNavbar />
        </BrowserRouter>
    );
};

describe('AppNavbar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock import.meta.env
        import.meta.env.REACT_APP_URL = 'http://localhost:3000';
    });

    it('renders login button when not authenticated', () => {
        renderWithUser(null, false);

        // Open menu
        fireEvent.pointerDown(screen.getByTestId('profile-menu'));
        fireEvent.click(screen.getByTestId('profile-menu'));

        expect(screen.getByTestId('login-button')).toBeInTheDocument();
        expect(screen.getByText('user_menu_log_in')).toBeInTheDocument();
    });

    it('renders About link in user menu', async () => {
        const user = { name: 'Test User', picture_url: 'pic.jpg', user_url: 'test' };
        renderWithUser(user);

        // Open menu
        fireEvent.pointerDown(screen.getByTestId('profile-menu'));
        fireEvent.click(screen.getByTestId('profile-menu'));

        const aboutLink = screen.getByText('about');
        expect(aboutLink).toBeInTheDocument();
        expect(aboutLink.closest('a')).toHaveAttribute('href', '/about');
    });

    it('renders logout button when authenticated', () => {
        const user = { name: 'Test User', picture_url: 'pic.jpg', user_url: 'test' };
        renderWithUser(user, true);

        // Open menu
        fireEvent.pointerDown(screen.getByTestId('profile-menu'));
        fireEvent.click(screen.getByTestId('profile-menu'));

        expect(screen.getByTestId('logout-button')).toBeInTheDocument();
        expect(screen.getByText('user_menu_log_out')).toBeInTheDocument();
    });

    it('handles logout', async () => {
        const user = { name: 'Test', picture_url: 'pic.jpg', user_url: 'test' };
        renderWithUser(user, true);

        fireEvent.pointerDown(screen.getByTestId('profile-menu'));
        fireEvent.click(screen.getByTestId('profile-menu'));
        fireEvent.click(screen.getByTestId('logout-button'));

        await waitFor(() => {
            expect(logoutMock).toHaveBeenCalled();
        });
    });

    it('opens profile dialog', async () => {
        const user = { name: 'Test', picture_url: 'pic.jpg', user_url: 'test' };
        (useAuth as any).mockReturnValue({ user, isAuthenticated: true });

        render(
            <BrowserRouter>
                <AppNavbar />
            </BrowserRouter>
        );

        const profileMenu = screen.getByTestId('profile-menu');
        fireEvent.pointerDown(profileMenu);
        fireEvent.click(profileMenu);

        const profileItem = await screen.findByText('user_menu_profile');
        fireEvent.pointerDown(profileItem);
        fireEvent.click(profileItem);

        await waitFor(() => {
            expect(screen.getByTestId('profile-dialog')).toBeInTheDocument();
        });
    });

    it('renders application title', () => {
        renderWithUser(null);
        expect(screen.getByText('application_title')).toBeInTheDocument();
    });
});
