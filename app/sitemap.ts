import type { MetadataRoute } from 'next';
import { getUpdateSlugs } from '@/lib/sanity';
import { SITE_URL } from '@/lib/metadata';
import { updatesPublicReleaseEnabled } from '@/lib/content/release';

// Must be a literal — Next.js statically analyses this export. Keep in sync
// with REVALIDATE_SECONDS in lib/sanity.ts.
export const revalidate = 600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ['', '/about', '/programs', '/updates', '/gallery', '/team', '/contact', '/enroll', '/faq', '/privacy', '/terms']
    .filter(route => updatesPublicReleaseEnabled || route !== '/updates');

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: route === '' || route === '/updates' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/enroll' || route === '/programs' ? 0.8 : route === '/updates' ? 0.7 : 0.5,
  }));

  // Option B excludes the whole Updates family, even if CMS data becomes
  // available. Keep the future publishing path below for authorized activation.
  if (!updatesPublicReleaseEnabled) return staticEntries;

  // Individual updates. getUpdateSlugs never throws — if Sanity is unreachable
  // the sitemap simply falls back to the static routes above.
  const updateEntries: MetadataRoute.Sitemap = (await getUpdateSlugs()).map(
    ({ slug, publishedAt }) => ({
      url: `${SITE_URL}/updates/${encodeURIComponent(slug)}`,
      lastModified: new Date(publishedAt),
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  );

  return [...staticEntries, ...updateEntries];
}
