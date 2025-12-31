import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { AppointmentCalendar } from './AppointmentCalendar';
import { enUS } from 'date-fns/locale';

// 1. Mock useTranslation with a mutable return value
const i18nMock = {
    language: 'en',
    changeLanguage: vi.fn(),
};

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: i18nMock
    })
}));

// 2. Mock Big Calendar to inspect the 'culture' prop
vi.mock('react-big-calendar', async () => {
    const actual = await vi.importActual('react-big-calendar');
    return {
        ...actual,
        Calendar: (props: any) => {
            return (
                <div data-testid="mock-big-calendar" data-culture={props.culture}>
                    Mock Calendar
                </div>
            )
        },
        dateFnsLocalizer: (config: any) => ({
            format: (date: Date, formatStr: string) => 'formatted-date',
            ...config
        }),
        Views: {
            MONTH: 'month',
            WEEK: 'week',
            DAY: 'day',
            AGENDA: 'agenda'
        }
    };
});

describe('AppointmentCalendar Locale Handling', () => {
    const defaultProps = {
        events: [],
        date: new Date('2023-10-26'),
        onDateChange: vi.fn(),
        view: 'month' as any,
        onViewChange: vi.fn(),
        onSelectEvent: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('uses "en-US" fallback for unknown locales', () => {
        i18nMock.language = 'xx-XX';
        render(<AppointmentCalendar {...defaultProps} />);
        const calendar = screen.getByTestId('mock-big-calendar');
        expect(calendar).toHaveAttribute('data-culture', 'en-US');
    });

    it('uses specific language code when exact match exists (legacy logic)', () => {
        i18nMock.language = 'en-US';
        render(<AppointmentCalendar {...defaultProps} />);
        const calendar = screen.getByTestId('mock-big-calendar');
        expect(calendar).toHaveAttribute('data-culture', 'en-US');
    });

    it('normalizes regional locale (de-DE) to base language (de)', () => {
        i18nMock.language = 'de-DE';
        render(<AppointmentCalendar {...defaultProps} />);
        const calendar = screen.getByTestId('mock-big-calendar');
        // Expect 'de' because 'de' is in the locales map
        expect(calendar).toHaveAttribute('data-culture', 'de');
    });

    it('uses full regional locale if it is explicitly supported', () => {
        // 'en-US' is explicitly in the map
        i18nMock.language = 'en-US';
        render(<AppointmentCalendar {...defaultProps} />);
        const calendar = screen.getByTestId('mock-big-calendar');
        expect(calendar).toHaveAttribute('data-culture', 'en-US');
    });
});
