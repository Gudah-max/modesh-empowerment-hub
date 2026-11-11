'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { CourseOption } from '@/lib/content/course-types';
import { Section } from './ui/Section';
import { PageIntro } from './ui/PageIntro';
import { ButtonLink } from './ui/ButtonLink';

function encode(data: Record<string, string>) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
}

export function EnrollView({ courses }: { courses: readonly CourseOption[] }) {
  const searchParams = useSearchParams();
  const courseParam = searchParams.get('course');
  const preselected = courses.find(course => course.slug === courseParam)?.label ?? '';
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
    const data: Record<string, string> = { 'form-name': 'enroll' };
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
    <div className="training-page">
      <p className="sr-only" role={status === 'success' ? undefined : 'status'} aria-live={status === 'success' ? undefined : 'polite'}>
        {status === 'submitting' ? 'Submitting your application. Please wait.' : ''}
      </p>
      <Section>
        <PageIntro title="Enroll at Modesh">
          <p>Apply for baking and entrepreneurship training in Manyatta, Kisumu. Choose a course and share your contact details below.</p>
        </PageIntro>
      </Section>
      <Section className="enrollment-section" aria-label="Enrollment application">
        <div className="enrollment-layout">
          {status === 'success' ? (
            <div className="enrollment-confirmation" role="status" aria-live="polite" aria-atomic="true">
              <CheckCircle2 size={36} aria-hidden="true" className="text-primary" />
              <h2 ref={confirmation} tabIndex={-1} className="section-title">Application Received</h2>
              <p>Thank you for applying to Modesh Empowerment Hub.</p>
              <p>Submitting an enrollment form is an expression of interest, not a guarantee of a place.</p>
              <p>You can contact Modesh with questions about your application.</p>
              <div className="home-actions"><ButtonLink href="/programs">View Programs <ArrowRight size={18} aria-hidden="true" /></ButtonLink><ButtonLink href="/contact" variant="secondary">Contact Modesh</ButtonLink></div>
            </div>
          ) : (
            <form name="enroll" method="POST" data-netlify="true" data-netlify-honeypot="bot-field"
              onSubmit={handleSubmit} className="enrollment-form" aria-labelledby="application-title"
              aria-describedby={status === 'error' ? 'application-guidance enrollment-error' : 'application-guidance'}
              aria-busy={status === 'submitting'}>
              <input type="hidden" name="form-name" value="enroll" />
              <p className="hidden"><label>Don&apos;t fill this out if you&apos;re human: <input name="bot-field" /></label></p>
              <h2 id="application-title" className="section-title">Your application</h2>
              <p id="application-guidance" className="form-guidance">Fields marked required must be completed. Preferred start and your message are optional.</p>
              <fieldset>
                <legend>Your contact details</legend>
                <div className="enrollment-field-grid">
                  <div className="enrollment-field"><label htmlFor="firstName">First Name <span>(required)</span></label><input type="text" id="firstName" name="firstName" autoComplete="given-name" required /></div>
                  <div className="enrollment-field"><label htmlFor="lastName">Last Name <span>(required)</span></label><input type="text" id="lastName" name="lastName" autoComplete="family-name" required /></div>
                  <div className="enrollment-field"><label htmlFor="email">Email Address <span>(required)</span></label><input type="email" id="email" name="email" autoComplete="email" inputMode="email" required /></div>
                  <div className="enrollment-field"><label htmlFor="phone">Phone Number <span>(required)</span></label><input type="tel" id="phone" name="phone" autoComplete="tel" inputMode="tel" required /></div>
                </div>
              </fieldset>
              <fieldset>
                <legend>Your training interests</legend>
                <div className="enrollment-field">
                  <label htmlFor="course">Course of Interest <span>(required)</span></label>
                  <select key={courseParam ?? ''} id="course" name="course" required defaultValue={preselected} aria-describedby="course-help">
                    <option value="" disabled>Select a course</option>
                    {courses.map(course => <option key={course.slug} value={course.label}>{course.label}</option>)}
                  </select>
                  <p id="course-help" className="field-help">Compare course details on our <Link href="/programs">Programs page</Link>.</p>
                </div>
                <div className="enrollment-field">
                  <label htmlFor="startDate">Preferred Start <span>(optional)</span></label>
                  <input type="text" id="startDate" name="startDate" placeholder="Tell us your preference" aria-describedby="start-help" />
                  <p id="start-help" className="field-help">This preference does not confirm a training date.</p>
                </div>
              </fieldset>
              <div className="enrollment-field"><label htmlFor="message">Anything else we should know? <span>(optional)</span></label><textarea id="message" name="message" rows={4} /></div>
              <p className="application-privacy">We do not sell or rent your personal information. Read our <Link href="/privacy">Privacy Policy</Link> and <Link href="/terms">Terms of Service</Link>.</p>
              {status === 'error' && <p id="enrollment-error" ref={error} tabIndex={-1} className="enrollment-error" role="alert">Something went wrong submitting your application. Please try again, or email us at <a href="mailto:info@modeshempowermenthub.org">info@modeshempowermenthub.org</a>.</p>}
              <div className="enrollment-submit">
                <button type="submit" disabled={status === 'submitting'} className="button-link button-link--primary">{status === 'submitting' ? 'Submitting…' : 'Submit Application'}</button>
                <p aria-hidden="true" className="field-help">{status === 'submitting' ? 'Submitting your application. Please wait.' : ''}</p>
              </div>
            </form>
          )}
          {status !== 'success' && <aside className="enrollment-help" aria-labelledby="application-help-title">
            <h2 id="application-help-title">Application guidance</h2>
            <div><h3>Choose your course</h3><p>Compare the course descriptions and practical skills to find your starting point.</p><ButtonLink href="/programs" variant="inline">Explore programs <ArrowRight size={18} aria-hidden="true" /></ButtonLink></div>
            <div><h3>After you apply</h3><p>Submitting an enrollment form is an expression of interest, not a guarantee of a place.</p><p>You can contact Modesh with questions about your application.</p><ButtonLink href="/terms" variant="inline">Read our terms</ButtonLink></div>
            <div><h3>Have a question?</h3><p>Ask about training before completing your application.</p><ButtonLink href="https://wa.me/254726844169" target="_blank" rel="noopener noreferrer" variant="secondary">Ask on WhatsApp</ButtonLink><ButtonLink href="/faq" variant="inline">Frequently asked questions</ButtonLink></div>
          </aside>}
        </div>
      </Section>
    </div>
  );
}
