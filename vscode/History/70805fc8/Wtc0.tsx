'use client';

import { cn, formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Input } from '../ui/input';

type SearchBarProps = {
  placeholder?: string;
  className?: string;
  classNameRoot?: string;
};

export default function SearchBar({ placeholder = 'Search by Title', className, classNameRoot }: SearchBarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let newUrl = '';

      if (searchQuery) {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'search',
          value: searchQuery,
        });
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ['search'],
        });
      }
      router.push(newUrl, { scroll: false });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchParams, router]);

  return (
    <div className={cn('bg-light flex items-center gap-2 overflow-hidden rounded-md dark:bg-transparent', classNameRoot)}>
      <Input type="text" placeholder={placeholder} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={cn(className)} />
    </div>
  );
}
