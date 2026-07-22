"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Leaf } from 'lucide-react';

const heroImages = [
  { src: "/images/hero_image.jpeg", alt: "Students learning to bake together at Modesh Empowerment Hub" },
  { src: "/images/hero_image_1.jpeg", alt: "Freshly baked bread and pastries made by Modesh students" },
  { src: "/images/hero_image_2.jpeg", alt: "A Modesh trainee shaping dough in the teaching kitchen" }
];

export function HomeView() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 relative rounded-lg overflow-hidden min-h-[500px] flex items-end p-8 sm:p-10">
            {heroImages.map((image, index) => (
              <Image
                key={image.src}
                src={image.src}
                alt={image.alt}
                fill
                className={`object-cover absolute inset-0 -z-10 brightness-[0.65] transition-opacity duration-1000 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
                sizes="100vw"
                priority={index === 0}
              />
            ))}
            <div className="max-w-xl text-white relative z-10">
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.15] mb-6 drop-shadow-md">
                Where Baking Builds Dignified Lives
              </h1>
              <div className="flex flex-wrap gap-4">
                <Link href="/enroll" className="bg-primary text-primary-foreground px-6 py-3 rounded font-medium hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary">
                  Enroll Now
                </Link>
                <Link href="/programs" className="bg-transparent border border-white text-white px-6 py-3 rounded font-medium hover:bg-white/10 active:scale-[0.98] transition-all outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-4 bg-[#f1f4f0] rounded-lg p-8 flex flex-col justify-between border border-border/50">
            <div>
               <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                  <Leaf className="w-5 h-5"/>
               </div>
               <h2 className="font-serif text-3xl font-semibold mb-4 text-primary leading-tight">Empowering Communities</h2>
               <p className="text-foreground/80 mb-6 leading-relaxed">
                 Modesh Empowerment Hub helps individuals learn comprehensive baking methods, 
                 fostering independence and entrepreneurial success.
               </p>
            </div>
            <div>
              <div className="relative h-48 w-full rounded mb-6 overflow-hidden">
                <Image
                  src="/images/hero_empoering_communities_small_image.jpeg"
                  alt="Empowering Communities"
                  fill
                  className="object-cover"
                />
              </div>
              <Link href="/about" className="flex items-center gap-2 font-semibold uppercase tracking-wider text-sm hover:text-primary active:scale-[0.98] transition-all group w-fit outline-none focus-visible:ring-2 focus-visible:ring-primary rounded p-1 -ml-1">
                Our Story <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/*
        Impact section — qualitative for now.
        TODO: reinstate headline numbers (graduates empowered, employment rate,
        community bakeries started) once real, sourced figures are available.
      */}
      <section className="bg-white py-20 lg:py-24 border-y border-border/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl font-semibold text-primary mb-6">Our Impact</h2>
          <p className="text-lg text-foreground/80 leading-relaxed">
            Every learner who walks through our doors leaves with more than a skill — they leave with confidence, a
            livelihood, and a renewed sense of dignity. From first-time bakers to community entrepreneurs, our graduates
            are building sustainable futures for themselves and their families across Kisumu and beyond.
          </p>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="py-20 lg:py-24 bg-background">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
               <h2 className="font-serif text-4xl font-semibold text-primary mb-4">Featured Programs</h2>
               <p className="text-foreground/80 text-lg">Discover our structured courses designed to take you from basics to professional mastery.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 {
                   title: 'Bread Making',
                   desc: 'Master the art of artisanal breads, from sourdough starters to classic baguettes in a supportive environment.',
                   img: '/images/bread_making.jpeg',
                   tag: 'Beginner'
                 },
                 {
                   title: 'Pastry Arts',
                   desc: 'Learn delicate techniques for creating exquisite tarts, eclairs, and complex layered desserts.',
                   img: '/images/pastry_arts.jpeg',
                   tag: 'Intermediate'
                 },
                 {
                   title: 'Cake Decoration',
                   desc: 'Advanced finishing techniques, fondant work, and structural cake design for special events.',
                   img: '/images/cake_decoration.jpeg',
                   tag: 'Advanced'
                 }
               ].map((program, i) => (
                  <div key={i} className="bg-white border border-border rounded-lg overflow-hidden group shadow-sm flex flex-col">
                     <div className="relative h-64 w-full bg-surface-variant overflow-hidden">
                        <Image src={program.img} alt={program.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw" className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-105" />
                        <div className="absolute top-4 left-4 bg-[#c0edcf] text-[#002112] px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm">
                           {program.tag}
                        </div>
                     </div>
                     <div className="p-8 flex flex-col flex-1">
                        <h3 className="font-serif text-2xl font-semibold text-primary mb-3">{program.title}</h3>
                        <p className="text-foreground/70 mb-8 flex-1 leading-relaxed">{program.desc}</p>
                        <Link href="/programs" className="text-sm font-semibold uppercase tracking-wider text-left hover:text-primary transition-colors flex items-center gap-2 group/btn w-fit outline-none focus-visible:ring-2 focus-visible:ring-primary rounded p-1 -ml-1">
                           View Details <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all" />
                        </Link>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
}
