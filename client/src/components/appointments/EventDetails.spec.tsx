import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EventDetails } from './EventDetails';

const mockEvent = {
    title: "Team Meeting",
    start: new Date("2023-10-26T10:00:00Z"),
    end: new Date("2023-10-26T11:00:00Z"),
    description: "Discuss project updates",
    location: "Conference Room A",
    calendarColor: "#ff0000"
};

describe('EventDetails Component', () => {
    it('renders event details correctly', () => {
        render(<EventDetails event={mockEvent} onClose={vi.fn()} />);

        expect(screen.getByText('Team Meeting')).toBeInTheDocument();
        expect(screen.getByText('Calendar Event')).toBeInTheDocument();
        expect(screen.getByText('Discuss project updates')).toBeInTheDocument();
        expect(screen.getByText('Conference Room A')).toBeInTheDocument();
        // Date formatting test might depend on timezone, assuming local or UTC handled by component/test env.
        // It renders "EEEE, MMMM d, yyyy"
    });

    it('renders correct duration', () => {
        render(<EventDetails event={mockEvent} onClose={vi.fn()} />);
        expect(screen.getByText('Duration: 60 minutes')).toBeInTheDocument();
    });

    it('handles missing optional fields', () => {
        const minimalEvent = {
            title: "Quick Sync",
            start: new Date("2023-10-26T10:00:00Z"),
            end: new Date("2023-10-26T10:15:00Z")
        };
        render(<EventDetails event={minimalEvent} onClose={vi.fn()} />);

        expect(screen.getByText('Quick Sync')).toBeInTheDocument();
        expect(screen.queryByText('Location')).not.toBeInTheDocument();
        expect(screen.queryByText('Description')).not.toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', async () => {
        const onClose = vi.fn();
        render(<EventDetails event={mockEvent} onClose={onClose} />);

        // The close button is the one with the X icon in the header
        // It's in the header div with "flex items-start justify-between"
        // We can just find the button by role. There is only one button in this component.
        const closeButton = screen.getByRole('button');

        await userEvent.click(closeButton);
        expect(onClose).toHaveBeenCalled();
    });
});
