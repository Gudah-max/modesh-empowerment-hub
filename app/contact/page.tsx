import { pageMetadata } from '@/lib/metadata';
import '../training.css';
import '../institution.css';
import { ContactView } from '@/components/ContactView';

export const metadata = pageMetadata('/contact', 'Contact', 'Contact Modesh Empowerment Hub with a question about training, enrollment or partnerships in Manyatta, Kisumu.');

export default function ContactPage() {
  return <ContactView />;
}
