import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PublicEventCard } from './PublicEventCard';
import { EMPTY_EVENT } from 'common';

// Mock dependencies
vi.mock('@/components/ui/button', () => ({
    buttonVariants: () => 'btn-variant',
    Button: ({ children, onClick, ...props }: any) => (
        <button onClick={onClick} {...props}>{children}</button>
    )
}));

vi.mock('../lib/utils', () => ({
    cn: (...args: any[]) => args.join(' ')
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key
    })
}));

const mockEvent = {
    ...EMPTY_EVENT,
    _id: '1',
    name: 'Public Event',
    duration: 60,
    isActive: true,
    url: 'public-event',
    description: 'Public Description',
    location: 'Online',
    tags: ['PublicTag']
};

describe('PublicEventCard', () => {
    it('should render event details', () => {
        render(<PublicEventCard event={mockEvent} onClick={vi.fn()} />);

        expect(screen.getByText('Public Event')).toBeInTheDocument();
        expect(screen.getByText('60 minutes')).toBeInTheDocument();
        expect(screen.getByText('Public Description')).toBeInTheDocument();
        expect(screen.getByText('PublicTag')).toBeInTheDocument();
    });

    it('should call onClick when clicked', () => {
        const handleClick = vi.fn();
        render(<PublicEventCard event={mockEvent} onClick={handleClick} />);

        const card = screen.getByRole('button'); // The whole card is a button
        fireEvent.click(card);

        expect(handleClick).toHaveBeenCalledWith(mockEvent);
    });

    it('should render correct location or default', () => {
        render(<PublicEventCard event={{ ...mockEvent, location: '' }} onClick={vi.fn()} />);
        expect(screen.getByText('Online Meeting')).toBeInTheDocument();
    });

    it('should use index for styling', () => {
        const { container } = render(<PublicEventCard event={mockEvent} onClick={vi.fn()} index={1} />);
        // Checking for class names related to index 1 (emerald)
        // GRADIENTS[1] = "from-emerald-500 to-teal-500"
        expect(container.innerHTML).toContain('from-emerald-500');
    });
});
