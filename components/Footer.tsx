import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-surface-variant py-16 border-t border-border mt-auto">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
             <div className="col-span-1">
                <Link href="/" className="flex items-center gap-2 mb-6 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md w-fit">
                   <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                     <Image src="/images/modesh_logo_transparent_background.png" alt="Modesh Logo" fill className="object-contain" />
                   </div>
                   <span className="font-serif font-bold text-lg sm:text-xl tracking-tight text-primary leading-tight">
                     Modesh Empowerment Hub
                   </span>
                </Link>
                <p className="text-foreground/70 mb-6">
                   Empowering individuals through the art of baking and community building.
                </p>
                <div className="flex items-center gap-3 mb-6">
                   <a
                      href="https://www.facebook.com/share/1HGk1Y66yA/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow Modesh Empowerment Hub on Facebook"
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                   >
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true" focusable="false">
                         <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                   </a>
                </div>
                <div className="text-sm text-foreground/60">
                   &copy; {new Date().getFullYear()} Modesh Empowerment Hub. All rights reserved.
                </div>
             </div>
             
             <div>
                <h4 className="font-semibold uppercase tracking-wider text-sm mb-6 text-primary">Contact</h4>
                <ul className="space-y-4 text-foreground/70">
                   <li><a href="mailto:info@modeshempowermenthub.org" className="inline-block py-2 hover:text-primary transition-colors">info@modeshempowermenthub.org</a></li>
                   <li><a href="tel:+254726844169" className="inline-block py-2 hover:text-primary transition-colors">+254-726844169</a></li>
                   <li className="py-2">Manyatta, Kisumu, Kenya<br/>3185(40100) Kisumu-Kenya</li>
                </ul>
             </div>

             <div>
                <h4 className="font-semibold uppercase tracking-wider text-sm mb-6 text-primary">Links</h4>
                <ul className="space-y-2 text-foreground/70 flex flex-col items-start">
                   <li><Link href="/about" className="inline-block py-2 hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -ml-1">About Us</Link></li>
                   <li><Link href="/programs" className="inline-block py-2 hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -ml-1">Programs</Link></li>
                   <li><Link href="/gallery" className="inline-block py-2 hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -ml-1">Gallery</Link></li>
                   <li><Link href="/team" className="inline-block py-2 hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -ml-1">Our Team</Link></li>
                </ul>
             </div>

             <div>
                <h4 className="font-semibold uppercase tracking-wider text-sm mb-6 text-primary">Legal</h4>
                <ul className="space-y-2 text-foreground/70 flex flex-col items-start">
                   <li><Link href="/privacy" className="inline-block py-2 hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -ml-1">Privacy Policy</Link></li>
                   <li><Link href="/terms" className="inline-block py-2 hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -ml-1">Terms of Service</Link></li>
                   <li><Link href="/faq" className="inline-block py-2 hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -ml-1">FAQ</Link></li>
                </ul>
             </div>
          </div>

          <div className="mt-12 pt-6 border-t border-border/60 text-center text-xs text-foreground/50">
             Built and maintained by{' '}
             <a
                href="https://www.vantadigitalai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors underline underline-offset-2"
             >
                Vanta Digital
             </a>
          </div>
       </div>
    </footer>
  );
}
