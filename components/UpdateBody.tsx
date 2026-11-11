import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';

/**
 * Body renderer for update detail pages. Styling matches the prose treatment
 * used by LegalPage so long-form content looks consistent across the site.
 *
 * Renders on the server — @portabletext/react ships a react-server entry point,
 * so no client JavaScript is shipped for article bodies.
 */
const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="font-serif text-2xl font-semibold text-primary mt-10 mb-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-serif text-xl font-semibold text-primary mt-8 mb-3">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l border-border pl-5 italic text-muted-foreground my-6">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p className="mb-5 leading-relaxed">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 space-y-2 mb-5">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 space-y-2 mb-5">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const href = typeof value?.href === 'string' ? value.href : '';
      // Anything that is not a same-site path opens in a new tab.
      const external = /^https?:\/\//i.test(href);
      return (
        <a
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        >
          {children}
        </a>
      );
    },
  },
};

export function UpdateBody({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className="update-body text-foreground leading-relaxed">
      <PortableText value={value} components={components} />
    </div>
  );
}
