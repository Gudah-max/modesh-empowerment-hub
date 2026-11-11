import { SITE_URL, SOCIAL_IMAGE } from '@/lib/metadata';
import type {Metadata} from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css'; // Global styles
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Analytics } from '@/components/Analytics';
import { WhatsAppButton } from '@/components/WhatsAppButton';

// Editorial pairing: elegant display serif for headings, clean sans for body/UI.
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Modesh Empowerment Hub',
    template: '%s | Modesh Empowerment Hub',
  },
  description: 'Empowering individuals through the art of baking and community building in Kisumu, Kenya.',
  keywords: ['baking school', 'Kisumu', 'Kenya', 'empowerment', 'vocational training', 'entrepreneurship', 'pastry', 'bread making'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Modesh Empowerment Hub',
    title: 'Modesh Empowerment Hub',
    description: 'Empowering individuals through the art of baking and community building in Kisumu, Kenya.',
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modesh Empowerment Hub',
    description: 'Empowering individuals through the art of baking and community building in Kisumu, Kenya.',
    images: [{ url: SOCIAL_IMAGE.url, alt: SOCIAL_IMAGE.alt }],
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-background text-foreground font-sans antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Header />
        <main id="main-content" tabIndex={-1} className="flex-1 shrink-0">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
        <Analytics />
      </body>
    </html>
  );
}
