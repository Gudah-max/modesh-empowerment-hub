import { getUpdates } from '@/lib/sanity';
import { UpdatesView } from '@/components/UpdatesView';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata('/updates', 'Updates & Opportunities',
  'Training opportunities, classes, events and announcements from Modesh Empowerment Hub in Kisumu, Kenya.');

/**
 * Cached listing; refreshes at most once per ISR window. Must be a literal —
 * Next.js statically analyses this export. Keep in sync with
 * REVALIDATE_SECONDS in lib/sanity.ts.
 */
export const revalidate = 600;

export default async function UpdatesPage() {
  const { data: updates, status } = await getUpdates();
  return <UpdatesView updates={updates} status={status} />;
}
