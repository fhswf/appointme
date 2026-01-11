import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from './alert-dialog';

describe('AlertDialog Component', () => {
    it('renders and opens/closes correctly', async () => {
        render(
            <AlertDialog>
                <AlertDialogTrigger>Open</AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Test Title</AlertDialogTitle>
                        <AlertDialogDescription>Test Description</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Action</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );

        // Initial state: Content should not be visible
        expect(screen.queryByText('Test Title')).not.toBeInTheDocument();

        // Open dialog
        await userEvent.click(screen.getByText('Open'));

        // Content should be visible
        // Radix UI renders in a portal, screen.getByText searches the document body
        expect(await screen.findByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();

        // Close dialog via Cancel
        await userEvent.click(screen.getByText('Cancel'));

        await waitFor(() => {
            expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
        });
    });

    it('renders with custom classes', async () => {
        render(
            <AlertDialog>
                <AlertDialogTrigger>Open</AlertDialogTrigger>
                <AlertDialogContent className="custom-content">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Title</AlertDialogTitle>
                        <AlertDialogDescription>Description</AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>
        );

        await userEvent.click(screen.getByText('Open'));

        // Radix UI Dialog Content usually has role="alertdialog"
        const content = await screen.findByRole('alertdialog');
        expect(content).toHaveClass('custom-content');
    });
});
