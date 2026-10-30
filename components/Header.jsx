import Link from 'next/link';
import { siteName, siteConfig } from '@/lib/siteConfig';

export default function Header() {
  // "Fly" in white, "chat" in red
  const first = siteName.slice(0, 3);
  const rest = siteName.slice(3);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand">
          <img src={siteConfig.logoNav} alt={siteConfig.ownerBrand} className="brand-logo" />
          <span>
            {first}
            <span className="brand-accent">{rest}</span>
          </span>
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
