import type { ReactNode } from 'react';

export function LegalPage({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro?: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <div className="w-full bg-background min-h-[calc(100vh-80px)] motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500">
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-primary mb-6">{title}</h1>
        {updated && (
          <p className="text-sm text-muted-foreground mb-8">Last updated: {updated}</p>
        )}
        {intro && <p className="text-lg text-foreground/80 leading-relaxed mb-10">{intro}</p>}
        <div className="space-y-8 text-foreground/80 leading-relaxed [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-primary [&_h2]:mb-3 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2">
          {children}
        </div>
      </section>
    </div>
  );
}
