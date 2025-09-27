'use client';

import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { ProjectCardProps } from '@/types/project';
import Image from 'next/image';
import Link from 'next/link';

export default function ProjectCard({ project }: { project: ProjectCardProps }) {
  const { slug, coverImage, title, shortDescription } = project;

  return (
    <Link href={`/projects/${slug}`}>
      <Card className="hover:shadow-lg hover:-translate-y-2 transition-transform duration-300 cursor-pointer overflow-hidden rounded-2xl">
        <div className="relative w-full aspect-video">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={coverImage || 'Project Image'}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI/wNPbL4f4wAAAABJRU5ErkJggg=="
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-sm">No Image</div>
          )}
        </div>

        <CardContent className="p-4">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <p className="text-sm mt-2 line-clamp-2 text-muted-foreground">{shortDescription || 'No description available'}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
