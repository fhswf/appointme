import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ResizableSidebar } from './resizable-sidebar';

describe('ResizableSidebar', () => {
    it('renders children correctly', () => {
        render(
            <ResizableSidebar>
                <div>Sidebar Content</div>
            </ResizableSidebar>
        );
        expect(screen.getByText('Sidebar Content')).toBeInTheDocument();
    });

    it('renders with initial width', () => {
        const { container } = render(
            <ResizableSidebar initialWidth={300}>
                <div>Content</div>
            </ResizableSidebar>
        );
        // The outer div has the width style
        const sidebar = container.firstChild as HTMLElement;
        expect(sidebar).toHaveStyle({ width: '300px' });
    });

    it('respects controlled width prop', () => {
        const { container } = render(
            <ResizableSidebar width={400}>
                <div>Content</div>
            </ResizableSidebar>
        );
        const sidebar = container.firstChild as HTMLElement;
        expect(sidebar).toHaveStyle({ width: '400px' });
    });

    it('handles resize interactions (right side)', () => {
        const onResize = vi.fn();
        render(
            <ResizableSidebar initialWidth={300} onResize={onResize} side="right">
                <div>Content</div>
            </ResizableSidebar>
        );

        const handle = screen.getByRole('separator');

        // Start resizing
        fireEvent.mouseDown(handle);

        // Mock window dimensions for right-side calculation
        // The component uses: distanceFromRight = window.innerWidth - mouseMoveEvent.clientX;
        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });

        // Move mouse. If clientX is 600, width should be 1024 - 600 = 424
        fireEvent.mouseMove(window, { clientX: 600 });

        expect(onResize).toHaveBeenCalledWith(424);

        // Stop resizing
        fireEvent.mouseUp(window);

        // Verify no further calls
        onResize.mockClear();
        fireEvent.mouseMove(window, { clientX: 500 });
        expect(onResize).not.toHaveBeenCalled();
    });

    it('handles resize interactions (left side)', () => {
        const onResize = vi.fn();
        render(
            <ResizableSidebar initialWidth={200} onResize={onResize} side="left">
                <div>Content</div>
            </ResizableSidebar>
        );

        const handle = screen.getByRole('separator');

        fireEvent.mouseDown(handle);

        // For left side, newWidth = clientX
        fireEvent.mouseMove(window, { clientX: 350 });

        expect(onResize).toHaveBeenCalledWith(350);

        fireEvent.mouseUp(window);
    });

    it('respects minWidth constraints', () => {
        const onResize = vi.fn();
        render(
            <ResizableSidebar initialWidth={200} minWidth={150} onResize={onResize} side="left">
                <div>Content</div>
            </ResizableSidebar>
        );

        const handle = screen.getByRole('separator');
        fireEvent.mouseDown(handle);

        // Try to resize below minWidth
        fireEvent.mouseMove(window, { clientX: 100 });

        // Should not have been called with 100, might not be called at all if logic wraps
        expect(onResize).not.toHaveBeenCalledWith(100);

        fireEvent.mouseUp(window);
    });

    it('respects maxWidth constraints', () => {
        const onResize = vi.fn();
        render(
            <ResizableSidebar initialWidth={200} maxWidth={500} onResize={onResize} side="left">
                <div>Content</div>
            </ResizableSidebar>
        );

        const handle = screen.getByRole('separator');
        fireEvent.mouseDown(handle);

        // Try to resize above maxWidth
        fireEvent.mouseMove(window, { clientX: 600 });

        expect(onResize).not.toHaveBeenCalledWith(600);

        fireEvent.mouseUp(window);
    });

    it('cleans up event listeners on unmount', () => {
        const addSpy = vi.spyOn(globalThis, 'addEventListener');
        const removeSpy = vi.spyOn(globalThis, 'removeEventListener');

        const { unmount } = render(
            <ResizableSidebar>
                <div>Content</div>
            </ResizableSidebar>
        );

        expect(addSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
        expect(addSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));

        unmount();

        expect(removeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
        expect(removeSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
    });
});
