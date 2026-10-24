import Link from 'next/link';
import { siteName } from '@/lib/siteConfig';

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand">
          {siteName}
        </Link>
        <nav className="nav-links">
          <Link href="/" className="nav-link">
            Home
          </Link>
          <Link href="/create" className="nav-link">
            Create a link
          </Link>
        </nav>
      </div>
    </header>
  );
}
