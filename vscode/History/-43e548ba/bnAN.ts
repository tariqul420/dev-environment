import type { MetadataRoute } from 'next';

const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['', '/tools', '/(marketing)/about', '/(marketing)/privacy', '/(marketing)/terms'];

  return staticRoutes.map((route) => ({
    url: new URL(route, site).toString(),
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.6,
  }));
}
