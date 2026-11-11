import type { PortableTextBlock } from '@portabletext/types';

/** Public-facing category labels. Order drives the filter pills on /updates. */
export const UPDATE_CATEGORIES = [
  'Training',
  'Classes',
  'Events',
  'Announcements',
  'Success Stories',
  'Community',
] as const;

export type UpdateCategory = (typeof UPDATE_CATEGORIES)[number];

/**
 * An image as returned by our GROQ projections. `url` and `dimensions` are
 * dereferenced from the asset document by Sanity itself, so they are canonical.
 * `ref` is kept only as a fallback for deriving a URL if the dereference is
 * ever unavailable (see lib/sanity-image.ts).
 */
export interface UpdateImage {
  url: string | null;
  ref: string | null;
  alt: string | null;
  width: number | null;
  height: number | null;
}

/** One published item in Updates & Opportunities. */
export interface Update {
  _id: string;
  title: string;
  slug: string;
  category: UpdateCategory;
  excerpt: string;
  coverImage: UpdateImage | null;
  publishedAt: string;
  eventDate: string | null;
  location: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
  featured: boolean;
}

/** A full update, including its Portable Text body. Used on detail pages. */
export interface UpdateDetail extends Update {
  body: PortableTextBlock[] | null;
}
