// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Appointments from './Appointments';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import * as eventServices from '../helpers/services/event_services';

// Mock Dependencies
vi.mock('axios');
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

vi.mock('../components/AppNavbar', () => ({
    default: () => <div data-testid="app-navbar">AppNavbar</div>
}));

vi.mock('../components/Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

// Mock UI components that might cause alias issues or are not focus of this test
vi.mock('@/components/ui/button', () => ({
    Button: ({ children, onClick, ...props }: any) => (
        <button onClick={onClick} {...props}>{children}</button>
    )
}));

// Mock services
vi.mock('../helpers/services/event_services', () => ({
    getUsersEvents: vi.fn()
}));

// Mock sub-components
vi.mock('../components/appointments/AppointmentSidebar', () => ({
    AppointmentSidebar: ({ calendars, onCalendarToggle }: any) => (
        <div data-testid="sidebar">
            Sidebar
            {calendars.map((c: any) => (
                <button key={c.id} onClick={() => onCalendarToggle(c.id)} data-testid={`calendar-toggle-${c.id}`}>
                    {c.label} {c.checked ? 'Checked' : 'Unchecked'}
                </button>
            ))}
        </div>
    )
}));

vi.mock('../components/appointments/AppointmentCalendar', () => ({
    AppointmentCalendar: ({ events, onSelectEvent }: any) => (
        <div data-testid="calendar">
            Calendar
            {events.map((e: any) => (
                <button key={e.id} onClick={() => onSelectEvent(e)} data-testid={`event-${e.id}`}>
                    {e.title} {e.resource?.data?.description}
                </button>
            ))}
        </div>
    )
}));

vi.mock('../components/appointments/AppointmentDetails', () => ({
    AppointmentDetails: ({ appointment, event, onClose }: any) => (
        <div data-testid="details">
            Details for {event?.name || 'Unknown'} - {appointment.description}
            <button onClick={onClose} data-testid="close-details">Close</button>
        </div>
    )
}));

describe('Appointments Page', () => {
    const mockAppointments = [
        {
            _id: '1',
            description: 'Meeting notes',
            event: 'evt1',
            start: new Date().toISOString(),
            end: new Date().toISOString(),
            attendeeName: 'John Doe',
            attendeeEmail: 'john@example.com'
        }
    ];

    const mockEvents = [
        {
            _id: 'evt1',
            name: 'Strategy Sync',
            location: 'Zoom'
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (axios.get as any).mockResolvedValue({ data: mockAppointments });
        (eventServices.getUsersEvents as any).mockResolvedValue({ data: mockEvents });
    });

    it('should render and fetch appointments and events', async () => {
        render(
            <MemoryRouter>
                <Appointments />
            </MemoryRouter>
        );

        expect(axios.get).toHaveBeenCalledWith("/api/v1/user/me/appointment");
        expect(eventServices.getUsersEvents).toHaveBeenCalled();

        await waitFor(() => {
            expect(screen.getByTestId('calendar')).toBeInTheDocument();
            expect(screen.getByText(/Meeting notes/)).toBeInTheDocument();
        });
    });

    it('should show details with event info', async () => {
        render(
            <MemoryRouter>
                <Appointments />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('calendar')).toBeInTheDocument();
        });

        const eventBtn = screen.getByTestId('event-1');
        fireEvent.click(eventBtn);

        expect(await screen.findByTestId('details')).toBeInTheDocument();
        expect(screen.getByText('Details for Strategy Sync - Meeting notes')).toBeInTheDocument();
    });
});
