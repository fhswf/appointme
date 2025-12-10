import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ContactInfo from './ContactInfo';
import * as authServices from '../helpers/services/auth_services';

// Mock dependencies
vi.mock('../helpers/services/auth_services', () => ({
    getAuthConfig: vi.fn()
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key
    })
}));

vi.mock('./MarkdownComponents', () => ({
    markdownComponents: {}
}));

vi.mock('react-markdown', () => ({
    default: ({ children }: { children: string }) => <div data-testid="markdown-content">{children}</div>
}));

describe('ContactInfo', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render contact info when available', async () => {
        const mockContactInfo = 'Contact us at: test@example.com';
        vi.mocked(authServices.getAuthConfig).mockResolvedValue({
            contactInfo: mockContactInfo
        } as any);

        render(<ContactInfo />);

        await waitFor(() => {
            expect(screen.getByText('Contact')).toBeInTheDocument();
            expect(screen.getByTestId('markdown-content')).toHaveTextContent(mockContactInfo);
        });
    });

    it('should not render anything when contact info is not available', async () => {
        vi.mocked(authServices.getAuthConfig).mockResolvedValue({
            contactInfo: null
        } as any);

        const { container } = render(<ContactInfo />);

        await waitFor(() => {
            expect(container.firstChild).toBeNull();
        });
    });

    it('should not render anything when contact info is empty string', async () => {
        vi.mocked(authServices.getAuthConfig).mockResolvedValue({
            contactInfo: ''
        } as any);

        const { container } = render(<ContactInfo />);

        await waitFor(() => {
            expect(container.firstChild).toBeNull();
        });
    });

    it('should handle error when fetching auth config', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        const error = new Error('Failed to fetch config');
        vi.mocked(authServices.getAuthConfig).mockRejectedValue(error);

        const { container } = render(<ContactInfo />);

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load contact info', error);
            expect(container.firstChild).toBeNull();
        });

        consoleErrorSpy.mockRestore();
    });

    it('should render markdown formatted contact info', async () => {
        const mockContactInfo = `
## Contact Details

Email: contact@example.com
Phone: +1-234-567-8900

**Office Hours**: 9 AM - 5 PM
        `;
        vi.mocked(authServices.getAuthConfig).mockResolvedValue({
            contactInfo: mockContactInfo
        } as any);

        render(<ContactInfo />);

        await waitFor(() => {
            expect(screen.getByText('Contact')).toBeInTheDocument();
            expect(screen.getByTestId('markdown-content')).toHaveTextContent('Contact Details');
            expect(screen.getByTestId('markdown-content')).toHaveTextContent('contact@example.com');
        });
    });

    it('should call getAuthConfig on mount', async () => {
        vi.mocked(authServices.getAuthConfig).mockResolvedValue({
            contactInfo: 'Test'
        } as any);

        render(<ContactInfo />);

        await waitFor(() => {
            expect(authServices.getAuthConfig).toHaveBeenCalledTimes(1);
        });
    });

    it('should handle config without contactInfo field', async () => {
        vi.mocked(authServices.getAuthConfig).mockResolvedValue({} as any);

        const { container } = render(<ContactInfo />);

        await waitFor(() => {
            expect(container.firstChild).toBeNull();
        });
    });

    it('should render heading with correct translation key', async () => {
        vi.mocked(authServices.getAuthConfig).mockResolvedValue({
            contactInfo: 'Test contact info'
        } as any);

        render(<ContactInfo />);

        await waitFor(() => {
            const heading = screen.getByText('Contact');
            expect(heading).toBeInTheDocument();
            expect(heading.tagName).toBe('H2');
            expect(heading).toHaveClass('text-2xl', 'font-semibold', 'mt-6', 'mb-3');
        });
    });
});
