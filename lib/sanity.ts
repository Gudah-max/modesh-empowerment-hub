import type { Update, UpdateDetail } from './types';

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
const API_VERSION = 'v2024-10-01';

/** ISR window shared by every route that reads from Sanity. */
export const REVALIDATE_SECONDS = 600;

/**
 * True once the Sanity project is configured via env vars. The site builds and
 * runs without it; the UI identifies this separately from an empty publication.
 */
export const cmsConfigured = Boolean(PROJECT_ID);

/**
 * `ready` can contain an empty list or null detail. Neither a missing CMS
 * connection nor a failed/malformed response establishes that content is absent.
 */
export type CmsStatus = 'ready' | 'unconfigured' | 'error';
export type CmsResult<T> = { ok: boolean; status: CmsStatus; data: T };

/**
 * Runs a GROQ query against Sanity's cached CDN endpoint (apicdn), which is
 * what the free tier's API allowance is measured against.
 *
 * Never throws: a network error, a non-2xx response, or unset env vars all
 * resolve to the supplied fallback so a CMS outage can neither fail a Netlify
 * build nor produce a 500 for a visitor.
 */
async function query<T>(groq: string, fallback: T, valid: (value: unknown) => value is T): Promise<CmsResult<T>> {
  if (!cmsConfigured) return { ok: false, status: 'unconfigured', data: fallback };

  try {
    const url =
      `https://${PROJECT_ID}.apicdn.sanity.io/${API_VERSION}/data/query/${DATASET}` +
      `?query=${encodeURIComponent(groq)}`;

    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) throw new Error(`Sanity responded ${res.status}`);

    const json: { result?: unknown } | null = await res.json();
    if (!json || !valid(json.result)) throw new Error('Invalid CMS response');
    return { ok: true, status: 'ready', data: json.result };
  } catch (error) {
    console.error('[sanity] query failed, serving fallback:', error);
    return { ok: false, status: 'error', data: fallback };
  }
}

/**
 * Only items that are published and not expired are ever returned. Sanity's
 * free plan has no scheduled publishing, so a future `publishedAt` acts as the
 * schedule and `expiresAt` retires past opportunities automatically.
 */
const LIVE = `_type == "update" && !(_id in path("drafts.**")) && defined(slug.current) && publishedAt <= now() && (!defined(expiresAt) || expiresAt > now())`;

/** Validate the required public fields before an invalid payload reaches a view. */
function isUpdate(value: unknown): value is Update {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  const optionalText = (field: unknown) => field == null || typeof field === 'string';
  const cover = item.coverImage;
  if (cover != null) {
    if (typeof cover !== 'object' || Array.isArray(cover)) return false;
    const image = cover as Record<string, unknown>;
    if (!['url', 'ref', 'alt'].every(key => optionalText(image[key]))) return false;
    if (!['width', 'height'].every(key => image[key] == null || (
      typeof image[key] === 'number' && Number.isFinite(image[key]) && (image[key] as number) > 0
    ))) return false;
  }
  return ['_id', 'title', 'slug', 'category', 'excerpt', 'publishedAt'].every(
    key => typeof item[key] === 'string' && (item[key] as string).trim().length > 0
  ) && Number.isFinite(Date.parse(item.publishedAt as string)) &&
    ['eventDate', 'location', 'ctaLabel', 'ctaUrl'].every(key => optionalText(item[key]));
}

const isUpdateList = (value: unknown): value is Update[] => Array.isArray(value) && value.every(isUpdate);
const isDetail = (value: unknown): value is UpdateDetail | null => value === null || (
  isUpdate(value) && (!('body' in value) || value.body === null || Array.isArray(value.body))
);

/**
 * `asset->url` and `asset->metadata.dimensions` are dereferenced by Sanity, so
 * the URL and intrinsic size are canonical rather than reconstructed. The raw
 * `_ref` is carried along purely as a fallback.
 */
const IMAGE_FIELDS = `
  "url": coverImage.asset->url,
  "ref": coverImage.asset._ref,
  "alt": coverImage.alt,
  "width": coverImage.asset->metadata.dimensions.width,
  "height": coverImage.asset->metadata.dimensions.height
`;

const LIST_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  category,
  excerpt,
  "coverImage": { ${IMAGE_FIELDS} },
  publishedAt,
  eventDate,
  location,
  ctaLabel,
  ctaUrl,
  "featured": coalesce(featured, false)
`;

/** Drops the placeholder object GROQ produces when there is no cover image. */
function normalise<T extends { coverImage: { url: string | null; ref: string | null } | null }>(
  item: T
): T {
  if (item.coverImage && !item.coverImage.url && !item.coverImage.ref) {
    return { ...item, coverImage: null };
  }
  return item;
}

/** Every live update, newest first. */
export async function getUpdates(): Promise<CmsResult<Update[]>> {
  const result = await query<Update[]>(
    `*[${LIVE}] | order(publishedAt desc) { ${LIST_FIELDS} }`,
    [],
    isUpdateList
  );
  return { ...result, data: result.data.map(normalise) };
}

/** The most recent live updates, for the homepage teaser. */
export async function getLatestUpdates(limit = 3): Promise<CmsResult<Update[]>> {
  const result = await query<Update[]>(
    `*[${LIVE}] | order(publishedAt desc) [0...${limit}] { ${LIST_FIELDS} }`,
    [],
    isUpdateList
  );
  return { ...result, data: result.data.map(normalise) };
}

/** One update by slug, including its body. Returns null when not found. */
export async function getUpdateBySlug(slug: string): Promise<CmsResult<UpdateDetail | null>> {
  const result = await query<UpdateDetail | null>(
    `*[${LIVE} && slug.current == $slug][0] { ${LIST_FIELDS}, body }`.replace(
      '$slug',
      JSON.stringify(slug)
    ),
    null,
    isDetail
  );
  return { ...result, data: result.data ? normalise(result.data) : null };
}

/**
 * Slugs for generateStaticParams. Falls back to an empty list if Sanity is
 * unreachable at build time, in which case detail pages render on demand.
 */
export async function getUpdateSlugs(): Promise<{ slug: string; publishedAt: string }[]> {
  const { data } = await query<{ slug: string; publishedAt: string }[]>(
    `*[${LIVE}] | order(publishedAt desc) { "slug": slug.current, publishedAt }`,
    [],
    (value): value is { slug: string; publishedAt: string }[] => Array.isArray(value) && value.every(
      item => item && typeof item.slug === 'string' && item.slug.trim() &&
        typeof item.publishedAt === 'string' && Number.isFinite(Date.parse(item.publishedAt))
    )
  );
  return data;
}
