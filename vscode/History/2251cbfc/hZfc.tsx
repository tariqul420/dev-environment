// components/tiptap-editor/render-tiptap-content.tsx
'use client';

import { cn } from '@/lib/utils';
import parse, { Element } from 'html-react-parser';
import { CodeBlock } from './code-block';

interface Props {
  html: string;
  className?: string;
}

export default function RenderTiptapContent({ html, className }: Props) {
  return (
    <div className={(cn('prose dark:prose-invert max-w-none tiptap-content'), className)}>
      {parse(html, {
        replace(domNode) {
          if (domNode instanceof Element && domNode.name === 'pre' && domNode.children.length && domNode.children[0] instanceof Element && domNode.children[0].name === 'code') {
            const codeElement = domNode.children[0] as Element;

            const language = codeElement.attribs?.class?.replace('language-', '')?.trim() || 'text';

            const rawCode = codeElement.children?.[0]?.type === 'text' ? (codeElement.children[0].data as string) : '';

            return <CodeBlock code={rawCode.trim()} language={language} />;
          }
        },
      })}
    </div>
  );
}
