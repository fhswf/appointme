
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmationDialog from './Confirm';
import React from 'react';

describe('ConfirmationDialog', () => {
    const mockOnCancel = vi.fn();
    const mockOnConfirm = vi.fn();
    const mockOnClose = vi.fn();

    const defaultOptions = {
        title: 'Confirm Action',
        description: 'Are you sure?',
        confirmationText: 'Yes',
        cancellationText: 'No',
        dialogProps: {},
        confirmationButtonProps: {},
        cancellationButtonProps: {},
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly with required options', () => {
        render(
            <ConfirmationDialog
                open={true}
                options={defaultOptions}
                onCancel={mockOnCancel}
                onConfirm={mockOnConfirm}
                onClose={mockOnClose}
            />
        );

        expect(screen.getByText('Confirm Action')).toBeInTheDocument();
        expect(screen.getByText('Are you sure?')).toBeInTheDocument();
        expect(screen.getByText('Yes')).toBeInTheDocument();
        expect(screen.getByText('No')).toBeInTheDocument();
    });

    it('should call onCancel when the cancel button is clicked', () => {
        render(
            <ConfirmationDialog
                open={true}
                options={defaultOptions}
                onCancel={mockOnCancel}
                onConfirm={mockOnConfirm}
                onClose={mockOnClose}
            />
        );

        fireEvent.click(screen.getByText('No'));
        expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('should call onConfirm when the confirm button is clicked', () => {
        render(
            <ConfirmationDialog
                open={true}
                options={defaultOptions}
                onCancel={mockOnCancel}
                onConfirm={mockOnConfirm}
                onClose={mockOnClose}
            />
        );

        fireEvent.click(screen.getByText('Yes'));
        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it('should render correct title and description', () => {
        const options = {
            ...defaultOptions,
            title: "New Title",
            description: "New Description"
        }
        render(
            <ConfirmationDialog
                open={true}
                options={options}
                onCancel={mockOnCancel}
                onConfirm={mockOnConfirm}
                onClose={mockOnClose}
            />
        );
        expect(screen.getByText('New Title')).toBeInTheDocument();
        expect(screen.getByText('New Description')).toBeInTheDocument();
    });

    it('should not render title or description if not provided', () => {
        const options = {
            ...defaultOptions,
            title: undefined,
            description: undefined
        }
        render(
            <ConfirmationDialog
                open={true}
                options={options}
                onCancel={mockOnCancel}
                onConfirm={mockOnConfirm}
                onClose={mockOnClose}
            />
        );
        expect(screen.queryByRole('heading')).not.toBeInTheDocument();
        expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument();
        expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
    });
});
