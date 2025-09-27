'use client';

import { incrementBlogViews } from '@/lib/actions/blog.action';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function BlogDetailsClient({ slug }: { slug: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (slug) {
      incrementBlogViews(slug, pathname);
    }
  }, [slug]);

  return null;
}
