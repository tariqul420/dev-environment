'use client';

import parse, { Element } from 'html-react-parser';
import { CodeBlock } from './CodeBlock';

interface Props {
  html: string;
}

export default function RenderTiptapContent({ html }: Props) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      {parse(html, {
        replace(domNode) {
          // Check if the domNode is an Element (i.e., tag node)
          if (domNode instanceof Element && domNode.name === 'pre' && domNode.children?.[0] instanceof Element && domNode.children[0].name === 'code') {
            const code = domNode.children[0].children?.[0]?.data ?? '';
            return <CodeBlock code={code.trim()} />;
          }
        },
      })}
    </div>
  );
}
