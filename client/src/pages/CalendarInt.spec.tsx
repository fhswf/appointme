
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import CalendarIntegration from './CalendarInt';
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from '../components/PrivateRoute';
import * as googleServices from '../helpers/services/google_services';
import * as caldavServices from '../helpers/services/caldav_services';
import * as userServices from '../helpers/services/user_services';

// Mock dependencies
vi.mock('../components/AppNavbar', () => ({ default: () => <div data-testid="app-navbar" /> }));
vi.mock('../components/ErrorBoundary', () => ({ default: ({ children }) => <div>{children}</div> }));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

vi.mock('../helpers/services/google_services');
vi.mock('../helpers/services/caldav_services');
vi.mock('../helpers/services/user_services');
vi.mock('../helpers/helpers', () => ({
    signout: vi.fn()
}));
vi.mock('@/components/ui/checkbox', () => ({
    Checkbox: ({ checked, onCheckedChange, ...props }) => (
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
            {...props}
        />
    )
}));

vi.mock('@radix-ui/react-checkbox', () => ({
    Root: vi.fn(),
    Indicator: vi.fn(),
}));

// Mock both relative and alias imports to be sure
vi.mock('../components/ui/checkbox', () => ({
    Checkbox: ({ checked, onCheckedChange, ...props }) => (
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
            {...props}
        />
    )
}));

vi.mock('@/components/ui/checkbox', () => ({
    Checkbox: ({ checked, onCheckedChange, ...props }) => (
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
            {...props}
        />
    )
}));

describe('CalendarIntegration Page', () => {
    const mockUser = {
        _id: 'user1',
        name: 'Test User',
        email: 'test@example.com',
        pull_calendars: [],
        push_calendar: null,
        google_tokens: { access_token: 'token' }
    };

    const mockCalendarList = {
        data: {
            data: {
                items: [
                    { id: 'cal1', summary: 'Google Calendar 1', primary: true }
                ]
            }
        }
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (googleServices.getCalendarList as any).mockResolvedValue(mockCalendarList);
        (googleServices.getAuthUrl as any).mockResolvedValue({ data: { success: true, url: 'http://auth' } });
        (caldavServices.listAccounts as any).mockResolvedValue({ data: [] });
        (userServices.updateUser as any).mockResolvedValue({});
    });

    it('should render and fetch calendars', async () => {
        render(
            <MemoryRouter>
                <UserContext.Provider value={{ user: mockUser } as any}>
                    <CalendarIntegration />
                </UserContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByTestId('app-navbar')).toBeInTheDocument();
        await waitFor(() => {
            expect(googleServices.getCalendarList).toHaveBeenCalled();
        });

        expect(screen.getByText('pink_loose_cougar_grin')).toBeInTheDocument(); // Title translation key
    });

    it('should open CalDAV dialog and add account', async () => {
        (caldavServices.addAccount as any).mockResolvedValue({});
        (caldavServices.listAccounts as any).mockResolvedValue({ data: [] });

        render(
            <MemoryRouter>
                <UserContext.Provider value={{ user: mockUser } as any}>
                    <CalendarIntegration />
                </UserContext.Provider>
            </MemoryRouter>
        );

        const addButton = screen.getByTestId('add-caldav-button');
        fireEvent.click(addButton);

        expect(screen.getByRole('heading', { name: 'Add CalDav Account' })).toBeInTheDocument();

        fireEvent.change(screen.getByTestId('caldav-name'), { target: { value: 'My CalDAV' } });
        fireEvent.change(screen.getByTestId('caldav-server-url'), { target: { value: 'http://caldav' } });
        fireEvent.change(screen.getByTestId('caldav-username'), { target: { value: 'user' } });
        fireEvent.change(screen.getByTestId('caldav-password'), { target: { value: 'pass' } });

        // Check privacy ack
        // The checkbox from shadcn/ui might be tricky to click by label or role, let's try finding by testid or role
        // Check privacy ack
        // Assuming the last one is privacy-ack or use testid if available. 
        // I added data-testid="caldav-privacy-ack" in previous diffs for user, but I am writing fresh here.
        // Wait, did I edit CalendarInt before? Yes, I added test-ids in step 24-28!

        const privacyCheckbox = screen.getByTestId('caldav-privacy-ack');
        fireEvent.click(privacyCheckbox);

        const saveButton = screen.getByText('Add');
        expect(saveButton).toBeEnabled();
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(caldavServices.addAccount).toHaveBeenCalledWith('http://caldav', 'user', 'pass', 'My CalDAV');
        });
    });

    it('should list and remove CalDAV accounts', async () => {
        const accounts = [{ _id: 'acc1', name: 'Existing Account' }];
        (caldavServices.listAccounts as any).mockResolvedValue({ data: accounts });
        (caldavServices.removeAccount as any).mockResolvedValue({});
        // Fix: listCalendars must return an array
        (caldavServices.listCalendars as any).mockResolvedValue({ data: [] });

        render(
            <MemoryRouter>
                <UserContext.Provider value={{ user: mockUser } as any}>
                    <CalendarIntegration />
                </UserContext.Provider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Existing Account')).toBeInTheDocument();
        });

        // Find delete button
        // It's a ghost button with Trash2 icon. It might not have testid.
        // "caldav-remove-acc1" would be ideal but it's not in code.
        // We can find by parent.
        // Button variant="ghost" size="icon" onClick={() => handleRemove(acc._id)}
        // Let's assume it's the only ghost button in that section?

        // Actually, listing accounts renders:
        // <span>{acc.name}</span> <Button ...>

        // I can just click the button near the text.
        const removeButton = screen.getByText('Existing Account').nextElementSibling;
        if (removeButton) {
            fireEvent.click(removeButton);
        }

        await waitFor(() => {
            expect(caldavServices.removeAccount).toHaveBeenCalledWith('acc1');
        });
    });
});
