import { ArrowRight, CalendarDays, MapPin } from 'lucide-react';
import type { Update } from '@/lib/types';
import { resolveImage } from '@/lib/sanity-image';
import { SanityImage } from '@/components/SanityImage';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { formatDate } from '@/lib/format';

export function UpdateCard({ update, priority = false, headingLevel = 3 }: { update: Update; priority?: boolean; headingLevel?: 2 | 3 }) {
  const image = resolveImage(update.coverImage, update.title);
  const dateLabel = formatDate(update.eventDate ?? update.publishedAt);
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <article className={`update-card${image ? '' : ' update-card--text'}`}>
      {image && <div className="update-card-photo">
        <SanityImage image={image} sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw" priority={priority} />
      </div>}
      <div className="update-card-body">
        <span className="update-category">{update.category}</span>
        <div className="update-meta">
          {dateLabel && <span><CalendarDays aria-hidden="true" /><time dateTime={update.eventDate ?? update.publishedAt}>{update.eventDate ? 'Event: ' : 'Posted: '}{dateLabel}</time></span>}
          {update.location && <span><MapPin aria-hidden="true" />{update.location}</span>}
        </div>
        <Heading>{update.title}</Heading>
        <p>{update.excerpt}</p>
        <ButtonLink href={`/updates/${encodeURIComponent(update.slug)}`} variant="inline">
          Read more<span className="sr-only">: {update.title}</span><ArrowRight className="w-4 h-4" aria-hidden="true" />
        </ButtonLink>
      </div>
    </article>
  );
}
