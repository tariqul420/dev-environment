"use client";

import { cn } from "@/lib/utils";
import parse, { Element } from "html-react-parser";
import { CodeBlock } from "./code-block";

export default function RenderTiptapContent({ html, className }) {
  return (
    <div
      className={cn(
        "prose dark:prose-invert tiptap-content max-w-none",
        className,
      )}
    >
      {parse(html, {
        replace(domNode) {
          if (
            domNode instanceof Element &&
            domNode.name === "pre" &&
            domNode.children.length &&
            domNode.children[0] instanceof Element &&
            domNode.children[0].name === "code"
          ) {
            const codeElement = domNode.children[0];
            const language =
              codeElement.attribs?.class?.replace("language-", "")?.trim() ||
              "text";
            const rawCode =
              codeElement.children?.[0]?.type === "text"
                ? codeElement.children[0].data
                : "";

            return <CodeBlock code={rawCode.trim()} language={language} />;
          }
        },
      })}
    </div>
  );
}
