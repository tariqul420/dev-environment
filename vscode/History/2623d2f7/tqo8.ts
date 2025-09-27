import React from 'react';

export type SearchParamsProps = {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
    sort?: string;
    limit?: string;
  }>;
};

export type SlugProps = { params: Promise<{ slug: string }> };

export interface AnimationContainerProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export interface ChildrenProps {
  children: React.ReactNode;
}
