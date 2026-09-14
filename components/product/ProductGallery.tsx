'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function ProductGallery({
  images,
  name,
}: {
  images: { front: string; back?: string; detail?: string };
  name: string;
}) {
  const views = [
    { src: images.front, label: 'Front' },
    ...(images.back ? [{ src: images.back, label: 'Back' }] : []),
    ...(images.detail ? [{ src: images.detail, label: 'Detail' }] : []),
  ];
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      <div className="flex gap-3 sm:flex-col">
        {views.map((v, i) => (
          <button
            key={v.label}
            onClick={() => setActive(i)}
            className={cn(
              'relative h-16 w-16 overflow-hidden rounded-md border bg-paper-2 transition-colors sm:h-20 sm:w-20',
              active === i ? 'border-ink' : 'border-line hover:border-ink/40',
            )}
            aria-label={`View ${v.label}`}
            aria-pressed={active === i}
          >
            <Image src={v.src} alt={`${name} ${v.label}`} fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
      <div className="relative aspect-[4/5] flex-1 overflow-hidden rounded-lg border border-line bg-paper-2">
        <Image
          src={views[active].src}
          alt={`${name} ${views[active].label}`}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover object-center"
          priority
        />
      </div>
    </div>
  );
}
