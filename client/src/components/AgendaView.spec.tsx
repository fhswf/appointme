import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import AgendaView from './AgendaView';
import axios from 'axios';

// Mock dependencies
vi.mock('axios');
vi.mock('react-i18next', () => {
    const t = (key: string) => key;
    return {
        useTranslation: () => ({
            t, // Stable reference
            i18n: { language: 'en' }
        })
    };
});

// Mock Big Calendar
vi.mock('react-big-calendar', async () => {
    return {
        Calendar: (props: any) => (
            <div data-testid="big-calendar">
                {props.events.map((evt: any) => (
                    <button key={evt.id} onClick={() => props.onSelectEvent(evt)}>
                        {evt.title}
                    </button>
                ))}
            </div>
        ),
        dateFnsLocalizer: vi.fn(),
        Views: {
            MONTH: 'month',
            WEEK: 'week',
            DAY: 'day'
        }
    };
});

// Mock UI components
vi.mock('@/components/ui/calendar', () => ({
    Calendar: ({ onSelect }: any) => (
        <button onClick={() => onSelect(new Date('2023-10-27'))} data-testid="small-calendar">
            Select Date
        </button>
    )
}));

const mockAppointments = [
    {
        _id: '1',
        description: 'Meeting',
        start: '2023-10-26T10:00:00Z',
        end: '2023-10-26T10:30:00Z',
        attendeeName: 'Jane Doe',
        attendeeEmail: 'jane@example.com',
        event: { name: 'Consultation' }
    }
];

describe('AgendaView Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders and fetches appointments', async () => {
        (axios.get as any).mockResolvedValue({ data: mockAppointments });

        render(<AgendaView />);

        // Wait for the appointments to be rendered (implies fetch completed)
        await waitFor(() => {
            expect(screen.getByText('Meeting')).toBeInTheDocument();
        });

        expect(axios.get).toHaveBeenCalledWith("/api/v1/user/me/appointment");
    });

    it('shows appointment details on selection', async () => {
        (axios.get as any).mockResolvedValue({ data: mockAppointments });
        render(<AgendaView />);

        await waitFor(() => {
            expect(screen.getByText('Meeting')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Meeting'));

        await waitFor(() => {
            expect(screen.getByText('appointment_details')).toBeInTheDocument();
        });
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });

    it('closes appointment details', async () => {
        (axios.get as any).mockResolvedValue({ data: mockAppointments });
        render(<AgendaView />);

        await waitFor(() => {
            expect(screen.getByText('Meeting')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Meeting'));
        await waitFor(() => expect(screen.getByText('appointment_details')).toBeInTheDocument());

        // Find close button - in AppointmentDetails implementation it's a button with sr-only text "close" or an icon
        // We mocked AppointmentDetails previously or we used real implementation?
        // We are using REAL implementation of AppointmentDetails here (it is NOT mocked in this file).
        // Real implementation has <span className="sr-only">{t("close")}</span> inside the button.
        // So we can find by text "close" but it is sr-only.

        const closeBtn = screen.getByRole('button', { name: /close/i });
        fireEvent.click(closeBtn);

        await waitFor(() => {
            expect(screen.queryByText('appointment_details')).not.toBeInTheDocument();
        });
    });

    it('handles date selection from small calendar', async () => {
        (axios.get as any).mockResolvedValue({ data: [] }); // resolved empty to finish fetch
        render(<AgendaView />);

        // Wait for fetch to settle even if empty
        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        const smallCal = screen.getByTestId('small-calendar');
        fireEvent.click(smallCal);

        // This test primarily checks no crash and interaction.
        // We could check if axios was called again if logic dictated, but here it just updates local state.
    });
});
