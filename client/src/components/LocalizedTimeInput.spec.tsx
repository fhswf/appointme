import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LocalizedTimeInput } from './LocalizedTimeInput';

// Mock translation to control locale
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'de' }
    }),
}));

describe('LocalizedTimeInput', () => {
    it('should format time correctly for DE locale', () => {
        const onChange = vi.fn();
        render(<LocalizedTimeInput value="14:00" onChange={onChange} />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('14:00');
    });

    it('should parse user input correctly', () => {
        const onChange = vi.fn();
        render(<LocalizedTimeInput value="" onChange={onChange} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '15:30' } });

        expect(onChange).toHaveBeenCalledWith('15:30');
    });
});
