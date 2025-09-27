"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProjectCard({ project }) {
  const { slug, coverImage, title, shortDescription } = project;

  return (
    <Link href={`/projects/${slug}`}>
      <div className="flex min-h-full w-full flex-col rounded-xl bg-white/5 transition-all duration-300 hover:translate-y-[-10px]">
        <div className="relative h-0 overflow-hidden rounded-t-[16px] pb-[95%]">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={coverImage || "Project Image"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="aspect-square object-cover"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI/wNPbL4f4wAAAABJRU5ErkJggg=="
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center rounded-t-[16px]">
              <span>No Image</span>
            </div>
          )}
        </div>

        <div className="flex flex-grow flex-col rounded-b-[16px] p-4">
          <h2 className="text-start text-lg font-semibold">{title}</h2>
          <p className="mt-2 line-clamp-2 text-start text-sm">
            {shortDescription ? shortDescription : "No description available"}
          </p>
        </div>
      </div>
    </Link>
  );
}
