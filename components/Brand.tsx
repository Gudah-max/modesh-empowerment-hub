import Image from 'next/image';
import Link from 'next/link';

export function Brand() {
  return (
    <Link href="/" aria-label="Modesh Empowerment Hub Home" className="brand">
      <Image src="/images/modesh_logo_transparent_background.png" alt="" width={48} height={48} sizes="48px" className="brand-logo" />
      <span>Modesh<br className="sm:hidden" /> Empowerment Hub</span>
    </Link>
  );
}
