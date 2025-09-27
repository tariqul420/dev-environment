'use client';

import { useEffect } from 'react';

export default function BlogDetailsClient({ slug }: { slug: string }) {
  useEffect(() => {
    return () => {
      if (slug) {
      }
    };
  }, [slug]);
}
