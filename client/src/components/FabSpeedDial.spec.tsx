import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { FabSpeedDial } from './FabSpeedDial';
import * as Sentry from '@sentry/react';

// Mock Sentry
vi.mock('@sentry/react', () => ({
    getFeedback: vi.fn(),
}));

// Mock useTheme
const mockToggleTheme = vi.fn();
vi.mock('./ThemeToggle', () => ({
    useTheme: () => ({
        theme: 'light',
        toggleTheme: mockToggleTheme,
    }),
}));

describe('FabSpeedDial Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders theme toggle button', () => {
        render(<FabSpeedDial />);
        expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
    });

    it('toggles theme on click', () => {
        render(<FabSpeedDial />);
        fireEvent.click(screen.getByLabelText('Toggle theme'));
        expect(mockToggleTheme).toHaveBeenCalled();
    });

    it('renders feedback button', () => {
        render(<FabSpeedDial />);
        expect(screen.getByTitle('Give Feedback')).toBeInTheDocument();
    });

    it('handles feedback triggering', async () => {
        const mockCreateForm = vi.fn().mockResolvedValue({
            appendToDom: vi.fn(),
            open: vi.fn(),
        });
        (Sentry.getFeedback as any).mockReturnValue({
            createForm: mockCreateForm
        });

        render(<FabSpeedDial />);

        const feedbackBtn = screen.getByTitle('Give Feedback');
        fireEvent.click(feedbackBtn);

        expect(Sentry.getFeedback).toHaveBeenCalled();
        await waitFor(() => expect(mockCreateForm).toHaveBeenCalled());
    });
});
