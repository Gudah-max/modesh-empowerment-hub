import { pageMetadata } from '@/lib/metadata';
import { ProgramsView } from '@/components/ProgramsView';
import '../training.css';

export const metadata = pageMetadata('/programs', 'Programs', 'Explore baking, pastry, bread-making and bakery entrepreneurship courses at Modesh Empowerment Hub in Kisumu.');

export default function ProgramsPage() {
  return <ProgramsView />;
}
