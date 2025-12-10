
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import EditEvent from '../../pages/EditEvent';
import * as eventServices from '../../helpers/services/event_services';
import * as helpers from '../../helpers/helpers';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
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
            <div data-testid="event-form">Event Form for {event.title}</div>
            <button type="submit" data-testid="submit-button">Save</button>
        </form>
    )
}));

const mockEvent = {
    _id: '123',
    title: 'Test Event',
    description: 'Test Description',
    isActive: true
};

describe('EditEvent', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetches and renders event data', async () => {
        vi.mocked(eventServices.getEventByID).mockResolvedValue({ data: mockEvent } as any);

        render(
            <MemoryRouter initialEntries={['/edit/123']}>
                <Routes>
                    <Route path="/edit/:id" element={<EditEvent />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(eventServices.getEventByID).toHaveBeenCalledWith('123');
            expect(screen.getByTestId('event-form')).toHaveTextContent('Test Event');
        });
    });

    it('redirects to landing on fetch failure', async () => {
        vi.mocked(eventServices.getEventByID).mockResolvedValue({ data: { success: false } } as any);

        render(
            <MemoryRouter initialEntries={['/edit/123']}>
                <Routes>
                    <Route path="/edit/:id" element={<EditEvent />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(helpers.signout).toHaveBeenCalled();
        });
    });

    it('handles form submission successfully', async () => {
        vi.mocked(eventServices.getEventByID).mockResolvedValue({ data: mockEvent } as any);
        vi.mocked(eventServices.updateEvent).mockResolvedValue({ data: { success: true } } as any);

        render(
            <MemoryRouter initialEntries={['/edit/123']}>
                <Routes>
                    <Route path="/edit/:id" element={<EditEvent />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            screen.getByTestId('submit-button').click();
        });

        await waitFor(() => {
            expect(eventServices.updateEvent).toHaveBeenCalledWith(
                '123',
                expect.objectContaining({ title: mockEvent.title })
            );
            expect(toast.success).toHaveBeenCalledWith('happy_caring_fox_spur');
        });
    });

    it('handles form submission error', async () => {
        vi.mocked(eventServices.getEventByID).mockResolvedValue({ data: mockEvent } as any);
        vi.mocked(eventServices.updateEvent).mockRejectedValue(new Error('Update failed'));

        render(
            <MemoryRouter initialEntries={['/edit/123']}>
                <Routes>
                    <Route path="/edit/:id" element={<EditEvent />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            screen.getByTestId('submit-button').click();
        });

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('tasty_witty_stingray_hope');
        });
    });
});
