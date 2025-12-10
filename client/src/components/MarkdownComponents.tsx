
import type { Components } from 'react-markdown';

export const markdownComponents: Components = {
    h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />,
    p: ({ node, ...props }) => <p className="mb-4 leading-relaxed text-muted-foreground" {...props} />,
    a: ({ node, ...props }) => <a className="text-primary font-medium hover:underline underline-offset-4" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 pl-4 text-muted-foreground" {...props} />,
    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
    strong: ({ node, ...props }) => <strong className="font-semibold text-foreground" {...props} />,
};
