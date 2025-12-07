
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Booking from './Booking';
import { MemoryRouter } from 'react-router-dom';
import * as userServices from '../helpers/services/user_services';
import * as eventServices from '../helpers/services/event_services';
import * as googleServices from '../helpers/services/google_services';
import { Day, IntervalSet } from 'common';

// Mock dependencies
vi.mock('../helpers/services/user_services');
vi.mock('../helpers/services/event_services');
vi.mock('../helpers/services/google_services');
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { t: (key: string) => key }
    }),
}));

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
            { start: new Date('2025-12-08T10:00:00'), end: new Date('2025-12-08T10:30:00') }
        ]
    };


    beforeEach(() => {
        vi.clearAllMocks();
        (userServices.getUserByUrl as any).mockResolvedValue({ data: mockUser });
        (eventServices.getEventByUrlAndUser as any).mockResolvedValue({ data: mockEvent });
        // @ts-ignore
        (eventServices.getAvailableTimes as any).mockResolvedValue(mockSlotsImpl);
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

        expect(screen.getByText('Schedule an appointment')).toBeInTheDocument();
        // Check for step titles
        expect(screen.getByText('Choose date')).toBeInTheDocument();
        expect(screen.getByText('Choose time')).toBeInTheDocument();
        expect(screen.getByText('Provide details')).toBeInTheDocument();
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

    // TODO: Add interaction tests (clicking next) to verify stepper logic
    // This requires more complex mocking of the Calendar and DayPicker interaction
});
