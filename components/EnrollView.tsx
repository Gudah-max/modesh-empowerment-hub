'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const courses = [
  { slug: 'professional-baking', label: 'Professional Baking' },
  { slug: 'pastry-arts', label: 'Pastry Arts' },
  { slug: 'artisan-bread-making', label: 'Artisan Bread Making' },
  { slug: 'bakery-entrepreneurship', label: 'Bakery Entrepreneurship' },
];

const selectChevron = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23002d19'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 1rem center',
  backgroundSize: '1.25rem',
} as const;

function encode(data: Record<string, string>) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
}

export function EnrollView() {
  const searchParams = useSearchParams();
  const courseParam = searchParams.get('course');
  const preselected = courses.find((c) => c.slug === courseParam)?.label ?? '';

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

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
      const res = await fetch('/', {
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
    <div className="w-full bg-background min-h-[calc(100vh-80px)] motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500">
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-6">Enroll Today</h1>
          <p className="text-lg text-foreground/80 leading-relaxed">
            Take the first step toward a dignified livelihood. Complete the form below and our admissions team will
            reach out to guide you through the next steps.
          </p>
        </div>

        {status === 'success' ? (
          <div className="bg-primary/5 rounded-2xl p-10 lg:p-14 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-primary mb-3">Application Received</h2>
            <p className="text-foreground/80 mb-8 max-w-md mx-auto">
              Thank you for applying to Modesh Empowerment Hub. Our admissions team will be in touch soon. In the
              meantime, feel free to explore our programs.
            </p>
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded font-medium hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 group"
            >
              View Programs <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          <form
            name="enroll"
            method="POST"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            className="bg-primary/5 rounded-2xl p-8 lg:p-12 space-y-6"
          >
            {/* Netlify form detection + honeypot */}
            <input type="hidden" name="form-name" value="enroll" />
            <p className="hidden">
              <label>
                Don&apos;t fill this out if you&apos;re human: <input name="bot-field" />
              </label>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-xs font-semibold uppercase tracking-wider text-primary">First Name</label>
                <input type="text" id="firstName" name="firstName" required className="w-full bg-white border border-border rounded px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-primary transition-shadow" />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-xs font-semibold uppercase tracking-wider text-primary">Last Name</label>
                <input type="text" id="lastName" name="lastName" required className="w-full bg-white border border-border rounded px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-primary transition-shadow" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-primary">Email Address</label>
                <input type="email" id="email" name="email" required className="w-full bg-white border border-border rounded px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-primary transition-shadow" />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-primary">Phone Number</label>
                <input type="tel" id="phone" name="phone" required className="w-full bg-white border border-border rounded px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-primary transition-shadow" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="course" className="block text-xs font-semibold uppercase tracking-wider text-primary">Course of Interest</label>
                <select
                  id="course"
                  name="course"
                  required
                  defaultValue={preselected}
                  className="w-full bg-white border border-border rounded px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-primary transition-shadow appearance-none"
                  style={selectChevron}
                >
                  <option value="" disabled>Select a course</option>
                  {courses.map((c) => (
                    <option key={c.slug} value={c.label}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="startDate" className="block text-xs font-semibold uppercase tracking-wider text-primary">Preferred Start</label>
                <input type="text" id="startDate" name="startDate" placeholder="e.g. Next intake" className="w-full bg-white border border-border rounded px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-primary transition-shadow" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-primary">Anything else we should know? <span className="text-foreground/50 normal-case font-normal">(optional)</span></label>
              <textarea id="message" name="message" rows={4} className="w-full bg-white border border-border rounded px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-primary transition-shadow resize-y"></textarea>
            </div>

            {status === 'error' && (
              <p className="text-error text-sm" role="alert">
                Something went wrong submitting your application. Please try again, or email us at{' '}
                <a href="mailto:info@modeshempowermenthub.org" className="underline">info@modeshempowermenthub.org</a>.
              </p>
            )}

            <div>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="bg-primary text-primary-foreground px-8 py-3 rounded font-medium hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? 'Submitting…' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
