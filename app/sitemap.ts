import type { MetadataRoute } from 'next';

const siteUrl = 'https://modeshempowermenthub.org';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/about', '/programs', '/gallery', '/team', '/contact', '/enroll', '/faq', '/privacy', '/terms'];
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/enroll' || route === '/programs' ? 0.8 : 0.5,
  }));
}
