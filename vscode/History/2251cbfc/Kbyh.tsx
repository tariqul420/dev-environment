'use client';

import parse, { Element, Text } from 'html-react-parser';
import { CodeBlock } from './code-block';

interface Props {
  html: string;
}

export default function RenderTiptapContent({ html }: Props) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      {parse(html, {
        replace(domNode) {
          if (domNode instanceof Element && domNode.name === 'pre' && domNode.children?.[0] instanceof Element && domNode.children[0].name === 'code') {
            const codeNode = domNode.children[0].children?.[0];

            // Safely check if it's a text node
            if (codeNode && codeNode instanceof Text) {
              return <CodeBlock code={codeNode.data.trim()} />;
            }
          }
        },
      })}
    </div>
  );
}
