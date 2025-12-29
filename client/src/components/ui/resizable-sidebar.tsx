import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ResizableSidebarProps {
    children: React.ReactNode;
    initialWidth?: number;
    minWidth?: number;
    maxWidth?: number;
    className?: string;
    side?: 'left' | 'right';
    width?: number;
    onResize?: (width: number) => void;
}

export function ResizableSidebar(props: ResizableSidebarProps) {
    const {
        children,
        initialWidth = 320,
        minWidth = 200,
        maxWidth = 600,
        className,
        side = 'right',
        onResize
    } = props;
    const [widthState, setWidthState] = useState(initialWidth);

    // Use prop width if provided, otherwise local state
    const width = (props.width !== undefined ? props.width : widthState);

    const [isResizing, setIsResizing] = useState(false);

    const startResizing = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
    }, []);

    const stopResizing = useCallback(() => {
        setIsResizing(false);
    }, []);

    const resize = useCallback(
        (mouseMoveEvent: MouseEvent) => {
            if (isResizing) {
                let newWidth;
                if (side === 'right') {
                    // Calculate width based on distance from right edge of window
                    const distanceFromRight = window.innerWidth - mouseMoveEvent.clientX;
                    newWidth = distanceFromRight;
                } else {
                    newWidth = mouseMoveEvent.clientX;
                }

                if (newWidth >= minWidth && newWidth <= maxWidth) {
                    if (props.width === undefined) {
                        setWidthState(newWidth);
                    }
                    if (onResize) onResize(newWidth);
                }
            }
        },
        [isResizing, minWidth, maxWidth, side, onResize, props.width]
    );

    useEffect(() => {
        globalThis.addEventListener('mousemove', resize);
        globalThis.addEventListener('mouseup', stopResizing);
        return () => {
            globalThis.removeEventListener('mousemove', resize);
            globalThis.removeEventListener('mouseup', stopResizing);
        };
    }, [resize, stopResizing]);

    return (
        <div
            className={cn("relative flex h-full", className)}
            style={{ width }}
        >
            {/* Resizer Handle */}
            <div
                role="separator"
                aria-valuenow={typeof width === 'number' ? width : undefined}
                aria-valuemin={minWidth}
                aria-valuemax={maxWidth}
                aria-orientation="vertical"
                aria-label="Resize sidebar"
                className={cn(
                    "absolute top-0 bottom-0 w-1 cursor-col-resize z-50 hover:bg-primary/50 transition-colors focus-visible:bg-primary focus-visible:outline-none",
                    isResizing && "bg-primary w-1 opacity-100",
                    side === 'right' ? "left-0" : "right-0"
                )}
                onMouseDown={startResizing}
            />

            <div className="flex-1 w-full h-full overflow-hidden">
                {children}
            </div>
        </div>
    );
}
