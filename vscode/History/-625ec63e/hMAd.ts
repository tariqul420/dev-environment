import { getBlogs } from '@/lib/actions/blog.action';
import { getProjects } from '@/lib/actions/project.action';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const base: MetadataRoute.Sitemap = [
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
    // const res = await fetch('https://tariqul.dev/api/sitemap-data', {
    //   next: { revalidate: 60 * 60 },
    // });
    // if (!res.ok) return base;

    // const { projects = [], blogs = [] } = await res.json();

    const [{ projects }] = await Promise.all([getProjects(), getBlogs()]);

    const projectUrls: MetadataRoute.Sitemap = projects.map((p: { slug: string; updatedAt?: string }) => ({
      url: `https://tariqul.dev/projects/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    const blogUrls: MetadataRoute.Sitemap = blogs.map((b: { slug: string; updatedAt?: string }) => ({
      url: `https://tariqul.dev/blogs/${b.slug}`,
      lastModified: b.updatedAt ? new Date(b.updatedAt) : now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    return [...base, ...projectUrls, ...blogUrls];
  } catch {
    return base;
  }
}
