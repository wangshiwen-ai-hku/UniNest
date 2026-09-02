import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text') || 'https://uni-nest-dun.vercel.app';
  const size = searchParams.get('size') || '360x360';
  const color = searchParams.get('color') || '14-56-37';

  try {
    const upstreamUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}&margin=8&data=${encodeURIComponent(
      text
    )}&color=${color}&ecc=H`;
    const res = await fetch(upstreamUrl);
    
    if (!res.ok) {
      throw new Error(`Upstream returned ${res.status}`);
    }

    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
