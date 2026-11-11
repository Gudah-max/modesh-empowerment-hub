import Image from 'next/image';
import { Section } from './ui/Section';
import { PageIntro } from './ui/PageIntro';
import { ButtonLink } from './ui/ButtonLink';

export function TeamView() {
  const team = [
    {
      name: 'Moureen Odera',
      role: 'DIRECTOR',
      desc: 'Moureen brings over 15 years of experience in community development and vocational training, steering Modesh with a steady hand and a compassionate heart.',
      img: '/images/odera_moureen_director.jpg'
    },
    {
      name: 'A. Odera',
      role: 'CEO',
      desc: 'With a background in enterprise management, A. Odera ensures the hub remains financially sustainable while maximizing its social impact in the community.',
      img: '/images/odera_a_ceo.jpg'
    }
    // TODO: add the Office Manager (and any other confirmed team members) once real names, photos, and bios are supplied.
  ];

  const partners = [
    { name: 'GIZ', src: '/images/giz_logo.png' },
    { name: 'SOMO', src: '/images/somo_logo.png' },
    { name: 'SHOFCO', src: '/images/shofco_logo.png' },
    { name: 'FAO', src: '/images/fao_logo.png' },
    { name: 'NITA', src: '/images/nita_logo.png' },
    { name: 'World Travel', src: '/images/world_travel_logo.png' },
    { name: 'KIDI', src: '/images/kenya_industrial_development_institute_logo.png' },
    { name: 'Cloud Solution', src: '/images/cloud_solution_logo.png' }
  ];

  return (
    <div className="institution-page training-page">
      <Section><PageIntro title="Our People & Partners"><p>Meet the dedicated leadership team guiding Modesh Empowerment Hub, and discover the invaluable partners who help make our vision a reality.</p></PageIntro></Section>
      <Section aria-labelledby="leadership-title" className="institution-content-start">
        <h2 id="leadership-title" className="section-title">The Leadership Team</h2>
        <div className="leadership-grid">
          {team.map(member => <article key={member.name} className="leadership-profile">
            <div className="leadership-photo"><Image src={member.img} alt={member.name} fill sizes="(min-width: 1280px) 596px, (min-width: 768px) 46vw, 92vw" className="object-contain" /></div>
            <div className="leadership-copy"><h3>{member.name}</h3><p className="leadership-role">{member.role}</p><p>{member.desc}</p></div>
          </article>)}
        </div>
      </Section>
      <Section aria-labelledby="team-partners-title" className="bg-surface">
        <h2 id="team-partners-title" className="section-title">Our Partners</h2>
        <p className="section-lead">We are deeply grateful for the unwavering support of our institutional partners. Their commitment empowers us to provide high-quality training and build a stronger, more resilient community.</p>
        <div className="institution-partners">{partners.map(partner => <div key={partner.name} className="institution-partner"><Image src={partner.src} alt={partner.name} fill sizes="(min-width: 768px) 22vw, 44vw" className="object-contain" /></div>)}</div>
        <div className="home-actions"><ButtonLink href="/about" variant="inline">Our Story</ButtonLink><ButtonLink href="/contact" variant="secondary">Contact Modesh</ButtonLink></div>
      </Section>
    </div>
  );
}
