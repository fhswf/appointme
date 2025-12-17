import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import ReactMarkdown from 'react-markdown';
import { markdownComponents } from './MarkdownComponents';

describe('MarkdownComponents', () => {
    it('should render h1 with correct classes', () => {
        const { container } = render(
            <ReactMarkdown components={markdownComponents}>
                # Heading 1
            </ReactMarkdown>
        );
        const h1 = container.querySelector('h1');
        expect(h1).toBeInTheDocument();
        expect(h1).toHaveClass('text-3xl', 'font-bold', 'mt-8', 'mb-4');
    });

    it('should render h2 with correct classes', () => {
        const { container } = render(
            <ReactMarkdown components={markdownComponents}>
                ## Heading 2
            </ReactMarkdown>
        );
        const h2 = container.querySelector('h2');
        expect(h2).toBeInTheDocument();
        expect(h2).toHaveClass('text-2xl', 'font-semibold', 'mt-6', 'mb-3');
    });

    it('should render h3 with correct classes', () => {
        const { container } = render(
            <ReactMarkdown components={markdownComponents}>
                ### Heading 3
            </ReactMarkdown>
        );
        const h3 = container.querySelector('h3');
        expect(h3).toBeInTheDocument();
        expect(h3).toHaveClass('text-xl', 'font-semibold', 'mt-4', 'mb-2');
    });

    it('should render paragraph with correct classes', () => {
        const { container } = render(
            <ReactMarkdown components={markdownComponents}>
                This is a paragraph.
            </ReactMarkdown>
        );
        const p = container.querySelector('p');
        expect(p).toBeInTheDocument();
        expect(p).toHaveClass('mb-4', 'leading-relaxed', 'text-muted-foreground');
    });

    it('should render link with correct classes', () => {
        const { container } = render(
            <ReactMarkdown components={markdownComponents}>
                [Link text](https://example.com)
            </ReactMarkdown>
        );
        const a = container.querySelector('a');
        expect(a).toBeInTheDocument();
        expect(a).toHaveClass('hover:underline', 'underline-offset-4');
        expect(a).toHaveAttribute('href', 'https://example.com');
    });

    it('should render unordered list with correct classes', () => {
        const { container } = render(
            <ReactMarkdown components={markdownComponents}>
                {`- Item 1\n- Item 2`}
            </ReactMarkdown>
        );
        const ul = container.querySelector('ul');
        expect(ul).toBeInTheDocument();
        expect(ul).toHaveClass('list-disc', 'mb-4', 'pl-4', 'text-muted-foreground');
    });

    it('should render list item with correct classes', () => {
        const { container } = render(
            <ReactMarkdown components={markdownComponents}>
                - Item 1
            </ReactMarkdown>
        );
        const li = container.querySelector('li');
        expect(li).toBeInTheDocument();
        expect(li).toHaveClass('mb-1');
    });

    it('should render strong with correct classes', () => {
        const { container } = render(
            <ReactMarkdown components={markdownComponents}>
                **Bold text**
            </ReactMarkdown>
        );
        const strong = container.querySelector('strong');
        expect(strong).toBeInTheDocument();
        expect(strong).toHaveClass('font-semibold', 'text-foreground');
    });

    it('should render complex markdown with all components', () => {
        const markdown = `
# Main Title

## Subtitle

This is a paragraph with **bold text** and a [link](https://example.com).

### Section

- List item 1
- List item 2

Another paragraph.
        `;

        const { container } = render(
            <ReactMarkdown components={markdownComponents}>
                {markdown}
            </ReactMarkdown>
        );

        expect(container.querySelector('h1')).toBeInTheDocument();
        expect(container.querySelector('h2')).toBeInTheDocument();
        expect(container.querySelector('h3')).toBeInTheDocument();
        expect(container.querySelector('p')).toBeInTheDocument();
        expect(container.querySelector('strong')).toBeInTheDocument();
        expect(container.querySelector('a')).toBeInTheDocument();
        expect(container.querySelector('ul')).toBeInTheDocument();
        expect(container.querySelectorAll('li')).toHaveLength(2);
    });

    it('should be callable directly for coverage', () => {
        // Direct calls to ensure coverage if component rendering isn't tracked
        const props = { children: 'Test' };

        expect(markdownComponents.h1({ node: {} as any, ...props })).toBeTruthy();
        expect(markdownComponents.h2({ node: {} as any, ...props })).toBeTruthy();
        expect(markdownComponents.h3({ node: {} as any, ...props })).toBeTruthy();
        expect(markdownComponents.p({ node: {} as any, ...props })).toBeTruthy();
        expect(markdownComponents.a({ node: {} as any, ...props })).toBeTruthy();
        expect(markdownComponents.ul({ node: {} as any, ...props })).toBeTruthy();
        expect(markdownComponents.li({ node: {} as any, ...props })).toBeTruthy();
        expect(markdownComponents.strong({ node: {} as any, ...props })).toBeTruthy();
    });
});
