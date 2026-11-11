import type { ImageLoaderProps } from 'next/image';
import type { UpdateImage } from './types';

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';

/**
 * Asset references look like `image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg`,
 * and the canonical file URL is
 * `https://cdn.sanity.io/images/<project>/<dataset>/<id>-<w>x<h>.<format>`.
 * Both shapes were verified against Sanity's own @sanity/image-url
 * implementation (parseAssetId / urlForImage).
 *
 * This is only a fallback. Our GROQ projections ask Sanity for `asset->url` and
 * `asset->metadata.dimensions` directly, so the values used at runtime are the
 * ones Sanity itself reports rather than ones we reconstruct.
 */
function fromRef(ref: string): { url: string; width: number; height: number } | null {
  if (!PROJECT_ID) return null;

  const [, id, dimensions, format] = ref.split('-');
  if (!id || !dimensions || !format) return null;

  const [width, height] = dimensions.split('x').map(Number);
  if (!Number.isFinite(width) || !Number.isFinite(height)) return null;

  return {
    url: `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}-${dimensions}.${format}`,
    width,
    height,
  };
}

/** A cover image resolved to everything <Image> needs, or null if unusable. */
export interface ResolvedImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

/**
 * Prefers the dereferenced URL and dimensions from Sanity; reconstructs from
 * the asset ref only when those are missing.
 */
export function resolveImage(image: UpdateImage | null, fallbackAlt: string): ResolvedImage | null {
  if (!image) return null;

  const alt = image.alt?.trim() || fallbackAlt;

  if (image.url && image.width && image.height) {
    return { url: image.url, width: image.width, height: image.height, alt };
  }

  if (image.ref) {
    const derived = fromRef(image.ref);
    if (derived) return { ...derived, alt };
  }

  return null;
}

/**
 * next/image loader that keeps every byte on Sanity's CDN.
 *
 * Without this, Next would route the image through Netlify's Image CDN, which
 * consumes Netlify credits. Sanity's free plan carries a far larger asset
 * bandwidth allowance, so all resizing and format negotiation happens there.
 */
export function sanityLoader({ src, width, quality }: ImageLoaderProps): string {
  const params = new URLSearchParams({
    w: String(width),
    q: String(quality ?? 75),
    auto: 'format',
    fit: 'max',
  });
  return `${src}?${params.toString()}`;
}

/** Sized variant for social cards. */
export function ogImageUrl(image: ResolvedImage | null): string | null {
  if (!image) return null;
  return `${image.url}?w=1200&h=630&fit=crop&auto=format`;
}
