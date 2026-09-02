import { NextRequest, NextResponse } from 'next/server';

const AMAP_KEY = process.env.NEXT_PUBLIC_AMAP_KEY || 'b1ab3580beb37c0f0434692477d6f331';

function getFallbackShenzhenCoords(address: string) {
  const lower = address.toLowerCase();
  if (lower.includes('南山') || lower.includes('后海') || lower.includes('深圳湾') || lower.includes('科技园') || lower.includes('白石洲')) {
    return { lng: 113.939882, lat: 22.517521, district: '南山区', formattedAddress: address };
  }
  if (lower.includes('罗湖') || lower.includes('春风路') || lower.includes('东门') || lower.includes('文锦渡')) {
    return { lng: 114.118932, lat: 22.536412, district: '罗湖区', formattedAddress: address };
  }
  if (lower.includes('龙华') || lower.includes('民治') || lower.includes('红山') || lower.includes('深圳北')) {
    return { lng: 114.024512, lat: 22.614214, district: '龙华区', formattedAddress: address };
  }
  return { lng: 114.062125, lat: 22.522814, district: '福田区', formattedAddress: address };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const city = searchParams.get('city') || '深圳市';

  if (!address) {
    return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
  }

  try {
    const url = `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(
      address
    )}&city=${encodeURIComponent(city)}&key=${AMAP_KEY}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    const data = await res.json();

    if (data.status === '1' && data.geocodes && data.geocodes.length > 0) {
      const first = data.geocodes[0];
      const [lngStr, latStr] = first.location.split(',');
      return NextResponse.json({
        lng: parseFloat(lngStr),
        lat: parseFloat(latStr),
        formattedAddress: first.formatted_address,
        district: first.district,
      });
    }
  } catch (error: any) {
    console.warn('AMap Geocoding API fetch skipped, using regional fallback:', error?.message);
  }

  // Graceful fallback coordinate in Shenzhen
  const fallback = getFallbackShenzhenCoords(address);
  return NextResponse.json(fallback);
}
