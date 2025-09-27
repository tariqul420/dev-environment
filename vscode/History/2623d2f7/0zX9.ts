import React from 'react';

export interface ParamsPropsType {
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  category?: string;
}

export type SearchParamsProps = {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
    sort?: string;
    limit?: string;
  }>;
};

export interface DashboardSearchParamsProps {
  pageSize?: string;
  pageIndex?: string;
  search?: string;
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
