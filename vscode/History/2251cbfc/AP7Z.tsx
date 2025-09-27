// components/render-tiptap-content.tsx
'use client';

import parse from 'html-react-parser';
import { CodeBlock } from './code-block';

interface Props {
  html: string;
}

export default function RenderTiptapContent({ html }: Props) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      {parse(html, {
        replace(domNode) {
          if (domNode.type === 'tag' && domNode.name === 'pre' && domNode.children?.[0]?.name === 'code') {
            const code = domNode.children[0].children?.[0]?.data ?? '';
            return <CodeBlock code={code.trim()} />;
          }
        },
      })}
    </div>
  );
}
