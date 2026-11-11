import { pageMetadata } from '@/lib/metadata';
import '../training.css';
import '../institution.css';
import { AboutView } from '@/components/AboutView';

export const metadata = pageMetadata('/about', 'About', 'Read the story, mission and vision behind Modesh Empowerment Hub in Manyatta, Kisumu.');

export default function AboutPage() {
  return <AboutView />;
}
