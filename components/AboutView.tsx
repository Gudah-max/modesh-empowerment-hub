import Image from 'next/image';
import { Sparkles, Eye, CheckCircle2 } from 'lucide-react';

export function AboutView() {
  return (
    <div className="w-full motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
           <div>
             <div className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-primary mb-6">
                <span className="w-8 h-px bg-primary"></span>
                <span>Our Origin</span>
             </div>
             <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-[1.15] mb-8">
               The Story
             </h1>
             <div className="space-y-6 text-lg text-foreground/80 leading-relaxed font-light">
               <p>
                 I was raised by a widow in a family of twelve children the 11th born. My father passed away when I was still young, leaving my mother to carry us alone with quiet strength and unwavering determination.
               </p>
               <p>
                 Those experiences shaped everything. I did not just observe hardship I lived it. I understood the emotional and financial strain vulnerable women face, and how easily dignity can be lost when opportunities are limited.
               </p>
               <p>
                 I founded Modesh Bakers as a starting point, and as it grew, I saw the deeper need: women who, like my mother, simply needed a chance to learn, earn, and rebuild their dignity. That realization gave birth to Modesh Empowerment Hub.
               </p>
               <p className="italic font-medium">
                 - Founder MEH
               </p>
             </div>
           </div>
           <div className="relative h-[500px] lg:h-[700px] w-full rounded-lg overflow-hidden bg-surface-variant shadow-sm border border-border/50">
             <Image 
                src="/images/about_image.jpg"
                alt="About Modesh" 
                fill 
                className="object-cover" 
                priority
             />
           </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28 border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
              <h2 className="font-serif text-4xl font-bold text-primary mb-4">Why We Exist</h2>
              <p className="text-foreground/80 text-lg">We are driven by a dual mandate: to provide top-tier professional training and to foster a resilient, supportive community.</p>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#f7faf5] p-10 lg:p-14 rounded-lg border border-border/60 shadow-sm transition-shadow hover:shadow-md">
                 <div className="w-14 h-14 bg-primary/10 rounded flex items-center justify-center text-primary mb-8">
                    <Sparkles className="w-7 h-7" />
                 </div>
                 <h3 className="font-serif text-3xl font-semibold text-primary mb-4">Our Mission</h3>
                 <p className="text-foreground/80 text-lg mb-8 leading-relaxed">
                    To equip marginalized individuals with comprehensive baking and entrepreneurial skills in a dignified, supportive environment, enabling them to secure sustainable livelihoods and build self-reliance.
                 </p>
                 <ul className="space-y-4">
                    {[
                      'Practical, hands-on culinary training.',
                      'Business management and financial literacy.',
                      'Mentorship and personal development counseling.'
                    ].map((item, i) => (
                       <li key={i} className="flex gap-4 items-start text-foreground/80">
                          <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-[17px]">{item}</span>
                       </li>
                    ))}
                 </ul>
              </div>

              <div className="bg-[#f7faf5] p-10 lg:p-14 rounded-lg border border-border/60 shadow-sm transition-shadow hover:shadow-md">
                 <div className="w-14 h-14 bg-primary/10 rounded flex items-center justify-center text-primary mb-8">
                    <Eye className="w-7 h-7" />
                 </div>
                 <h3 className="font-serif text-3xl font-semibold text-primary mb-4">Our Vision</h3>
                 <p className="text-foreground/80 text-lg leading-relaxed">
                    A community where every individual has the opportunity, skills, and confidence to thrive economically and contribute meaningfully to society, transforming their narratives from survival to success.
                 </p>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
