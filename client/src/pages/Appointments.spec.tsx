import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import Appointments from './Appointments';
import axios from 'axios';
import { useAuth } from "../components/AuthProvider";

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

// Mock Child Components to simplify testing
vi.mock("../components/AppNavbar", () => ({
    default: () => <div data-testid="app-navbar">Navbar</div>
}));
vi.mock("../components/Footer", () => ({
    default: () => <div data-testid="footer">Footer</div>
}));
vi.mock("../components/appointments/AppointmentSidebar", () => ({
    AppointmentSidebar: (props: any) => (
        <div data-testid="appointment-sidebar">
            <button onClick={() => props.onCalendarToggle('cal1')}>Toggle Cal 1</button>
            <button onClick={() => props.setDate(new Date('2023-11-01'))}>Set Date</button>
        </div>
    )
}));
vi.mock("../components/appointments/AppointmentCalendar", () => ({
    AppointmentCalendar: (props: any) => (
        <div data-testid="appointment-calendar">
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
    AppointmentDetails: ({ onClose }: any) => (
        <div data-testid="appointment-details">
            <button onClick={onClose}>Close Details</button>
        </div>
    )
}));
vi.mock("../components/appointments/EventDetails", () => ({
    EventDetails: ({ onClose }: any) => (
        <div data-testid="event-details">
            <button onClick={onClose}>Close Event Details</button>
        </div>
    )
}));
vi.mock("@/components/ui/resizable-sidebar", () => ({
    ResizableSidebar: ({ children }: any) => <div>{children}</div>
}));

// Mock Services
vi.mock("../helpers/services/event_services", () => ({
    getUsersEvents: vi.fn().mockResolvedValue({ data: [{ _id: 'evt1', name: 'Service Name' }] })
}));
vi.mock("../helpers/services/user_services", () => ({
    updateUser: vi.fn().mockResolvedValue({})
}));

describe('Appointments Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({ user: { agenda_visible_calendars: [] } });
    });

    it('renders and fetches initial data', async () => {
        (axios.get as any).mockImplementation((url: string) => {
            if (url === "/api/v1/user/me/calendar") return Promise.resolve({ data: [{ id: 'cal1', summary: 'My Cal', type: 'caldav' }] });
            if (url === "/api/v1/user/me/appointment") return Promise.resolve({ data: [] });
            return Promise.resolve({ data: [] });
        });

        render(<Appointments />);

        // Check for child components
        expect(screen.getByTestId('app-navbar')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();

        // Wait for data load
        await waitFor(() => {
            expect(screen.getByTestId('appointment-sidebar')).toBeInTheDocument();
            expect(screen.getByTestId('appointment-calendar')).toBeInTheDocument();
        });

        expect(axios.get).toHaveBeenCalledWith("/api/v1/user/me/calendar");
        expect(axios.get).toHaveBeenCalledWith("/api/v1/user/me/appointment");
    });

    it('handles calendar toggle', async () => {
        (axios.get as any).mockImplementation((url: string) => {
            if (url === "/api/v1/user/me/calendar") return Promise.resolve({ data: [{ id: 'cal1', summary: 'My Cal', type: 'caldav' }] });
            return Promise.resolve({ data: [] });
        });

        render(<Appointments />);
        await waitFor(() => screen.getByTestId('appointment-sidebar'));

        const toggleBtn = screen.getByText('Toggle Cal 1');
        fireEvent.click(toggleBtn);

        // Can't easily check state directly, but we can check if it triggers side effects or UI updates if we didn't mock Sidebar fully.
        // Since we mocked sidebar, we verified interactions passed to it.
        // real logic calls updateUser.
        const { updateUser } = await import("../helpers/services/user_services");
        await waitFor(() => {
            expect(updateUser).toHaveBeenCalled();
        });
    });

    it('opens appointment details on selection', async () => {
        (axios.get as any).mockResolvedValue({ data: [] });
        render(<Appointments />);
        await waitFor(() => screen.getByTestId('appointment-calendar'));

        const selectBtn = screen.getByText('Select Appointment');
        fireEvent.click(selectBtn);

        await waitFor(() => {
            expect(screen.getByTestId('appointment-details')).toBeInTheDocument();
        });
    });

    it('opens calendar event details on selection', async () => {
        (axios.get as any).mockResolvedValue({ data: [] });
        render(<Appointments />);
        await waitFor(() => screen.getByTestId('appointment-calendar'));

        const selectBtn = screen.getByText('Select Calendar Event');
        fireEvent.click(selectBtn);

        await waitFor(() => {
            expect(screen.getByTestId('event-details')).toBeInTheDocument();
        });
    });

    it('closes details sidebar', async () => {
        (axios.get as any).mockResolvedValue({ data: [] });
        render(<Appointments />);
        await waitFor(() => screen.getByTestId('appointment-calendar'));

        const selectBtn = screen.getByText('Select Appointment');
        fireEvent.click(selectBtn);
        await waitFor(() => expect(screen.getByTestId('appointment-details')).toBeInTheDocument());

        const closeBtn = screen.getByText('Close Details');
        fireEvent.click(closeBtn);

        await waitFor(() => {
            expect(screen.queryByTestId('appointment-details')).not.toBeInTheDocument();
        });
    });
});
