import Link from 'next/link';
import { Brand } from './Brand';
import { Container } from './ui/Container';
import { primaryNavigation } from '@/lib/content/navigation';
export function Footer() {
  return (
    <footer className="site-footer"><Container>
      <div className="footer-grid">
        <div className="min-w-0"><Brand />
          <p className="text-muted-foreground mt-6">Empowering individuals through the art of baking and community building.</p>
          <a href="https://www.facebook.com/share/1HGk1Y66yA/" target="_blank" rel="noopener noreferrer" className="footer-link mt-4" aria-label="Follow Modesh Empowerment Hub on Facebook">Follow us on Facebook</a>
        </div>
        <div className="min-w-0"><h2 className="footer-heading">Contact Modesh</h2><ul>
          <li><a href="mailto:info@modeshempowermenthub.org" className="footer-link">info@modeshempowermenthub.org</a></li>
          <li><a href="tel:+254726844169" className="footer-link">+254-726844169</a></li>
          <li><a href="https://wa.me/254726844169" target="_blank" rel="noopener noreferrer" className="footer-link">Chat on WhatsApp</a></li>
          <li className="text-muted-foreground mt-3">Manyatta, Kisumu, Kenya<br />3185(40100) Kisumu-Kenya</li>
        </ul></div>
        <nav aria-label="Footer navigation"><h2 className="footer-heading">Explore</h2><ul>{primaryNavigation.map(item => <li key={item.href}><Link href={item.href} className="footer-link">{item.label}</Link></li>)}</ul></nav>
        <nav aria-label="Helpful links"><h2 className="footer-heading">Helpful links</h2><ul>
          <li><Link href="/enroll" className="footer-link">Enroll Now</Link></li>
          <li><Link href="/team" className="footer-link">People &amp; Partners</Link></li>
          <li><Link href="/faq" className="footer-link">FAQ</Link></li>
          <li><Link href="/privacy" className="footer-link">Privacy Policy</Link></li>
          <li><Link href="/terms" className="footer-link">Terms of Service</Link></li>
        </ul></nav>
      </div>
      <div className="footer-bottom"><p>&copy; {new Date().getFullYear()} Modesh Empowerment Hub. All rights reserved.</p>
        <p>Built and maintained by <a href="https://www.vantadigitalai.com" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold underline underline-offset-4">Vanta Digital</a></p>
      </div>
    </Container></footer>
  );
}
