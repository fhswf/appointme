import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AppointmentSidebar } from './AppointmentSidebar';

// Mock the UI components used
vi.mock('@/components/ui/calendar', () => ({
    Calendar: ({ mode, selected, onSelect, modifiers }: any) => (
        <div data-testid="mock-calendar">
            <button onClick={() => onSelect(new Date('2023-10-27'))}>Select Date</button>
            <span>{selected?.toISOString()}</span>
        </div>
    )
}));

describe('AppointmentSidebar Component', () => {
    const mockSetDate = vi.fn();
    const mockOnCalendarToggle = vi.fn();
    const mockCalendars = [
        { id: '1', label: 'Work', color: 'red', checked: true },
        { id: '2', label: 'Personal', color: 'blue', checked: false }
    ];
    const mockDatesWithAppointments = new Set([new Date('2023-10-25').getTime()]);

    it('renders correctly with calendars', () => {
        render(
            <AppointmentSidebar
                date={new Date('2023-10-26')}
                setDate={mockSetDate}
                calendars={mockCalendars}
                onCalendarToggle={mockOnCalendarToggle}
                datesWithAppointments={mockDatesWithAppointments}
            />
        );

        expect(screen.getByTestId('mock-calendar')).toBeInTheDocument();
        expect(screen.getByText('Calendars')).toBeInTheDocument();
        expect(screen.getByText('Work')).toBeInTheDocument();
        expect(screen.getByText('Personal')).toBeInTheDocument();
    });

    it('renders empty state when no calendars', () => {
        render(
            <AppointmentSidebar
                date={new Date('2023-10-26')}
                setDate={mockSetDate}
                calendars={[]}
                onCalendarToggle={mockOnCalendarToggle}
                datesWithAppointments={mockDatesWithAppointments}
            />
        );

        expect(screen.getByText('No calendars connected')).toBeInTheDocument();
    });

    it('calls setDate when date is selected in calendar', async () => {
        render(
            <AppointmentSidebar
                date={new Date('2023-10-26')}
                setDate={mockSetDate}
                calendars={mockCalendars}
                onCalendarToggle={mockOnCalendarToggle}
                datesWithAppointments={mockDatesWithAppointments}
            />
        );

        await userEvent.click(screen.getByText('Select Date'));
        expect(mockSetDate).toHaveBeenCalled();
    });

    it('calls onCalendarToggle when checkbox is clicked', async () => {
        render(
            <AppointmentSidebar
                date={new Date('2023-10-26')}
                setDate={mockSetDate}
                calendars={mockCalendars}
                onCalendarToggle={mockOnCalendarToggle}
                datesWithAppointments={mockDatesWithAppointments}
            />
        );

        // Find checkbox by label
        const workCheckbox = screen.getByLabelText('Work');
        await userEvent.click(workCheckbox);
        expect(mockOnCalendarToggle).toHaveBeenCalledWith('1');

        const personalCheckbox = screen.getByLabelText('Personal');
        await userEvent.click(personalCheckbox);
        expect(mockOnCalendarToggle).toHaveBeenCalledWith('2');
    });
});
