'use client';

import TiptapEditor from '../tiptap-editor/tiptap-editor';

interface ContentContainerProps {
  content: string;
  className?: string;
}

export default function ContentContainer({ content, className }: ContentContainerProps) {
  return (
    <div className={className}>
      <TiptapEditor content={content} onChange={() => {}} editable={false} />
    </div>
  );
}
