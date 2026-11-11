'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GalleryImage } from '@/lib/content/gallery';
import { Section } from './ui/Section';
import { PageIntro } from './ui/PageIntro';

const categories = ['All Moments', 'In the Kitchen', 'Masterpieces', 'Graduation'] as const;

export function GalleryView({ items }: { items: readonly GalleryImage[] }) {
  const [activeFilter, setActiveFilter] = useState<string>('All Moments');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const images = items.filter(item => activeFilter === 'All Moments' || item.category === activeFilter);
  const activeItem = lightboxIndex === null ? null : images[lightboxIndex];
  const isOpen = activeItem != null;

  // Native modal top layer makes the entire background inert, including the
  // shared header/footer. Only opening/closing changes focus; slide changes do not.
  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (openerRef.current?.isConnected) openerRef.current.focus({ preventScroll: true });
    };
  }, [isOpen]);

  const move = (direction: number) => setLightboxIndex(index => index === null ? null : (index + direction + images.length) % images.length);

  return (
    <div className="institution-page training-page">
      <Section><PageIntro title="Student Life & Gallery"><p>Baking, learning and moments from life at Modesh. Browse the photographs or open an image for a closer look.</p></PageIntro></Section>
      <Section aria-label="Photographs" className="institution-content-start">
        <div className="gallery-filters" role="group" aria-label="Filter photographs">
          {categories.map(category => <button key={category} type="button" aria-pressed={activeFilter === category} aria-controls="gallery-images" onClick={() => { setActiveFilter(category); setLightboxIndex(null); }}>{category}</button>)}
        </div>
        <p className="gallery-count" role="status" aria-live="polite" aria-atomic="true">{images.length} photographs · {activeFilter}</p>
        <div id="gallery-images" className="gallery-grid">
          {images.map((item, index) => <button key={item.src} type="button" aria-label={'View larger image: ' + item.alt} aria-haspopup="dialog" onClick={event => { openerRef.current = event.currentTarget; setLightboxIndex(index); }}>
            <Image src={item.thumb ?? item.src} alt={item.alt} width={item.width} height={item.height} sizes="(min-width: 1280px) 389px, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw" />
          </button>)}
        </div>
      </Section>
      <dialog ref={dialogRef} className="gallery-viewer" aria-label="Image viewer" aria-describedby="gallery-viewer-description"
        onCancel={event => { event.preventDefault(); setLightboxIndex(null); }}
        onClick={event => { if (event.target === event.currentTarget) setLightboxIndex(null); }}
        onKeyDown={event => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1); }
          if (event.key === 'Tab') {
            const controls = dialogRef.current?.querySelectorAll<HTMLButtonElement>('button:not([disabled])');
            if (!controls?.length) return;
            const first = controls[0], last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
          }
        }}>
        {activeItem && lightboxIndex !== null && <>
          <div className="viewer-toolbar"><h2 className="sr-only">Image viewer</h2><button ref={closeRef} type="button" aria-label="Close image viewer" onClick={() => setLightboxIndex(null)}>Close <X size={22} aria-hidden="true" /></button></div>
          <div className="viewer-photo"><Image src={activeItem.src} alt={activeItem.alt} fill sizes="94vw" className="object-contain" priority /></div>
          <div className="viewer-footer">
            <div id="gallery-viewer-description" role="status" aria-live="polite" aria-atomic="true"><p>{lightboxIndex + 1} of {images.length}</p><p>{activeItem.alt}</p></div>
            <div className="viewer-navigation"><button type="button" aria-label="Previous image" onClick={() => move(-1)}><ChevronLeft size={22} aria-hidden="true" /> Previous</button><button type="button" aria-label="Next image" onClick={() => move(1)}>Next <ChevronRight size={22} aria-hidden="true" /></button></div>
          </div>
        </>}
      </dialog>
    </div>
  );
}
