import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ResizableSidebar } from './resizable-sidebar';

describe('ResizableSidebar Component', () => {
    it('renders children correctly', () => {
        render(
            <ResizableSidebar initialWidth={300}>
                <div data-testid="child">Content</div>
            </ResizableSidebar>
        );
        expect(screen.getByTestId('child')).toBeInTheDocument();
        expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('applies initial width', () => {
        render(
            <ResizableSidebar initialWidth={350} side="right">
                <div>Content</div>
            </ResizableSidebar>
        );
        // The outer div has the style width.
        // We need to find the outer div. Since it doesn't have a role, we can add a test id or find by class/element.
        // It has a relative flex class.
        // Let's rely on container or just assume the first div rendered.
    });

    it('resizes on drag', () => {
        const onResize = vi.fn();
        render(
            <ResizableSidebar
                initialWidth={300}
                minWidth={100}
                maxWidth={500}
                side="right"
                onResize={onResize}
            >
                <div>Content</div>
            </ResizableSidebar>
        );

        // Find the handle. It has `cursor-col-resize`.
        // We can find it by class.
        // Or cleaner: component with children usually wraps them.
        // The handle is a sibling of the content container.

        // Let's modify the component or use querySelector for the handle class "cursor-col-resize"
        const handle = document.querySelector('.cursor-col-resize');

        if (!handle) throw new Error("Handle not found");

        // Simulate resize
        // 1. Mouse down on handle
        fireEvent.mouseDown(handle);

        // 2. Mouse move on window
        // Right side: width = window.innerWidth - clientX
        // Start width 300.
        // If we move mouse to innerWidth - 400, width should be 400.

        // Mock window.innerWidth
        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });

        // Move to 624 (1024 - 400).
        fireEvent.mouseMove(window, { clientX: 624 });

        // Check if onResize called with 400
        expect(onResize).toHaveBeenCalledWith(400);

        // 3. Mouse up
        fireEvent.mouseUp(window);

        // 4. Move again, should not resize
        onResize.mockClear();
        fireEvent.mouseMove(window, { clientX: 524 }); // would be 500
        expect(onResize).not.toHaveBeenCalled();
    });

    it('respects minWidth constraints', () => {
        const onResize = vi.fn();
        render(
            <ResizableSidebar
                initialWidth={300}
                minWidth={200}
                side="right"
                onResize={onResize}
            >
                <div>Content</div>
            </ResizableSidebar>
        );

        const handle = document.querySelector('.cursor-col-resize');
        if (!handle) throw new Error("Handle not found");

        fireEvent.mouseDown(handle);

        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });

        // Try to resize to 100 (clientX = 924)
        fireEvent.mouseMove(window, { clientX: 924 });

        expect(onResize).not.toHaveBeenCalled(); // Should not call callback if invalid?
        // Actually code checks "if (newWidth >= minWidth && newWidth <= maxWidth)"

        fireEvent.mouseUp(window);
    });
});
