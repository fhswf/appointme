
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EventList from '../../components/EventList';
import * as eventServices from '../../helpers/services/event_services';
import * as helpers from '../../helpers/helpers';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies
vi.mock('../../helpers/services/event_services');
vi.mock('../../helpers/helpers');
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key
    })
}));

// Mock EventCard to simplify testing
vi.mock('../../components/EventCard', () => ({
    EventCard: ({ event, onDelete, setActive }: any) => (
        <div data-testid={`event-card-${event._id}`}>
            <span>{event.title}</span>
            <button onClick={() => onDelete(event)}>Delete</button>
            <button onClick={() => setActive(event, !event.isActive)}>Toggle</button>
        </div>
    )
}));

const mockEvents = [
    { _id: '1', title: 'Event 1', isActive: true },
    { _id: '2', title: 'Event 2', isActive: false }
];

describe('EventList', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders empty state correctly', async () => {
        vi.mocked(eventServices.getUsersEvents).mockResolvedValue({ data: [] } as any);

        render(
            <BrowserRouter>
                <EventList url="test-url" />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('sunny_great_halibut_empower')).toBeInTheDocument();
            expect(screen.getByText('create_first_event_type_button')).toBeInTheDocument();
        });
    });

    it('renders list of events', async () => {
        vi.mocked(eventServices.getUsersEvents).mockResolvedValue({ data: mockEvents, status: 200 } as any);

        render(
            <BrowserRouter>
                <EventList url="test-url" />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('event-card-1')).toBeInTheDocument();
            expect(screen.getByTestId('event-card-2')).toBeInTheDocument();
        });
    });

    it('handles delete event', async () => {
        vi.mocked(eventServices.getUsersEvents).mockResolvedValue({ data: mockEvents } as any);

        render(
            <BrowserRouter>
                <EventList url="test-url" />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('event-card-1')).toBeInTheDocument();
        });

        // Click delete on first event
        const deleteBtn = screen.getByTestId('event-card-1').querySelector('button');
        fireEvent.click(deleteBtn!);

        expect(screen.queryByTestId('event-card-1')).not.toBeInTheDocument();
    });

    it('handles toggle event status', async () => {
        vi.mocked(eventServices.getUsersEvents).mockResolvedValue({ data: mockEvents } as any);
        vi.mocked(eventServices.updateEvent).mockResolvedValue({ data: { success: true } } as any);

        render(
            <BrowserRouter>
                <EventList url="test-url" />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('event-card-1')).toBeInTheDocument();
        });

        // Click toggle on first event
        const toggleBtn = screen.getAllByText('Toggle')[0];
        fireEvent.click(toggleBtn);

        expect(eventServices.updateEvent).toHaveBeenCalledWith(
            '1',
            expect.objectContaining({ _id: '1', isActive: false })
        );
    });

    it('redirects on fetch failure', async () => {
        vi.mocked(eventServices.getUsersEvents).mockResolvedValue({ data: { success: false } } as any);

        render(
            <BrowserRouter>
                <EventList url="test-url" />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(helpers.signout).toHaveBeenCalled();
        });
    });
});
