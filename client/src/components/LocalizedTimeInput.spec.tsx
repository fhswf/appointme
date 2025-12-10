import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { LocalizedTimeInput } from './LocalizedTimeInput';

// Mock translation to control locale
const mockUseTranslation = vi.fn();

vi.mock('react-i18next', () => ({
    useTranslation: () => mockUseTranslation(),
}));

describe('LocalizedTimeInput', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it('should format time correctly for DE locale (24h)', () => {
        mockUseTranslation.mockReturnValue({ i18n: { language: 'de' } });
        const onChange = vi.fn();
        render(<LocalizedTimeInput value="14:00" onChange={onChange} />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('14:00');
    });

    it('should format time correctly for EN locale (12h)', () => {
        mockUseTranslation.mockReturnValue({ i18n: { language: 'en' } });
        const onChange = vi.fn();
        render(<LocalizedTimeInput value="14:00" onChange={onChange} />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('02:00 PM');
    });

    it('should parse user input correctly for 24h format', () => {
        mockUseTranslation.mockReturnValue({ i18n: { language: 'de' } });
        const onChange = vi.fn();
        render(<LocalizedTimeInput value="" onChange={onChange} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '15:30' } });

        expect(onChange).toHaveBeenCalledWith('15:30');
    });

    it('should parse user input correctly for 12h format', () => {
        mockUseTranslation.mockReturnValue({ i18n: { language: 'en' } });
        const onChange = vi.fn();
        render(<LocalizedTimeInput value="" onChange={onChange} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '11:30 PM' } });

        expect(onChange).toHaveBeenCalledWith('23:30');
    });

    it('should handle invalid input gracefully', () => {
        mockUseTranslation.mockReturnValue({ i18n: { language: 'en' } });
        const onChange = vi.fn();
        render(<LocalizedTimeInput value="10:00" onChange={onChange} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'invalid-time' } });

        // Should not call onChange for invalid time
        expect(onChange).not.toHaveBeenCalled();
    });

    it('should reformat on blur', () => {
        mockUseTranslation.mockReturnValue({ i18n: { language: 'en' } });
        const onChange = vi.fn();
        render(<LocalizedTimeInput value="14:00" onChange={onChange} />);

        const input = screen.getByRole('textbox');
        
        // Simulating typing something valid but unformatted slightly differently or partial
        fireEvent.change(input, { target: { value: '2:00 pm' } });
        fireEvent.blur(input);

        // Should format strictly to '02:00 PM'
        expect(input).toHaveValue('02:00 PM');
    });

    it('should revert to original value on blur if invalid', () => {
        mockUseTranslation.mockReturnValue({ i18n: { language: 'en' } });
        const onChange = vi.fn();
        render(<LocalizedTimeInput value="14:00" onChange={onChange} />);

        const input = screen.getByRole('textbox');
        
        fireEvent.change(input, { target: { value: 'garbage' } });
        fireEvent.blur(input);

        // Should revert to '02:00 PM' (original value formatted)
        expect(input).toHaveValue('02:00 PM');
    });

    it('should update display value when prop changes', () => {
        mockUseTranslation.mockReturnValue({ i18n: { language: 'de' } });
        const { rerender } = render(<LocalizedTimeInput value="10:00" onChange={vi.fn()} />);
        
        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('10:00');

        rerender(<LocalizedTimeInput value="11:00" onChange={vi.fn()} />);
        expect(input).toHaveValue('11:00');
    });
});

