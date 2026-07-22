import Link from 'next/link';
import { LegalPage } from '@/components/LegalPage';

export const metadata = {
  title: 'FAQ',
  description: 'Answers to common questions about enrolling in Modesh Empowerment Hub programs.',
};

const faqs = [
  {
    q: 'Who can enroll at Modesh Empowerment Hub?',
    a: 'Our programs are open to individuals seeking to build baking and entrepreneurship skills, with a special focus on empowering marginalized and vulnerable community members. No prior experience is required for our beginner courses.',
  },
  {
    q: 'What programs do you offer?',
    a: 'We offer Professional Baking, Pastry Arts, Artisan Bread Making, and Bakery Entrepreneurship. Each program ranges from 4 to 12 weeks. See the Programs page for full details.',
  },
  {
    q: 'How do I enroll?',
    a: 'Submit the enrollment form with your details and preferred course. Our admissions team will contact you for a short interview, and then help you complete registration to secure your spot.',
  },
  {
    q: 'Where are you located?',
    a: 'We are based in Manyatta, Kisumu, Kenya. You can find directions and our contact details on the Contact page.',
  },
  {
    q: 'What are your operating hours?',
    a: 'Monday to Friday, 8:00 AM – 5:00 PM, and Saturday, 9:00 AM – 1:00 PM.',
  },
  {
    q: 'Do you offer support beyond training?',
    a: 'Yes. Alongside hands-on training, we provide business and financial-literacy guidance, mentorship, and personal development support to help graduates build sustainable livelihoods.',
  },
];

export default function FAQPage() {
  return (
    <LegalPage
      title="Frequently Asked Questions"
      intro="Answers to the questions we hear most often. If you don't see yours here, we're happy to help."
    >
      {faqs.map((item) => (
        <div key={item.q}>
          <h2>{item.q}</h2>
          <p>{item.a}</p>
        </div>
      ))}
      <div>
        <h2>Still have questions?</h2>
        <p>
          Reach out any time at{' '}
          <a href="mailto:info@modeshempowermenthub.org">info@modeshempowermenthub.org</a>, or{' '}
          <Link href="/enroll">start your application</Link>.
        </p>
      </div>
    </LegalPage>
  );
}
