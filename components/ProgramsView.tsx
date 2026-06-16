import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, ClipboardList, MessageSquare, GraduationCap, Clock } from 'lucide-react';

export function ProgramsView() {
  const programs = [
    {
      title: 'Professional Baking',
      tag: 'Beginner to Advanced',
      duration: '12 Weeks',
      desc: 'Master the fundamentals of baking cakes, cookies, and patisserie. From understanding basic ingredients to executing advanced presentation techniques.',
      list: ['Ingredient Science & Measurement', 'Classic Cake Formulation', 'Commercial Baking Standards'],
      img: '/images/proffesional_baking.jpeg'
    },
    {
      title: 'Pastry Arts',
      tag: 'Intermediate',
      duration: '8 Weeks',
      desc: 'Dive deep into the world of delicate desserts. Master chocolate work, sugarcraft, and high-end dessert presentation suitable for fine dining.',
      list: ['Chocolate Tempering & Sculpting', 'Advanced Sugarcraft', 'Plated Dessert Design'],
      img: '/images/pastry_art.jpeg'
    },
    {
      title: 'Artisan Bread Making',
      tag: 'All Levels',
      duration: '6 Weeks',
      desc: 'Explore traditional and modern bread techniques. Learn the secrets of sourdough, laminated doughs, and commercial yeast breads.',
      list: ['Sourdough Starter Cultivation', 'Viennoiserie & Lamination', 'Baking Chemistry'],
      img: '/images/artisan_bread_making.jpeg'
    },
    {
      title: 'Bakery Entrepreneurship',
      tag: 'Business Focus',
      duration: '4 Weeks',
      desc: 'Turn your passion into a business. This course covers business planning, costing, marketing, and the operational logistics of running a bakery.',
      list: ['Business Plan Development', 'Costing & Pricing Strategy', 'Brand & Marketing'],
      img: '/images/bakery_enterprenuership.jpeg'
    }
  ];

  return (
    <div className="w-full motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-6">Our Programs & Courses</h1>
          <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
            Discover our comprehensive range of baking and culinary arts programs designed to equip you with the skills and confidence to succeed in the professional world.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
             <Link href="#courses" className="bg-primary text-primary-foreground px-8 py-3.5 rounded font-medium hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 inline-block">
               Explore Courses
             </Link>
             <Link href="#enrollment" className="bg-transparent border border-primary text-primary px-8 py-3.5 rounded font-medium hover:bg-primary/5 active:scale-[0.98] transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 inline-block">
               Enrollment Guide
             </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
           {programs.map((prog, i) => (
             <div key={i} className="bg-white border border-border/80 rounded-lg overflow-hidden flex flex-col shadow-sm">
               <div className="relative h-64 sm:h-72 w-full bg-surface-variant overflow-hidden">
                  <Image src={prog.img} alt={prog.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 motion-safe:hover:scale-105" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 left-4 bg-[#c0edcf] text-[#002112] px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm">
                     {prog.tag}
                  </div>
               </div>
               <div className="p-8 lg:p-10 flex-1 flex flex-col">
                  <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                    <h3 className="font-serif text-3xl font-semibold text-primary leading-tight">{prog.title}</h3>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-primary/70 bg-primary/5 px-2.5 py-1 rounded-full whitespace-nowrap">
                       <Clock className="w-4 h-4" /> {prog.duration}
                    </div>
                  </div>
                  <p className="text-foreground/80 mb-8 leading-relaxed md:h-20 line-clamp-3 md:line-clamp-none">{prog.desc}</p>
                  
                  <div className="mb-8 flex-1">
                     <div className="text-xs font-semibold uppercase tracking-wider text-primary/60 mb-3 border-b border-border/50 pb-2">What you'll learn</div>
                     <ul className="space-y-3">
                        {prog.list.map((item, j) => (
                          <li key={j} className="flex gap-3 text-sm text-foreground/80">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 opacity-80" />
                            <span>{item}</span>
                          </li>
                        ))}
                     </ul>
                  </div>
                  <Link href={`/programs/${prog.title.toLowerCase().replace(/\s+/g, '-')}`} className="block text-center w-full py-3.5 border border-border/80 rounded font-medium hover:bg-surface-variant/50 active:scale-[0.98] transition-all text-primary uppercase tracking-wider text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                     Course Details
                  </Link>
               </div>
             </div>
           ))}
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-24">
              <h2 className="font-serif text-4xl font-bold text-primary mb-4">How to Join Modesh</h2>
              <p className="text-foreground/80 text-lg">Our enrollment process is straightforward, designed to get you started on your culinary journey as smoothly as possible.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="bg-[#f7faf5] p-10 rounded-lg text-center border border-border/60 relative z-10 shadow-sm">
                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-border/50 text-primary">
                    <ClipboardList className="w-8 h-8" />
                 </div>
                 <h3 className="font-serif text-2xl font-semibold text-primary mb-3">1. Submit Application</h3>
                 <p className="text-foreground/70 leading-relaxed">Fill out our online application form with your details and preferred course selection.</p>
              </div>
              <div className="bg-[#f7faf5] p-10 rounded-lg text-center border border-border/60 relative z-10 shadow-sm">
                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-border/50 text-primary">
                    <MessageSquare className="w-8 h-8" />
                 </div>
                 <h3 className="font-serif text-2xl font-semibold text-primary mb-3">2. Admissions Interview</h3>
                 <p className="text-foreground/70 leading-relaxed">A brief chat with our admissions team to ensure the program aligns with your goals.</p>
              </div>
              <div className="bg-[#f7faf5] p-10 rounded-lg text-center border border-border/60 relative z-10 shadow-sm">
                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-border/50 text-primary">
                    <GraduationCap className="w-8 h-8" />
                 </div>
                 <h3 className="font-serif text-2xl font-semibold text-primary mb-3">3. Secure Your Spot</h3>
                 <p className="text-foreground/70 leading-relaxed">Complete your registration and payment to officially join the Modesh family.</p>
              </div>
              
              {/* Optional connecting line block here for desktop */}
              <div className="hidden md:block absolute top-[110px] left-[15%] right-[15%] h-px bg-border z-0" />
           </div>

           <div className="mt-16 text-center">
              <Link href="/enroll" className="inline-block bg-primary text-primary-foreground px-10 py-4 rounded font-medium hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm text-lg outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                Start Your Application
              </Link>
           </div>
        </div>
      </section>
    </div>
  );
}
