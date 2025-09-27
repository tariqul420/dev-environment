'use client';

import { cn } from '@/lib/utils';
import RenderTiptapContent from '../tiptap-editor/render-tiptap-content';

interface ContentContainerProps {
  content: string;
  className?: string;
}

export default function ContentContainer2({ content, className }: ContentContainerProps) {
  return (
    <div className={cn('tiptap-content', className)}>
      <RenderTiptapContent html={content} />
    </div>
  );
}
