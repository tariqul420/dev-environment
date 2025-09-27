'use client';

import { cn } from '@/lib/utils';
import Blockquote from '@tiptap/extension-blockquote';
import Code from '@tiptap/extension-code';
import HardBreak from '@tiptap/extension-hard-break';
import Highlight from '@tiptap/extension-highlight';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, Node, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from './editor-menu-bar';

import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import Heading from '@tiptap/extension-heading';
import { createLowlight } from 'lowlight';

const lowlight = createLowlight();

type EditorProps = {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
  className?: string;
};

export default function TiptapEditor({ content, onChange, editable = true, className }: EditorProps) {
  const editor = useEditor({
    editable,
    content,
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc ml-4',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal ml-4 ',
          },
        },
        heading: false,
        link: false,
        underline: false,
        blockquote: false,
        horizontalRule: false,
        hardBreak: false,
        codeBlock: false,
        code: false,
      }),
      Heading.configure({
        HTMLAttributes: (node: Node) => {
          switch (node.attrs.level) {
            case 1:
              return {
                class: 'text-3xl font-semibold tracking-tight pt-10 pb-4',
              };
            case 2:
              return {
                class: 'text-2xl font-semibold tracking-tight pt-8 pb-3 text-gray-900 dark:text-zinc-100',
              };
            case 3:
              return {
                class: 'text-xl font-medium pt-6 pb-2 text-gray-900 dark:text-zinc-100',
              };
            default:
              return {};
          }
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'w-full table-auto border border-border',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-border bg-muted text-foreground font-semibold px-2 py-1',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-border px-2 py-1 text-sm',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
        },
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: 'border-l-4 border-border pl-4 italic text-muted-foreground',
        },
      }),
      HorizontalRule,
      HardBreak,
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'text',
        HTMLAttributes: {
          class: 'relative my-4 rounded-md bg-zinc-100 p-4 dark:bg-zinc-900',
        },
      }),
      Code.configure({
        HTMLAttributes: {
          class: 'rounded bg-muted px-1 py-0.5 font-mono text-sm',
        },
      }),
    ],

    editorProps: {
      attributes: {
        class: cn('prose dark:prose-invert max-w-none focus:outline-none min-h-[200px]', className),
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    autofocus: true,
  });

  return (
    <>
      <div className="sticky top-[4px] z-50 bg-background/90 backdrop-blur-sm border-b shadow-md">{editable && <MenuBar editor={editor} />}</div>
      <EditorContent editor={editor} />
    </>
  );
}
