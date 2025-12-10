import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import EditEvent from './EditEvent';
import * as eventServices from '../helpers/services/event_services';
import * as helpers from '../helpers/helpers';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('../helpers/services/event_services', () => ({
    getEventByID: vi.fn(),
    updateEvent: vi.fn()
}));

vi.mock('../helpers/helpers', () => ({
    signout: vi.fn()
}));

vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn()
    }
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key
    })
}));

// Mock useParams and useNavigate
const mockNavigate = vi.fn();
const mockParams = { id: 'test-event-id' };

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => mockParams
    };
});

// Mock EventForm component since we are testing EditEvent integration, not the form itself
vi.mock('../components/EventForm', () => ({
    EventForm: ({ event, handleOnSubmit }: any) => (
        <div data-testid="event-form">
            <span>Event Form for {event.name}</span>
            <button onClick={() => handleOnSubmit({ ...event, name: 'Updated Event' })}>
                Save
            </button>
        </div>
    )
}));

// Mock AppNavbar
vi.mock('../components/AppNavbar', () => ({
    default: () => <div data-testid="app-navbar">Navbar</div>
}));

const mockEvent = {
    _id: 'test-event-id',
    name: 'Test Event',
    url: 'test-event',
    duration: 30,
    isActive: true,
    description: 'Description',
    location: 'Location',
    available: {},
    bufferbefore: 0,
    bufferafter: 0,
    user: 'user1',
    minFuture: 0,
    maxFuture: 0,
    maxPerDay: 0
};

describe('EditEvent Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(eventServices.getEventByID).mockResolvedValue({ data: mockEvent } as any);
    });

    const renderEditEvent = () => {
        return render(
            <BrowserRouter>
                <EditEvent />
            </BrowserRouter>
        );
    };

    it('should render and fetch event data on mount', async () => {
        renderEditEvent();

        await waitFor(() => {
            expect(screen.getByTestId('app-navbar')).toBeInTheDocument();
            expect(screen.getByTestId('event-form')).toBeInTheDocument();
            expect(screen.getByText('each_awake_tadpole_jest')).toBeInTheDocument();
        });

        expect(eventServices.getEventByID).toHaveBeenCalledWith('test-event-id');
        expect(screen.getByText('Event Form for Test Event')).toBeInTheDocument();
    });

    it('should handle event update success', async () => {
        vi.mocked(eventServices.updateEvent).mockResolvedValue({ data: { success: true } } as any);
        renderEditEvent();

        await waitFor(() => {
            expect(screen.getByTestId('event-form')).toBeInTheDocument();
        });

        const saveButton = screen.getByText('Save');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(eventServices.updateEvent).toHaveBeenCalledWith(
                'test-event-id',
                expect.objectContaining({ name: 'Updated Event' })
            );
            expect(toast.success).toHaveBeenCalledWith('happy_caring_fox_spur');
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    it('should handle event update failure', async () => {
        vi.mocked(eventServices.updateEvent).mockResolvedValue({ data: { success: false } } as any);
        renderEditEvent();

        await waitFor(() => {
            expect(screen.getByTestId('event-form')).toBeInTheDocument();
        });

        const saveButton = screen.getByText('Save');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(helpers.signout).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/landing');
        });
    });

    it('should handle event update error', async () => {
        vi.mocked(eventServices.updateEvent).mockRejectedValue(new Error('Update failed'));
        renderEditEvent();

        await waitFor(() => {
            expect(screen.getByTestId('event-form')).toBeInTheDocument();
        });

        const saveButton = screen.getByText('Save');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('tasty_witty_stingray_hope');
        });
    });

    it('should handle getEventByID failure', async () => {
        vi.mocked(eventServices.getEventByID).mockResolvedValue({ data: { success: false } } as any);
        renderEditEvent();

        await waitFor(() => {
            expect(helpers.signout).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/landing');
        });
    });
});
