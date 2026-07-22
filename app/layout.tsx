import type {Metadata} from 'next';
import { Literata } from 'next/font/google';
import './globals.css'; // Global styles
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Analytics } from '@/components/Analytics';

const literata = Literata({
  subsets: ['latin'],
  variable: '--font-literata',
});

const siteUrl = 'https://modeshempowermenthub.org';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Modesh Empowerment Hub',
    template: '%s | Modesh Empowerment Hub',
  },
  description: 'Empowering individuals through the art of baking and community building in Kisumu, Kenya.',
  keywords: ['baking school', 'Kisumu', 'Kenya', 'empowerment', 'vocational training', 'entrepreneurship', 'pastry', 'bread making'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Modesh Empowerment Hub',
    title: 'Modesh Empowerment Hub',
    description: 'Empowering individuals through the art of baking and community building in Kisumu, Kenya.',
    images: [{ url: '/opengraph-image.jpeg', alt: 'Modesh Empowerment Hub' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modesh Empowerment Hub',
    description: 'Empowering individuals through the art of baking and community building in Kisumu, Kenya.',
    images: ['/opengraph-image.jpeg'],
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${literata.variable}`}>
      <body className="bg-background text-foreground font-serif antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <Header />
        <main className="flex-1 shrink-0">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
