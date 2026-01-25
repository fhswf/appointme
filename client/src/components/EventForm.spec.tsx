import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { EventForm } from './EventForm';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

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

// Mock Select component with Native Select for easier testing
vi.mock('@/components/ui/select', () => ({
    Select: ({ onValueChange, children, value }: any) => (
        <select
            data-testid="mock-select"
            value={value}
            onChange={e => onValueChange(e.target.value)}
        >
            {children}
        </select>
    ),
    SelectTrigger: ({ children }: any) => null,
    SelectValue: () => null,
    SelectContent: ({ children }: any) => <>{children}</>,
    SelectItem: ({ value, children }: any) => <option value={value}>{children}</option>,
}));

// Mock Textarea
vi.mock('@/components/ui/textarea', () => ({
    Textarea: (props: any) => <textarea data-testid="event-description" {...props} />
}));

vi.mock('@/components/ui/input', () => ({
    Input: (props: any) => <input {...props} />
}));
// Mock useAuth
vi.mock('../components/AuthProvider', () => ({
    useAuth: () => ({
        user: {
            defaultAvailable: {
                1: [{ start: "09:00", end: "17:00" }]
            }
        },
        isAuthenticated: true
    })
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
    maxPerDay: 0,
    availabilityMode: 'define' as const
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
        render(
            <BrowserRouter>
                <EventForm event={mockEvent} handleOnSubmit={mockSubmit} />
            </BrowserRouter>
        );

        expect(screen.getByTestId('event-form-title')).toHaveValue('Test Event');
        expect(screen.getByTestId('event-description')).toHaveValue('Test Description');
    });

    it('should update form fields', () => {
        render(
            <BrowserRouter>
                <EventForm event={mockEvent} handleOnSubmit={mockSubmit} />
            </BrowserRouter>
        );

        const titleInput = screen.getByTestId('event-form-title');
        fireEvent.change(titleInput, { target: { value: 'Updated Event' } });

        expect(titleInput).toHaveValue('Updated Event');
    });

    it('should submit form with updated data', async () => {
        render(
            <BrowserRouter>
                <EventForm event={mockEvent} handleOnSubmit={mockSubmit} />
            </BrowserRouter>
        );

        const titleInput = screen.getByTestId('event-form-title');
        fireEvent.change(titleInput, { target: { value: 'Updated Event' } });

        const submitButton = screen.getByTestId('event-form-submit');
        expect(submitButton).toBeEnabled();

        fireEvent.click(submitButton);

        expect(mockSubmit).toHaveBeenCalled();
        expect(mockSubmit.mock.calls[0][0].name).toBe('Updated Event');
    });

    it('should auto-generate slug from name if matching', () => {
        render(
            <BrowserRouter>
                <EventForm event={mockEvent} handleOnSubmit={mockSubmit} />
            </BrowserRouter>
        );

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

    it('should update description field', () => {
        render(
            <BrowserRouter>
                <EventForm event={mockEvent} handleOnSubmit={mockSubmit} />
            </BrowserRouter>
        );

        const descriptionInput = screen.getByTestId('event-description');
        fireEvent.change(descriptionInput, { target: { value: 'New description' } });

        expect(descriptionInput).toHaveValue('New description');
    });

    it('should update location field', () => {
        render(
            <BrowserRouter>
                <EventForm event={mockEvent} handleOnSubmit={mockSubmit} />
            </BrowserRouter>
        );

        const locationInput = screen.getByDisplayValue('Test Location');
        fireEvent.change(locationInput, { target: { value: 'New Location' } });

        expect(locationInput).toHaveValue('New Location');
    });

    it('should update url field independently', () => {
        const eventWithDifferentUrl = { ...mockEvent, url: 'custom_url' };
        render(<EventForm event={eventWithDifferentUrl} handleOnSubmit={mockSubmit} />);

        const titleInput = screen.getByTestId('event-form-title');
        fireEvent.change(titleInput, { target: { value: 'New Name' } });

        const submitButton = screen.getByTestId('event-form-submit');
        fireEvent.click(submitButton);

        // URL should NOT auto-update if it doesn't match the slug
        expect(mockSubmit.mock.calls[2][0].url).toBe('custom_url');
    });

    it('should update maxFuture field', () => {
        render(
            <BrowserRouter>
                <EventForm event={mockEvent} handleOnSubmit={mockSubmit} />
            </BrowserRouter>
        );

        const maxFutureInput = screen.getAllByRole('spinbutton')[0]; // First number input
        fireEvent.change(maxFutureInput, { target: { value: '30' } });

        const submitButton = screen.getByTestId('event-form-submit');
        fireEvent.click(submitButton);

        // maxFuture is multiplied by 86400 (seconds in a day)
        expect(mockSubmit.mock.calls[3][0].maxFuture).toBe(30 * 86400);
    });

    it('should update minFuture field', () => {
        render(
            <BrowserRouter>
                <EventForm event={mockEvent} handleOnSubmit={mockSubmit} />
            </BrowserRouter>
        );

        const minFutureInput = screen.getAllByRole('spinbutton')[1]; // Second number input
        fireEvent.change(minFutureInput, { target: { value: '2' } });

        const submitButton = screen.getByTestId('event-form-submit');
        fireEvent.click(submitButton);

        // minFuture is multiplied by 86400 (seconds in a day)
        expect(mockSubmit.mock.calls[4][0].minFuture).toBe(2 * 86400);
    });

    it('should update maxPerDay field', () => {
        render(
            <BrowserRouter>
                <EventForm event={mockEvent} handleOnSubmit={mockSubmit} />
            </BrowserRouter>
        );

        const maxPerDayInput = screen.getAllByRole('spinbutton')[2]; // Third number input
        fireEvent.change(maxPerDayInput, { target: { value: '5' } });

        const submitButton = screen.getByTestId('event-form-submit');
        fireEvent.click(submitButton);

        expect(mockSubmit.mock.calls[5][0].maxPerDay).toBe(5);
    });

    it('should keep submit button disabled when form is unchanged', () => {
        render(
            <BrowserRouter>
                <EventForm event={mockEvent} handleOnSubmit={mockSubmit} />
            </BrowserRouter>
        );

        const submitButton = screen.getByTestId('event-form-submit');
        expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when form is changed', () => {
        render(
            <BrowserRouter>
                <EventForm event={mockEvent} handleOnSubmit={mockSubmit} />
            </BrowserRouter>
        );

        const titleInput = screen.getByTestId('event-form-title');
        fireEvent.change(titleInput, { target: { value: 'Changed' } });

        const submitButton = screen.getByTestId('event-form-submit');
        expect(submitButton).toBeEnabled();
    });
    it('should copy standard availability when copy button is clicked', () => {
        render(
            <BrowserRouter>
                <EventForm event={mockEvent} handleOnSubmit={mockSubmit} />
            </BrowserRouter>
        );

        // Mock window.confirm
        const confirmSpy = vi.spyOn(window, 'confirm');
        confirmSpy.mockImplementation(() => true);

        const copyButton = screen.getByText('Copy Standard Availability');
        fireEvent.click(copyButton);

        const submitButton = screen.getByTestId('event-form-submit');
        fireEvent.click(submitButton);

        const submittedEvent = mockSubmit.mock.calls[mockSubmit.mock.calls.length - 1][0];
        // Expect availability to match mocked default (Monday 9-17)
        // 1: [{ start: "09:00", end: "17:00" }]
        expect(submittedEvent.available[1]).toEqual([{ start: "09:00", end: "17:00" }]);

        confirmSpy.mockRestore();
    });

    it('should add and remove tags', () => {
        render(
            <BrowserRouter>
                <EventForm event={mockEvent} handleOnSubmit={mockSubmit} />
            </BrowserRouter>
        );

        const tagInput = screen.getByPlaceholderText('Type a tag and press Enter');
        fireEvent.change(tagInput, { target: { value: 'NewTag' } });
        fireEvent.keyDown(tagInput, { key: 'Enter', code: 'Enter' });

        expect(screen.getByText('NewTag')).toBeInTheDocument();

        // Check if tag is in submission
        const submitButton = screen.getByTestId('event-form-submit');
        fireEvent.click(submitButton);
        const submittedEvent = mockSubmit.mock.calls[mockSubmit.mock.calls.length - 1][0];
        // Remove tag
        // Find the span containing the tag text
        // The text 'NewTag' is directly inside the span
        const tagSpan = screen.getByText('NewTag');
        // The button is a sibling of the text node or child of the span
        // tagSpan returned by getByText is likely the span itself if it contains the text
        const removeButton = tagSpan.querySelector('button');

        expect(removeButton).toBeInTheDocument();
        if (removeButton) fireEvent.click(removeButton);
    });

    it('should show availability editor even if availabilityMode is missing', () => {
        const { availabilityMode, ...eventWithoutMode } = mockEvent;
        render(
            <BrowserRouter>
                <EventForm event={eventWithoutMode as any} handleOnSubmit={mockSubmit} />
            </BrowserRouter>
        );

        // Should default to 'define' mode and show AvailabilityEditor
        expect(screen.getByText('Daily availability')).toBeInTheDocument();
        // Check for some day elements from AvailabilityEditor
        expect(screen.getByText('Mon')).toBeInTheDocument();
    });

    it('should handle recurrence settings', () => {
        render(
            <BrowserRouter>
                <EventForm event={mockEvent} handleOnSubmit={mockSubmit} />
            </BrowserRouter>
        );

        // Enable recurrence
        const recurrenceSwitch = screen.getByLabelText('Enable Recurring Event');
        fireEvent.click(recurrenceSwitch);

        // Check availability of recurrence fields
        expect(screen.getByText('Frequency')).toBeInTheDocument();
        expect(screen.getByText('End Condition')).toBeInTheDocument();

        // Change frequency to Monthly
        const selects = screen.getAllByTestId('mock-select');
        const frequencySelect = selects.find(select => select.querySelector('option[value="monthly"]'));
        if (frequencySelect) {
            fireEvent.change(frequencySelect, { target: { value: 'monthly' } });
        }

        // Submit and check
        const submitButton = screen.getByTestId('event-form-submit');
        fireEvent.click(submitButton);
        const submittedEvent = mockSubmit.mock.calls[mockSubmit.mock.calls.length - 1][0];

        expect(submittedEvent.recurrence.enabled).toBe(true);
        expect(submittedEvent.recurrence.frequency).toBe('monthly');
    });

    it('should update recurrence count and span', () => {
        render(
            <BrowserRouter>
                <EventForm event={mockEvent} handleOnSubmit={mockSubmit} />
            </BrowserRouter>
        );
        const recurrenceSwitch = screen.getByLabelText('Enable Recurring Event');
        fireEvent.click(recurrenceSwitch);

        // Set occurrences
        const countInput = screen.getByPlaceholderText('e.g. 10');
        fireEvent.change(countInput, { target: { value: '5' } });

        let submitButton = screen.getByTestId('event-form-submit');
        fireEvent.click(submitButton);
        let submittedEvent = mockSubmit.mock.calls[mockSubmit.mock.calls.length - 1][0];
        expect(submittedEvent.recurrence.count).toBe(5);
        expect(submittedEvent.recurrence.span).toBeUndefined();

        // Change to Time Span
        const spanInput = screen.getByLabelText('Time Span:').querySelector('input'); // The input is inside or near label, finding by ID is better
        // ID is recurrence-span-val
        const spanValInput = document.getElementById('recurrence-span-val');
        if (spanValInput) {
            fireEvent.change(spanValInput, { target: { value: '6' } });
        }

        submitButton = screen.getByTestId('event-form-submit');
        fireEvent.click(submitButton);
        submittedEvent = mockSubmit.mock.calls[mockSubmit.mock.calls.length - 1][0];

        expect(submittedEvent.recurrence.span.value).toBe(6);
        expect(submittedEvent.recurrence.count).toBeUndefined();
    });

    it('should switch availability mode', () => {
        render(
            <BrowserRouter>
                <EventForm event={mockEvent} handleOnSubmit={mockSubmit} />
            </BrowserRouter>
        );

        // Switch to 'default' (Use Standard)
        const selects = screen.getAllByTestId('mock-select');
        const availabilitySelect = selects.find(select => select.querySelector('option[value="default"]'));

        if (availabilitySelect) {
            fireEvent.change(availabilitySelect, { target: { value: 'default' } });
        }

        expect(screen.getAllByText('Using Standard Availability defined in Profile settings.').length).toBeGreaterThan(0);

        const submitButton = screen.getByTestId('event-form-submit');
        fireEvent.click(submitButton);
        const submittedEvent = mockSubmit.mock.calls[mockSubmit.mock.calls.length - 1][0];
        expect(submittedEvent.availabilityMode).toBe('default');
    });

    it('should update form when props change', () => {
        const { rerender } = render(
            <BrowserRouter>
                <EventForm event={mockEvent} handleOnSubmit={mockSubmit} />
            </BrowserRouter>
        );

        expect(screen.getByTestId('event-form-title')).toHaveValue('Test Event');

        const newEvent = { ...mockEvent, name: 'New Prop Event' };
        rerender(
            <BrowserRouter>
                <EventForm event={newEvent} handleOnSubmit={mockSubmit} />
            </BrowserRouter>
        );

        expect(screen.getByTestId('event-form-title')).toHaveValue('New Prop Event');
        expect(screen.getByTestId('event-form-title')).toHaveValue('New Prop Event');
    });

    it('should update gender field', () => {
        render(
            <BrowserRouter>
                <EventForm event={mockEvent} handleOnSubmit={mockSubmit} />
            </BrowserRouter>
        );

        const selects = screen.getAllByTestId('mock-select');
        const genderSelect = selects.find(select => select.querySelector('option[value="male"]'));

        expect(genderSelect).toBeDefined();
        if (genderSelect) {
            fireEvent.change(genderSelect, { target: { value: 'male' } });
        }

        const submitButton = screen.getByTestId('event-form-submit');
        fireEvent.click(submitButton);
        const submittedEvent = mockSubmit.mock.calls[mockSubmit.mock.calls.length - 1][0];

        expect(submittedEvent.gender).toBe('male');
    });
});
