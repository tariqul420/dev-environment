import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

import remarkGfm from 'remark-gfm';
import type { Plugin } from 'unified';
import remarkSlug from 'remark-slug' as Plugin;

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [remarkGfm, remarkSlug],
    rehypePlugins: [],
  },
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
};

export default withMDX(nextConfig);
