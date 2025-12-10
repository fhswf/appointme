import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Profile from './Profile';
import * as userServices from '../helpers/services/user_services';
import { UserContext } from '../components/PrivateRoute';

// Mock dependencies
vi.mock('../helpers/services/user_services', () => ({
    getUser: vi.fn(),
    updateUser: vi.fn()
}));

// Mock LanguageSelector
vi.mock('../components/LanguageSelector', () => ({
    LanguageSelector: () => <div data-testid="language-selector">Language Selector</div>
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            changeLanguage: vi.fn(),
            language: 'en'
        }
    }),
    initReactI18next: {
        type: '3rdParty',
        init: vi.fn()
    }
}));


describe('Profile Component', () => {
    const mockUser = {
        name: 'Test User',
        user_url: 'test-user',
        email: 'test@example.com',
        use_gravatar: false,
        send_invitation_email: false,
        picture_url: 'http://example.com/pic.jpg'
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(userServices.getUser).mockResolvedValue({ data: mockUser, status: 200 } as any);
        vi.mocked(userServices.updateUser).mockResolvedValue({ data: mockUser, status: 200 } as any);
    });

    const renderProfile = () => {
        // Provide a valid user context so useAuthenticated returns true
        const contextValue = { user: mockUser as any };

        return render(
            <UserContext.Provider value={contextValue}>
                <BrowserRouter>
                    <Profile />
                </BrowserRouter>
            </UserContext.Provider>
        );
    };

    it('should render profile form with user data', async () => {
        renderProfile();

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
        });

        expect(screen.getByDisplayValue('test-user')).toBeInTheDocument();
    });

    it('should handle name change', async () => {
        renderProfile();

        await waitFor(() => expect(screen.getByDisplayValue('Test User')).toBeInTheDocument());

        const nameInput = screen.getByDisplayValue('Test User');
        fireEvent.change(nameInput, { target: { value: 'New Name' } });

        expect(screen.getByDisplayValue('New Name')).toBeInTheDocument();
    });

    it('should handle toggle send_invitation_email', async () => {
        renderProfile();

        await waitFor(() => expect(screen.getByDisplayValue('Test User')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByLabelText('send_invitation_email')).toBeInTheDocument());

        const checkbox = screen.getByLabelText('send_invitation_email');
        expect(checkbox).not.toBeChecked();

        fireEvent.click(checkbox);
        expect(checkbox).toBeChecked();
    });

    it('should save profile changes', async () => {
        renderProfile();

        await waitFor(() => expect(screen.getByDisplayValue('Test User')).toBeInTheDocument());

        const nameInput = screen.getByDisplayValue('Test User');
        fireEvent.change(nameInput, { target: { value: 'Updated Name' } });

        const saveButton = screen.getByText('save');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(userServices.updateUser).toHaveBeenCalledWith(expect.objectContaining({
                name: 'Updated Name'
            }));
        });
    });

    it('should handle gravatar toggle', async () => {
        renderProfile();

        await waitFor(() => expect(screen.getByDisplayValue('Test User')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByLabelText('use_gravatar')).toBeInTheDocument());

        const checkbox = screen.getByLabelText('use_gravatar');
        fireEvent.click(checkbox);

        expect(checkbox).toBeChecked();
    });
});
