'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Mail, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';

function encode(data: Record<string, string>) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
}

export function ContactView() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-6">Contact & Connect</h1>
          <p className="text-lg text-foreground/80 leading-relaxed">
            Whether you&apos;re looking to begin your baking journey, partner with our community, or simply learn more about the Modesh Empowerment Hub, we&apos;re here to help you take the next step.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
          
          {/* Left Column: Get in Touch */}
          <div className="bg-primary/5 rounded-2xl p-8 lg:p-12">
            <h2 className="font-serif text-2xl font-bold text-primary mb-8">Get in Touch</h2>
            
            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary mt-1" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-primary mb-2">Visit Us</h3>
                  <p className="text-foreground/80">Manyatta, Kisumu, Kenya<br />3185(40100) Kisumu-Kenya</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-primary mt-1" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-primary mb-2">Email</h3>
                  <a href="mailto:info@modeshempowermenthub.org" className="text-foreground/80 hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">info@modeshempowermenthub.org</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-primary mt-1" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-primary mb-2">Call</h3>
                  <a href="tel:+254726844169" className="text-foreground/80 hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">+254-726844169</a>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider text-primary mb-4">Hours of Operation</h3>
              <div className="space-y-2 text-foreground/80">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>8:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>9:00 AM - 1:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Send a Message */}
          <div className="bg-primary/5 rounded-2xl p-8 lg:p-12 flex flex-col">
            <h2 className="font-serif text-2xl font-bold text-primary mb-8">Send a Message</h2>

            {status === 'success' ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-primary mb-2">Message Sent</h3>
                <p className="text-foreground/80 max-w-sm">
                  Thank you for reaching out. We&apos;ll get back to you as soon as we can.
                </p>
              </div>
            ) : (
            <form
              name="contact"
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              className="space-y-6 flex-1 flex flex-col"
            >
              {/* Netlify form detection + honeypot */}
              <input type="hidden" name="form-name" value="contact" />
              <p className="hidden">
                <label>
                  Don&apos;t fill this out if you&apos;re human: <input name="bot-field" />
                </label>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-xs font-semibold uppercase tracking-wider text-primary">First Name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    name="firstName" 
                    required 
                    className="w-full bg-white border border-border rounded px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-primary transition-shadow" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-xs font-semibold uppercase tracking-wider text-primary">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    name="lastName" 
                    required 
                    className="w-full bg-white border border-border rounded px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-primary transition-shadow" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-primary">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required 
                  className="w-full bg-white border border-border rounded px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-primary transition-shadow" 
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="inquiryType" className="block text-xs font-semibold uppercase tracking-wider text-primary">Inquiry Type</label>
                <select 
                  id="inquiryType" 
                  name="inquiryType" 
                  required
                  className="w-full bg-white border border-border rounded px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-primary transition-shadow appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23002d19'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
                >
                  <option value="Program Enrollment">Program Enrollment</option>
                  <option value="Partnership">Partnership</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>

              <div className="space-y-2 flex-1 flex flex-col">
                <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-primary">Your Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  required 
                  rows={4}
                  className="w-full flex-1 bg-white border border-border rounded px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-primary transition-shadow resize-y" 
                ></textarea>
              </div>

              {status === 'error' && (
                <p className="text-error text-sm" role="alert">
                  Something went wrong sending your message. Please try again, or email us directly at{' '}
                  <a href="mailto:info@modeshempowermenthub.org" className="underline">info@modeshempowermenthub.org</a>.
                </p>
              )}

              <div>
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded font-medium hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? 'Sending…' : 'Send Message'}
                </button>
              </div>
            </form>
            )}
          </div>
        </div>

        {/* Map Section */}
        <div className="relative w-full h-[400px] bg-[#9eb4ad] rounded-2xl overflow-hidden mb-20 shadow-inner">
          <iframe
            title="Modesh Empowerment Hub Location"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://maps.google.com/maps?q=Manyatta,+Kisumu,+Kenya&t=&z=14&ie=UTF8&iwloc=&output=embed"
          ></iframe>
        </div>

        {/* CTA Section */}
        <div className="bg-primary/5 rounded-2xl p-12 text-center max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-primary mb-4">Ready to Begin?</h2>
          <p className="text-foreground/80 mb-8 max-w-2xl mx-auto">
            Join a community dedicated to skill-building, personal growth, and professional excellence. Start your application process today.
          </p>
          <Link 
            href="/enroll" 
            className="inline-flex items-center gap-2 bg-transparent border border-primary text-primary px-8 py-3 rounded font-medium hover:bg-primary/5 active:scale-[0.98] transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 group"
          >
            Start Your Application
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </section>
    </div>
  );
}
