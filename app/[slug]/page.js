import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
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

  const title = flyer.business_name || 'Chat on WhatsApp';
  const description = 'Tap to chat on WhatsApp';
  const img = imageUrl(flyer.image_path);

  return {
    title,
    description,
    openGraph: { title, description, images: [img] },
    twitter: { card: 'summary_large_image', title, description, images: [img] },
  };
}

export default async function FlyerPage({ params }) {
  const flyer = await getFlyer(params.slug);
  if (!flyer) notFound();

  // Fire-and-forget view counter -- doesn't block the page render.
  supabaseAdmin.rpc('increment_view', { flyer_slug: params.slug }).then(() => {});

  const img = imageUrl(flyer.image_path);

  return (
    <main className="page-content flush" style={{ padding: 0 }}>
      <img src={img} alt={flyer.business_name || 'Flyer'} style={{ width: '100%', display: 'block' }} />
      <div style={{ padding: '20px 22px 36px' }}>
        {flyer.business_name && <h1 style={{ fontSize: 19, margin: '0 0 6px' }}>{flyer.business_name}</h1>}
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '0 0 16px' }}>
          Tap below to chat directly on WhatsApp
        </p>
        <FlyerButton
          slug={flyer.slug}
          countryCode={flyer.country_code}
          phone={flyer.phone}
          message={flyer.whatsapp_message}
        />
      </div>
    </main>
  );
}
