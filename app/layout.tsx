import type {Metadata} from 'next';
import { Literata } from 'next/font/google';
import './globals.css'; // Global styles
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const literata = Literata({
  subsets: ['latin'],
  variable: '--font-literata',
});

export const metadata: Metadata = {
  title: 'Modesh Empowerment Hub',
  description: 'Empowering individuals through the art of baking and community building.',
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
      </body>
    </html>
  );
}
