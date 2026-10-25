import { NextResponse } from 'next/server';
import sharp from 'sharp';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { slugify, randomSuffix } from '@/lib/slug';
import { PLATFORMS } from '@/lib/platforms';

export const runtime = 'nodejs';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
// Vercel's own serverless function body-size limit sits around 4.5MB --
// this is set below that so people get our clear error message instead
// of a cryptic platform-level FUNCTION_PAYLOAD_TOO_LARGE failure.
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4MB
const MAX_LINKS_PER_IP_PER_WINDOW = 5;
const RATE_WINDOW_MINUTES = 10;

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('image');
    const platform = (formData.get('platform') || 'whatsapp').toString();
    const countryCode = (formData.get('countryCode') || '').toString().trim();
    const phone = (formData.get('phone') || '').toString().replace(/[^0-9]/g, '');
    const username = (formData.get('username') || '').toString().trim().replace(/^@/, '');
    const businessName = (formData.get('businessName') || '').toString().trim();
    const message = (formData.get('message') || '').toString().trim();

    if (!PLATFORMS[platform]) {
      return NextResponse.json({ error: 'Invalid platform.' }, { status: 400 });
    }
    const platformConfig = PLATFORMS[platform];

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Flyer image is required.' }, { status: 400 });
    }

    if (platform === 'whatsapp') {
      if (!countryCode || !phone) {
        return NextResponse.json({ error: 'WhatsApp number is required.' }, { status: 400 });
      }
    } else {
      if (!username) {
        return NextResponse.json(
          { error: `${platformConfig.label} username is required.` },
          { status: 400 }
        );
      }
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Please upload a JPG, PNG or WebP image.' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

    const windowStart = new Date(Date.now() - RATE_WINDOW_MINUTES * 60 * 1000).toISOString();
    const { count: recentCount } = await supabaseAdmin
      .from('flyers')
      .select('id', { count: 'exact', head: true })
      .eq('creator_ip', ip)
      .gte('created_at', windowStart);

    if ((recentCount || 0) >= MAX_LINKS_PER_IP_PER_WINDOW) {
      return NextResponse.json(
        { error: 'Too many links created recently. Please try again in a few minutes.' },
        { status: 429 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    if (arrayBuffer.byteLength > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: 'Image must be under 4MB.' }, { status: 400 });
    }

    const processed = await sharp(Buffer.from(arrayBuffer))
      .rotate()
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    const base = slugify(businessName) || 'flyer';
    let slug = `${base}-${randomSuffix(4)}`;
    for (let i = 0; i < 5; i++) {
      const { data: existing } = await supabaseAdmin
        .from('flyers')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();
      if (!existing) break;
      slug = `${base}-${randomSuffix(4)}`;
    }

    const imagePath = `${slug}.webp`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from('flyers')
      .upload(imagePath, processed, { contentType: 'image/webp', upsert: false });

    if (uploadError) {
      console.error(uploadError);
      return NextResponse.json({ error: 'Could not upload image.' }, { status: 500 });
    }

    const manageToken = crypto.randomBytes(16).toString('hex');

    const { error: insertError } = await supabaseAdmin.from('flyers').insert({
      slug,
      image_path: imagePath,
      business_name: businessName || null,
      platform,
      country_code: platform === 'whatsapp' ? countryCode : null,
      phone: platform === 'whatsapp' ? phone : null,
      username: platform !== 'whatsapp' ? username : null,
      prefill_message: platformConfig.supportsMessage && message ? message : null,
      manage_token: manageToken,
      creator_ip: ip,
    });

    if (insertError) {
      console.error(insertError);
      return NextResponse.json({ error: 'Could not save your link.' }, { status: 500 });
    }

    return NextResponse.json({ slug, manageToken });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
