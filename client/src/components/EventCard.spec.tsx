import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EventCard } from './EventCard';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'sonner';
import { EMPTY_EVENT } from 'common';

// Mock clipboard
Object.assign(navigator, {
    clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
    },
});

// Mock dependencies
vi.mock('../helpers/services/event_services', () => ({
    deleteEvent: vi.fn().mockResolvedValue({ data: { success: true } }),
}));

vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

const mockEvent = {
    ...EMPTY_EVENT,
    _id: '1',
    name: 'Test Event',
    duration: 30,
    isActive: true,
    url: 'test-event',
    description: 'Test Description',
    location: 'Test Location',

    bufferbefore: 0,
    bufferafter: 0,
    user: 'user1',
    minFuture: 0,
    maxFuture: 0,
    maxPerDay: 0,
    tags: ['Tag1', 'Tag2']
};

describe('EventCard Component', () => {
    const mockSetActive = vi.fn();
    const mockOnDelete = vi.fn();

    it('should render event details', () => {
        render(
            <BrowserRouter>
                <EventCard
                    event={mockEvent}
                    url="test-user"
                    hasCalendar={true}
                    setActive={mockSetActive}
                    onDelete={mockOnDelete}
                />
            </BrowserRouter>
        );

        expect(screen.getByText('Test Event')).toBeInTheDocument();
        expect(screen.getByText('30 min')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByText('Tag1')).toBeInTheDocument();
        expect(screen.getByText('Tag2')).toBeInTheDocument();
    });

    it('should toggle active state', () => {
        render(
            <BrowserRouter>
                <EventCard
                    event={mockEvent}
                    url="test-user"
                    hasCalendar={true}
                    setActive={mockSetActive}
                    onDelete={mockOnDelete}
                />
            </BrowserRouter>
        );

        const switchEl = screen.getByTestId('active-switch');
        fireEvent.click(switchEl);

        expect(mockSetActive).toHaveBeenCalledWith(mockEvent, false);
    });

    it('should copy link to clipboard', async () => {
        render(
            <BrowserRouter>
                <EventCard
                    event={mockEvent}
                    url="test-user"
                    hasCalendar={true}
                    setActive={mockSetActive}
                    onDelete={mockOnDelete}
                />
            </BrowserRouter>
        );

        const copyButton = screen.getByTestId('copy-link-button');
        fireEvent.click(copyButton);

        expect(navigator.clipboard.writeText).toHaveBeenCalled();
        // Wait for promise resolution
        await new Promise(process.nextTick);
        expect(toast.success).toHaveBeenCalledWith('link_copied_to_clipboard');
    });

    it('should call onDelete when delete button clicked', () => {
        render(
            <BrowserRouter>
                <EventCard
                    event={mockEvent}
                    url="test-user"
                    hasCalendar={true}
                    setActive={mockSetActive}
                    onDelete={mockOnDelete}
                />
            </BrowserRouter>
        );

        const deleteButton = screen.getByTestId('delete-event-button');
        fireEvent.click(deleteButton);

        expect(mockOnDelete).toHaveBeenCalledWith(mockEvent);
    });

    it('should display Student Only badge for student events', () => {
        const studentEvent = {
            ...mockEvent,
            allowed_roles: ['student']
        };

        render(
            <BrowserRouter>
                <EventCard
                    event={studentEvent}
                    url="test-user"
                    hasCalendar={true}
                    setActive={mockSetActive}
                    onDelete={mockOnDelete}
                />
            </BrowserRouter>
        );

        expect(screen.getByText('Student Only')).toBeInTheDocument();
    });
});

