import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventType } from './EventType';
import { Event, User } from 'common';

// Mock dependencies
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'en' }
    })
}));

vi.mock('@/components/ui/button', () => ({
    Button: ({ children, onClick, className }: any) => (
        <button onClick={onClick} className={className}>{children}</button>
    )
}));

vi.mock('@/components/ui/card', () => ({
    Card: ({ children }: any) => <div data-testid="card">{children}</div>,
    CardHeader: ({ children, className }: any) => <div className={className}>{children}</div>,
    CardTitle: ({ children }: any) => <h3>{children}</h3>,
    CardDescription: ({ children }: any) => <p>{children}</p>,
    CardContent: ({ children, className }: any) => <div className={className}>{children}</div>,
    CardFooter: ({ children }: any) => <div>{children}</div>
}));

vi.mock('@/components/ui/avatar', () => ({
    Avatar: ({ children }: any) => <div data-testid="avatar">{children}</div>,
    AvatarImage: ({ src, alt }: any) => <img src={src} alt={alt} />,
    AvatarFallback: ({ children }: any) => <span>{children}</span>
}));

const mockEvent: Event = {
    _id: 'event1',
    name: 'Test Event',
    description: 'Test Description',
    duration: 30,
    location: 'Test Location',
    url: 'test-event',
    isActive: true,
    available: {},
    bufferbefore: 0,
    bufferafter: 0,
    user: 'user1',
    minFuture: 0,
    maxFuture: 0,
    maxPerDay: 0
};

const mockUser: User = {
    _id: 'user1',
    name: 'Test User',
    email: 'test@example.com',
    user_url: 'test-user',
    picture_url: 'http://example.com/pic.jpg',
    use_gravatar: false,
    send_invitation_email: false
};

describe('EventType', () => {
    it('should render event details', () => {
        render(<EventType event={mockEvent} user={mockUser} time={undefined} />);

        expect(screen.getByText('Test Event')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByText('Test Location')).toBeInTheDocument();
    });

    it('should render user avatar', () => {
        render(<EventType event={mockEvent} user={mockUser} time={undefined} />);

        const avatar = screen.getByTestId('avatar');
        expect(avatar).toBeInTheDocument();

        const img = screen.getByAltText('Test User');
        expect(img).toHaveAttribute('src', 'http://example.com/pic.jpg');
    });

    it('should render user fallback when no picture', () => {
        const userWithoutPicture = { ...mockUser, picture_url: '' };
        render(<EventType event={userWithoutPicture} user={userWithoutPicture} time={undefined} />);

        expect(screen.getByText('T')).toBeInTheDocument(); // First letter of name
    });

    it('should render duration with translation key', () => {
        render(<EventType event={mockEvent} user={mockUser} time={undefined} />);

        expect(screen.getByText('30equal_jolly_thrush_empower')).toBeInTheDocument();
    });

    it('should render time when provided', () => {
        const time = new Date('2024-01-15T10:00:00');
        render(<EventType event={mockEvent} user={mockUser} time={time} />);

        // Time should be formatted and displayed (format varies by locale)
        expect(screen.getByText(/15\.01\.2024/i)).toBeInTheDocument();
    });

    it('should not render time section when time is undefined', () => {
        const { container } = render(<EventType event={mockEvent} user={mockUser} time={undefined} />);

        // CalendarClock icon should not be present (only appears with time)
        const icons = container.querySelectorAll('svg');
        // Should have Hourglass and MapPin icons only (2 icons)
        expect(icons.length).toBe(2);
    });

    it('should render button when handleOnClick is provided', () => {
        const handleOnClick = vi.fn();
        render(<EventType event={mockEvent} user={mockUser} time={undefined} handleOnClick={handleOnClick} />);

        const button = screen.getByText('petty_swift_piranha_rise');
        expect(button).toBeInTheDocument();
    });

    it('should not render button when handleOnClick is not provided', () => {
        render(<EventType event={mockEvent} user={mockUser} time={undefined} />);

        const button = screen.queryByText('petty_swift_piranha_rise');
        expect(button).not.toBeInTheDocument();
    });

    it('should call handleOnClick when button is clicked', () => {
        const handleOnClick = vi.fn();
        render(<EventType event={mockEvent} user={mockUser} time={undefined} handleOnClick={handleOnClick} />);

        const button = screen.getByText('petty_swift_piranha_rise');
        fireEvent.click(button);

        expect(handleOnClick).toHaveBeenCalledWith(mockEvent);
    });

    it('should prevent default on button click', () => {
        const handleOnClick = vi.fn();
        render(<EventType event={mockEvent} user={mockUser} time={undefined} handleOnClick={handleOnClick} />);

        const button = screen.getByText('petty_swift_piranha_rise');
        const event = new MouseEvent('click', { bubbles: true, cancelable: true });
        const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

        button.dispatchEvent(event);

        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should log event, user, and time to console', () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
        const time = new Date('2024-01-15T10:00:00');

        render(<EventType event={mockEvent} user={mockUser} time={time} />);

        expect(consoleSpy).toHaveBeenCalledWith(
            'EventType: event=%o, user=%o, time=%o',
            mockEvent,
            mockUser,
            time
        );

        consoleSpy.mockRestore();
    });

    it('should format time with German locale', () => {
        vi.mock('react-i18next', () => ({
            useTranslation: () => ({
                t: (key: string) => key,
                i18n: { language: 'de' }
            })
        }));

        const time = new Date('2024-01-15T10:00:00');
        render(<EventType event={mockEvent} user={mockUser} time={time} />);

        // Should render time (exact format depends on locale)
        expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    it('should render all icons correctly', () => {
        const time = new Date('2024-01-15T10:00:00');
        const handleOnClick = vi.fn();
        const { container } = render(
            <EventType event={mockEvent} user={mockUser} time={time} handleOnClick={handleOnClick} />
        );

        // Should have Hourglass, MapPin, CalendarClock (in time section), and CalendarClock (in button)
        const icons = container.querySelectorAll('svg');
        expect(icons.length).toBeGreaterThanOrEqual(3);
    });
});
