import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeAll } from 'vitest';
import { AppointmentCalendar } from './AppointmentCalendar';
import { Views } from 'react-big-calendar';

// Mock translaton
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'en' }
    })
}));

// Mock Big Calendar
vi.mock('react-big-calendar', async () => {
    const actual = await vi.importActual('react-big-calendar');
    return {
        ...actual,
        Calendar: (props: any) => {
            return (
                <div data-testid="mock-big-calendar">
                    <button onClick={() => props.onNavigate(new Date())}>Navigate</button>
                    <button onClick={() => props.onView('week')}>Change View</button>
                    <button onClick={() => props.onSelectEvent({ title: 'Test Event' })}>Select Event</button>
                    {/* Render custom toolbar to test it */}
                    {props.components?.toolbar && (
                        <props.components.toolbar
                            label="October 2023"
                            onNavigate={props.onNavigate}
                            onView={props.onView}
                            view={props.view}
                            date={props.date}
                        />
                    )}
                    {/* Render events to test custom event component? 
                        Difficult without full logic. We can test custom components purely in isolation if needed or rely on integration.
                    */}
                </div>
            )
        },
        dateFnsLocalizer: vi.fn(),
        Views: {
            MONTH: 'month',
            WEEK: 'week',
            DAY: 'day',
            AGENDA: 'agenda'
        }
    };
});

describe('AppointmentCalendar Component', () => {
    const mockOnDateChange = vi.fn();
    const mockOnViewChange = vi.fn();
    const mockOnSelectEvent = vi.fn();
    const defaultProps = {
        events: [],
        date: new Date('2023-10-26'),
        onDateChange: mockOnDateChange,
        view: 'month' as any,
        onViewChange: mockOnViewChange,
        onSelectEvent: mockOnSelectEvent
    };

    it('renders correctly', () => {
        render(<AppointmentCalendar {...defaultProps} />);
        expect(screen.getByTestId('mock-big-calendar')).toBeInTheDocument();
    });

    it('renders custom toolbar and interacts', async () => {
        render(<AppointmentCalendar {...defaultProps} />);

        // Check for toolbar elements (mocked translation returns key)
        expect(screen.getByText('today')).toBeInTheDocument();
        expect(screen.getByText('month')).toBeInTheDocument();
        expect(screen.getByText('week')).toBeInTheDocument();
        expect(screen.getByText('day')).toBeInTheDocument();

        // Test interactions via the mock implementation or directly if toolbar rendered
        const weekBtn = screen.getByText('week');
        fireEvent.click(weekBtn);
        // The CustomToolbar calls onView with Views.WEEK ('week')
        expect(mockOnViewChange).toHaveBeenCalledWith('week');
    });

    it('handles event selection', () => {
        render(<AppointmentCalendar {...defaultProps} />);
        const selectBtn = screen.getByText('Select Event');
        fireEvent.click(selectBtn);
        expect(mockOnSelectEvent).toHaveBeenCalledWith({ title: 'Test Event' });
    });
});
