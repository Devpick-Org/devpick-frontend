"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface ContentRendererProps {
  content: string;
  className?: string;
}

export function ContentRenderer({ content, className }: ContentRendererProps) {
  return (
    <div
      className={cn(
        "text-sm leading-7 text-foreground/90 font-medium",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p({ children }) {
            return <p className="mb-3 last:mb-0">{children}</p>;
          },
          pre({ children }) {
            return (
              <pre className="my-3 overflow-x-auto rounded-lg bg-muted/60 px-4 py-3 text-xs font-mono leading-6">
                {children}
              </pre>
            );
          },
          code({ className: langClass, children, ...props }) {
            const isBlock = langClass?.startsWith("language-");
            if (isBlock) {
              return (
                <code className="font-mono" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code
                className="rounded bg-muted/60 px-1 py-0.5 text-xs font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <div className="my-3 overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return (
              <thead className="border-b border-border bg-muted/40">
                {children}
              </thead>
            );
          },
          tbody({ children }) {
            return <tbody className="divide-y divide-border/50">{children}</tbody>;
          },
          tr({ children }) {
            return <tr>{children}</tr>;
          },
          th({ children }) {
            return (
              <th className="px-3 py-2 text-left font-semibold text-foreground/80">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="px-3 py-2 text-muted-foreground">{children}</td>
            );
          },
          ul({ children }) {
            return (
              <ul className="mb-3 list-disc space-y-1 pl-5">{children}</ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="mb-3 list-decimal space-y-1 pl-5">{children}</ol>
            );
          },
          li({ children }) {
            return <li>{children}</li>;
          },
          strong({ children }) {
            return <strong className="font-semibold">{children}</strong>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="my-3 border-l-2 border-primary/40 pl-4 text-muted-foreground italic">
                {children}
              </blockquote>
            );
          },
          h1({ children }) {
            return (
              <h1 className="mb-2 text-base font-bold text-foreground">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="mb-2 text-sm font-bold text-foreground">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="mb-1 text-sm font-semibold text-foreground">
                {children}
              </h3>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
