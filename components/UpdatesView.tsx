'use client';

import { useState } from 'react';
import { UpdateCard } from '@/components/UpdateCard';
import { UpdateState } from '@/components/UpdateState';
import { Section } from '@/components/ui/Section';
import { PageIntro } from '@/components/ui/PageIntro';
import { UPDATE_CATEGORIES, type Update } from '@/lib/types';
import type { CmsStatus } from '@/lib/sanity';

const ALL = 'All Updates';

export function UpdatesView({ updates, status }: { updates: Update[]; status: CmsStatus }) {
  const [activeFilter, setActiveFilter] = useState<string>(ALL);
  const present = UPDATE_CATEGORIES.filter(category => updates.some(update => update.category === category));
  const filters = [ALL, ...present];
  // Refreshed content may no longer contain the selected category.
  const selected = filters.includes(activeFilter) ? activeFilter : ALL;
  const visible = selected === ALL ? updates : updates.filter(update => update.category === selected);

  return (
    <div className="training-page reading-page">
      <Section>
        <PageIntro title="Updates & Opportunities">
          <p>Training opportunities, upcoming classes, events, and stories from the Modesh community. Check back here for the latest news from the hub.</p>
        </PageIntro>
      </Section>
      <Section className="reading-content" aria-label="Published updates">
        {status === 'ready' && updates.length > 0 ? <>
          {filters.length > 1 && <div className="updates-filters" role="group" aria-label="Filter updates by category">
            {filters.map(filter => (
              <button key={filter} type="button" aria-pressed={selected === filter} aria-controls="updates-results" onClick={() => setActiveFilter(filter)}>{filter}</button>
            ))}
          </div>}
          <p className="updates-count" role="status" aria-live="polite" aria-atomic="true">{visible.length} {visible.length === 1 ? 'update' : 'updates'} · {selected}</p>
          <div id="updates-results" className="updates-grid">
            {visible.map((update, i) => <UpdateCard key={update._id} update={update} headingLevel={2} priority={i === 0} />)}
          </div>
        </> : <UpdateState kind={status === 'ready' ? 'empty' : status} />}
      </Section>
    </div>
  );
}
