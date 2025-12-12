import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EventForm } from '../../components/EventForm';
import { EMPTY_EVENT, Event } from 'common';

// Mock dependencies
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'en' }
    })
}));

global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

describe('EventForm Reproduction', () => {
    it('should add a new empty slot when add button is clicked', async () => {
        const handleOnSubmit = vi.fn();
        const event: Event = { ...EMPTY_EVENT };
        // Ensure we have at least one day enabled so we can see the + button
        // Let's use Monday (index 1)
        event.available[1] = [{ start: '09:00', end: '17:00' }];

        render(<EventForm event={event} handleOnSubmit={handleOnSubmit} />);

        // Find the "Monday" section. 
        // We know from the code: "Jan 5, 2025 is a Sunday. Day enum is 0 for Sunday."
        // So Monday is Jan 6.
        // The component uses getDayName which returns short weekday.
        // Monday -> "Mon"

        const mondayLabel = screen.getByText('Mon');
        expect(mondayLabel).toBeInTheDocument();

        // The add button is in the same row.
        // We can find the button by looking for the Plus icon's parent button 
        // or just by role within the Monday container.
        // Given existing code structure, let's find the specific add button for Monday.
        // The structure is: 
        // Grid -> [Checkbox+Label] [Slots] [AddButton]

        // Let's create a more targeted selector or just try finding all add buttons and picking the one for Monday.
        // But since we only populated Monday, only Monday should have the Add button enabled (if logic holds).

        // Wait for potential effects
        await waitFor(() => expect(screen.getAllByDisplayValue(/09:00/)).toHaveLength(1));

        // Click the adding button.
        // The button has a Plus icon.
        // We can find by class mostly or try to narrow down.
        // Let's look for the button in the Monday row.
        // We can verify with a specific test-id if we added one, but we didn't.
        // Let's try to target the button near "Mon".

        const buttons = screen.getAllByRole('button');
        // Filter for the one that looks like the add button (has aria-label or just check usage).
        // The component has: <Button variant="ghost" size="icon" onClick={addSlot} ...> <Plus ... /> </Button>
        // It doesn't have a label.

        // Let's use the container structure.
        const mondayRow = mondayLabel.closest('.grid');
        expect(mondayRow).not.toBeNull();

        if (mondayRow) {
            // Actually, looking at the code uses `variant="ghost"`. Radix/shadcn usually puts specific classes.
            // Let's try to queryAllByRole('button') within the row.
            const rowButtons = mondayRow.querySelectorAll('button');
            // There might be delete buttons too.
            // The add button is the last col.
            const addButton = rowButtons[rowButtons.length - 1]; // Last button is Add (or Delete if no Add?)
            // Add button only shows if slots.length > 0.

            fireEvent.click(addButton);
        }

        // Now we expect 2 slots (so 4 time inputs: start/end for each)
        await waitFor(() => {
            // We can just count all inputs that look like time inputs or just all textboxes in the day row
            // But simpler: just check that we have more inputs than before.
            const inputs = screen.getAllByRole('textbox');
            // Initial was 2 inputs (start+end). New slot adds 2 more. Total 4.
            // Plus other form inputs? EventForm has Title, Desc etc.
            // Let's rely on class or structure if possible.
            // Or better: LocalizedTimeInput uses 'input' type='text'.

            // Let's filter by value empty (new slot)
            const emptyInputs = inputs.filter((i: any) => i.value === '');
            // New slot has start="" and end="". So at least 2 empty inputs.
            expect(emptyInputs.length).toBeGreaterThanOrEqual(2);
        });
    });
});
