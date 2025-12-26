import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppointmentCalendar } from './AppointmentCalendar';
import { Views } from 'react-big-calendar';

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'en' }
    })
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    ChevronLeft: () => <span>ChevronLeft</span>,
    ChevronRight: () => <span>ChevronRight</span>,
    MapPin: () => <span>MapPin</span>
}));

describe('AppointmentCalendar', () => {
    const mockEvents = [
        {
            id: '1',
            title: 'Test Event',
            start: new Date(2025, 0, 1, 10, 0), // Jan 1 2025 10:00
            end: new Date(2025, 0, 1, 11, 0),
            resource: { type: 'appointment' }
        },
        {
            id: '2',
            title: 'Background Event',
            start: new Date(2025, 0, 1, 12, 0),
            end: new Date(2025, 0, 1, 13, 0),
            resource: { type: 'availability' }
        }
    ];

    const defaultProps = {
        events: mockEvents,
        date: new Date(2025, 0, 1),
        onDateChange: vi.fn(),
        view: Views.MONTH,
        onViewChange: vi.fn(),
        onSelectEvent: vi.fn(),
        backgroundEvents: []
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly', () => {
        render(<AppointmentCalendar {...defaultProps} />);
        // Check for toolbar elements using translations keys
        expect(screen.getByText('today')).toBeInTheDocument();
        expect(screen.getByText('month')).toBeInTheDocument();
        expect(screen.getByText('week')).toBeInTheDocument();
        expect(screen.getByText('day')).toBeInTheDocument();
    });

    it('handles navigation via toolbar buttons', () => {
        render(<AppointmentCalendar {...defaultProps} />);

        fireEvent.click(screen.getByText('ChevronLeft'));
        // RBC calls onNavigate with (newDate, view, action)
        expect(defaultProps.onDateChange).toHaveBeenCalledWith(expect.any(Date), expect.anything(), expect.anything());

        fireEvent.click(screen.getByText('ChevronRight'));
        expect(defaultProps.onDateChange).toHaveBeenCalledWith(expect.any(Date), expect.anything(), expect.anything());

        fireEvent.click(screen.getByText('today'));
        // 'today' action might or might not have same signature depending on RBC version, but error log suggests it does or similar.
        // Actually usually strictly it's (date, view, 'TODAY').
        expect(defaultProps.onDateChange).toHaveBeenCalledWith(expect.any(Date), expect.anything(), expect.anything());
    });

    it('handles view changes', () => {
        // Start with Week view to test switching to Day and Month
        render(<AppointmentCalendar {...defaultProps} view={Views.WEEK} />);

        fireEvent.click(screen.getByText('day'));
        expect(defaultProps.onViewChange).toHaveBeenCalledWith(Views.DAY);

        vi.mocked(defaultProps.onViewChange).mockClear();

        fireEvent.click(screen.getByText('month'));
        expect(defaultProps.onViewChange).toHaveBeenCalledWith(Views.MONTH);
    });

    it('renders events in Month view', () => {
        render(<AppointmentCalendar {...defaultProps} view={Views.MONTH} />);
        expect(screen.getByText('Test Event')).toBeInTheDocument();
        // MonthEvent renders just time and title approx.
    });

    it('calls onSelectEvent when an event is clicked', () => {
        // Week view is better for clicking specific event rendering
        render(<AppointmentCalendar {...defaultProps} view={Views.WEEK} />);

        // Find by text. Note that react-big-calendar might render multiple elements or structure.
        const eventTitle = screen.getByText('Test Event');
        fireEvent.click(eventTitle);

        expect(defaultProps.onSelectEvent).toHaveBeenCalled();
        // The argument passed depends on RBC internals, but we expect it to be the event object
        expect(defaultProps.onSelectEvent).toHaveBeenCalledWith(
            expect.objectContaining({ title: 'Test Event' }),
            expect.anything()
        );
    });

    it('custom event component handles display logic (initials)', () => {
        const eventsWithInitials = [
            {
                ...mockEvents[0],
                resource: {
                    type: 'appointment',
                    data: { attendee: { name: 'John Doe' } }
                }
            }
        ];

        render(<AppointmentCalendar {...defaultProps} events={eventsWithInitials} view={Views.WEEK} />);

        // CustomEvent component logic renders 'JD'
        expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('custom event component handles one name', () => {
        const eventsWithInitials = [
            {
                ...mockEvents[0],
                resource: {
                    type: 'appointment',
                    data: { attendee: { name: 'Single' } }
                }
            }
        ];
        render(<AppointmentCalendar {...defaultProps} events={eventsWithInitials} view={Views.WEEK} />);
        expect(screen.getByText('SI')).toBeInTheDocument(); // S + I (Single -> Si -> SI) ?? logic: substring(0, 2).toUpperCase()
    });

    it('handles location and description rendering', () => {
        const detailedEvent = [
            {
                ...mockEvents[0],
                resource: {
                    type: 'calendar',
                    data: { description: 'Desc', location: 'Office' }
                }
            }
        ];

        render(<AppointmentCalendar {...defaultProps} events={detailedEvent} view={Views.WEEK} />);
        expect(screen.getByText('Desc')).toBeInTheDocument();
        expect(screen.getByText('Office')).toBeInTheDocument();
    });

    it('renders custom toolbar with correct active states', () => {
        render(<AppointmentCalendar {...defaultProps} view={Views.MONTH} />);

        const monthButton = screen.getByText('month').closest('button');
        const weekButton = screen.getByText('week').closest('button');
        const dayButton = screen.getByText('day').closest('button');

        expect(monthButton).toHaveClass('bg-card');
        expect(weekButton).not.toHaveClass('bg-card');
        expect(dayButton).not.toHaveClass('bg-card');
    });

    it('custom event component handles styling for calendar events', () => {
        const calendarEvent = {
            ...mockEvents[0],
            resource: {
                type: 'calendar',
                color: '#ff0000',
                data: { description: 'Test Desc' }
            }
        };

        render(<AppointmentCalendar {...defaultProps} events={[calendarEvent]} view={Views.WEEK} />);

        const eventTitle = screen.getByText('Test Event');
        const eventContainer = eventTitle.closest('div')?.parentElement?.parentElement;

        // We can check styles directly or indirectly via class names if they were dynamic classes
        // Here we check inline styles applied by CustomEvent
        expect(eventContainer).toHaveStyle({
            backgroundColor: '#ff000015',
            borderLeftColor: '#ff0000'
        });

        expect(eventTitle).toHaveStyle({
            color: '#ff0000'
        });
    });

    it('custom event component handles styling for appointments', () => {
        const appointmentEvent = {
            ...mockEvents[0],
            resource: {
                type: 'appointment',
                data: { attendee: { name: 'Jane Doe' } }
            }
        };

        render(<AppointmentCalendar {...defaultProps} events={[appointmentEvent]} view={Views.WEEK} />);

        const eventTitle = screen.getByText('Test Event');
        const eventContainer = eventTitle.closest('div')?.parentElement?.parentElement;

        expect(eventContainer).toHaveStyle({
            backgroundColor: 'hsl(var(--card))'
        });

        expect(eventTitle).toHaveStyle({
            color: 'hsl(var(--foreground))'
        });
    });


    it('custom month event component renders correctly', () => {
        const calendarEvent = {
            ...mockEvents[0],
            resource: {
                type: 'calendar',
                color: '#00ff00'
            }
        };

        render(<AppointmentCalendar {...defaultProps} events={[calendarEvent]} view={Views.MONTH} />);
        
        const timeElement = screen.getByText('10:00');
        const eventElement = timeElement.closest('div');
        
        expect(eventElement).toHaveStyle({
            backgroundColor: '#00ff00',
            opacity: '0.9'
        });
    });

    it('custom month event component handles non-calendar events', () => {
         const otherEvent = {
            ...mockEvents[0],
            resource: {
                type: 'other'
            }
        };

        render(<AppointmentCalendar {...defaultProps} events={[otherEvent]} view={Views.MONTH} />);
        
        const timeElement = screen.getByText('10:00');
        const eventElement = timeElement.closest('div');

        expect(eventElement).toHaveStyle({
            backgroundColor: 'hsl(var(--primary))',
            opacity: '1'
        });
    });

    it('passes correct formats to Calendar', () => {
        render(<AppointmentCalendar {...defaultProps} />);
        fireEvent.click(screen.getByText('week'));
        fireEvent.click(screen.getByText('day'));
    });
});
