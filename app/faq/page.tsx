import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { PageIntro } from '@/components/ui/PageIntro';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { pageMetadata } from '@/lib/metadata';
import '../training.css';
import '../reading.css';

export const metadata = pageMetadata('/faq', 'FAQ', 'Answers to common questions about enrolling in Modesh Empowerment Hub programs.');

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
  const groups = [
    { id: 'training', title: 'Training and enrollment', items: faqs.slice(0, 3) },
    { id: 'visiting', title: 'Visiting the Hub', items: faqs.slice(3, 5) },
    { id: 'support', title: 'Support beyond training', items: faqs.slice(5) },
  ];
  return (
    <div className="training-page reading-page">
      <Section>
        <PageIntro title="Frequently Asked Questions">
          <p>Answers to the questions we hear most often. If you don&apos;t see yours here, we&apos;re happy to help.</p>
        </PageIntro>
      </Section>
      <Section className="reading-content">
        <div className="faq-layout">
          <nav aria-label="FAQ topics" className="faq-topics">
            {groups.map(group => <a key={group.id} href={`#${group.id}`}>{group.title}</a>)}
            <a href="#questions">Still have questions?</a>
          </nav>
          <div className="faq-answers">
            {groups.map(group => (
              <section key={group.id} id={group.id} aria-labelledby={`${group.id}-heading`}>
                <h2 className="section-title" id={`${group.id}-heading`}>{group.title}</h2>
                {group.items.map(item => (
                  <div className="faq-answer" key={item.q}>
                    <h3>{item.q}</h3>
                    <p>{item.a}</p>
                    {item === faqs[1] && <ButtonLink href="/programs" variant="inline">Explore Programs</ButtonLink>}
                    {item === faqs[2] && <>
                      <p>Submitting an enrollment form is an expression of interest, not a guarantee of a place. Read our <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>.</p>
                      <ButtonLink href="/enroll" variant="inline">Start your application</ButtonLink>
                    </>}
                    {item === faqs[3] && <ButtonLink href="/contact" variant="inline">Contact and directions</ButtonLink>}
                  </div>
                ))}
              </section>
            ))}
            <section id="questions" aria-labelledby="questions-heading" className="reading-help">
              <h2 className="section-title" id="questions-heading">Still have questions?</h2>
              <p>Reach out any time at <a href="mailto:info@modeshempowermenthub.org">info@modeshempowermenthub.org</a>, or <Link href="/enroll">start your application</Link>.</p>
              <ButtonLink href="/contact">Contact Modesh</ButtonLink>
            </section>
          </div>
        </div>
      </Section>
    </div>
  );
}
