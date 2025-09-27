// app/sitemap.ts
import { getBlogs } from '@/lib/actions/blog.action';
import { getProjects } from '@/lib/actions/project.action';
import type { MetadataRoute } from 'next';

// getProjects / getBlogs expected signature:
// ({ search, page, limit, isFeatured }) => Promise<{ projects|blogs, total, hasNextPage }>

type PagedResult<T> = {
  items: T[];
  hasNextPage: boolean;
};

async function fetchAllProjects(limit = 100): Promise<PagedResult<{ slug: string; updatedAt?: string }>> {
  const items: { slug: string; updatedAt?: string }[] = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const { projects = [], hasNextPage: next = false } = await getProjects({
      search: '',
      page,
      limit,
    });

    // defensive: only keep what we need
    for (const p of projects) {
      if (p?.slug) items.push({ slug: String(p.slug), updatedAt: p?.updatedAt });
    }

    hasNextPage = !!next;
    page += 1;
  }

  return { items, hasNextPage: false };
}

async function fetchAllBlogs(limit = 100): Promise<PagedResult<{ slug: string; updatedAt?: string }>> {
  const items: { slug: string; updatedAt?: string }[] = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const { blogs = [], hasNextPage: next = false } = await getBlogs({
      search: '',
      page,
      limit,
    });

    for (const b of blogs) {
      if (b?.slug) items.push({ slug: String(b.slug), updatedAt: b?.updatedAt });
    }

    hasNextPage = !!next;
    page += 1;
  }

  return { items, hasNextPage: false };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Base static routes
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
    // Pull everything with pagination
    const [projRes, blogRes] = await Promise.all([fetchAllProjects(100), fetchAllBlogs(100)]);

    const projectUrls: MetadataRoute.Sitemap = projRes.items.map((p) => ({
      url: `https://tariqul.dev/projects/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    const blogUrls: MetadataRoute.Sitemap = blogRes.items.map((b) => ({
      url: `https://tariqul.dev/blogs/${b.slug}`,
      lastModified: b.updatedAt ? new Date(b.updatedAt) : now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    // Deduplicate just in case
    const seen = new Set<string>();
    const all = [...base, ...projectUrls, ...blogUrls].filter((entry) => {
      if (seen.has(entry.url)) return false;
      seen.add(entry.url);
      return true;
    });

    return all;
  } catch {
    // যদি DB/API কোনো কারণে ফেল করে, অন্তত বেসিক sitemap দাও
    return base;
  }
}
