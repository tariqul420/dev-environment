import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: 'https://tariqul.dev/',
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: 'https://tariqul.dev/projects',
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://tariqul.dev/blogs',
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  try {
  } catch (error) {}
}
