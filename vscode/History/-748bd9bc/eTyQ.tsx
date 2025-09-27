"use client";

import type { Editor } from "@tiptap/core";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Columns,
  Columns3,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  ListPlus,
  ListX,
  Quote,
  Redo,
  Strikethrough,
  Table as TableIcon,
  Type,
  Underline,
  Undo,
} from "lucide-react";
import { Toggle } from "../ui/toggle";

export default function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const Options = [
    {
      icon: <Heading1 className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      preesed: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: <Heading2 className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      preesed: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <Heading3 className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      preesed: editor.isActive("heading", { level: 3 }),
    },
    {
      icon: <Bold className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      preesed: editor.isActive("bold"),
    },
    {
      icon: <Italic className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      preesed: editor.isActive("italic"),
    },
    {
      icon: <Underline className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      preesed: editor.isActive("underline"),
    },
    {
      icon: <Strikethrough className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      preesed: editor.isActive("strike"),
    },
    {
      icon: <Highlighter className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      preesed: editor.isActive("highlight"),
    },
    {
      icon: <LinkIcon className="h-4 w-4" />,
      onClick: () => {
        const url = window.prompt("Enter URL");
        if (url) editor.chain().focus().setLink({ href: url }).run();
      },
      preesed: editor.isActive("link"),
    },
    {
      icon: <Quote className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      preesed: editor.isActive("blockquote"),
    },
    {
      icon: <Type className="h-4 w-4" />,
      onClick: () => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      icon: <AlignLeft className="h-4 w-4" />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      preesed: editor.isActive({ textAlign: "left" }),
    },
    {
      icon: <AlignCenter className="h-4 w-4" />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      preesed: editor.isActive({ textAlign: "center" }),
    },
    {
      icon: <AlignRight className="h-4 w-4" />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      preesed: editor.isActive({ textAlign: "right" }),
    },
    {
      icon: <List className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      preesed: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      preesed: editor.isActive("orderedList"),
    },
    {
      icon: <Undo className="h-4 w-4" />,
      onClick: () => editor.chain().focus().undo().run(),
    },
    {
      icon: <Redo className="h-4 w-4" />,
      onClick: () => editor.chain().focus().redo().run(),
    },

    // 🧩 Table Toolbar
    {
      icon: <TableIcon className="h-4 w-4" />,
      onClick: () => {
        const isInTable = editor.isActive("table");
        if (isInTable) {
          editor.chain().focus().deleteTable().run();
        } else {
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 2, withHeaderRow: true })
            .run();
        }
      },
      preesed: editor.isActive("table"),
    },
    {
      icon: <ListPlus className="h-4 w-4" />,
      onClick: () => editor.chain().focus().addRowAfter().run(),
    },
    {
      icon: <Columns className="h-4 w-4" />,
      onClick: () => editor.chain().focus().addColumnAfter().run(),
    },
    {
      icon: <ListX className="h-4 w-4" />,
      onClick: () => editor.chain().focus().deleteRow().run(),
    },
    {
      icon: <Columns3 className="h-4 w-4" />,
      onClick: () => editor.chain().focus().deleteColumn().run(),
    },
  ];

  return (
    <div className="border-border bg-background flex flex-wrap gap-1 rounded-md border p-1">
      {Options.map((option, index) => (
        <Toggle
          key={index}
          pressed={option.preesed}
          onPressedChange={option.onClick}
        >
          {option.icon}
        </Toggle>
      ))}
    </div>
  );
}
