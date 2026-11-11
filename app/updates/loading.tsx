import { Section } from '@/components/ui/Section';

/** Text status avoids decorative motion and fictitious cards while loading. */
export default function Loading() {
  return <div className="training-page reading-page"><Section>
    <h1 className="training-title">Updates &amp; Opportunities</h1>
    <p className="section-lead" role="status">Loading updates…</p>
  </Section></div>;
}
