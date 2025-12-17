import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Legal from './Legal';
import { UserContext } from '../components/PrivateRoute';

// Mock dependencies
vi.mock('../components/AppNavbar', () => ({
    default: () => <div data-testid="app-navbar">AppNavbar</div>
}));

vi.mock('../components/Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

vi.mock('../components/ContactInfo', () => ({
    default: () => <div data-testid="contact-info">ContactInfo</div>
}));

vi.mock('@/components/ui/button', () => ({
    Button: ({ children, onClick, ...props }: any) => (
        <button onClick={onClick} {...props}>{children}</button>
    )
}));

vi.mock('react-markdown', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="markdown">{children}</div>
}));

// Mock useTranslation
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key
    })
}));

// Mock useLocation
const mockLocation = { hash: '' };
vi.mock('react-router-dom', () => ({
    useLocation: () => mockLocation
}));

describe('Legal Page', () => {
    const renderWithContext = (user: any = null) => {
        return render(
            <UserContext.Provider value={{ user: user as any }}>
                <Legal />
            </UserContext.Provider>
        );
    };

    beforeEach(() => {
        mockLocation.hash = '';
    });

    it('should render navbar and footer', () => {
        renderWithContext();
        expect(screen.getByTestId('app-navbar')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('should default to Impressum tab', () => {
        renderWithContext();
        // Check if impressum button is active (bold/border is CSS class, hard to check "active" logic without checking class)
        // Check if impressum content is shown
        expect(screen.getByText('impressum_content')).toBeInTheDocument();
        expect(screen.getByTestId('contact-info')).toBeInTheDocument();
        // Privacy content should not be visible
        expect(screen.queryByText('privacy_content_public')).not.toBeInTheDocument();
    });

    it('should switch to Privacy tab on click', () => {
        renderWithContext();
        fireEvent.click(screen.getByText('Datenschutzhinweise'));

        expect(screen.getByText('privacy_content_public')).toBeInTheDocument();
        // Impressum content should be hidden
        expect(screen.queryByText('impressum_content')).not.toBeInTheDocument();
    });

    it('should show public privacy content when not logged in', () => {
        renderWithContext(null);
        fireEvent.click(screen.getByText('Datenschutzhinweise'));
        expect(screen.getByText('privacy_content_public')).toBeInTheDocument();
    });

    it('should show logged-in privacy content when logged in', () => {
        renderWithContext({ name: 'Test User' });
        fireEvent.click(screen.getByText('Datenschutzhinweise'));
        expect(screen.getByText('privacy_content')).toBeInTheDocument();
    });

    it('should respect hash #privacy', () => {
        mockLocation.hash = '#privacy';
        renderWithContext();
        expect(screen.getByText('privacy_content_public')).toBeInTheDocument();
    });

    it('should respect hash #impressum', () => {
        mockLocation.hash = '#impressum';
        renderWithContext();
        expect(screen.getByText('impressum_content')).toBeInTheDocument();
    });

    it('should respect hash #impressum', () => {
        mockLocation.hash = '#impressum';
        renderWithContext();
        expect(screen.getByText('impressum_content')).toBeInTheDocument();
    });

    it('should switch back to Impressum from Privacy', () => {
        renderWithContext();
        fireEvent.click(screen.getByText('Datenschutzhinweise'));
        expect(screen.getByText('privacy_content_public')).toBeInTheDocument();
        
        fireEvent.click(screen.getByText('Impressum'));
        expect(screen.getByText('impressum_content')).toBeInTheDocument();
        expect(screen.queryByText('privacy_content_public')).not.toBeInTheDocument();
    });

    it('should handle authenticated internal privacy content', () => {
        const user = { name: 'User' };
        renderWithContext(user);
        fireEvent.click(screen.getByText('Datenschutzhinweise'));
        expect(screen.getByText('privacy_content')).toBeInTheDocument();
    });
});
