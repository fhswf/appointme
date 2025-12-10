
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AppNavbar from '../../components/AppNavbar';
import * as helpers from '../../helpers/helpers';
import { BrowserRouter } from 'react-router-dom';
import { UserContext } from '../../components/PrivateRoute';

// Mock dependencies
vi.mock('../../helpers/helpers');
vi.mock('sonner');
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key
    })
}));

// Mock sub-components
vi.mock('../../components/ThemeToggle', () => ({
    ThemeToggle: () => <div data-testid="theme-toggle">ThemeToggle</div>
}));
vi.mock('../../components/ProfileDialog', () => ({
    ProfileDialog: ({ open, onOpenChange }: any) => (
        open ? <div data-testid="profile-dialog" onClick={() => onOpenChange(false)}>Profile Dialog</div> : null
    )
}));
vi.mock('@/components/ui/dropdown-menu', () => ({
    DropdownMenu: ({ children }: any) => <div>{children}</div>,
    DropdownMenuTrigger: ({ children, asChild }: any) => <div onClick={(children as any).props.onClick}>{children}</div>,
    DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
    DropdownMenuItem: ({ children, onClick, asChild, ...props }: any) => <div onClick={onClick} {...props}>{children}</div>,
    DropdownMenuSeparator: () => <hr />,
}));

// Helper to render with UserContext
const renderWithUser = (user: any) => {
    return render(
        <UserContext.Provider value={{ user }}>
            <BrowserRouter>
                <AppNavbar />
            </BrowserRouter>
        </UserContext.Provider>
    );
};

describe('AppNavbar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock import.meta.env
        import.meta.env.REACT_APP_URL = 'http://localhost:3000';
    });

    it('renders login button when not authenticated', () => {
        vi.mocked(helpers.useAuthenticated).mockReturnValue(false);
        renderWithUser(null);

        // Open menu
        fireEvent.click(screen.getByTestId('profile-menu'));

        expect(screen.getByTestId('login-button')).toBeInTheDocument();
        expect(screen.getByText('user_menu_log_in')).toBeInTheDocument();
    });

    it('renders logout button when authenticated', () => {
        vi.mocked(helpers.useAuthenticated).mockReturnValue(true);
        const user = { name: 'Test User', picture_url: 'pic.jpg', user_url: 'test' };
        renderWithUser(user);

        // Open menu
        fireEvent.click(screen.getByTestId('profile-menu'));

        expect(screen.getByTestId('logout-button')).toBeInTheDocument();
        expect(screen.getByText('user_menu_log_out')).toBeInTheDocument();
    });

    it('handles logout', () => {
        vi.mocked(helpers.useAuthenticated).mockReturnValue(true);
        const user = { name: 'Test', picture_url: 'pic.jpg', user_url: 'test' };
        renderWithUser(user);

        fireEvent.click(screen.getByTestId('profile-menu'));
        fireEvent.click(screen.getByTestId('logout-button'));

        expect(helpers.signout).toHaveBeenCalled();
    });

    it('opens profile dialog', async () => {
        vi.mocked(helpers.useAuthenticated).mockReturnValue(true);
        const user = { name: 'Test', picture_url: 'pic.jpg', user_url: 'test' };
        renderWithUser(user);

        fireEvent.click(screen.getByTestId('profile-menu'));
        fireEvent.click(screen.getByText('user_menu_profile'));

        await waitFor(() => {
            expect(screen.getByTestId('profile-dialog')).toBeInTheDocument();
        });
    });

    it('renders application title', () => {
        renderWithUser(null);
        expect(screen.getByText('application_title')).toBeInTheDocument();
    });
});
