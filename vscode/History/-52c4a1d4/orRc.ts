import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

import remarkGfm from 'remark-gfm';
const remarkSlug = require('remark-slug'); // ✅ FIX for TS error

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
