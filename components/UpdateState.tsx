import { ButtonLink } from '@/components/ui/ButtonLink';

const states = {
  unconfigured: {
    title: 'Online updates are not connected yet',
    body: 'This website is not connected to the updates service yet. Please contact Modesh for current training information and opportunities.',
  },
  error: {
    title: 'Updates are temporarily unavailable',
    body: 'We could not reach the updates service or load its content. Please try again later, or contact Modesh for current information.',
  },
  empty: {
    title: 'No published updates yet',
    body: 'There are no published updates to show here at the moment. You can explore our programs or contact Modesh with a question.',
  },
  missing: {
    title: 'This update isn’t available',
    body: 'The link may be incorrect, or this update may be unpublished, removed or expired. Browse Updates & Opportunities or contact Modesh for help.',
  },
};

export function UpdateState({ kind, detail = false }: { kind: keyof typeof states; detail?: boolean }) {
  const state = states[kind];
  const Heading = detail ? 'h1' : 'h2';
  return (
    <div className="reading-help update-state">
      <Heading className={detail ? 'training-title' : 'section-title'}>{state.title}</Heading>
      <p>{state.body}</p>
      <div className="home-actions">
        <ButtonLink href={detail ? '/updates' : '/programs'} variant="secondary">{detail ? 'All Updates' : 'Explore Programs'}</ButtonLink>
        <ButtonLink href="/contact" variant="inline">Contact Modesh</ButtonLink>
      </div>
    </div>
  );
}
