import type { Metadata } from 'next';

// Existing production identity; this is metadata, not deployment configuration.
export const SITE_URL = 'https://modeshempowermenthub.org';
export const SITE_NAME = 'Modesh Empowerment Hub';
export const SOCIAL_IMAGE = {
  url: '/opengraph-image.jpeg',
  width: 1600,
  height: 1067,
  alt: 'Decorated cakes displayed on a kitchen counter',
};

/** Explicit nested social fields avoid inheriting the homepage's identity. */
export function pageMetadata(path: string, title: string, description: string): Metadata {
  const shareTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  return {
    title: title === SITE_NAME ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: SITE_NAME,
      title: shareTitle,
      description,
      url: path,
      images: [SOCIAL_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: shareTitle,
      description,
      images: [{ url: SOCIAL_IMAGE.url, alt: SOCIAL_IMAGE.alt }],
    },
  };
}
