"use client";

import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm"; // Tables, strikethrough, etc.
import remarkBreaks from "remark-breaks"; // Soft breaks as hard breaks
import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeSanitize, rehypeHighlight]}
        components={{
          // Párrafos con espaciado consistente
          p({ children }) {
            return <p className="mb-4 last:mb-0 leading-7">{children}</p>;
          },
          // Encabezados con mejor jerarquía visual
          h1({ children }) {
            return <h1 className="text-2xl font-bold mt-8 mb-4">{children}</h1>;
          },
          h2({ children }) {
            return (
              <h2 className="text-xl font-semibold mt-6 mb-3">{children}</h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="text-lg font-medium mt-4 mb-2">{children}</h3>
            );
          },
          // Listas más limpias
          ul({ children }) {
            return (
              <ul className="my-4 ml-6 list-disc marker:text-primary/50 space-y-2">
                {children}
              </ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="my-4 ml-6 list-decimal marker:text-primary/50 space-y-2">
                {children}
              </ol>
            );
          },
          li({ children }) {
            return <li className="pl-1">{children}</li>;
          },
          // Citas mejoradas
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-primary/30 pl-4 italic my-4 text-muted-foreground">
                {children}
              </blockquote>
            );
          },
          // Bloques de código con botón de copiar
          pre({ children, ...props }) {
            return <CodeBlock {...props}>{children}</CodeBlock>;
          },
          // Bloques de código inline
          code({
            inline,
            className,
            children,
            ...props
          }: {
            inline?: boolean;
            className?: string;
            children?: React.ReactNode;
          }) {
            return inline ? (
              <code
                className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary"
                {...props}
              >
                {children}
              </code>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          // Enlaces
          a({ children, ...props }) {
            return (
              <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium hover:underline decoration-primary/30 underline-offset-4 transition-colors"
              >
                {children}
              </a>
            );
          },
          // Separadores
          hr() {
            return <hr className="my-8 border-border" />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function CodeBlock({
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Extract text content from the code element
    let code = "";
    if (children && typeof children === "object" && "props" in children) {
      const codeElement = (children as React.ReactElement<any>).props?.children;
      if (typeof codeElement === "string") {
        code = codeElement;
      } else if (Array.isArray(codeElement)) {
        code = codeElement.join("");
      }
    }

    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-accent rounded-md relative group my-4">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 p-2 rounded-md bg-background/80 hover:bg-background border border-border transition-colors opacity-0 group-hover:opacity-100 z-10"
        aria-label="Copiar código"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      <pre
        className="p-4 overflow-x-auto border border-border font-mono text-sm leading-relaxed"
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}
