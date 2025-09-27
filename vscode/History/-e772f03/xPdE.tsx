'use client';

import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SearchInput() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get('query') || '');

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set('query', query);
      } else {
        params.delete('query');
      }
      router.replace(`/blogs?${params.toString()}`);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, router, searchParams]);

  return <Input type="text" placeholder="Search blogs..." className="mb-6" value={query} onChange={(e) => setQuery(e.target.value)} />;
}
