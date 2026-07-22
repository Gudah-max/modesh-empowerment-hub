import Image from 'next/image';

export function TeamView() {
  const team = [
    {
      name: 'Moureen Odera',
      role: 'DIRECTOR',
      desc: 'Moureen brings over 15 years of experience in community development and vocational training, steering Modesh with a steady hand and a compassionate heart.',
      img: '/images/odera_moureen_director.jpg'
    },
    {
      name: 'A. Odera',
      role: 'CEO',
      desc: 'With a background in enterprise management, A. Odera ensures the hub remains financially sustainable while maximizing its social impact in the community.',
      img: '/images/odera_a_ceo.jpg'
    }
    // TODO: add the Office Manager (and any other confirmed team members) once real names, photos, and bios are supplied.
  ];

  const partners = [
    { name: 'GIZ', src: '/images/giz_logo.png' },
    { name: 'SOMO', src: '/images/somo_logo.png' },
    { name: 'SHOFCO', src: '/images/shofco_logo.png' },
    { name: 'FAO', src: '/images/fao_logo.png' },
    { name: 'NITA', src: '/images/nita_logo.png' },
    { name: 'World Travel', src: '/images/world_travel_logo.png' },
    { name: 'KIDI', src: '/images/kenya_industrial_development_institute_logo.png' },
    { name: 'Cloud Solution', src: '/images/cloud_solution_logo.png' }
  ];

  return (
    <div className="w-full motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500">
       <section className="bg-background py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center max-w-2xl mx-auto mb-20 lg:mb-28">
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-6">Our People & Partners</h1>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  Meet the dedicated leadership team guiding Modesh Empowerment Hub, and discover the invaluable partners who help make our vision a reality.
                </p>
             </div>

             <div className="mb-24 lg:mb-32">
                <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-primary text-center mb-16 relative inline-block left-1/2 -translate-x-1/2">
                   The Leadership Team
                   <span className="absolute -bottom-4 left-1/2 w-16 h-1 -translate-x-1/2 bg-primary/20"></span>
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10 max-w-3xl mx-auto">
                   {team.map((member, i) => (
                      <div key={i} className="bg-white border border-border rounded-lg overflow-hidden shadow-sm group">
                         <div className="relative h-80 w-full bg-surface-variant overflow-hidden">
                            <Image src={member.img} alt={member.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw" className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-105 motion-safe:group-hover:-translate-y-1" />
                         </div>
                         <div className="p-8">
                            <h3 className="font-serif text-2xl font-semibold text-primary mb-1">{member.name}</h3>
                            <div className="text-sm font-semibold tracking-wider text-primary/70 uppercase mb-4">{member.role}</div>
                            <p className="text-foreground/80 leading-relaxed">{member.desc}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             <div>
                <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-primary text-center mb-12">Our Partners</h2>
                <div className="text-center max-w-3xl mx-auto mb-16 text-lg text-foreground/80 leading-relaxed">
                   We are deeply grateful for the unwavering support of our institutional partners. Their commitment empowers us to provide high-quality training and build a stronger, more resilient community.
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-8 max-w-5xl mx-auto">
                   {partners.map((partner, i) => (
                     <div key={i} className="bg-white aspect-square rounded-full border border-border flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 shadow-sm hover:shadow p-4 text-center overflow-hidden relative">
                        {partner.src ? (
                           <Image src={partner.src} alt={partner.name} fill className="object-contain p-6" />
                        ) : (
                           <span className="font-serif text-xl sm:text-2xl font-bold text-primary/50 tracking-widest uppercase">{partner.name}</span>
                        )}
                     </div>
                   ))}
                </div>
             </div>
          </div>
       </section>
    </div>
  );
}
