import Link from 'next/link';
import { siteName, siteConfig } from '@/lib/siteConfig';

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand">
          <img src="/dexred-lab-logo-white.png" alt={siteConfig.ownerBrand} className="brand-logo" />
          {siteName}
        </Link>
        <nav className="nav-links">
          <Link href="/" className="nav-link">
            Home
          </Link>
          <Link href="/create" className="nav-link">
            Create a link
          </Link>
          <Link href="/qr" className="nav-link">
            QR code
          </Link>
        </nav>
      </div>
    </header>
  );
}
