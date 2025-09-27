'use client';

import { ProjectCardProps } from '@/types/project';
import Image from 'next/image';
import Link from 'next/link';
import MagicCardContainer from '../magic-card-container';

export default function ProjectCard({ project }: { project: ProjectCardProps }) {
  const { slug, coverImage, title, shortDescription } = project;

  return (
    <Link href={`/projects/${slug}`}>
      <MagicCardContainer className="min-h-full hover:translate-y-[-10px] transition-all duration-300">
        <div className="flex flex-col w-full">
          <div className="relative h-0  pb-[95%] rounded-t-[16px] overflow-hidden">
            {coverImage ? (
              <Image
                src={coverImage}
                alt={coverImage || 'Project Image'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover aspect-square"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI/wNPbL4f4wAAAABJRU5ErkJggg=="
              />
            ) : (
              <div className="absolute inset-0 rounded-t-[16px] flex items-center justify-center">
                <span>No Image</span>
              </div>
            )}
          </div>

          <div className="flex flex-col p-4 flex-grow rounded-b-[16px]">
            <h2 className="font-semibold text-start text-lg">{title}</h2>
            <p className="text-sm text-start mt-2 line-clamp-2">{shortDescription ? shortDescription : 'No description available'}</p>
          </div>
        </div>
      </MagicCardContainer>
    </Link>
  );
}
