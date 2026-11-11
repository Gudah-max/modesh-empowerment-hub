import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, CalendarDays, MapPin } from 'lucide-react';
import { getUpdateBySlug, getUpdateSlugs } from '@/lib/sanity';
import { resolveImage, ogImageUrl } from '@/lib/sanity-image';
import { pageMetadata, SITE_NAME, SITE_URL, SOCIAL_IMAGE } from '@/lib/metadata';
import { formatDate } from '@/lib/format';
import { SanityImage } from '@/components/SanityImage';
import { UpdateBody } from '@/components/UpdateBody';
import { UpdateState } from '@/components/UpdateState';
import { Section } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/ButtonLink';

// Keep the existing ISR window and on-demand paths for later publications.
export const revalidate = 600;

export async function generateStaticParams() {
  return (await getUpdateSlugs()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data: update, status } = await getUpdateBySlug(slug);
  if (!update) {
    const title = status === 'ready' ? 'Update not found' : 'Updates unavailable';
    const description = status === 'ready'
      ? 'This update may be unpublished, removed, expired or linked incorrectly. Browse Updates & Opportunities or contact Modesh.'
      : 'Online updates are currently unavailable. Contact Modesh for current information.';
    return {
      title, description,
      robots: { index: false, follow: true },
      alternates: { canonical: null },
      openGraph: { title, description, siteName: SITE_NAME, images: [SOCIAL_IMAGE] },
      twitter: { card: 'summary_large_image', title, description, images: [{ url: SOCIAL_IMAGE.url, alt: SOCIAL_IMAGE.alt }] },
    };
  }
  const path = `/updates/${encodeURIComponent(update.slug)}`;
  const image = resolveImage(update.coverImage, update.title);
  const ogImage = ogImageUrl(image);
  const base = pageMetadata(path, update.title, update.excerpt);
  const images = ogImage ? [{ url: ogImage, alt: image?.alt ?? update.title }] : [SOCIAL_IMAGE];
  return {
    ...base,
    openGraph: {
      ...base.openGraph, type: 'article', publishedTime: update.publishedAt, images,
    },
    twitter: { ...base.twitter, images },
  };
}

export default async function UpdatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: update, status } = await getUpdateBySlug(slug);
  if (status !== 'ready') {
    return <div className="training-page reading-page"><Section><UpdateState kind={status} detail /></Section></div>;
  }
  if (!update) notFound();

  const image = resolveImage(update.coverImage, update.title);
  const publishedLabel = formatDate(update.publishedAt);
  const eventLabel = formatDate(update.eventDate);
  const externalCta = update.ctaUrl ? /^https?:\/\//i.test(update.ctaUrl) : false;
  // The document is an article about an update. Optional event fields do not
  // establish its organizer, scheduled status or a verified street address.
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: update.title, description: update.excerpt,
    datePublished: update.publishedAt,
    mainEntityOfPage: `${SITE_URL}/updates/${encodeURIComponent(update.slug)}`,
    ...(image ? { image: [image.url] } : {}),
  };
  return (
    <div className="training-page reading-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <Section>
        <article className="update-detail">
          <ButtonLink href="/updates" variant="inline"><ArrowLeft className="w-4 h-4" aria-hidden="true" />All Updates</ButtonLink>
          <header>
            <span className="update-category">{update.category}</span>
            <h1 className="training-title">{update.title}</h1>
            <div className="update-meta">
              {publishedLabel && <span><time dateTime={update.publishedAt}>Posted {publishedLabel}</time></span>}
              {eventLabel && <span><CalendarDays aria-hidden="true" /><time dateTime={update.eventDate ?? undefined}>Event: {eventLabel}</time></span>}
              {update.location && <span><MapPin aria-hidden="true" />{update.location}</span>}
            </div>
            <p className="update-excerpt">{update.excerpt}</p>
          </header>
          {image && <SanityImage image={image} sizes="(max-width: 767px) 100vw, 800px" priority className="update-cover" />}
          {update.body && update.body.length > 0 && <UpdateBody value={update.body} />}
          <footer className="update-end">
            {update.ctaUrl && <a href={update.ctaUrl} {...(externalCta ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="button-link button-link--primary">
              {update.ctaLabel?.trim() || 'Find Out More'}<ArrowRight className="w-4 h-4" aria-hidden="true" />
              {externalCta && <span className="sr-only">(opens in a new tab)</span>}
            </a>}
            <div className="home-actions"><ButtonLink href="/updates" variant="inline">Back to all updates</ButtonLink><ButtonLink href="/contact" variant="inline">Ask Modesh a question</ButtonLink></div>
          </footer>
        </article>
      </Section>
    </div>
  );
}
