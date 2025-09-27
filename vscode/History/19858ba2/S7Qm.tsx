'use client';

import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface Blog {
  slug: string;
  title: string;
  description: string;
}

const blogs: Blog[] = [
  {
    slug: 'essential-a-to-z-command',
    title: 'Essential A to Z Linux Commands',
    description: 'Comprehensive list of terminal commands every developer should know.',
  },
  {
    slug: 'mongodb-deploy-and-backup-in-vps',
    title: 'MongoDB Deploy & Backup in VPS',
    description: 'Full guide to deploy and automate MongoDB backups on a VPS securely.',
  },
  {
    slug: 'next-js-deploy-in-vps',
    title: 'Next.js Deployment in VPS',
    description: 'Step-by-step deployment of a Next.js app on a VPS with production setup.',
  },
];

export default function BlogsPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="grid gap-6">
        {blogs.map((blog) => (
          <Link key={blog.slug} href={`/blogs/${blog.slug}`}>
            <Card className="cursor-pointer transition hover:shadow-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
                <p className="text-muted-foreground text-sm">{blog.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
