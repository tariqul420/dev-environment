import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastMod = new Date();

  return [
    { url: 'https://tariqul.dev/', lastModified: lastMod, changeFrequency: 'weekly', priority: 1 },
    { url: 'https://tariqul.dev/projects', lastModified: lastMod, changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://tariqul.dev/blogs', lastModified: lastMod, changeFrequency: 'monthly', priority: 0.6 },
  ];
}
