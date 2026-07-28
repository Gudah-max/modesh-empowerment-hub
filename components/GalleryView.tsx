'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react';

export function GalleryView() {
  const galleryItems: { src: string; category: string; alt?: string }[] = [
    { src: '/images/2000_69e3e50d204b9.jpeg', category: 'In the Kitchen' },
    { src: '/images/2000_69e3e52038864.jpeg', category: 'Masterpieces' },
    { src: '/images/2000_69e3e548ab358.jpeg', category: 'Graduation' },
    { src: '/images/2000_69e4aa1524e17.jpeg', category: 'In the Kitchen' },
    { src: '/images/2000_69e4aa22b5faf.jpeg', category: 'Masterpieces' },
    { src: '/images/2000_69e4aa52dc101.jpeg', category: 'In the Kitchen' },
    { src: '/images/2000_69e4aa52ded35.jpeg', category: 'Masterpieces' },
    { src: '/images/2000_69e4abfa84db8.jpeg', category: 'Graduation' },
    { src: '/images/2000_69e4abfa86d6f.jpeg', category: 'In the Kitchen' },
    { src: '/images/2000_69e4abfa8a04b.jpeg', category: 'Masterpieces' },
    { src: '/images/2000_69e4abfa8b6c0.jpeg', category: 'Graduation' },
    { src: '/images/2000_69e4abfa8cc50.jpeg', category: 'In the Kitchen' },
    { src: '/images/2000_69e4abfa8e21e.jpeg', category: 'Masterpieces' },
    { src: '/images/2000_69e4abfa8f794.jpeg', category: 'Graduation' },
    { src: '/images/2000_69e4abfa92390.jpeg', category: 'In the Kitchen' },
    { src: '/images/2000_69e4abfa938c7.jpeg', category: 'Masterpieces' },
    { src: '/images/2000_69e4abfa9502f.jpeg', category: 'Graduation' },
    { src: '/images/2000_69e4abfa97b47.jpeg', category: 'In the Kitchen' },
    { src: '/images/2000_69e4abfa994b6.jpeg', category: 'Masterpieces' },
    { src: '/images/800_69e4aa52dd934.jpeg', category: 'Masterpieces' },
    { src: '/images/800_69e4abfa88694.jpeg', category: 'Masterpieces' },
    { src: '/images/800_69e4abfa9be84.jpeg', category: 'In the Kitchen' },
    { src: '/images/800_69e652c811435.jpeg', category: 'Graduation' },
    { src: '/images/artisan_bread_making.jpeg', category: 'In the Kitchen' },
    { src: '/images/bakery_enterprenuership.jpeg', category: 'Masterpieces' },
    { src: '/images/bread_making.jpeg', category: 'Graduation' },
    { src: '/images/cake_decoration.jpeg', category: 'In the Kitchen' },
    { src: '/images/pastry_art.jpeg', category: 'Graduation' },
    { src: '/images/pastry_arts.jpeg', category: 'In the Kitchen' },
    { src: '/images/proffesional_baking.jpeg', category: 'Masterpieces' },
    { src: '/images/hero-1.jpeg', category: 'Masterpieces', alt: 'A row of elegant multi-tier wedding cakes with sugar flowers made by Modesh students' },
    { src: '/images/hero-7.jpeg', category: 'Graduation', alt: 'Guests tasting dessert cups at the Modesh Wedding Cake Master Class' },
    { src: '/images/hero-8.jpeg', category: 'Graduation', alt: 'A guest enjoying a dessert at a Modesh Empowerment Hub event' },
  ];
  // TODO: replace arbitrary category assignments with real captions/categories once confirmed with the team.

  const categories = ['All Moments', 'In the Kitchen', 'Masterpieces', 'Graduation'];
  const [activeFilter, setActiveFilter] = useState('All Moments');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const filteredImages = galleryItems.filter(
    (item) => activeFilter === 'All Moments' || item.category === activeFilter
  );

  const altFor = (item: { category: string; alt?: string }) =>
    item.alt ?? `${item.category} at Modesh Empowerment Hub`;

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const showPrev = useCallback(
    () => setLightboxIndex((i) => (i === null ? i : (i - 1 + filteredImages.length) % filteredImages.length)),
    [filteredImages.length]
  );
  const showNext = useCallback(
    () => setLightboxIndex((i) => (i === null ? i : (i + 1) % filteredImages.length)),
    [filteredImages.length]
  );

  // Keyboard controls + body scroll lock while the lightbox is open
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') showPrev();
      else if (e.key === 'ArrowRight') showNext();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, closeLightbox, showPrev, showNext]);

  const changeFilter = (filter: string) => {
    setActiveFilter(filter);
    setLightboxIndex(null);
  };

  const activeItem = lightboxIndex === null ? null : filteredImages[lightboxIndex];

  return (
    <div className="w-full bg-background min-h-[calc(100vh-80px)] motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
         <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-6">Student Life & Gallery</h1>
         <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-12 lg:mb-16 leading-relaxed">
            Step inside the Modesh Empowerment Hub. Witness the dedication, the joy of learning, and the incredible creations of our students as they master the art of baking.
         </p>

         <div className="flex flex-wrap justify-center gap-3 mb-12 lg:mb-16">
            {categories.map((filter, i) => (
              <button
                key={i}
                onClick={() => changeFilter(filter)}
                className={`px-6 py-2.5 rounded-full font-medium text-sm transition-colors shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  activeFilter === filter ? 'bg-primary text-white' : 'bg-white text-foreground hover:bg-surface-variant border border-border/80'
                }`}
              >
                {filter}
              </button>
            ))}
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredImages.map((item, i) => (
               <button
                  key={item.src}
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  aria-label={`View larger image: ${altFor(item)}`}
                  className="relative aspect-square w-full p-0 rounded-lg overflow-hidden bg-surface-variant shadow-sm group cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
               >
                  <Image
                     src={item.src}
                     alt={altFor(item)}
                     fill
                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                     className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-colors duration-300 flex items-center justify-center">
                     <Expand className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md" aria-hidden="true" />
                  </div>
               </button>
            ))}
         </div>
      </section>

      {/* Lightbox */}
      {activeItem && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={closeLightbox}
          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 sm:p-6 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200"
        >
          <button
            ref={closeButtonRef}
            onClick={closeLightbox}
            aria-label="Close image viewer"
            className="absolute top-4 right-4 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="w-6 h-6" />
          </button>

          {filteredImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); showPrev(); }}
                aria-label="Previous image"
                className="absolute left-2 sm:left-4 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); showNext(); }}
                aria-label="Next image"
                className="absolute right-2 sm:right-4 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </>
          )}

          <div className="relative w-[90vw] h-[82vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={activeItem.src}
              alt={altFor(activeItem)}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/40 px-3 py-1 rounded-full">
            {lightboxIndex + 1} / {filteredImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
