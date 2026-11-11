'use client';

import { useEffect } from 'react';
import { Section } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/ButtonLink';

/** Unexpected render errors, separate from expected CMS read failures. */
export default function UpdatesError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('[updates] render error:', error); }, [error]);
  return <div className="training-page reading-page"><Section>
    <div className="update-state">
      <h1 className="training-title">We couldn&apos;t load this page</h1>
      <p className="section-lead" role="alert">Something went wrong while loading our updates. Please try again, or contact Modesh for help.</p>
      <div className="home-actions">
        <button type="button" onClick={reset} className="button-link button-link--primary">Try Again</button>
        <ButtonLink href="/updates" variant="secondary">All Updates</ButtonLink>
        <ButtonLink href="/contact" variant="inline">Contact Modesh</ButtonLink>
      </div>
    </div>
  </Section></div>;
}
