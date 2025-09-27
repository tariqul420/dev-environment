"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function ProjectCard({ project }) {
  const { slug, coverImage, title, shortDescription } = project;

  return (
    <Link href={`/projects/${slug}`} aria-label={`Open project: ${title}`}>
      <Card className="group h-full overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-2">
        {/* Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title || "Project Image"}
              fill
              className="object-cover"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI/wNPbL4f4wAAAABJRU5ErkJggg=="
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-muted-foreground text-sm">No Image</span>
            </div>
          )}
        </div>

        {/* Text */}
        <CardHeader className="pb-2">
          <CardTitle className="line-clamp-2 text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {shortDescription || "No description available"}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
