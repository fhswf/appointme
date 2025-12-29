import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AppointmentDetails } from './AppointmentDetails';
import { Appointment, Event } from 'common';

const mockAppointment: Appointment = {
    _id: "app1",
    start: new Date("2023-10-26T10:00:00Z"),
    end: new Date("2023-10-26T10:30:00Z"),
    attendeeName: "John Doe",
    attendeeEmail: "john@example.com",
    description: "Looking forward to it",
    location: "Zoom",
    event: "evt1"
};

const mockEvent: Event = {
    _id: "evt1",
    name: "Consultation",
    description: "A 30 min consultation",
    owner: "user1",
    duration: 30,
    isActive: true
};

describe('AppointmentDetails Component', () => {
    it('renders appointment details correctly', () => {
        render(
            <AppointmentDetails
                appointment={mockAppointment}
                event={mockEvent}
                onClose={vi.fn()}
            />
        );

        expect(screen.getByText('Consultation')).toBeInTheDocument();
        expect(screen.getByText('A 30 min consultation')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
        expect(screen.getByText('Looking forward to it')).toBeInTheDocument();
        expect(screen.getByText('Zoom')).toBeInTheDocument();
    });

    it('renders default title if event name is missing', () => {
        render(
            <AppointmentDetails
                appointment={mockAppointment}
                onClose={vi.fn()}
            />
        );
        expect(screen.getByText('Appointment')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', async () => {
        const onClose = vi.fn();
        render(
            <AppointmentDetails
                appointment={mockAppointment}
                event={mockEvent}
                onClose={onClose}
            />
        );

        // There might be multiple close buttons if X icon is used elsewhere, so be specific or use closest
        // The X icon is in a button
        const closeButtons = screen.getAllByRole('button');
        // The X button is likely the last one or identified by icon. 
        // Let's rely on the fact that it is a button with an X icon.
        // Or finding by 'Details' header and then finding the button.

        // Easier: render passes, let's just click the button that likely closes it.
        // We can inspect the code: <X className="h-5 w-5" /> is inside a button.
        // It's the 3rd button in the header if onEdit and onDelete are present.

        // Let's use specific queries if possible, but for now getting by role button is ok if we check which one.
        // The component has a "Details" header and buttons next to it.

        // Let's try to find it by the close icon if we can match element, but simply firing event on the button containing X is good.
        // Since we can't easily select by icon, let's assume it's the one without text.

        // Actually, we can check for an aria-label if it existed, but it doesn't. 
        // We can try adding aria-label in a future refactor.
        // For now, let's try finding the button that calls onClose.
        // We can just click the button that looks like a close button (last one in header).

        const closeButton = closeButtons[closeButtons.length - 1]; // usually the last one in the header group if no footer actions?
        // Wait, there is a footer action button too "Reschedule Appointment".
        // The header buttons are inside a div with class "flex gap-2".

        // Let's use a more robust way:
        const header = screen.getByText('Details').closest('div');
        const headerButtons = header?.querySelectorAll('button');
        const closeBtn = headerButtons ? headerButtons[headerButtons.length - 1] : null;

        if (closeBtn) {
            await userEvent.click(closeBtn);
            expect(onClose).toHaveBeenCalled();
        } else {
            throw new Error("Close button not found");
        }
    });

    it('calls onDelete when delete button is clicked', async () => {
        const onDelete = vi.fn();
        render(
            <AppointmentDetails
                appointment={mockAppointment}
                event={mockEvent}
                onClose={vi.fn()}
                onDelete={onDelete}
            />
        );

        const header = screen.getByText('Details').closest('div');
        // With onDelete, the buttons are [Edit?, Delete, Close] logic.
        // Logic: Edit (if onEdit), Delete (if onDelete), Close.
        // We pass onDelete but not onEdit here. So [Delete, Close].
        // Delete should be the first one.

        const headerButtons = header?.querySelectorAll('button');
        const deleteBtn = headerButtons ? headerButtons[0] : null; // First one since onEdit is undefined

        if (deleteBtn) {
            await userEvent.click(deleteBtn);
            expect(onDelete).toHaveBeenCalledWith(mockAppointment._id);
        } else {
            throw new Error("Delete button not found");
        }
    });
});
