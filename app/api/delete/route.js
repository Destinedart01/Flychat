import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req) {
  const { token } = await req.json();
  if (!token) return NextResponse.json({ ok: false }, { status: 400 });

  const { data: flyer } = await supabaseAdmin
    .from('flyers')
    .select('image_path')
    .eq('manage_token', token)
    .maybeSingle();

  if (!flyer) return NextResponse.json({ ok: false }, { status: 404 });

  await supabaseAdmin.storage.from('flyers').remove([flyer.image_path]);
  await supabaseAdmin.from('flyers').update({ status: 'removed' }).eq('manage_token', token);

  return NextResponse.json({ ok: true });
}
