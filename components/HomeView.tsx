import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Section } from './ui/Section';
import { ButtonLink } from './ui/ButtonLink';
import { partners, homeFeatures } from '@/lib/content/home';

export function HomeView() {
  return (<>
    <Section aria-labelledby="home-title">
      <div className="home-hero"><div>
        <h1 id="home-title">Where Baking Builds Dignified Lives.</h1>
        <p className="section-lead">Hands-on baking and entrepreneurship training in Manyatta, Kisumu. Develop practical skills, build confidence, and explore new opportunities.</p>
        <div className="home-actions"><ButtonLink href="/enroll">Enroll Now <ArrowRight size={18} aria-hidden="true" /></ButtonLink><ButtonLink href="/programs" variant="secondary">Explore Programs</ButtonLink></div>
      </div><div className="hero-photo">
        <Image src="/images/hero-9.jpeg" alt="A baking demonstration with tiered cakes and seated participants" fill priority sizes="(min-width: 1280px) 691px, (min-width: 1024px) 56vw, (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)" className="object-cover" />
      </div></div>
    </Section>
    <Section className="bg-soft-green" aria-labelledby="programs-title">
      <div className="section-heading-row"><div><h2 id="programs-title" className="section-title">Find your place in baking.</h2><p className="section-lead">Discover our structured courses designed to take you from basics to professional mastery.</p></div><ButtonLink href="/programs" variant="inline">Explore all programs <ArrowRight size={18} aria-hidden="true" /></ButtonLink></div>
      <div className="course-preview-grid">{homeFeatures.map(program => (
        <article key={program.title} className="course-preview">
          <div className="course-preview-photo"><Image src={program.img} alt={program.title} fill sizes="(min-width: 1280px) 389px, (min-width: 1024px) 31vw, (min-width: 768px) 46vw, 92vw" className="object-cover" /></div>
          <div className="course-preview-body"><span className="course-level">{program.tag}</span><h3>{program.title}</h3><p>{program.desc}</p><ButtonLink href="/programs#courses" variant="inline" aria-label={'Explore programs: ' + program.title}>Explore programs <ArrowRight size={18} aria-hidden="true" /></ButtonLink></div>
        </article>
      ))}</div>
    </Section>
    <Section aria-labelledby="learning-title"><div className="learning-layout">
      <div><h2 id="learning-title" className="section-title">Baking skills. A foundation for independence.</h2><p className="section-lead">Modesh Empowerment Hub helps individuals learn comprehensive baking methods, fostering independence and entrepreneurial success.</p>
        <ul className="learning-list"><li>Practical, hands-on culinary training.</li><li>Business management and financial literacy.</li></ul>
        <ButtonLink href="/programs#enrollment" variant="inline">See how to join Modesh <ArrowRight size={18} aria-hidden="true" /></ButtonLink>
      </div><div className="impact-copy lg:mt-0"><h3>Our Impact</h3><p>Every learner who walks through our doors leaves with more than a skill — they leave with confidence, a livelihood, and a renewed sense of dignity. From first-time bakers to community entrepreneurs, our graduates are building sustainable futures for themselves and their families across Kisumu and beyond.</p><ButtonLink href="/about" variant="inline" className="mt-4">Our mission and approach <ArrowRight size={18} aria-hidden="true" /></ButtonLink></div>
    </div></Section>
    <Section className="bg-surface border-y border-border" aria-labelledby="story-title"><div className="story-layout">
      <Image src="/images/about_image.jpg" alt="A person standing behind decorated cakes" width={800} height={708} sizes="(min-width: 1280px) 480px, (min-width: 1024px) 40vw, 92vw" className="story-photo" />
      <div className="story-copy"><h2 id="story-title" className="section-title">The story behind Modesh.</h2>
        <p>I was raised by a widow in a family of twelve children the 11th born. My father passed away when I was still young, leaving my mother to carry us alone with quiet strength and unwavering determination.</p>
        <p>Those experiences shaped everything. I did not just observe hardship I lived it. I understood the emotional and financial strain vulnerable women face, and how easily dignity can be lost when opportunities are limited.</p>
        <p>I founded Modesh Bakers as a starting point, and as it grew, I saw the deeper need: women who, like my mother, simply needed a chance to learn, earn, and rebuild their dignity. That realization gave birth to Modesh Empowerment Hub.</p>
        <p className="font-semibold text-forest">- Founder MEH</p><ButtonLink href="/about" variant="inline" className="mt-4">Our story and mission <ArrowRight size={18} aria-hidden="true" /></ButtonLink>
      </div>
    </div></Section>
    <Section aria-labelledby="student-life-title">
      <div className="section-heading-row"><div><h2 id="student-life-title" className="section-title">See the learning. See the work.</h2><p className="section-lead">Baking, making and learning together at Modesh.</p></div><ButtonLink href="/gallery" variant="inline">Explore student life <ArrowRight size={18} aria-hidden="true" /></ButtonLink></div>
      <div className="student-photo-grid"><div className="student-photo"><Image src="/images/hero_empoering_communities_small_image.jpeg" alt="People preparing food together in a kitchen" fill sizes="(min-width: 1280px) 596px, (min-width: 640px) 46vw, 92vw" className="object-cover" /></div><div className="student-photo"><Image src="/images/hero-4.jpeg" alt="Participants seated together during a baking session" fill sizes="(min-width: 1280px) 596px, (min-width: 640px) 46vw, 92vw" className="object-cover" /></div></div>
    </Section>
    <Section className="bg-surface border-t border-border" aria-labelledby="partners-title">
      <div className="section-heading-row"><h2 id="partners-title" className="section-title">In partnership with</h2><ButtonLink href="/team" variant="inline">People &amp; Partners <ArrowRight size={18} aria-hidden="true" /></ButtonLink></div>
      <ul className="partner-grid">{partners.map(partner => <li key={partner.name}><div className="partner-logo"><Image src={partner.src} alt={partner.name} fill sizes="(min-width: 768px) 240px, 120px" className="object-contain" /></div></li>)}</ul>
    </Section>
  </>);
}

export function HomeEnrollment() {
  return (<Section className="home-close" aria-labelledby="enrollment-title">
    <h2 id="enrollment-title" className="section-title">Your next chapter starts here.</h2><p className="section-lead">Explore baking training at Modesh in Kisumu. Apply online or contact us with your questions.</p>
    <div className="home-actions"><ButtonLink href="/enroll">Enroll Now <ArrowRight size={18} aria-hidden="true" /></ButtonLink><ButtonLink href="/contact" variant="secondary">Contact Modesh</ButtonLink></div>
    <div className="close-contact"><a href="tel:+254726844169">Call +254-726844169</a><a href="https://wa.me/254726844169" target="_blank" rel="noopener noreferrer">Ask on WhatsApp</a><a href="/faq">Frequently asked questions</a></div>
  </Section>);
}
