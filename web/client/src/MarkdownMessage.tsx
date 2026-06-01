import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github-dark-dimmed.min.css";

/** http(s) ou protocol-relative — abre em novo separador com aviso acessível. */
function opensInNewTab(href: string | undefined): boolean {
  if (!href) return false;
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//")
  );
}

/**
 * Reduz níveis na bolha do chat para não competir com o h1 da app
 * e manter hierarquia útil (h3–h6).
 */
const components: Partial<Components> = {
  h1: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
  h2: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
  h3: ({ children, ...props }) => <h4 {...props}>{children}</h4>,
  h4: ({ children, ...props }) => <h5 {...props}>{children}</h5>,
  h5: ({ children, ...props }) => <h6 {...props}>{children}</h6>,
  h6: ({ children, ...props }) => <h6 {...props}>{children}</h6>,
  a: ({ href, children, ...props }) =>
    opensInNewTab(href) ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
        <span className="sr-only"> (abre num novo separador)</span>
      </a>
    ) : (
      <a href={href} {...props}>
        {children}
      </a>
    ),
  img: ({ alt, ...props }) => (
    <img {...props} alt={alt ?? ""} loading="lazy" decoding="async" />
  ),
};

export default function MarkdownMessage({ text }: { text: string }) {
  return (
    <div className="md-root">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
