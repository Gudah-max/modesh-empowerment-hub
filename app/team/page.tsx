import { pageMetadata } from '@/lib/metadata';
import '../training.css';
import '../institution.css';
import { TeamView } from '@/components/TeamView';

export const metadata = pageMetadata('/team', 'Team', 'Meet Modesh Empowerment Hub’s leadership and explore the partner directory.');

export default function TeamPage() {
  return <TeamView />;
}
