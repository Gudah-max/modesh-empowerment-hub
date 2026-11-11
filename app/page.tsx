import { pageMetadata, SITE_NAME } from '@/lib/metadata';
import { HomeView, HomeEnrollment } from '@/components/HomeView';
import { LatestUpdates } from '@/components/LatestUpdates';

// The latest-updates teaser reads from the CMS, so the homepage refreshes on
// the same ISR window. Cached hits are still served from the CDN.
// Must be a literal — Next.js statically analyses this export. Keep in sync
// with REVALIDATE_SECONDS in lib/sanity.ts.
export const revalidate = 600;

export const metadata = pageMetadata('/', SITE_NAME, 'Hands-on baking and entrepreneurship training in Manyatta, Kisumu. Explore programs, learn our story and express your interest in training.');

export default function Page() {
  return (
    <>
      <HomeView />
      <LatestUpdates />
      <HomeEnrollment />
    </>
  );
}
