import Image from 'next/image';
import { Section } from './ui/Section';
import { ButtonLink } from './ui/ButtonLink';

export function AboutView() {
  return (
    <div className="institution-page training-page">
      <Section aria-labelledby="about-story-title">
        <div className="about-story-layout">
          <div>
            <h1 id="about-story-title" className="training-title">The Story</h1>
            <div className="about-story-copy">
              <p>I was raised by a widow in a family of twelve children the 11th born. My father passed away when I was still young, leaving my mother to carry us alone with quiet strength and unwavering determination.</p>
              <p>Those experiences shaped everything. I did not just observe hardship I lived it. I understood the emotional and financial strain vulnerable women face, and how easily dignity can be lost when opportunities are limited.</p>
              <p>I founded Modesh Bakers as a starting point, and as it grew, I saw the deeper need: women who, like my mother, simply needed a chance to learn, earn, and rebuild their dignity. That realization gave birth to Modesh Empowerment Hub.</p>
              <p className="story-attribution">- Founder MEH</p>
            </div>
          </div>
          <Image src="/images/about_image.jpg" alt="A person standing behind decorated cakes" width={800} height={708} sizes="(min-width: 1024px) 42vw, 92vw" className="about-story-photo" priority />
        </div>
      </Section>
      <Section aria-labelledby="purpose-title" className="bg-surface">
        <h2 id="purpose-title" className="section-title">Why We Exist</h2>
        <p className="section-lead">We are driven by a dual mandate: to provide top-tier professional training and to foster a resilient, supportive community.</p>
        <div className="purpose-grid">
          <section aria-labelledby="mission-title">
            <h3 id="mission-title">Our Mission</h3>
            <p>To equip marginalized individuals with comprehensive baking and entrepreneurial skills in a dignified, supportive environment, enabling them to secure sustainable livelihoods and build self-reliance.</p>
            <ul>
              <li>Practical, hands-on culinary training.</li>
              <li>Business management and financial literacy.</li>
              <li>Mentorship and personal development counseling.</li>
            </ul>
          </section>
          <section aria-labelledby="vision-title">
            <h3 id="vision-title">Our Vision</h3>
            <p>A community where every individual has the opportunity, skills, and confidence to thrive economically and contribute meaningfully to society, transforming their narratives from survival to success.</p>
          </section>
        </div>
      </Section>
      <Section aria-labelledby="about-next-title" className="bg-soft-green">
        <h2 id="about-next-title" className="section-title">Explore Modesh</h2>
        <div className="home-actions"><ButtonLink href="/programs">Explore Programs</ButtonLink><ButtonLink href="/enroll" variant="secondary">Enroll Now</ButtonLink><ButtonLink href="/team" variant="inline">People &amp; Partners</ButtonLink><ButtonLink href="/contact" variant="inline">Contact Modesh</ButtonLink></div>
      </Section>
    </div>
  );
}
