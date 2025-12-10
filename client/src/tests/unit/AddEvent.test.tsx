
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import AddEvent from '../../pages/AddEvent';
import * as eventServices from '../../helpers/services/event_services';
import * as helpers from '../../helpers/helpers';
import { BrowserRouter } from 'react-router-dom';
import { UserContext } from '../../components/PrivateRoute';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('../../helpers/services/event_services');
vi.mock('../../helpers/helpers');
vi.mock('sonner');
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key
    })
}));

// Mock AppNavbar
vi.mock('../../components/AppNavbar', () => ({
    default: () => <div data-testid="app-navbar">AppNavbar</div>
}));

// Mock EventForm
vi.mock('../../components/EventForm', () => ({
    EventForm: ({ event, handleOnSubmit }: any) => (
        <form onSubmit={(e) => { e.preventDefault(); handleOnSubmit(event); }}>
            <div data-testid="event-form">Event Form</div>
            <button type="submit" data-testid="submit-button">Create</button>
        </form>
    )
}));

const mockUser = {
    _id: 'user123',
    name: 'Test User',
    email: 'test@example.com'
};

const renderWithUser = (user: any) => {
    return render(
        <UserContext.Provider value={{ user }}>
            <BrowserRouter>
                <AddEvent />
            </BrowserRouter>
        </UserContext.Provider>
    );
};

describe('AddEvent', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly', () => {
        renderWithUser(mockUser);
        expect(screen.getByTestId('app-navbar')).toBeInTheDocument();
        expect(screen.getByText('Add Event Type')).toBeInTheDocument();
        expect(screen.getByTestId('event-form')).toBeInTheDocument();
    });

    it('handles successful event creation', async () => {
        vi.mocked(eventServices.saveUserEvent).mockResolvedValue({ data: { success: true } } as any);

        renderWithUser(mockUser);

        screen.getByTestId('submit-button').click();

        await waitFor(() => {
            expect(eventServices.saveUserEvent).toHaveBeenCalledWith(
                expect.any(Object), // formData (EMPTY_EVENT initially)
                'user123'
            );
            expect(toast.success).toHaveBeenCalledWith('best_due_parakeet_zip');
        });
    });

    it('handles creation failure', async () => {
        vi.mocked(eventServices.saveUserEvent).mockRejectedValue(new Error('Creation failed'));

        renderWithUser(mockUser);

        screen.getByTestId('submit-button').click();

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('steep_fine_lobster_inspire');
        });
    });

    it('redirects to landing if success is false (session expired)', async () => {
        vi.mocked(eventServices.saveUserEvent).mockResolvedValue({ data: { success: false } } as any);

        renderWithUser(mockUser);

        screen.getByTestId('submit-button').click();

        await waitFor(() => {
            expect(helpers.signout).toHaveBeenCalled();
        });
    });

    it('does not submit if user is null', async () => {
        renderWithUser(null);

        screen.getByTestId('submit-button').click();

        await waitFor(() => {
            expect(eventServices.saveUserEvent).not.toHaveBeenCalled();
        });
    });
});
