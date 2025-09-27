import React from 'react';

type SlugParams = { params: Promise<{ slug: string }> };

interface ChildrenProps {
  children: React.ReactNode;
}
