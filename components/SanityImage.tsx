'use client';

import Image from 'next/image';
import { sanityLoader, type ResolvedImage } from '@/lib/sanity-image';

/**
 * Renders a Sanity-hosted image through next/image with a loader that points at
 * Sanity's CDN, so resizing and delivery never touch Netlify's Image CDN.
 *
 * This is a client component because next/image cannot receive a function
 * `loader` prop across the server/client boundary. Keeping it a small leaf
 * means the pages that use it stay server-rendered.
 */
export function SanityImage({
  image,
  sizes,
  className,
  priority = false,
}: {
  image: ResolvedImage;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      loader={sanityLoader}
      src={image.url}
      alt={image.alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
