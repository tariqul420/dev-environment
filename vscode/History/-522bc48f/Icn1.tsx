"use client";

import { cn } from "@/lib/utils";
import Blockquote from "@tiptap/extension-blockquote";
import HardBreak from "@tiptap/extension-hard-break";
import Highlight from "@tiptap/extension-highlight";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./editor-menu-bar";

type EditorProps = {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
  className?: string;
};

export default function TiptapEditor({
  content,
  onChange,
  editable = true,
  className,
}: EditorProps) {
  const editor = useEditor({
    editable,
    content,
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-4",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-4",
          },
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "w-full table-auto border border-gray-300",
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-gray-400 bg-gray-100 font-semibold px-2 py-1",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-gray-300 px-2 py-1",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: "border-l-4 pl-4 italic",
        },
      }),
      HorizontalRule,
      HardBreak,
    ],

    editorProps: {
      attributes: {
        class: cn(className),
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    autofocus: true,
  });

  return (
    <>
      {editable && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
    </>
  );
}
