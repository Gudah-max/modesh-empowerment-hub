import '@/app/reading.css';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getLatestUpdates } from '@/lib/sanity';
import { UpdateCard } from '@/components/UpdateCard';
import { updatesPublicReleaseEnabled } from '@/lib/content/release';

/**
 * Homepage teaser for the three most recent updates.
 *
 * A server component so the homepage stays server-rendered and HomeView.tsx is
 * left completely untouched. Option B suppresses the teaser and its CMS query
 * until a future public release is explicitly enabled. Empty/unavailable CMS
 * content also leaves the normal homepage unchanged.
 */
export async function LatestUpdates() {
  if (!updatesPublicReleaseEnabled) return null;

  const { data: updates } = await getLatestUpdates(3);
  if (updates.length === 0) return null;

  return (
    <section className="bg-white py-20 lg:py-24 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-serif text-4xl font-semibold text-primary mb-4">
            Latest Updates &amp; Opportunities
          </h2>
          <p className="text-foreground/80 text-lg">
            Training opportunities, upcoming classes, and news from the Modesh community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {updates.map((update) => (
            <UpdateCard key={update._id} update={update} />
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/updates"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded font-medium hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 group"
          >
            View All Updates
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
