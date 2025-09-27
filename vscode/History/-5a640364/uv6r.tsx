'use client';

import { incrementBlogViews } from '@/lib/actions/blog.action';
import { useEffect } from 'react';

export default function BlogDetailsClient({ slug }: { slug: string }) {
  useEffect(() => {
    if (slug) {
      incrementBlogViews(slug);
    }
  }, [slug]);

  return null;
}
