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

    // Test all locale mappings
    it('should format time correctly for FR locale (24h)', () => {
        mockUseTranslation.mockReturnValue({ i18n: { language: 'fr' } });
        const onChange = vi.fn();
        render(<LocalizedTimeInput value="14:00" onChange={onChange} />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('14:00');
    });

    it('should format time correctly for ES locale (24h)', () => {
        mockUseTranslation.mockReturnValue({ i18n: { language: 'es' } });
        const onChange = vi.fn();
        render(<LocalizedTimeInput value="14:00" onChange={onChange} />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('14:00');
    });

    it('should format time correctly for IT locale (24h)', () => {
        mockUseTranslation.mockReturnValue({ i18n: { language: 'it' } });
        const onChange = vi.fn();
        render(<LocalizedTimeInput value="14:00" onChange={onChange} />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('14:00');
    });

    it('should format time correctly for JA locale (24h)', () => {
        mockUseTranslation.mockReturnValue({ i18n: { language: 'ja' } });
        const onChange = vi.fn();
        render(<LocalizedTimeInput value="14:00" onChange={onChange} />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('14:00');
    });

    it('should format time correctly for KO locale (24h)', () => {
        mockUseTranslation.mockReturnValue({ i18n: { language: 'ko' } });
        const onChange = vi.fn();
        render(<LocalizedTimeInput value="14:00" onChange={onChange} />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('14:00');
    });

    it('should format time correctly for ZH locale (24h)', () => {
        mockUseTranslation.mockReturnValue({ i18n: { language: 'zh' } });
        const onChange = vi.fn();
        render(<LocalizedTimeInput value="14:00" onChange={onChange} />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('14:00');
    });

    // Test empty values
    it('should handle empty value', () => {
        mockUseTranslation.mockReturnValue({ i18n: { language: 'en' } });
        const onChange = vi.fn();
        render(<LocalizedTimeInput value="" onChange={onChange} />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('');
    });

    it('should handle onChange with empty value', () => {
        mockUseTranslation.mockReturnValue({ i18n: { language: 'en' } });
        const onChange = vi.fn();
        render(<LocalizedTimeInput value="10:00" onChange={onChange} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '' } });

        // Empty value should not trigger onChange
        expect(onChange).not.toHaveBeenCalled();
    });

    // Test className prop
    it('should apply custom className', () => {
        mockUseTranslation.mockReturnValue({ i18n: { language: 'en' } });
        const onChange = vi.fn();
        render(<LocalizedTimeInput value="10:00" onChange={onChange} className="custom-class" />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('custom-class');
    });

    // Test placeholder
    it('should show default placeholder for EN locale', () => {
        mockUseTranslation.mockReturnValue({ i18n: { language: 'en' } });
        const onChange = vi.fn();
        render(<LocalizedTimeInput value="" onChange={onChange} />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('placeholder', '09:00 AM');
    });

    it('should show default placeholder for DE locale', () => {
        mockUseTranslation.mockReturnValue({ i18n: { language: 'de' } });
        const onChange = vi.fn();
        render(<LocalizedTimeInput value="" onChange={onChange} />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('placeholder', '09:00');
    });

    it('should use custom placeholder when provided', () => {
        mockUseTranslation.mockReturnValue({ i18n: { language: 'en' } });
        const onChange = vi.fn();
        render(<LocalizedTimeInput value="" onChange={onChange} placeholder="Custom placeholder" />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('placeholder', 'Custom placeholder');
    });

    // Test language switching
    it('should update format when language changes', () => {
        mockUseTranslation.mockReturnValue({ i18n: { language: 'en' } });
        const onChange = vi.fn();
        const { rerender } = render(<LocalizedTimeInput value="14:00" onChange={onChange} />);

        let input = screen.getByRole('textbox');
        expect(input).toHaveValue('02:00 PM');

        // Change language to German
        mockUseTranslation.mockReturnValue({ i18n: { language: 'de' } });
        rerender(<LocalizedTimeInput value="14:00" onChange={onChange} />);

        input = screen.getByRole('textbox');
        expect(input).toHaveValue('14:00');
    });

    // Test fallback for 24h input in 12h locale
    it('should parse 24h format input in 12h locale as fallback', () => {
        mockUseTranslation.mockReturnValue({ i18n: { language: 'en' } });
        const onChange = vi.fn();
        render(<LocalizedTimeInput value="" onChange={onChange} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '14:00' } });

        // Should parse 24h format as fallback and convert to HH:mm
        expect(onChange).toHaveBeenCalledWith('14:00');
    });

    // Test edge cases for time values
    it('should handle midnight (00:00)', () => {
        mockUseTranslation.mockReturnValue({ i18n: { language: 'en' } });
        const onChange = vi.fn();
        render(<LocalizedTimeInput value="00:00" onChange={onChange} />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('12:00 AM');
    });

    it('should handle noon (12:00)', () => {
        mockUseTranslation.mockReturnValue({ i18n: { language: 'en' } });
        const onChange = vi.fn();
        render(<LocalizedTimeInput value="12:00" onChange={onChange} />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('12:00 PM');
    });

    it('should handle end of day (23:59)', () => {
        mockUseTranslation.mockReturnValue({ i18n: { language: 'en' } });
        const onChange = vi.fn();
        render(<LocalizedTimeInput value="23:59" onChange={onChange} />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('11:59 PM');
    });
});

