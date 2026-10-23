import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req) {
  const { slug } = await req.json();
  if (!slug) return NextResponse.json({ ok: false }, { status: 400 });

  await supabaseAdmin.rpc('increment_click', { flyer_slug: slug });
  return NextResponse.json({ ok: true });
}
