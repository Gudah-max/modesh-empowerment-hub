'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/programs', label: 'Programs' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/team', label: 'Team' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link 
            href="/" 
            className="flex items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 p-1"
            aria-label="Modesh Empowerment Hub Home"
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
              <Image 
                src="/images/modesh_logo_transparent_background.png" 
                alt="Modesh Empowerment Hub Logo" 
                fill 
                className="object-contain"
              />
            </div>
             <span className="font-serif font-bold text-lg sm:text-xl tracking-tight text-primary leading-tight">
               Modesh<br className="hidden sm:block lg:hidden" /> Empowerment Hub
             </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-4 lg:gap-8 items-center" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`text-sm font-semibold tracking-wide uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full px-4 py-2 hover:text-primary ${
                    isActive ? 'text-primary bg-primary/10' : 'text-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center">
            <Link 
              href="/enroll" 
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded font-medium hover:bg-primary/90 active:scale-[0.98] transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Enroll Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.95] transition-transform"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col py-4 px-4 space-y-2" aria-label="Mobile Navigation">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`text-left text-sm font-semibold tracking-wide uppercase px-4 py-3 rounded transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isActive ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-surface-variant'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-4 pb-2">
              <Link 
                href="/enroll" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full bg-primary text-primary-foreground px-6 py-3 rounded font-medium hover:bg-primary/90 active:scale-[0.98] transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Enroll Now
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
