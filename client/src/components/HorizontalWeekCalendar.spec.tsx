
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HorizontalWeekCalendar from './HorizontalWeekCalendar';
import { getLocale } from '../helpers/date_locales';

vi.mock('../helpers/date_locales', () => ({
    getLocale: vi.fn(),
}));

describe('HorizontalWeekCalendar', () => {
    it('should render', () => {
        const selected = new Date();
        const onSelect = vi.fn();
        const checkDay = vi.fn().mockReturnValue(true);

        render(
            <HorizontalWeekCalendar
                selectedDate={selected}
                onSelect={onSelect}
                isDayAvailable={checkDay}
            />
        );

        // Basic rendering check (e.g., ensuring no crash)
        // Since it renders dates based on current week, we might check for class names or structure
        const calendarContainer = document.querySelector('.flex.flex-col');
        expect(calendarContainer).toBeInTheDocument();
    });
});
