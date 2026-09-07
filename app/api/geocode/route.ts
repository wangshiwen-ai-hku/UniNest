import { NextRequest, NextResponse } from 'next/server';

const AMAP_KEY = process.env.NEXT_PUBLIC_AMAP_KEY || 'b1ab3580beb37c0f0434692477d6f331';

function getFallbackShenzhenCoords(address: string) {
  const lower = address.toLowerCase();

  // 1. 金地名津（福田口岸正对面，重点纠错）
  if (lower.includes('金地名津') || (lower.includes('金地') && lower.includes('名津'))) {
    return { lng: 114.0664, lat: 22.5195, district: '福田区', formattedAddress: '深圳市福田区港田路金地名津' };
  }

  // 2. 置地广场 (罗湖区春风路) vs 置地逸轩 (福田区福民)
  if (lower.includes('置地广场') || (lower.includes('置地') && (lower.includes('罗湖') || lower.includes('春风')))) {
    return { lng: 114.1235, lat: 22.5368, district: '罗湖区', formattedAddress: '深圳市罗湖区春风路3068号置地广场' };
  }
  if (lower.includes('置地逸轩') || lower.includes('置地')) {
    return { lng: 114.0612, lat: 22.5245, district: '福田区', formattedAddress: '深圳市福田区金田路3028号置地逸轩' };
  }

  // 3. 香港热点房源
  if (lower.includes('名城') || lower.includes('festival city')) {
    return { lng: 114.1785, lat: 22.3732, district: '香港·沙田区', formattedAddress: '香港新界沙田大围美田路1号大围名城' };
  }
  if (lower.includes('海滨南岸') || lower.includes('harbour place')) {
    return { lng: 114.1882, lat: 22.3025, district: '香港·九龙城区', formattedAddress: '香港九龙红磡爱景街8号海滨南岸' };
  }
  if (lower.includes('学生村') || lower.includes('薄扶林')) {
    return { lng: 114.1352, lat: 22.2828, district: '香港·中西区', formattedAddress: '香港薄扶林道93号香港大学赛马会第一学生村' };
  }
  if (lower.includes('蔚蓝湾畔') || lower.includes('坑口')) {
    return { lng: 114.2642, lat: 22.3168, district: '香港·西贡区', formattedAddress: '香港新界将军澳培成路15号蔚蓝湾畔' };
  }
  if (lower.includes('泓都') || lower.includes('坚尼地城')) {
    return { lng: 114.1278, lat: 22.2845, district: '香港·中西区', formattedAddress: '香港港岛坚尼地城新海旁38号泓都' };
  }

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
