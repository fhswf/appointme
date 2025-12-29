import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

describe('Tabs Component', () => {
    it('renders the tabs and default content', () => {
        render(
            <Tabs defaultValue="tab1">
                <TabsList>
                    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">Content 1</TabsContent>
                <TabsContent value="tab2">Content 2</TabsContent>
            </Tabs>
        );

        expect(screen.getByText('Tab 1')).toBeInTheDocument();
        expect(screen.getByText('Tab 2')).toBeInTheDocument();
        expect(screen.getByText('Content 1')).toBeInTheDocument();
        expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    });

    it('switches content when a tab is clicked', async () => {
        render(
            <Tabs defaultValue="tab1">
                <TabsList>
                    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">Content 1</TabsContent>
                <TabsContent value="tab2">Content 2</TabsContent>
            </Tabs>
        );

        const tab2 = screen.getByText('Tab 2');

        await userEvent.click(tab2);

        expect(screen.getByText('Content 2')).toBeInTheDocument();
        expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    });

    it('applies custom class names', () => {
        render(
            <Tabs defaultValue="tab1" className="custom-tabs">
                <TabsList className="custom-list">
                    <TabsTrigger value="tab1" className="custom-trigger">Tab 1</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1" className="custom-content">Content 1</TabsContent>
            </Tabs>
        );

        // Tabs root is not directly accessible usually without data-testid or ref, but we check sub-components
        // The Radix Tabs root renders a div.
        const list = screen.getByRole('tablist');
        expect(list).toHaveClass('custom-list');

        const trigger = screen.getByRole('tab', { name: 'Tab 1' });
        expect(trigger).toHaveClass('custom-trigger');

        const content = screen.getByRole('tabpanel');
        expect(content).toHaveClass('custom-content');
    });
});
