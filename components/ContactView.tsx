'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Section } from './ui/Section';
import { PageIntro } from './ui/PageIntro';
import { ButtonLink } from './ui/ButtonLink';

function encode(data: Record<string, string>) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
}

export function ContactView() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const confirmation = useRef<HTMLHeadingElement>(null);
  const error = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (status === 'success') confirmation.current?.focus();
    if (status === 'error') error.current?.focus();
  }, [status]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data: Record<string, string> = { 'form-name': 'contact' };
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    try {
      // The Next.js Netlify adapter requires a static HTML submission target.
      const res = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode(data),
      });
      if (!res.ok) throw new Error('Submission failed');
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="institution-page training-page">
      <p className="sr-only" role={status === 'success' ? undefined : 'status'} aria-live={status === 'success' ? undefined : 'polite'}>{status === 'submitting' ? 'Sending your message. Please wait.' : ''}</p>
      <Section><PageIntro title="Contact & Connect"><p>Whether you&apos;re looking to begin your baking journey, partner with our community, or simply learn more about the Modesh Empowerment Hub, we&apos;re here to help you take the next step.</p></PageIntro></Section>
      <Section aria-label="Contact information and message form" className="institution-content-start">
        <div className="contact-layout">
          <section className="contact-details" aria-labelledby="contact-details-title">
            <h2 id="contact-details-title" className="section-title">Get in Touch</h2>
            <div><h3>Visit Us</h3><address>Manyatta, Kisumu, Kenya<br />3185(40100) Kisumu-Kenya</address></div>
            <div><h3>Email</h3><a href="mailto:info@modeshempowermenthub.org">info@modeshempowermenthub.org</a></div>
            <div><h3>Call</h3><a href="tel:+254726844169">+254-726844169</a></div>
            <div><h3>Hours of Operation</h3><dl className="contact-hours"><div><dt>Monday - Friday</dt><dd>8:00 AM - 5:00 PM</dd></div><div><dt>Saturday</dt><dd>9:00 AM - 1:00 PM</dd></div></dl></div>
            <ButtonLink href="https://wa.me/254726844169" target="_blank" rel="noopener noreferrer" variant="secondary">Chat on WhatsApp</ButtonLink>
          </section>
          <section className="contact-message" aria-labelledby="contact-message-title">
            <h2 id="contact-message-title" className="section-title">Send a Message</h2>
            {status === 'success' ? (
              <div role="status" aria-live="polite" aria-atomic="true" className="contact-confirmation">
                <CheckCircle2 size={36} aria-hidden="true" className="text-primary" />
                <h3 ref={confirmation} tabIndex={-1}>Message Sent</h3>
                <p>Thank you for reaching out. We&apos;ll get back to you as soon as we can.</p>
                <ButtonLink href="/programs" variant="inline">Explore Programs</ButtonLink>
              </div>
            ) : (
              <form name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={handleSubmit}
                aria-labelledby="contact-message-title" aria-describedby={status === 'error' ? 'contact-guidance contact-error' : 'contact-guidance'} aria-busy={status === 'submitting'}>
                <input type="hidden" name="form-name" value="contact" />
                <p className="hidden"><label>Don&apos;t fill this out if you&apos;re human: <input name="bot-field" /></label></p>
                <p id="contact-guidance" className="form-guidance">All fields are required.</p>
                <div className="enrollment-field-grid">
                  <div className="enrollment-field"><label htmlFor="firstName">First Name <span>(required)</span></label><input type="text" id="firstName" name="firstName" autoComplete="given-name" required /></div>
                  <div className="enrollment-field"><label htmlFor="lastName">Last Name <span>(required)</span></label><input type="text" id="lastName" name="lastName" autoComplete="family-name" required /></div>
                </div>
                <div className="enrollment-field"><label htmlFor="email">Email Address <span>(required)</span></label><input type="email" id="email" name="email" autoComplete="email" inputMode="email" required /></div>
                <div className="enrollment-field"><label htmlFor="inquiryType">Inquiry Type <span>(required)</span></label><select id="inquiryType" name="inquiryType" required><option value="Program Enrollment">Program Enrollment</option><option value="Partnership">Partnership</option><option value="General Inquiry">General Inquiry</option></select></div>
                <div className="enrollment-field"><label htmlFor="message">Your Message <span>(required)</span></label><textarea id="message" name="message" required rows={4} /></div>
                <p className="application-privacy">We do not sell or rent your personal information. Read our <Link href="/privacy">Privacy Policy</Link>.</p>
                {status === 'error' && <p id="contact-error" ref={error} tabIndex={-1} className="enrollment-error" role="alert">Something went wrong sending your message. Please try again, or email us directly at <a href="mailto:info@modeshempowermenthub.org">info@modeshempowermenthub.org</a>.</p>}
                <div className="enrollment-submit"><button type="submit" disabled={status === 'submitting'} className="button-link button-link--primary">{status === 'submitting' ? 'Sending…' : 'Send Message'}</button></div>
              </form>
            )}
          </section>
        </div>
      </Section>
      <Section aria-labelledby="contact-map-title" className="bg-surface">
        <h2 id="contact-map-title" className="section-title">Manyatta, Kisumu</h2>
        <p className="section-lead">The map shows Manyatta, Kisumu. Contact Modesh for directions.</p>
        <ButtonLink href="https://maps.google.com/maps?q=Manyatta,+Kisumu,+Kenya" target="_blank" rel="noopener noreferrer" variant="inline">Open Manyatta in Google Maps</ButtonLink>
        <div className="contact-map"><iframe title="Manyatta, Kisumu area map" width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=Manyatta,+Kisumu,+Kenya&t=&z=14&ie=UTF8&iwloc=&output=embed" /></div>
      </Section>
      <Section aria-labelledby="contact-next-title" className="bg-soft-green">
        <h2 id="contact-next-title" className="section-title">Ready to Begin?</h2>
        <p className="section-lead">Join a community dedicated to skill-building, personal growth, and professional excellence. Start your application process today.</p>
        <div className="home-actions"><ButtonLink href="/enroll">Start Your Application <ArrowRight size={18} aria-hidden="true" /></ButtonLink><ButtonLink href="/programs" variant="secondary">Explore Programs</ButtonLink><ButtonLink href="/faq" variant="inline">Frequently asked questions</ButtonLink></div>
      </Section>
    </div>
  );
}
