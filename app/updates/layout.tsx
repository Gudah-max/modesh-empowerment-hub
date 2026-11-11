import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { updatesPublicReleaseEnabled } from '@/lib/content/release';
import '../training.css';
import '../reading.css';

// Cover the entire inactive route family, including future populated details.
// Missing/unavailable detail metadata retains its own explicit noindex guard.
export const metadata: Metadata = updatesPublicReleaseEnabled
  ? {}
  : { robots: { index: false, follow: true } };

export default function UpdatesLayout({ children }: { children: ReactNode }) {
  return children;
}
