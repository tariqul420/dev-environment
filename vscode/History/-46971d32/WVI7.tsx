'use client';

import Image from 'next/image';

interface ImageGalleryProps {
  images?: string[];
  name?: string;
}

export default function ImageGallery({ images = [], name = '' }: ImageGalleryProps) {
  if (images.length === 0) return null;

  return (
    <section className="space-y-6 mt-12">
      <h2 className="text-2xl font-bold">Gallery</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((src, idx) => (
          <div key={idx} className="relative aspect-video rounded-md overflow-hidden hover:shadow-xl transition-all">
            <Image src={src} alt={`${name} - screenshot ${idx + 1}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
          </div>
        ))}
      </div>
    </section>
  );
}
