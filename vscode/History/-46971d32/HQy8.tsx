'use client';

import Image from 'next/image';

interface ImageGalleryProps {
  images?: string[];
  name?: string;
  className?: string;
}

export default function ImageGallery({ images = [], name = '', className = '' }: ImageGalleryProps) {
  if (images.length === 0) return null;

  return (
    <div className={`grid grid-cols-3 gap-2 ${className}`}>
      {/* First image: large preview */}
      {images[0] && (
        <div className="relative col-span-3 md:col-span-2 row-span-2 h-[300px] md:h-auto rounded-lg overflow-hidden">
          <Image src={images[0]} alt={`${name} Image 1`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 66vw" priority />
        </div>
      )}

      {/* Next two images */}
      {images.slice(1, 3).map((src, idx) => (
        <div key={idx + 1} className="relative h-[150px] rounded-lg overflow-hidden">
          <Image src={src} alt={`${name} Image ${idx + 2}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        </div>
      ))}

      {/* Last row full width if more than 3 */}
      {images.length > 3 && (
        <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-2">
          {images.slice(3).map((src, idx) => (
            <div key={idx + 3} className="relative h-[150px] rounded-lg overflow-hidden">
              <Image src={src} alt={`${name} Image ${idx + 4}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
