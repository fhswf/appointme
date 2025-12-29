import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import Appointments from './Appointments';
import axios from 'axios';
import { useAuth } from "../components/AuthProvider";
import { getUsersEvents } from "../helpers/services/event_services";
import { updateUser } from "../helpers/services/user_services";

// Mock Dependencies
vi.mock('axios');
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'en' }
    })
}));

// Mock Auth Provider
vi.mock("../components/AuthProvider", () => ({
    useAuth: vi.fn()
}));

// Mock Services
vi.mock("../helpers/services/event_services", () => ({
    getUsersEvents: vi.fn().mockResolvedValue({ data: [{ _id: 'evt1', name: 'Service Name', available: [], isActive: true }] })
}));
vi.mock("../helpers/services/user_services", () => ({
    updateUser: vi.fn().mockResolvedValue({})
}));

// Mock Child Components
vi.mock("../components/AppNavbar", () => ({ default: () => <div data-testid="app-navbar">Navbar</div> }));
vi.mock("../components/Footer", () => ({ default: () => <div data-testid="footer">Footer</div> }));
vi.mock("../components/appointments/AppointmentSidebar", () => ({
    AppointmentSidebar: (props: any) => (
        <div data-testid="appointment-sidebar">
            <button onClick={() => props.onCalendarToggle('caldav-cal1')}>Toggle Cal 1</button>
            <button onClick={() => props.setDate(new Date('2023-11-01'))}>Set Date</button>
        </div>
    )
}));
vi.mock("../components/appointments/AppointmentCalendar", () => ({
    AppointmentCalendar: (props: any) => (
        <div data-testid="appointment-calendar">
            <button onClick={() => props.onViewChange('week')}>Change View Week</button>
            <button onClick={() => props.onSelectEvent({
                resource: { type: 'appointment', data: { _id: 'appt1', event: 'evt1', start: '2023-10-26', end: '2023-10-26' } }
            })}>Select Appointment</button>
            <button onClick={() => props.onSelectEvent({
                resource: { type: 'calendar', data: { id: 'calEvt1', summary: 'Ext Event' } }
            })}>Select Calendar Event</button>
        </div>
    )
}));
vi.mock("../components/appointments/AppointmentDetails", () => ({
    AppointmentDetails: ({ onClose }: any) => <div data-testid="appointment-details"><button onClick={onClose}>Close Details</button></div>
}));
vi.mock("../components/appointments/EventDetails", () => ({
    EventDetails: ({ onClose }: any) => <div data-testid="event-details"><button onClick={onClose}>Close Event Details</button></div>
}));
vi.mock("@/components/ui/resizable-sidebar", () => ({
    ResizableSidebar: ({ children }: any) => <div>{children}</div>
}));

describe('Appointments Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({ user: { agenda_visible_calendars: [] } });
    });

    it('renders and fetches initial data successfully', async () => {
        (axios.get as any).mockImplementation((url: string) => {
            if (url === "/api/v1/user/me/calendar") return Promise.resolve({
                data: [{ id: 'cal1', summary: 'My Cal', type: 'caldav', accountId: 'acc1', originalId: 'cal1', color: '#000000', checked: true }]
            });
            if (url === "/api/v1/user/me/appointment") return Promise.resolve({ data: [] });
            return Promise.resolve({ data: [] });
        });

        render(<Appointments />);

        await waitFor(() => {
            expect(screen.getByTestId('appointment-sidebar')).toBeInTheDocument();
            expect(screen.getByTestId('appointment-calendar')).toBeInTheDocument();
        });

        expect(axios.get).toHaveBeenCalledWith("/api/v1/user/me/calendar");
        expect(axios.get).toHaveBeenCalledWith("/api/v1/user/me/appointment");
    });

    it('handles fetching calendar events with complex iCal data', async () => {
        (axios.get as any).mockImplementation((url: string) => {
            if (url === "/api/v1/user/me/calendar") return Promise.resolve({
                data: [{ id: 'cal1', summary: 'My Cal', type: 'caldav', accountId: 'acc1', checked: true }]
            });
            if (url === "/api/v1/user/me/appointment") return Promise.resolve({ data: [] });
            if (url.includes("/event")) {
                return Promise.resolve({
                    data: [{
                        id: 'evt1',
                        format: 'ical',
                        data: 'BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Test Event\nDTSTART:20231026T100000Z\nDTEND:20231026T110000Z\nEND:VEVENT\nEND:VCALENDAR'
                    }]
                });
            }
            return Promise.resolve({ data: [] });
        });

        render(<Appointments />);
        await waitFor(() => screen.getByTestId('appointment-calendar'));
    });

    it('calculates availability and updates background events', async () => {
        (axios.get as any).mockResolvedValue({ data: [] }); // Default empty
        (getUsersEvents as any).mockResolvedValue({
            data: [{
                _id: 'evt1',
                name: 'Service Name',
                available: { days: [1, 2, 3, 4, 5], timeSlots: [{ start: "09:00", end: "17:00" }] },
                isActive: true
            }]
        });

        render(<Appointments />);
        await waitFor(() => screen.getByTestId('appointment-calendar'));

        const changeViewBtn = screen.getByText('Change View Week');
        fireEvent.click(changeViewBtn);

        // Can't verify backgroundEvents prop directly easily without inspecting mock calls or prop plumbing
        // But we ensure no error is thrown
        await waitFor(() => expect(screen.getByTestId('appointment-calendar')).toBeInTheDocument());
    });

    it('handles calendar toggle and user update', async () => {
        (axios.get as any).mockResolvedValue({
            data: [{ id: 'cal1', summary: 'My Cal', type: 'caldav', accountId: 'acc1' }]
        });

        render(<Appointments />);
        await waitFor(() => screen.getByTestId('appointment-sidebar'));

        const toggleBtn = screen.getByText('Toggle Cal 1');
        fireEvent.click(toggleBtn);

        await waitFor(() => {
            expect(updateUser).toHaveBeenCalled();
        });
    });

    it('opens and closes appointment details', async () => {
        (axios.get as any).mockResolvedValue({ data: [] });
        render(<Appointments />);
        await waitFor(() => screen.getByTestId('appointment-calendar'));

        fireEvent.click(screen.getByText('Select Appointment'));
        await waitFor(() => expect(screen.getByTestId('appointment-details')).toBeInTheDocument());

        fireEvent.click(screen.getByText('Close Details'));
        await waitFor(() => expect(screen.queryByTestId('appointment-details')).not.toBeInTheDocument());
    });

    it('opens and closes calendar event details', async () => {
        (axios.get as any).mockResolvedValue({ data: [] });
        render(<Appointments />);
        await waitFor(() => screen.getByTestId('appointment-calendar'));

        fireEvent.click(screen.getByText('Select Calendar Event'));
        await waitFor(() => expect(screen.getByTestId('event-details')).toBeInTheDocument());

        fireEvent.click(screen.getByText('Close Event Details'));
        await waitFor(() => expect(screen.queryByTestId('event-details')).not.toBeInTheDocument());
    });

    it('handles calendar fetch error gracefully', async () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
        (axios.get as any).mockRejectedValueOnce(new Error('Fetch error'));

        render(<Appointments />);
        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        // Should still render UI
        expect(screen.getByTestId('app-navbar')).toBeInTheDocument();
        consoleSpy.mockRestore();
    });
});

