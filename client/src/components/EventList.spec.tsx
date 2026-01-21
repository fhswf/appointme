import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import EventList from './EventList';
import * as eventServices from '../helpers/services/event_services';
import * as helpers from '../helpers/helpers';

// Mock dependencies
vi.mock('../helpers/services/event_services', () => ({
    getUsersEvents: vi.fn(),
    updateEvent: vi.fn()
}));

vi.mock('../helpers/helpers', () => ({
    signout: vi.fn()
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

vi.mock('./EventCard', () => ({
    EventCard: ({ event, onDelete, setActive }: any) => (
        <div data-testid={`event-card-${event._id}`}>
            <span>{event.name}</span>
            <button onClick={() => onDelete(event)}>Delete</button>
            <button onClick={() => setActive(event, !event.isActive)}>Toggle Active</button>
        </div>
    )
}));

const mockEvents = [
    {
        _id: 'event1',
        name: 'Test Event 1',
        url: 'test-event-1',
        duration: 30,
        isActive: true,
        description: 'Description 1',
        location: 'Location 1',
        available: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
        bufferbefore: 0,
        bufferafter: 0,
        user: 'user1',
        minFuture: 0,
        maxFuture: 0,
        maxPerDay: 0
    },
    {
        _id: 'event2',
        name: 'Test Event 2',
        url: 'test-event-2',
        duration: 60,
        isActive: false,
        description: 'Description 2',
        location: 'Location 2',
        available: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
        bufferbefore: 0,
        bufferafter: 0,
        user: 'user1',
        minFuture: 0,
        maxFuture: 0,
        maxPerDay: 0
    }
];

describe('EventList Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(eventServices.getUsersEvents).mockResolvedValue({ data: mockEvents } as any);
    });

    const renderEventList = (url = 'test-user') => {
        const mockUser = {
            _id: 'user1',
            email: 'test@example.com',
            name: 'Test User',
            user_url: 'test-user',
            picture_url: 'pic.jpg',
            google_tokens: {},
            push_calendars: [],
            pull_calendars: [],
            caldav_accounts: []
        };
        return render(
            <BrowserRouter>
                <EventList url={url} user={mockUser as any} />
            </BrowserRouter>
        );
    };

    it('should render event list with events', async () => {
        renderEventList();

        await waitFor(() => {
            expect(screen.getByText('Test Event 1')).toBeInTheDocument();
        });

        expect(screen.getByTestId('event-list')).toBeInTheDocument();
        expect(screen.getByText('Test Event 2')).toBeInTheDocument();
    });

    it('should fetch events on mount', async () => {
        renderEventList();

        await waitFor(() => {
            expect(eventServices.getUsersEvents).toHaveBeenCalled();
        });
    });

    it('should render empty state when no events', async () => {
        vi.mocked(eventServices.getUsersEvents).mockResolvedValue({ data: [] } as any);

        renderEventList();

        await waitFor(() => {
            // content text removed in new design, only button remains
            expect(screen.getByText(/new_event_type/i)).toBeInTheDocument();
        });
    });

    it('should handle delete event', async () => {
        renderEventList();

        await waitFor(() => {
            expect(screen.getByTestId('event-card-event1')).toBeInTheDocument();
        });

        const deleteButton = screen.getAllByText('Delete')[0];
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(screen.queryByTestId('event-card-event1')).not.toBeInTheDocument();
        });
    });

    it('should handle toggle event active status', async () => {
        vi.mocked(eventServices.updateEvent).mockResolvedValue({ data: { success: true } } as any);

        renderEventList();

        await waitFor(() => {
            expect(screen.getByTestId('event-card-event1')).toBeInTheDocument();
        });

        const toggleButton = screen.getAllByText('Toggle Active')[0];
        fireEvent.click(toggleButton);

        await waitFor(() => {
            expect(eventServices.updateEvent).toHaveBeenCalledWith(
                'event1',
                expect.objectContaining({
                    _id: 'event1',
                    isActive: false
                })
            );
        });
    });

    it('should handle authentication failure', async () => {
        vi.mocked(eventServices.getUsersEvents).mockResolvedValue({
            data: { success: false }
        } as any);

        renderEventList();

        await waitFor(() => {
            expect(helpers.signout).toHaveBeenCalled();
        });
    });

    it('should render with correct grid layout', async () => {
        renderEventList();

        await waitFor(() => {
            const eventList = screen.getByTestId('event-list');
            expect(eventList).toHaveClass('grid');
        });
    });

    it('should pass url prop to EventCard', async () => {
        const testUrl = 'my-custom-url';
        renderEventList(testUrl);

        await waitFor(() => {
            expect(screen.getByTestId('event-card-event1')).toBeInTheDocument();
        });
    });

    it('should handle multiple events correctly', async () => {
        const manyEvents = Array.from({ length: 5 }, (_, i) => ({
            ...mockEvents[0],
            _id: `event${i}`,
            name: `Event ${i}`
        }));

        vi.mocked(eventServices.getUsersEvents).mockResolvedValue({ data: manyEvents } as any);

        renderEventList();

        await waitFor(() => {
            expect(screen.getAllByText(/Event \d/)).toHaveLength(5);
        });
    });

    it('should navigate to /addevent when clicking create first event button', async () => {
        vi.mocked(eventServices.getUsersEvents).mockResolvedValue({ data: [] } as any);

        renderEventList();

        await waitFor(() => {
            expect(screen.getByText(/new_event_type/i)).toBeInTheDocument();
        });

        const createButton = screen.getByText(/new_event_type/i);
        fireEvent.click(createButton);

        expect(mockNavigate).toHaveBeenCalledWith('/addevent');
    });
});
