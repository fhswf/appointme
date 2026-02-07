
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Booking from './Booking';
import { MemoryRouter } from 'react-router-dom';
import * as userServices from '../helpers/services/user_services';
import * as eventServices from '../helpers/services/event_services';
import { IntervalSet } from 'common';
import { addDays, startOfDay, endOfDay } from 'date-fns';

// Mock dependencies
vi.mock('../helpers/services/user_services');
vi.mock('../helpers/services/event_services');
vi.mock('../helpers/services/google_services');
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            t: (key: string) => key,
            language: 'en',
            changeLanguage: () => { }
        }
    }),
}));

vi.mock('sonner', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn()
    }
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useParams: () => ({ user_url: 'test-user', url: 'test-event' }),
        useNavigate: () => mockNavigate
    };
});

describe('Booking Page Reproduction', () => {
    const mockUser = {
        _id: 'user1',
        name: 'Test User',
        user_url: 'test-user',
        email: 'test@example.com'
    };

    const mockEvent = {
        _id: 'event1',
        url: 'test-event',
        name: 'Test Event',
        duration: 30,
        isActive: true,
        available: true,
        // We set available to true to trigger the auto-selection logic
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Set timezone to Europe/Berlin for consistent testing
        process.env.TZ = 'Europe/Berlin';

        (userServices.getUserByUrl as any).mockResolvedValue({ data: mockUser });
        (userServices.getTransientUser as any).mockResolvedValue({ data: null });
        (eventServices.getEventByUrlAndUser as any).mockResolvedValue({ data: mockEvent });

        // Mock scrollIntoView
        Element.prototype.scrollIntoView = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should automatically select the first available date', async () => {
        const today = startOfDay(new Date());
        const tomorrow = addDays(today, 1);

        // Setup slots for tomorrow
        const slotStart = new Date(tomorrow);
        slotStart.setHours(10, 0, 0, 0);
        const slotEnd = new Date(slotStart);
        slotEnd.setHours(11, 0, 0, 0);

        const mockSlots = new IntervalSet();
        mockSlots.push({ start: slotStart, end: slotEnd });

        (eventServices.getAvailableTimes as any).mockResolvedValue({
            slots: mockSlots,
            message: undefined
        });

        render(
            <MemoryRouter>
                <Booking />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(eventServices.getEventByUrlAndUser).toHaveBeenCalled();
            expect(eventServices.getAvailableTimes).toHaveBeenCalled();
        });

        // If auto-selected, "Available Times" should be visible
        // And the slots for that day should be rendered
        expect(await screen.findByText('Available Times')).toBeInTheDocument();

        // Check if the slot button is present
        // The slot time is 10:00. In 'en' locale it might be "10:00 AM" depending on implementation
        // The code uses format(time, "p")
        // Just checking for button existence is good enough for now, or text match
        const buttons = screen.getAllByRole('button');
        const timeButton = buttons.find(b => b.textContent?.includes('10:00'));
        expect(timeButton).toBeInTheDocument();
    });

    it('should highlight available dates in the calendar', async () => {
        const today = startOfDay(new Date());
        const tomorrow = addDays(today, 1);

        // Setup slots for tomorrow
        const slotStart = new Date(tomorrow);
        slotStart.setHours(10, 0, 0, 0);
        const slotEnd = new Date(slotStart);
        slotEnd.setHours(11, 0, 0, 0);

        const mockSlots = new IntervalSet();
        mockSlots.push({ start: slotStart, end: slotEnd });

        (eventServices.getAvailableTimes as any).mockResolvedValue({
            slots: mockSlots,
            message: undefined
        });

        render(
            <MemoryRouter>
                <Booking />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(eventServices.getAvailableTimes).toHaveBeenCalled();
            expect(screen.getByText('Available Times')).toBeInTheDocument();
        });

        // Find the date element for tomorrow
        // Calendar usually renders buttons for dates.
        // We need to look for the button that corresponds to 'tomorrow' day number.
        // And check if it has 'font-bold' class.
        // Note: Use a more specific selector if possible, e.g. within the calendar container.

        // Since we don't have easy aria-label mocking for current date, 
        // let's try to find the button by day number.
        // Check if "font-bold" is applied to any button in the calendar grid (except nav buttons)
        // This is a bit loose but confirms *some* highlighting is happening.
        // A better way:
        const dayNumber = tomorrow.getDate().toString();

        // Find by text, ensuring it is a button (day picker days are buttons)
        // We use getAll because there might be previous/next month days with same number shown
        // But the one in current month should likely be the first or we can check aria-current or similar if selected.
        // Or simplified: just check if ANY button with that number has the class.

        const dayButtons = screen.getAllByText(dayNumber, { selector: 'button' });

        const boldButton = dayButtons.find(btn => btn.className.includes('font-bold'));

        expect(boldButton).toBeInTheDocument();
        expect(boldButton).toHaveClass('font-bold');

        // Check that a day WITHOUT slots is NOT bold
        // addDays(today, 2) has no slots mocked
        const day2 = addDays(today, 2);
        const day2Number = day2.getDate().toString();
        const day2Buttons = screen.getAllByText(day2Number, { selector: 'button' });
        // Assuming the one in current month is found (or just check all)
        // We expect NO button for this day to have font-bold, OR specifically the enabled one.
        // Since it's disabled, it might have 'font-normal'.

        // Let's check the first one found (simpler)
        if (day2Buttons.length > 0) {
            const btn = day2Buttons[0];
            // It should NOT have font-bold, or should have font-normal if we apply that class explicitly.
            // Tailwind font-bold sets font-weight: 700. font-normal sets 400.
            // If we apply both without precedence, one wins. 
            // Ideally we want to ensure 'font-bold' class is NOT present or overridden.
            // But since we put 'font-bold' roughly in the class string, it IS present in the class list string.
            // We need to check if 'font-normal' is ALSO present (and presumably winning due to specificity logic or order).
            // Actually, testing-library `toHaveClass` just checks string presence.
            // So if we have `font-bold disabled:font-normal`, the string `font-bold` is still there!

            // We can check if `disabled:font-normal` or `aria-disabled:font-normal` is present.
            // Or better, check computed style? Vitest/jsdom computed style for pseudo-classes is tricky.

            // Wait, if `disabled:font-normal` is applied, the class string contains "disabled:font-normal". 
            // It is hard to verify "visual boldness" in unit test without computed styles on pseudo-states.

            // However, ensuring the CLASS is present is a good start.
            expect(btn).toHaveClass('aria-disabled:font-normal');
            // And we can also add 'disabled:font-normal' to the expectations if we add it to code.
        }
    });
});
