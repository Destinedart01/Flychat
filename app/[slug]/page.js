import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getPlatform } from '@/lib/platforms';
import FlyerButton from './FlyerButton';

async function getFlyer(slug) {
  const { data } = await supabaseAdmin
    .from('flyers')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .maybeSingle();
  return data;
}

function imageUrl(imagePath) {
  const { data } = supabaseAdmin.storage.from('flyers').getPublicUrl(imagePath);
  return data.publicUrl;
}

export async function generateMetadata({ params }) {
  const flyer = await getFlyer(params.slug);
  if (!flyer) return { title: 'Link not found' };

  const config = getPlatform(flyer.platform);
  const title = flyer.business_name || config.buttonText;
  const description = `Tap to ${config.buttonText.toLowerCase()}`;
  const img = imageUrl(flyer.image_path);

  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: img, alt: title }] },
    twitter: { card: 'summary_large_image', title, description, images: [img] },
  };
}

export default async function FlyerPage({ params }) {
  const flyer = await getFlyer(params.slug);
  if (!flyer) notFound();

  supabaseAdmin.rpc('increment_view', { flyer_slug: params.slug }).then(() => {});

  const img = imageUrl(flyer.image_path);
  const config = getPlatform(flyer.platform);

  // Deliberately no <GridBackground /> here -- this is the one page a
  // visitor actually lands on, so it stays clean: image, name, one button.
  return (
    <main className="page-content flush" style={{ padding: 0 }}>
      <img src={img} alt={flyer.business_name || 'Flyer'} style={{ width: '100%', display: 'block' }} />
      <div style={{ padding: '20px 22px 36px' }}>
        {flyer.business_name && <h1 style={{ fontSize: 19, margin: '0 0 6px' }}>{flyer.business_name}</h1>}
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '0 0 16px' }}>
          Tap below to {config.buttonText.toLowerCase()}
        </p>
        <FlyerButton
          slug={flyer.slug}
          platform={flyer.platform}
          countryCode={flyer.country_code}
          phone={flyer.phone}
          username={flyer.username}
          message={flyer.prefill_message}
        />

        <div className="visitor-cta">
          <p>Got a flyer or business of your own?</p>
          <Link href="/create" className="btn btn-outline" style={{ width: 'auto', padding: '10px 18px' }}>
            Create your own Flychat link
          </Link>
        </div>
      </div>
    </main>
  );
}
