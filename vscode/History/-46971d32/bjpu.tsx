'use client';

import Image from 'next/image';

interface ImageGalleryProps {
  images?: string[];
  name?: string;
  className?: string;
}

export default function ImageGallery({ images = [], name = '', className = '' }: ImageGalleryProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 ${className}`} style={{ gridAutoRows: '150px' }}>
      {/* Large main image */}
      {images[0] && (
        <div
          className="relative rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
          style={{ gridColumn: 'span 2', gridRow: 'span 2' }}>
          <Image src={images[0]} alt={`${name} Image 1`} fill sizes="(max-width: 1024px) 100vw, 50vw" style={{ objectFit: 'cover' }} priority />
        </div>
      )}

      {/* Other images */}
      {images.slice(1, 4).map((src, idx) => (
        <div key={idx} className="relative rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
          <Image src={src} alt={`${name} Image ${idx + 2}`} fill sizes="(max-width: 1024px) 50vw, 25vw" style={{ objectFit: 'cover' }} />
        </div>
      ))}
    </div>
  );
}
