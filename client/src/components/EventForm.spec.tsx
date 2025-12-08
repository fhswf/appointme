import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { EventForm } from './EventForm';

// Mock Checkbox to avoid Radix UI issues in test environment
vi.mock('@/components/ui/checkbox', () => ({
    Checkbox: ({ checked, onCheckedChange, ...props }: any) => (
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
            {...props}
        />
    )
}));

// Mock Select component parts to simplify testing
vi.mock('@/components/ui/select', () => ({
    Select: ({ onValueChange, children }: any) => <div data-testid="select">{children}</div>,
    SelectTrigger: ({ children }: any) => <button>{children}</button>,
    SelectValue: () => <span>Select Value</span>,
    SelectContent: ({ children }: any) => <div>{children}</div>,
    SelectItem: ({ value, children, onClick }: any) => <button onClick={() => onClick?.(value)} data-value={value}>{children}</button>,
}));

// Mock Textarea
vi.mock('@/components/ui/textarea', () => ({
    Textarea: (props: any) => <textarea data-testid="event-description" {...props} />
}));

vi.mock('@/components/ui/input', () => ({
    Input: (props: any) => <input {...props} />
}));


const mockEvent = {
    _id: '1',
    name: 'Test Event',
    duration: 30,
    isActive: true,
    url: 'test_event', // Matches slug of 'Test Event' for auto-gen test
    description: 'Test Description',
    location: 'Test Location',
    available: {
        0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
    },
    bufferbefore: 0,
    bufferafter: 0,
    user: 'user1',
    minFuture: 0,
    maxFuture: 0,
    maxPerDay: 0
};

describe('EventForm Component', () => {
    const mockSubmit = vi.fn();

    // Suppress console.log to avoid JSDOM errors when logging React Events
    const originalLog = console.log;
    beforeAll(() => {
        console.log = vi.fn();
    });
    afterAll(() => {
        console.log = originalLog;
    });

    it('should render form with event data', () => {
        render(<EventForm event={mockEvent} handleOnSubmit={mockSubmit} />);

        expect(screen.getByTestId('event-form-title')).toHaveValue('Test Event');
        expect(screen.getByTestId('event-description')).toHaveValue('Test Description');
    });

    it('should update form fields', () => {
        render(<EventForm event={mockEvent} handleOnSubmit={mockSubmit} />);

        const titleInput = screen.getByTestId('event-form-title');
        fireEvent.change(titleInput, { target: { value: 'Updated Event' } });

        expect(titleInput).toHaveValue('Updated Event');
    });

    it('should submit form with updated data', async () => {
        render(<EventForm event={mockEvent} handleOnSubmit={mockSubmit} />);

        const titleInput = screen.getByTestId('event-form-title');
        fireEvent.change(titleInput, { target: { value: 'Updated Event' } });

        const submitButton = screen.getByTestId('event-form-submit');
        expect(submitButton).toBeEnabled();

        fireEvent.click(submitButton);

        expect(mockSubmit).toHaveBeenCalled();
        expect(mockSubmit.mock.calls[0][0].name).toBe('Updated Event');
    });

    it('should auto-generate slug from name if matching', () => {
        render(<EventForm event={mockEvent} handleOnSubmit={mockSubmit} />);

        const titleInput = screen.getByTestId('event-form-title');
        // Initial state: url matches slug of name

        fireEvent.change(titleInput, { target: { value: 'New Name' } });

        // This logic is tricky to test since we mocked input heavily, but let's see if our logic holds
        // The component internal state updates
        // We can check if Submit is called with new URL
        const submitButton = screen.getByTestId('event-form-submit');
        fireEvent.click(submitButton);

        expect(mockSubmit.mock.calls[1][0].url).toBe('new_name'); // 'New Name' slugified
    });
});
