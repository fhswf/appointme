
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Booking from './Booking';
import { MemoryRouter } from 'react-router-dom';
import * as userServices from '../helpers/services/user_services';
import * as eventServices from '../helpers/services/event_services';

// Mock dependencies
vi.mock('../helpers/services/user_services');
vi.mock('../helpers/services/event_services');
vi.mock('../helpers/services/google_services');
vi.mock('react-i18next', () => {
    let language = 'en';
    return {
        useTranslation: () => ({
            t: (key: string) => key,
            i18n: {
                t: (key: string) => key,
                language,
                changeLanguage: (lang: string) => { language = lang; }
            }
        }),
    };
});


// Mock sonner toast
vi.mock('sonner', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn()
    }
}));

// Mock react-router-dom hooks
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useParams: () => ({ user_url: 'test-user', url: 'test-event' }),
        useNavigate: () => mockNavigate
    };
});

describe('Booking Page', () => {
    const mockUser = {
        _id: 'user1',
        name: 'Test User',
        user_url: 'test-user',
        email: 'test@example.com'
    };

    const mockEvent = {
        _id: 'event1',
        url: 'test-event',
        title: 'Test Event',
        duration: 30,
        isActive: true,
        available: [
            [{ start: '09:00', end: '17:00' }], // Sunday
            [{ start: '09:00', end: '17:00' }], // Monday
            [{ start: '09:00', end: '17:00' }],
            [{ start: '09:00', end: '17:00' }],
            [{ start: '09:00', end: '17:00' }],
            [{ start: '09:00', end: '17:00' }],
            [{ start: '09:00', end: '17:00' }],
        ],
        bufferbefore: 0,
        bufferafter: 0
    };

    // Create a valid IntervalSet mock or instance
    // Since IntervalSet is from common, we might be able to use logic or just mock the return
    // The component expects `slots.overlapping(...)` and `slots.intersect(...)`
    // We can mock the methods directly.

    const mockSlotsImpl = {
        overlapping: () => ['something'],
        intersect: () => [
            { start: new Date('2025-12-08T10:00:00'), end: new Date('2025-12-08T11:00:00') }
        ]
    };


    beforeEach(() => {
        vi.clearAllMocks();
        (userServices.getUserByUrl as any).mockResolvedValue({ data: mockUser });
        (eventServices.getEventByUrlAndUser as any).mockResolvedValue({ data: mockEvent });
        // @ts-ignore
        (eventServices.getAvailableTimes as any).mockResolvedValue(mockSlotsImpl);
        
        // Mock scrollIntoView
        Element.prototype.scrollIntoView = vi.fn();
    });

    it('should render and fetch user and event data', async () => {
        render(
            <MemoryRouter>
                <Booking />
            </MemoryRouter>
        );

        expect(userServices.getUserByUrl).toHaveBeenCalledWith('test-user');

        await waitFor(() => {
            expect(eventServices.getEventByUrlAndUser).toHaveBeenCalledWith('user1', 'test-event');
        });

        // Check for step titles
        expect(await screen.findByText('Schedule an appointment')).toBeInTheDocument();
        // Check for step titles
        expect(screen.getByText('Schedule Appointment')).toBeInTheDocument();
        // expect(screen.getByText('Choose time')).toBeInTheDocument(); // Time step is merged
        expect(screen.getByText('Provide details')).toBeInTheDocument();

        // Check for footer links
        expect(screen.getByText('Impressum')).toBeInTheDocument();
        expect(screen.getByText('Datenschutzhinweise')).toBeInTheDocument();
    });

    it('should allow changing language', async () => {
        render(
            <MemoryRouter>
                <Booking />
            </MemoryRouter>
        );

        // Check if selector is present (it renders a Select component which usually has a trigger)
        // We mocked the LanguageSelector component? No, we are using the real one.
        // It uses Radix UI Select.
        // We might need to look for the trigger text "Language" or the icon.
        // Our LanguageSelector has placeholder "Language", but since default is 'en', it shows "English".
        expect(screen.getByText('English')).toBeInTheDocument();
    });



    it('should navigate to Not Found if user not found', async () => {
        (userServices.getUserByUrl as any).mockResolvedValue({ data: [] }); // User fetch returns empty
        render(
            <MemoryRouter>
                <Booking />
            </MemoryRouter>
        );
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/notfound');
        });
    });

    it('should navigate to Not Found if event isActive is false', async () => {
        const inactiveEvent = { ...mockEvent, isActive: false };
        (eventServices.getEventByUrlAndUser as any).mockResolvedValue({ data: inactiveEvent });

        render(
            <MemoryRouter>
                <Booking />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(eventServices.getEventByUrlAndUser).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/notfound');
        });
    });

    // Mock UI components to simplify testing
    vi.mock('@/components/ui/calendar', () => ({
        Calendar: ({ onSelect, mode }: any) => (
            <div data-testid="mock-calendar">
                <button
                    data-testid="select-date-btn"
                    onClick={() => onSelect(new Date('2025-12-08T12:00:00Z'))}
                >
                    Select Date
                </button>
            </div>
        )
    }));

    it('should complete a full booking flow successfully', async () => {
        const { insertEvent } = await import('../helpers/services/google_services');
        const { toast } = await import('sonner');
        // @ts-ignore
        const userEvent = (await import('@testing-library/user-event')).default;

        // Setup mocks
        (insertEvent as any).mockResolvedValue({});

        render(
            <MemoryRouter>
                <Booking />
            </MemoryRouter>
        );

        // 1. Initial State
        await waitFor(() => {
            expect(screen.getByText('Schedule an appointment')).toBeInTheDocument();
        });

        // 2. Select Date
        // We use our mock calendar to trigger date selection
        const selectDateBtn = screen.getByTestId('select-date-btn');
        await userEvent.click(selectDateBtn);

        // 3. Select Time
        // The slots should appear after date selection.
        // Based on mockSlotsImpl returning a slot at 10:00
        // We need to wait for the slot button to act.
        // Note: The slot time depends on the intersect mock.
        // Our mock returns 2025-12-08T10:00:00.
        // Converting to ISO string might depend on timezone, 
        // but let's look for the formatted text "10:00" if possible or rely on the button existence

        const slotRegex = /10:00/; // The format is HH:mm
        const slotBtn = await screen.findByText(slotRegex);
        await userEvent.click(slotBtn);

        // 4. Fill Details
        // Stepper should have moved to "Provide details"
        // We look for inputs
        const nameInput = await screen.findByLabelText(/Name/i);
        await userEvent.type(nameInput, 'John Doe');

        const emailInput = screen.getByLabelText(/Email/i);
        await userEvent.type(emailInput, 'john@example.com');

        const descInput = screen.getByLabelText(/Information/i);
        await userEvent.type(descInput, 'My meeting notes');

        // 5. Submit
        const submitBtn = screen.getByRole('button', { name: /whole_acidic_parrot_promise/i }); // Translation key fallback or use actual text if mocked
        // Our mock translation returns the key.
        await userEvent.click(submitBtn);

        // 6. Verification
        await waitFor(() => {
            expect(insertEvent).toHaveBeenCalledWith(
                'event1',
                expect.any(Date), // 10:00 date object
                'John Doe',
                'john@example.com',
                'My meeting notes'
            );
            expect(mockNavigate).toHaveBeenCalledWith('/booked', expect.any(Object));
            expect(toast.success).toHaveBeenCalledWith("Event successfully booked!");
        });
    });

    it('should handle booking submission error', async () => {
        const { insertEvent } = await import('../helpers/services/google_services');
        const { toast } = await import('sonner');
        // @ts-ignore
        const userEvent = (await import('@testing-library/user-event')).default;

        // Mock failure
        (insertEvent as any).mockRejectedValue(new Error("Booking failed"));

        render(
            <MemoryRouter>
                <Booking />
            </MemoryRouter>
        );

        // 1. Select Date
        await userEvent.click(screen.getByTestId('select-date-btn'));

        // 2. Select Time
        const slotBtn = await screen.findByText(/10:00/);
        await userEvent.click(slotBtn);

        // 3. Fill Details
        await userEvent.type(await screen.findByLabelText(/Name/i), 'Jane Doe');
        await userEvent.type(screen.getByLabelText(/Email/i), 'jane@example.com');
        await userEvent.type(screen.getByLabelText(/Information/i), 'Notes');

        // 4. Submit
        const submitBtn = screen.getByRole('button', { name: /whole_acidic_parrot_promise/i });
        await userEvent.click(submitBtn);

        // Verification
        await waitFor(() => {
            expect(insertEvent).toHaveBeenCalled();
            expect(toast.error).toHaveBeenCalledWith("Could not book event");
            expect(mockNavigate).not.toHaveBeenCalledWith('/booked', expect.any(Object));
        });
    });
});
