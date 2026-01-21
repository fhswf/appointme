import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProfileDialog } from './ProfileDialog';
import * as userServices from '../helpers/services/user_services';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('../helpers/services/user_services', () => ({
    getUser: vi.fn(),
    updateUser: vi.fn(),
    exportSettings: vi.fn(),
    importSettings: vi.fn()
}));

vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn()
    }
}));

const mockT = (key: string) => key;
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: mockT
    })
}));

vi.mock('./LanguageSelector', () => ({
    LanguageSelector: () => <div data-testid="language-selector">Language Selector</div>
}));

vi.mock('./AvailabilityEditor', () => ({
    AvailabilityEditor: ({ onChange }: any) => (
        <div data-testid="availability-editor">
            <button onClick={() => onChange({ 1: [] })}>Update Availability</button>
        </div>
    )
}));

vi.mock('./CalendarSettings', () => ({
    CalendarSettings: () => (
        <div data-testid="calendar-settings">Calendar Settings Mock</div>
    )
}));

const mockRefreshAuth = vi.fn();
vi.mock('../components/AuthProvider', () => ({
    useAuth: () => ({
        refreshAuth: mockRefreshAuth
    })
}));

// Mock UI components
vi.mock('@/components/ui/dialog', () => ({
    Dialog: ({ children, open }: any) => open ? <div>{children}</div> : null,
    DialogContent: ({ children }: any) => <div>{children}</div>,
    DialogHeader: ({ children }: any) => <div>{children}</div>,
    DialogTitle: ({ children }: any) => <div>{children}</div>,
    DialogFooter: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/components/ui/button', () => ({
    Button: ({ children, onClick, type }: any) => (
        <button onClick={onClick} type={type}>{children}</button>
    )
}));

const mockUser = {
    _id: 'user1',
    name: 'Test User',
    user_url: 'test-user',
    picture_url: 'http://example.com/pic.jpg',
    use_gravatar: true,
    send_invitation_email: false,
    google_tokens: {}
};

describe('ProfileDialog', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(userServices.getUser).mockResolvedValue({ data: mockUser } as any);
        mockRefreshAuth.mockResolvedValue(undefined);
    });

    it('should calculate initial state and render loading', async () => {
        render(<ProfileDialog open={true} onOpenChange={vi.fn()} />);
        expect(screen.getByText('loading')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.queryByText('loading')).not.toBeInTheDocument();
        });
    });

    it('should fetch user data and render form', async () => {
        render(<ProfileDialog open={true} onOpenChange={vi.fn()} />);

        await waitFor(() => {
            expect(screen.queryByText('loading')).not.toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
            expect(screen.getByDisplayValue('test-user')).toBeInTheDocument();
            expect(screen.getByRole('img')).toHaveAttribute('src', mockUser.picture_url);
        });
    });

    it('should handle form input changes', async () => {
        render(<ProfileDialog open={true} onOpenChange={vi.fn()} />);

        await waitFor(() => {
            expect(screen.queryByText('loading')).not.toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
        });

        const nameInput = screen.getByDisplayValue('Test User');
        fireEvent.change(nameInput, { target: { value: 'New Name' } });
        expect(nameInput).toHaveValue('New Name');

        const checkbox = screen.getByLabelText('use_gravatar');
        fireEvent.click(checkbox);
        expect(checkbox).not.toBeChecked();

        const urlInput = screen.getByDisplayValue('test-user');
        fireEvent.change(urlInput, { target: { value: 'new-url' } });
        expect(urlInput).toHaveValue('new-url');

        const emailCheckbox = screen.getByLabelText('send_invitation_email');
        fireEvent.click(emailCheckbox);
        expect(emailCheckbox).toBeChecked();
    });

    it('should submit updated data', async () => {
        vi.mocked(userServices.updateUser).mockResolvedValue({ data: mockUser } as any);
        const onOpenChange = vi.fn();

        render(<ProfileDialog open={true} onOpenChange={onOpenChange} />);

        await waitFor(() => {
            expect(screen.queryByText('loading')).not.toBeInTheDocument();
        });

        // Submit the form directly
        const form = document.getElementById('profile-form') as HTMLFormElement;
        fireEvent.submit(form);

        await waitFor(() => {
            expect(userServices.updateUser).toHaveBeenCalledWith(expect.objectContaining({
                name: 'Test User',
                user_url: 'test-user',
                use_gravatar: true
            }));
            expect(toast.success).toHaveBeenCalledWith('profile_updated');
            expect(mockRefreshAuth).toHaveBeenCalled();
            expect(onOpenChange).toHaveBeenCalledWith(false);
        });
    });

    it('should handle update error (409 conflict)', async () => {
        const error = { response: { status: 409 } };
        vi.mocked(userServices.updateUser).mockRejectedValue(error);

        render(<ProfileDialog open={true} onOpenChange={vi.fn()} />);

        // Wait for loading to complete and form to be rendered
        await waitFor(() => {
            expect(screen.queryByText('loading')).not.toBeInTheDocument();
        });

        // Ensure form is fully loaded
        await waitFor(() => {
            expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
        });

        // Submit the form directly
        const form = document.getElementById('profile-form') as HTMLFormElement;
        fireEvent.submit(form);

        await waitFor(() => {
            expect(userServices.updateUser).toHaveBeenCalled();
            expect(toast.error).toHaveBeenCalledWith('user_url_taken');
        });
    });

    it('should handle generic update error', async () => {
        vi.mocked(userServices.updateUser).mockRejectedValue(new Error('Failed'));

        render(<ProfileDialog open={true} onOpenChange={vi.fn()} />);

        // Wait for loading to complete and form to be rendered
        await waitFor(() => {
            expect(screen.queryByText('loading')).not.toBeInTheDocument();
        });

        // Ensure form is fully loaded
        await waitFor(() => {
            expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
        });

        // Submit the form directly
        const form = document.getElementById('profile-form') as HTMLFormElement;
        fireEvent.submit(form);

        await waitFor(() => {
            expect(userServices.updateUser).toHaveBeenCalled();
            expect(toast.error).toHaveBeenCalledWith('error_saving_profile');
        });
    });

    it('should handle load error', async () => {
        vi.mocked(userServices.getUser).mockRejectedValue(new Error('Load failed'));

        render(<ProfileDialog open={true} onOpenChange={vi.fn()} />);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('error_loading_profile');
        });
    });

    it('should fallback to default image if no picture_url', async () => {
        const userNoPic = { ...mockUser, picture_url: null };
        vi.mocked(userServices.getUser).mockResolvedValue({ data: userNoPic } as any);

        render(<ProfileDialog open={true} onOpenChange={vi.fn()} />);

        await waitFor(() => {
            // Check for the user icon container or svg presence
            // The implementation renders a div with User Icon if no picture
            // simplified: checking that img is not present or checks for the fallback div logic
            expect(screen.queryByRole('img')).not.toBeInTheDocument();
        });
    });

    it('should switch to availability tab and render editor', async () => {
        render(<ProfileDialog open={true} onOpenChange={vi.fn()} />);

        await waitFor(() => {
            expect(screen.queryByText('loading')).not.toBeInTheDocument();
        });

        const availabilityTab = screen.getByText('Standard Availability');
        fireEvent.click(availabilityTab);

        expect(screen.getByText('Define your standard weekly availability here. You can use this availability in your Event Types.')).toBeInTheDocument();

        // Trigger onChange via mock button
        const updateButton = screen.getByText('Update Availability');
        fireEvent.click(updateButton);
    });

    it('should handle data tab export', async () => {
        const mockSettings = { data: { user: {}, events: [] } };
        vi.mocked(userServices.exportSettings).mockResolvedValue(mockSettings as any);

        // Mock URL.createObjectURL and URL.revokeObjectURL
        const mockCreateObjectURL = vi.fn(() => 'blob:http://localhost/blob');
        const mockRevokeObjectURL = vi.fn();
        Object.defineProperty(window, 'URL', {
            value: {
                createObjectURL: mockCreateObjectURL,
                revokeObjectURL: mockRevokeObjectURL
            },
            writable: true
        });

        render(<ProfileDialog open={true} onOpenChange={vi.fn()} />);
        await waitFor(() => expect(screen.queryByText('loading')).not.toBeInTheDocument());

        fireEvent.click(screen.getByText('Data'));
        fireEvent.click(screen.getByText('Export Data'));

        await waitFor(() => {
            expect(userServices.exportSettings).toHaveBeenCalled();
            expect(mockCreateObjectURL).toHaveBeenCalled();
        });
    });

    it('should handle data tab import', async () => {
        vi.mocked(userServices.importSettings).mockResolvedValue({} as any);
        const onOpenChange = vi.fn();
        const mockRefreshAuth = vi.fn(); // Assuming it's already mocked properly in the file scope if needed, or re-mock here via existing mocks

        // Mock window.confirm
        const mockConfirm = vi.spyOn(window, 'confirm');
        mockConfirm.mockReturnValue(true);

        render(<ProfileDialog open={true} onOpenChange={onOpenChange} />);
        await waitFor(() => expect(screen.queryByText('loading')).not.toBeInTheDocument());

        fireEvent.click(screen.getByText('Data'));

        const file = new File(['{"user":{},"events":[]}'], 'settings.json', { type: 'application/json' });

        // Find input directly by ID since it's hidden and might be hard to select by label text in this structure
        const fileInput = document.getElementById('import-file') as HTMLInputElement;

        Object.defineProperty(fileInput, 'files', { value: [file] });
        fireEvent.change(fileInput);

        await waitFor(() => {
            expect(userServices.importSettings).toHaveBeenCalledWith(expect.objectContaining({ user: {}, events: [] }));
            expect(onOpenChange).toHaveBeenCalledWith(false);
        });
    });
});
