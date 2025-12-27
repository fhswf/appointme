import React from 'react';
import { render, waitFor, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Appointments from './Appointments';
import axios from 'axios';
import * as eventServices from '../helpers/services/event_services';
import * as userServices from '../helpers/services/user_services';

// Mock dependencies
vi.mock('axios');
vi.mock('../helpers/services/event_services');
vi.mock('../helpers/services/user_services');

// Mock AuthProvider
vi.mock('../components/AuthProvider', () => ({
    useAuth: () => ({
        user: { _id: 'user1', agenda_visible_calendars: [] }
    })
}));

// Mock Child Components to isolate Page logic
vi.mock('../components/appointments/AppointmentSidebar', () => ({
    AppointmentSidebar: () => <div data-testid="appointment-sidebar">Sidebar</div>
}));

vi.mock('../components/appointments/AppointmentCalendar', () => ({
    AppointmentCalendar: () => <div data-testid="appointment-calendar">Calendar</div>
}));

vi.mock('../components/appointments/AppointmentDetails', () => ({
    AppointmentDetails: () => <div data-testid="appointment-details">Details</div>
}));

vi.mock('../components/appointments/EventDetails', () => ({
    EventDetails: () => <div data-testid="event-details">EventDetails</div>
}));

vi.mock('@/components/ui/resizable-sidebar', () => ({
    ResizableSidebar: ({ children }: any) => <div data-testid="resizable-sidebar">{children}</div>
}));

vi.mock('../components/AppNavbar', () => ({
    default: () => <div data-testid="navbar">Navbar</div>
}));

vi.mock('../components/Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

describe('Appointments Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state initially', async () => {
        // Mock promises that never resolve immediately to check loading state
        (axios.get as any).mockReturnValue(new Promise(() => { }));
        (eventServices.getUsersEvents as any).mockReturnValue(new Promise(() => { }));

        render(<Appointments />);

        // Check for loader (assumed to be the spinner div)
        // The code has <div className="animate-spin ...">
        // We can't easily query by class name with standard queries, 
        // but we can query by the absence of the Calendar
        expect(screen.queryByTestId('appointment-calendar')).not.toBeInTheDocument();
    });

    it('fetches data and renders content', async () => {
        const mockAppointments = [{ _id: 'apt1', start: new Date(), end: new Date(), event: 'evt1' }];
        const mockEvents = [{ _id: 'evt1', name: 'Event 1' }];
        const mockCalendars = [{ id: 'cal1', summary: 'Calendar 1', type: 'caldav' }];

        // Mock API responses
        // 1. Calendars fetch
        // 2. Appointments fetch
        // 3. Events fetch
        // 4. Calendar Events fetch (triggered after calendars)

        (axios.get as any).mockImplementation((url: string) => {
            if (url === '/api/v1/user/me/calendar') return Promise.resolve({ data: mockCalendars });
            if (url === '/api/v1/user/me/appointment') return Promise.resolve({ data: mockAppointments });
            if (url.includes('/event')) return Promise.resolve({ data: [] }); // Calendar events
            return Promise.resolve({ data: [] });
        });

        (eventServices.getUsersEvents as any).mockResolvedValue({ data: mockEvents });

        await act(async () => {
            render(<Appointments />);
        });

        await waitFor(() => {
            expect(screen.getByTestId('appointment-calendar')).toBeInTheDocument();
        });

        expect(screen.getByTestId('appointment-sidebar')).toBeInTheDocument();
        expect(axios.get).toHaveBeenCalledWith('/api/v1/user/me/calendar');
        expect(axios.get).toHaveBeenCalledWith('/api/v1/user/me/appointment');
    });

    it('handles calendar fetch error gracefully', async () => {
        (axios.get as any).mockImplementation((url: string) => {
            if (url === '/api/v1/user/me/calendar') return Promise.reject(new Error("Fail"));
            if (url === '/api/v1/user/me/appointment') return Promise.resolve({ data: [] });
            return Promise.resolve({ data: [] });
        });
        (eventServices.getUsersEvents as any).mockResolvedValue({ data: [] });

        await act(async () => {
            render(<Appointments />);
        });

        await waitFor(() => {
            expect(screen.getByTestId('appointment-calendar')).toBeInTheDocument();
        });
        // Should still render, just no calendars
    });
});
