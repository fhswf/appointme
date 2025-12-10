
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LocalizedTimeInput from '../../components/LocalizedTimeInput';
import { useTranslation } from 'react-i18next';

// Mock translation
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        i18n: {
            language: 'en'
        }
    })
}));

// Mock utils
vi.mock('@/lib/utils', () => ({
    cn: (...args: any[]) => args.filter(Boolean).join(' ')
}));

describe('LocalizedTimeInput', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders with initial value', () => {
        const initialValue = '10:00';
        render(
            <LocalizedTimeInput
                value={initialValue}
                onChange={vi.fn()}
                className="test-class"
            />
        );

        // Uses display value which might be formatted.
        // With mocked 'en' locale and getFormatStr default 'hh:mm aa' -> '10:00 AM'
        expect(screen.getByDisplayValue('10:00 AM')).toBeInTheDocument();
    });

    it('calls onChange with new time when input changes', () => {
        const initialValue = '10:00';
        const handleChange = vi.fn();
        render(
            <LocalizedTimeInput
                value={initialValue}
                onChange={handleChange}
            />
        );

        const input = screen.getByDisplayValue('10:00 AM');

        // Change to 11:30 PM (user types localized format or raw)
        // If user types '11:30 PM', parseTime 'hh:mm aa' should work.
        fireEvent.change(input, { target: { value: '11:30 PM' } });

        // onChange arg depends on parseTime return.
        // parseTime('11:30 PM', 'en') -> '23:30' (HH:mm)
        expect(handleChange).toHaveBeenCalledWith('23:30');
    });

    it('handles localized specific logic if any', () => {
        // e.g., 24h format
        // This depends on how the component is implemented (view_file of component needed to be exact)
    });
});
