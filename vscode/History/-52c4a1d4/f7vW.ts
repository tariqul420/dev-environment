// next.config.ts
import createMDX from '@next/mdx';
import type { NextConfig } from 'next';
import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug'; // ✅ must NOT be undefined
import type { Plugin } from 'unified';

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    // ✅ Make sure both are defined
    remarkPlugins: [remarkGfm as Plugin, remarkSlug as Plugin],
    rehypePlugins: [], // ✅ no empty object or invalid plugin
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
