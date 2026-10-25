import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import DeleteButton from './DeleteButton';
import QrCode from '@/components/QrCode';
import GridBackground from '@/components/GridBackground';
import { getPlatform } from '@/lib/platforms';

async function getFlyerByToken(token) {
  const { data } = await supabaseAdmin
    .from('flyers')
    .select('*')
    .eq('manage_token', token)
    .maybeSingle();
  return data;
}

export default async function ManagePage({ params }) {
  const flyer = await getFlyerByToken(params.token);
  if (!flyer) notFound();

  return (
    <>
      <GridBackground />
      <main className="page-content">
        <h1 style={{ fontSize: 21 }}>Manage your link</h1>
        <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 10 }}>/{flyer.slug}</p>

        <div className="stat-line" style={{ marginTop: 18 }}>
          <div>Platform: <strong>{getPlatform(flyer.platform).label}</strong></div>
          <div>Status: <strong>{flyer.status}</strong></div>
          <div>Views: <strong>{flyer.view_count}</strong></div>
          <div>Taps: <strong>{flyer.click_count}</strong></div>
        </div>

        {flyer.status === 'active' && (
          <div style={{ marginTop: 26 }}>
            <label className="field-label" style={{ marginTop: 0 }}>
              Scan to open
            </label>
            <QrCode path={`/${flyer.slug}`} />
          </div>
        )}

        {flyer.status === 'active' && <DeleteButton token={flyer.manage_token} />}
      </main>
    </>
  );
}
