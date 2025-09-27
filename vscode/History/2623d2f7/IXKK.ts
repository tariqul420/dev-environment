import React from 'react';

export type SearchParamsPropsType = {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: number;
    sort?: string;
    limit?: string;
  }>;
};

export interface ParamsPropsType {
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  category?: string;
}

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
