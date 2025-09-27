'use client';

import { ComponentPropsWithoutRef, useState } from 'react';
import { highlight } from 'sugar-high';

export function CodeBlock({ children, className, ...props }: ComponentPropsWithoutRef<'code'>) {
  const isInline = !className;

  if (isInline) {
    return (
      <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm" {...props}>
        {children}
      </code>
    );
  }

  const rawCode = String(children).trim();
  const highlightedCode = highlight(rawCode);

  return (
    <div className="relative my-4 rounded-md bg-zinc-100 p-4 dark:bg-zinc-900">
      <CopyButton code={rawCode} />
      <pre className="overflow-x-auto text-sm leading-relaxed">
        <code dangerouslySetInnerHTML={{ __html: highlightedCode }} {...props} />
      </pre>
    </div>
  );
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute right-3 top-3 rounded border border-zinc-300 bg-white/80 px-2 py-1 text-xs text-zinc-600 backdrop-blur-sm hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-700">
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}
