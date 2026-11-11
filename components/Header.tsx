'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Brand } from './Brand';
import { Container } from './ui/Container';
import { ButtonLink } from './ui/ButtonLink';
import { primaryNavigation } from '@/lib/content/navigation';

export function Header() {
  const [openPath, setOpenPath] = useState<string | null>(null);
  const pathname = usePathname();
  const open = openPath === pathname;
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const element = header.current;
    if (!element) return;
    // Keep the ordinary sticky layout, but let enlarged rows/open menus scroll
    // with the page when they exceed the focus offset or a third of the view.
    const updatePosition = () => {
      const focusOffset = 7 * parseFloat(getComputedStyle(document.documentElement).fontSize);
      const flow = element.getBoundingClientRect().height > Math.min(focusOffset, window.innerHeight / 3);
      const wasSticky = !element.hasAttribute('data-flow');
      element.toggleAttribute('data-flow', flow);
      // Opening a sticky disclosure after scrolling must not move its controls
      // above the viewport when the expanded header enters document flow.
      if (flow && wasSticky && element.querySelector('button[aria-expanded="true"]')) {
        element.scrollIntoView({ block: 'start', behavior: 'instant' });
      }
    };
    const revealFocus = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement) || target.closest('[role="dialog"]') ||
          getComputedStyle(target).position === 'fixed') return;
      const rect = target.getBoundingClientRect();
      const topEdge = !element.contains(target) && getComputedStyle(element).position === 'sticky'
        ? Math.max(0, element.getBoundingClientRect().bottom) : 0;
      const style = getComputedStyle(target);
      // :focus-visible styles may settle after focusin; reserve the shared
      // 2px outline + 4px offset even before that paint.
      const gap = Math.max(6, parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset));
      // Browsers can leave an already-in-view link behind a sticky header on
      // reverse Tab. Expose its outline as well as its text.
      if (rect.top < topEdge + gap) {
        window.scrollBy({ top: -Math.ceil(topEdge + gap - rect.top), behavior: 'instant' });
      } else if (rect.height + 2 * gap <= window.innerHeight - topEdge && rect.bottom > window.innerHeight - gap) {
        window.scrollBy({ top: Math.ceil(rect.bottom - window.innerHeight + gap), behavior: 'instant' });
      }
    };
    const observer = new ResizeObserver(updatePosition);
    observer.observe(element);
    window.addEventListener('resize', updatePosition);
    document.addEventListener('focusin', revealFocus);
    updatePosition();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updatePosition);
      document.removeEventListener('focusin', revealFocus);
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') { setOpenPath(null); toggle.current?.focus(); }
    }
    const desktop = window.matchMedia('(min-width: 1280px)');
    const closeOnDesktop = () => { if (desktop.matches) setOpenPath(null); };
    document.addEventListener('keydown', closeOnEscape);
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      desktop.removeEventListener('change', closeOnDesktop);
    };
  }, [open]);
  const links = primaryNavigation.map(item => (
    <Link key={item.href} href={item.href} className="nav-link"
      aria-current={pathname === item.href || pathname.startsWith(item.href + '/') ? 'page' : undefined}
      onClick={() => setOpenPath(null)}>{item.label}</Link>
  ));
  return (
    <header ref={header} className="site-header">
      <Container className="header-row">
        <Brand />
        <nav className="hidden xl:flex items-center gap-2" aria-label="Main Navigation">{links}</nav>
        <div className="hidden sm:block shrink-0"><ButtonLink href="/enroll">Enroll Now</ButtonLink></div>
        <button ref={toggle} type="button" className="xl:hidden p-3 rounded-lg text-primary"
          onClick={() => setOpenPath(open ? null : pathname)} aria-expanded={open} aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}>
          {open ? <X aria-hidden="true" size={24} /> : <Menu aria-hidden="true" size={24} />}
        </button>
      </Container>
      <div id="mobile-menu" hidden={!open} className="mobile-menu xl:hidden">
        <Container><nav aria-label="Mobile Navigation">{links}<ButtonLink href="/enroll" onClick={() => setOpenPath(null)}>Enroll Now</ButtonLink></nav></Container>
      </div>
    </header>
  );
}
