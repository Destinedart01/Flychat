import Link from 'next/link';
import { siteName } from '@/lib/siteConfig';

export default function Home() {
  return (
    <main className="page-content" style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>{siteName}</h1>
      <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 32 }}>
        Upload your flyer, add your WhatsApp number, get a link. Anyone who
        opens it sees your flyer and one button straight into your DMs.
      </p>
      <Link href="/create" className="btn btn-primary" style={{ width: 'auto', padding: '14px 30px' }}>
        Create your link
      </Link>
    </main>
  );
}
