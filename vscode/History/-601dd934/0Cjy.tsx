'use client';

import { ProjectCardProps } from '@/types/project';
import Image from 'next/image';
import Link from 'next/link';
import MagicCardContainer from './magic-card-container';

export default function ProjectCard({ project }: { project: ProjectCardProps }) {
  const { slug, image, name, description } = project;

  return (
    <MagicCardContainer className="min-h-full hover:translate-y-[-10px] transition-all duration-300">
      <Link href={`/projects/${slug}`}>
        <div className="flex flex-col w-full">
          <div className="relative h-0 pb-[56.25%] rounded-t-[16px] overflow-hidden">
            {image ? (
              <Image
                src={image[0]}
                alt={name || 'Project Image'}
                fill
                className="object-cover"
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
            <h1 className="font-medium text-start text-lg">{name || 'Untitled Project'}</h1>
            <p className="text-sm text-start mt-3 line-clamp-2">{description ? description : 'No description available'}</p>
          </div>
        </div>
      </Link>
    </MagicCardContainer>
  );
}
