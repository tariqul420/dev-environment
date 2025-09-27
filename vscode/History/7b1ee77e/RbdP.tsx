'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface BackBtnProps {
  className?: string;
  variant?: 'default' | 'ghost' | 'secondary' | 'destructive' | 'outline';
  children?: React.ReactNode;
}

export default function BackBtn({ className, variant = 'ghost', children = 'Go Back' }: BackBtnProps) {
  const router = useRouter();

  const buttonContent = (
    <div className="inline-flex items-center gap-2 font-semibold">
      <ArrowLeft size={20} className={cn('transition-transform duration-300 ease-in-out', 'group-hover:-translate-x-1')} />
      <span>{children}</span>
    </div>
  );

  return (
    <Button variant={variant} onClick={() => router.back()} className={cn('group flex items-center gap-2 font-semibold cursor-pointer transition-all duration-300', className)}>
      {buttonContent}
    </Button>
  );
}
