import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CalendarSettings } from './CalendarSettings';
import { MemoryRouter } from 'react-router-dom';
import * as router from 'react-router-dom';
import { UserContext } from '../components/PrivateRoute';
import * as googleServices from '../helpers/services/google_services';
import * as caldavServices from '../helpers/services/caldav_services';
import * as userServices from '../helpers/services/user_services';
import { useAuth } from '../components/AuthProvider';

// Mock dependencies
vi.mock('../components/AuthProvider');
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


vi.mock('@radix-ui/react-checkbox', () => ({
    Root: vi.fn(),
    Indicator: vi.fn(),
}));

// Mock both relative and alias imports to be sure
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

const navigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => navigate,
    };
});

describe('CalendarSettings Component', () => {
    const mockUser = {
        _id: 'user1',
        name: 'Test User',
        email: 'test@example.com',
        pull_calendars: [],
        push_calendars: [],
        push_calendar: null,
        google_tokens: { access_token: 'token' }
    };

    const mockCalendarList = {
        data: {
            data: {
                items: [
                    { id: 'cal1', summary: 'Google Calendar 1', primary: false }
                ]
            }
        }
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (googleServices.getCalendarList as any).mockResolvedValue(mockCalendarList);
        (googleServices.getAuthUrl as any).mockResolvedValue({ data: { success: true, url: 'http://auth' } });
        (caldavServices.listAccounts as any).mockResolvedValue({ data: [] });
        (userServices.updateUser as any).mockResolvedValue({ data: mockUser });
        const currentMockUser = { ...mockUser, pull_calendars: [], push_calendars: [] };
        (useAuth as any).mockImplementation(() => ({
            user: currentMockUser,
            refreshAuth: vi.fn(),
            setUser: vi.fn()
        }));
    });

    it('should render and fetch calendars', async () => {
        render(
            <MemoryRouter>
                <UserContext.Provider value={{ user: mockUser } as any}>
                    <CalendarSettings />
                </UserContext.Provider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(googleServices.getCalendarList).toHaveBeenCalled();
            expect(googleServices.getAuthUrl).not.toHaveBeenCalled();
        });

        // AppNavbar is not in CalendarSettings, so we verify specific content
        // expect(screen.getByText('pink_loose_cougar_grin')).toBeInTheDocument(); 
        // Title 'pink_loose_cougar_grin' is in CalendarInt page, NOT in CalendarSettings.
        // CalendarSettings has 'Add CalDav Account' button or similar.
    });

    it('should open CalDAV dialog and add account', async () => {
        (caldavServices.addAccount as any).mockResolvedValue({});
        (caldavServices.listAccounts as any).mockResolvedValue({ data: [] });

        render(
            <MemoryRouter>
                <UserContext.Provider value={{ user: mockUser } as any}>
                    <CalendarSettings />
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
        fireEvent.change(screen.getByTestId('caldav-email'), { target: { value: 'user@example.com' } });

        const privacyCheckbox = screen.getByTestId('caldav-privacy-ack');
        fireEvent.click(privacyCheckbox);

        const saveButton = screen.getByText('Add');
        expect(saveButton).toBeEnabled();
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(caldavServices.addAccount).toHaveBeenCalledWith('http://caldav', 'user', 'pass', 'My CalDAV', 'user@example.com');
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
                    <CalendarSettings />
                </UserContext.Provider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Existing Account')).toBeInTheDocument();
        });

        const accountName = screen.getByText('Existing Account');
        // closest row container
        const row = accountName.closest('.border');
        const removeButton = row?.querySelector('button');

        if (removeButton) {
            fireEvent.click(removeButton);
        }

        await waitFor(() => {
            expect(caldavServices.removeAccount).toHaveBeenCalledWith('acc1');
        });
    });

    it('should update push calendar', async () => {
        render(
            <MemoryRouter>
                <div id="root">
                    <CalendarSettings />
                </div>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('edit-push-calendar')).toBeInTheDocument();
        });

        // Open Dialog
        const editBtn = screen.getByTestId('edit-push-calendar');
        await userEvent.click(editBtn);

        // Dialog opens
        expect(screen.getAllByText('Calendar')).toHaveLength(1); // Dialog title only

        // Select a calendar (assuming mocked list has items)
        // Mock list has 'Google Calendar 1' (id: cal1)
        const checkbox = screen.getByLabelText('Google Calendar 1');
        await userEvent.click(checkbox);
        await waitFor(() => {
            expect(checkbox).toBeChecked();
        });

        const saveBtn = screen.getByTestId('button-save');
        await userEvent.click(saveBtn);

        await waitFor(() => {
            expect(userServices.updateUser).toHaveBeenCalledWith(expect.objectContaining({
                push_calendars: ['cal1']
            }));
        });
    });

    it('should update pull calendars', async () => {
        render(
            <MemoryRouter>
                <UserContext.Provider value={{ user: mockUser } as any}>
                    <CalendarSettings />
                </UserContext.Provider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('edit-pull-calendar')).toBeInTheDocument();
        });

        const editBtn = screen.getByTestId('edit-pull-calendar');
        fireEvent.click(editBtn);

        const checkbox = screen.getByLabelText('Google Calendar 1');
        fireEvent.click(checkbox); // Toggle it

        const saveBtn = screen.getByText('factual_nimble_snail_clap');
        fireEvent.click(saveBtn);

        await waitFor(() => {
            expect(userServices.updateUser).toHaveBeenCalled();
        });
    });

    it('should handle partial failure when listing calendars', async () => {
        const accounts = [{ _id: 'acc1', name: 'Broken Account' }];
        (caldavServices.listAccounts as any).mockResolvedValue({ data: accounts });
        (caldavServices.listCalendars as any).mockRejectedValue(new Error('Network Error'));

        render(
            <MemoryRouter>
                <UserContext.Provider value={{ user: mockUser } as any}>
                    <CalendarSettings />
                </UserContext.Provider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Broken Account')).toBeInTheDocument();
            expect(screen.getByText(/Failed to load calendars for/)).toBeInTheDocument();
        });
    });

    it('should fetch auth url if calendar list fails with 401', async () => {
        (googleServices.getCalendarList as any).mockRejectedValue({ response: { status: 401 } });

        render(
            <MemoryRouter>
                <UserContext.Provider value={{ user: mockUser } as any}>
                    <CalendarSettings />
                </UserContext.Provider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(googleServices.getAuthUrl).toHaveBeenCalled();
        });
    });



    it('should handle multiple calendars, save without redirect, and close', async () => {
        navigate.mockClear();

        const googleCals = {
            data: {
                data: {
                    items: [
                        { id: 'google1', summary: 'Google', primary: false }
                    ]
                }
            }
        };
        (googleServices.getCalendarList as any).mockResolvedValue(googleCals);

        const accounts = [{ _id: 'acc1', name: 'CalDAV Account' }];
        (caldavServices.listAccounts as any).mockResolvedValue({ data: accounts });

        // Mock listCalendars for the account
        (caldavServices.listCalendars as any).mockResolvedValue({
            data: [{ id: 'caldav1', summary: 'CalDAV' }]
        });

        render(
            <MemoryRouter>
                <UserContext.Provider value={{ user: mockUser } as any}>
                    <CalendarSettings />
                </UserContext.Provider>
            </MemoryRouter>
        );

        // Wait for both calendars to be loaded
        await waitFor(() => {
            expect(screen.getByTestId('edit-pull-calendar')).toBeInTheDocument();
        });

        // Check for step titles


        // Open Pull Calendars dialog
        fireEvent.click(screen.getByTestId('edit-pull-calendar'));

        // Check if both calendars are listed
        await waitFor(() => {
            expect(screen.getByText('Google')).toBeInTheDocument();
            expect(screen.getByText('CalDAV')).toBeInTheDocument();
        });

        // Select both
        const googleCheckbox = screen.getByLabelText('Google');
        const caldavCheckbox = screen.getByLabelText('CalDAV');

        // Assuming undefined start state or empty
        if (!(googleCheckbox as HTMLInputElement).checked) fireEvent.click(googleCheckbox);
        if (!(caldavCheckbox as HTMLInputElement).checked) fireEvent.click(caldavCheckbox);

        // Click Save
        const saveBtn = screen.getByText('factual_nimble_snail_clap'); // "Save" key
        fireEvent.click(saveBtn);

        await waitFor(() => {
            expect(userServices.updateUser).toHaveBeenCalledWith(expect.objectContaining({
                pull_calendars: expect.arrayContaining(['google1', 'caldav1'])
            }));
        });

        // Verify navigate was NOT called (no redirect on save)
        expect(navigate).not.toHaveBeenCalled();

        // Close button check is removed because it's part of the main page, not the component, 
        // OR if the component has it? No, CalendarSettings doesn't have a close button.
        // It's in CalendarInt.tsx
    });
});
