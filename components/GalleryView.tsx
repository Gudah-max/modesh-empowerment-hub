'use client';

import Image from 'next/image';
import { useState } from 'react';

export function GalleryView() {
  const galleryItems = [
    { src: '/images/2000_69e3e50d204b9.jpg.jpeg', category: 'In the Kitchen' },
    { src: '/images/2000_69e3e52038864.jpg.jpeg', category: 'Masterpieces' },
    { src: '/images/2000_69e3e548ab358.jpg.jpeg', category: 'Graduation' },
    { src: '/images/2000_69e4aa1524e17.jpg.jpeg', category: 'In the Kitchen' },
    { src: '/images/2000_69e4aa22b5faf.jpg.jpeg', category: 'Masterpieces' },
    { src: '/images/2000_69e4aa52da193.jpg.jpeg', category: 'Graduation' },
    { src: '/images/2000_69e4aa52dc101.jpg.jpeg', category: 'In the Kitchen' },
    { src: '/images/2000_69e4aa52ded35.jpg.jpeg', category: 'Masterpieces' },
    { src: '/images/2000_69e4abfa84db8.jpg.jpeg', category: 'Graduation' },
    { src: '/images/2000_69e4abfa86d6f.jpg.jpeg', category: 'In the Kitchen' },
    { src: '/images/2000_69e4abfa8a04b.jpg.jpeg', category: 'Masterpieces' },
    { src: '/images/2000_69e4abfa8b6c0.jpg.jpeg', category: 'Graduation' },
    { src: '/images/2000_69e4abfa8cc50.jpg.jpeg', category: 'In the Kitchen' },
    { src: '/images/2000_69e4abfa8e21e.jpg.jpeg', category: 'Masterpieces' },
    { src: '/images/2000_69e4abfa8f794.jpg.jpeg', category: 'Graduation' },
    { src: '/images/2000_69e4abfa92390.jpg.jpeg', category: 'In the Kitchen' },
    { src: '/images/2000_69e4abfa938c7.jpg.jpeg', category: 'Masterpieces' },
    { src: '/images/2000_69e4abfa9502f.jpg.jpeg', category: 'Graduation' },
    { src: '/images/2000_69e4abfa97b47.jpg.jpeg', category: 'In the Kitchen' },
    { src: '/images/2000_69e4abfa994b6.jpg.jpeg', category: 'Masterpieces' },
    { src: '/images/800_69e3e50d204b9.jpg.jpeg', category: 'Graduation' },
    { src: '/images/800_69e3e52038864.jpg.jpeg', category: 'In the Kitchen' },
    { src: '/images/800_69e4aa22b5faf.jpg.jpeg', category: 'Graduation' },
    { src: '/images/800_69e4aa52da193.jpg.jpeg', category: 'In the Kitchen' },
    { src: '/images/800_69e4aa52dd934.jpg.jpeg', category: 'Masterpieces' },
    { src: '/images/800_69e4aa52ded35.jpg.jpeg', category: 'Graduation' },
    { src: '/images/800_69e4abfa86d6f.jpg.jpeg', category: 'In the Kitchen' },
    { src: '/images/800_69e4abfa88694.jpg.jpeg', category: 'Masterpieces' },
    { src: '/images/800_69e4abfa8b6c0.jpg.jpeg', category: 'Graduation' },
    { src: '/images/800_69e4abfa8cc50.jpg.jpeg', category: 'In the Kitchen' },
    { src: '/images/800_69e4abfa8f794.jpg.jpeg', category: 'Masterpieces' },
    { src: '/images/800_69e4abfa92390.jpg.jpeg', category: 'Graduation' },
    { src: '/images/800_69e4abfa938c7.jpg.jpeg', category: 'In the Kitchen' },
    { src: '/images/800_69e4abfa9502f.jpg.jpeg', category: 'Masterpieces' },
    { src: '/images/800_69e4abfa97b47.jpg.jpeg', category: 'Graduation' },
    { src: '/images/800_69e4abfa9be84.jpg.jpeg', category: 'In the Kitchen' },
    { src: '/images/800_69e652c811435.jpg.jpeg', category: 'Graduation' },
    { src: '/images/artisan_bread_making.jpeg', category: 'In the Kitchen' },
    { src: '/images/bakery_enterprenuership.jpeg', category: 'Masterpieces' },
    { src: '/images/bread_making.jpeg', category: 'Graduation' },
    { src: '/images/cake_decoration.jpeg', category: 'In the Kitchen' },
    { src: '/images/hero_empoering_communities_small_image.jpeg', category: 'Masterpieces' },
    { src: '/images/hero_image.jpeg', category: 'Graduation' },
    { src: '/images/hero_image_1.jpeg', category: 'In the Kitchen' },
    { src: '/images/hero_image_2.jpeg', category: 'Masterpieces' },
    { src: '/images/john_doe.png', category: 'Graduation' },
    { src: '/images/odera_a_ceo.png', category: 'In the Kitchen' },
    { src: '/images/odera_moureen_director.png', category: 'Masterpieces' },
    { src: '/images/pastry_art.jpeg', category: 'Graduation' },
    { src: '/images/pastry_arts.jpeg', category: 'In the Kitchen' },
    { src: '/images/proffesional_baking.jpeg', category: 'Masterpieces' },
  ];

  const categories = ['All Moments', 'In the Kitchen', 'Masterpieces', 'Graduation'];
  const [activeFilter, setActiveFilter] = useState('All Moments');

  const filteredImages = galleryItems.filter(
    (item) => activeFilter === 'All Moments' || item.category === activeFilter
  );

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
                onClick={() => setActiveFilter(filter)}
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
               <div key={i} className="relative aspect-square w-full rounded-lg overflow-hidden bg-surface-variant shadow-sm group">
                  <Image 
                     src={item.src} 
                     alt={item.category} 
                     fill 
                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                     className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-105" 
                     referrerPolicy="no-referrer" 
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
               </div>
            ))}
         </div>
      </section>
    </div>
  );
}
