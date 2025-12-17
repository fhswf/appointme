
import type { Components } from 'react-markdown';

export const markdownComponents: Components = {
    h1: ({ node, children, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props}>{children}</h1>,
    h2: ({ node, children, ...props }) => <h2 className="text-2xl font-semibold mt-6 mb-3" {...props}>{children}</h2>,
    h3: ({ node, children, ...props }) => <h3 className="text-xl font-semibold mt-4 mb-2" {...props}>{children}</h3>,
    p: ({ node, children, ...props }) => <p className="mb-4 leading-relaxed text-muted-foreground" {...props}>{children}</p>,
    a: ({ node, children, ...props }) => <a className="hover:underline underline-offset-4" {...props}>{children}</a>,
    ul: ({ node, children, ...props }) => <ul className="list-disc mb-4 pl-4 text-muted-foreground" {...props}>{children}</ul>,
    li: ({ node, children, ...props }) => <li className="mb-1" {...props}>{children}</li>,
    strong: ({ node, children, ...props }) => <strong className="font-semibold text-foreground" {...props}>{children}</strong>,
};
