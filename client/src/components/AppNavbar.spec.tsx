import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import AppNavbar from './AppNavbar';
import { MemoryRouter } from 'react-router-dom';
import * as Sentry from '@sentry/react';

// Mock dependencies
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock AuthProvider hook
const mockUseAuth = vi.fn();
vi.mock('./AuthProvider', () => ({
    useAuth: () => mockUseAuth(),
}));

// Mock Sentry
vi.mock('@sentry/react', () => ({
    getFeedback: vi.fn(),
}));

// Mock Child Components
vi.mock('./ThemeToggle', () => ({
    ThemeToggle: () => <div data-testid="theme-toggle">ThemeToggle</div>,
}));

vi.mock('./ProfileDialog', () => ({
    ProfileDialog: ({ open }: any) => (open ? <div data-testid="profile-dialog">ProfileDialog</div> : null),
}));

// Mock sonner toast
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
    },
}));

vi.mock('@/components/ui/dropdown-menu', () => ({
    DropdownMenu: ({ children }: any) => <div>{children}</div>,
    DropdownMenuTrigger: ({ children, asChild, ...props }: any) => <div data-testid="dropdown-trigger" {...props}>{children}</div>,
    DropdownMenuContent: ({ children }: any) => <div data-testid="dropdown-content">{children}</div>,
    DropdownMenuItem: ({ children, onClick, ...props }: any) => <button onClick={onClick} {...props}>{children}</button>,
    DropdownMenuSeparator: () => <hr />,
}));

vi.mock('../ui/dropdown-menu', () => ({
    DropdownMenu: ({ children }: any) => <div>{children}</div>,
    DropdownMenuTrigger: ({ children, asChild, ...props }: any) => <div data-testid="dropdown-trigger" {...props}>{children}</div>,
    DropdownMenuContent: ({ children }: any) => <div data-testid="dropdown-content">{children}</div>,
    DropdownMenuItem: ({ children, onClick, ...props }: any) => <button onClick={onClick} {...props}>{children}</button>,
    DropdownMenuSeparator: () => <hr />,
}));

import userEvent from '@testing-library/user-event';

describe('AppNavbar Component', () => {
    const mockLogout = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAuth.mockReturnValue({
            user: null,
            isAuthenticated: false,
            logout: mockLogout,
        });
    });

    it('renders logo and basic links', () => {
        render(
            <MemoryRouter>
                <AppNavbar />
            </MemoryRouter>
        );
        expect(screen.getByText('application_title')).toBeInTheDocument();
        expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    });

    it('renders login button when not authenticated', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <AppNavbar />
            </MemoryRouter>
        );

        // Open user menu
        const menuTrigger = screen.getByTestId('profile-menu');
        await user.click(menuTrigger);

        expect(screen.getByTestId('login-button')).toBeInTheDocument();
    });

    it('navigates to login on login click', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <AppNavbar />
            </MemoryRouter>
        );

        const menuTrigger = screen.getByTestId('profile-menu');
        await user.click(menuTrigger);
        await user.click(screen.getByTestId('login-button'));

        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('renders user links when authenticated', () => {
        mockUseAuth.mockReturnValue({
            user: { name: 'Test User', picture_url: 'http://example.com/pic.jpg', user_url: 'testuser' },
            isAuthenticated: true,
            logout: mockLogout,
        });

        render(
            <MemoryRouter>
                <AppNavbar />
            </MemoryRouter>
        );

        expect(screen.getByText('My Event Types')).toBeInTheDocument();
        const appointmentsLinks = screen.getAllByText('my_appointments');
        expect(appointmentsLinks.length).toBeGreaterThan(0);
        appointmentsLinks.forEach(link => expect(link).toBeInTheDocument());
    });

    it('renders logout and handles logout', async () => {
        const user = userEvent.setup();
        mockUseAuth.mockReturnValue({
            user: { name: 'Test User' },
            isAuthenticated: true,
            logout: mockLogout,
        });

        render(
            <MemoryRouter>
                <AppNavbar />
            </MemoryRouter>
        );

        const menuTrigger = screen.getByTestId('profile-menu');
        await user.click(menuTrigger);

        const logoutBtn = screen.getByTestId('logout-button');
        await user.click(logoutBtn);

        expect(mockLogout).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/landing');
    });

    it('opens profile dialog', async () => {
        const user = userEvent.setup();
        mockUseAuth.mockReturnValue({
            user: { name: 'Test User' },
            isAuthenticated: true,
            logout: mockLogout,
        });

        render(
            <MemoryRouter>
                <AppNavbar />
            </MemoryRouter>
        );

        const menuTrigger = screen.getByTestId('profile-menu');
        await user.click(menuTrigger);

        await user.click(screen.getByText('user_menu_profile'));
        expect(screen.getByTestId('profile-dialog')).toBeInTheDocument();
    });

    it('handles feedback triggering', async () => {
        const user = userEvent.setup();
        const mockCreateForm = vi.fn().mockResolvedValue({
            appendToDom: vi.fn(),
            open: vi.fn(),
        });
        (Sentry.getFeedback as any).mockReturnValue({
            createForm: mockCreateForm
        });

        render(
            <MemoryRouter>
                <AppNavbar />
            </MemoryRouter>
        );

        const menuTrigger = screen.getByTestId('profile-menu');
        await user.click(menuTrigger);

        await user.click(screen.getByText('Feedback'));

        expect(Sentry.getFeedback).toHaveBeenCalled();
        // Wait for async promise
        await expect(mockCreateForm).toHaveBeenCalled();
    });
});
