
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Booking from './Booking';
import { MemoryRouter } from 'react-router-dom';
import * as userServices from '../helpers/services/user_services';
import * as eventServices from '../helpers/services/event_services';
import { IntervalSet } from 'common';
import { addDays, format, startOfDay } from 'date-fns';

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
    const fixedNow = new Date('2026-04-15T08:00:00.000Z'); // 2026-04-15 10:00 Europe/Berlin

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
        process.env.TZ = 'Europe/Berlin';
        vi.useFakeTimers({ shouldAdvanceTime: true });
        vi.setSystemTime(fixedNow);

        (userServices.getUserByUrl as any).mockResolvedValue({ data: mockUser });
        (userServices.getTransientUser as any).mockResolvedValue({ data: null });
        (eventServices.getEventByUrlAndUser as any).mockResolvedValue({ data: mockEvent });

        // Mock scrollIntoView
        Element.prototype.scrollIntoView = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
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

        const availableDayButton = document.querySelector<HTMLButtonElement>(
            `button[data-day="${format(tomorrow, 'yyyy-MM-dd')}"]`
        );

        expect(availableDayButton).toBeInTheDocument();
        expect(availableDayButton).toHaveClass('font-bold');
        expect(availableDayButton).not.toBeDisabled();

        // Check that a day WITHOUT slots is NOT bold
        // addDays(today, 2) has no slots mocked
        const day2 = addDays(today, 2);
        const unavailableDayButton = document.querySelector<HTMLButtonElement>(
            `button[data-day="${format(day2, 'yyyy-MM-dd')}"]`
        );

        expect(unavailableDayButton).toBeInTheDocument();
        expect(unavailableDayButton).toBeDisabled();
    });
});
