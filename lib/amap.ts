const AMAP_KEY = process.env.NEXT_PUBLIC_AMAP_KEY || 'b1ab3580beb37c0f0434692477d6f331';
const AMAP_SECURITY_CODE = process.env.NEXT_PUBLIC_AMAP_SECURITY_CODE || '12726c8cdd730b4bd6bae42b8a0369fa';

export interface GeocodeResult {
  lng: number;
  lat: number;
  formattedAddress?: string;
  district?: string;
}

/**
 * Initializes and loads the AMap 2.0 JS API SDK with a strict 3-second timeout
 */
export async function loadAMapSDK(): Promise<any> {
  if (typeof window === 'undefined') return null;

  // Set AMap security config on window
  (window as any)._AMapSecurityConfig = {
    securityJsCode: AMAP_SECURITY_CODE,
  };

  const loadPromise = async () => {
    const AMapLoader = (await import('@amap/amap-jsapi-loader')).default;
    const AMap = await AMapLoader.load({
      key: AMAP_KEY,
      version: '2.0',
      plugins: [
        'AMap.Geocoder',
        'AMap.ToolBar',
        'AMap.AutoComplete',
        'AMap.PlaceSearch',
      ],
    });
    return AMap;
  };

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('高德地图连接超时，已自动启用手绘矢量地图')), 3500)
  );

  try {
    const AMap = await Promise.race([loadPromise(), timeoutPromise]);
    return AMap;
  } catch (error) {
    console.warn('AMap SDK load warning/fallback:', error);
    throw error;
  }
}

/**
 * Utility to convert human-entered address into precise [lng, lat] coordinates
 */
export async function geocodeAddress(address: string, city: string = '深圳市'): Promise<GeocodeResult> {
  // If in browser and AMap is loaded
  if (typeof window !== 'undefined' && (window as any).AMap && (window as any).AMap.Geocoder) {
    return new Promise((resolve) => {
      const geocoder = new (window as any).AMap.Geocoder({ city });
      geocoder.getLocation(address, (status: string, result: any) => {
        if (status === 'complete' && result.geocodes && result.geocodes.length > 0) {
          const first = result.geocodes[0];
          resolve({
            lng: Number(first.location.lng),
            lat: Number(first.location.lat),
            formattedAddress: first.formattedAddress,
            district: first.district,
          });
        } else {
          resolve(getFallbackShenzhenCoords(address));
        }
      });
    });
  }

  // Fallback REST API call or heuristic
  try {
    const res = await fetch(`/api/geocode?address=${encodeURIComponent(address)}&city=${encodeURIComponent(city)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.lng && data.lat) {
        return data;
      }
    }
  } catch (e) {
    console.warn('Geocoding API failed, using regional coordinates:', e);
  }

  return getFallbackShenzhenCoords(address);
}

export interface PlaceSuggestion {
  name: string;
  address: string;
  district: string;
  lng: number;
  lat: number;
}

/**
 * 实时从高德 POI / 自动补全接口搜索地点推荐（类似外卖搜索）
 */
export async function searchPlaceSuggestions(keyword: string, city: string = '深圳'): Promise<PlaceSuggestion[]> {
  if (!keyword || !keyword.trim()) return [];

  // 1. Try AMap client-side AutoComplete
  if (typeof window !== 'undefined') {
    try {
      const AMap = (window as any).AMap || (await loadAMapSDK());
      if (AMap && AMap.AutoComplete) {
        return new Promise((resolve) => {
          const auto = new AMap.AutoComplete({ city });
          auto.search(keyword, (status: string, result: any) => {
            if (status === 'complete' && result && result.tips) {
              const items: PlaceSuggestion[] = result.tips
                .filter((tip: any) => tip.location && tip.name)
                .map((tip: any) => ({
                  name: tip.name,
                  address: tip.address || tip.district || tip.name,
                  district: tip.district || '',
                  lng: Number(tip.location.lng),
                  lat: Number(tip.location.lat),
                }));
              if (items.length > 0) {
                return resolve(items.slice(0, 7));
              }
            }
            resolve(getLocalFilteredPresets(keyword));
          });
        });
      }
    } catch (e) {
      console.warn('AMap AutoComplete query failed:', e);
    }
  }

  return getLocalFilteredPresets(keyword);
}

/**
 * 逆地理编码：根据经纬度反查标准地址（外卖拖拽定位大头针核心）
 */
export async function reverseGeocodeCoords(lng: number, lat: number): Promise<{ address: string; district: string }> {
  if (typeof window !== 'undefined') {
    try {
      const AMap = (window as any).AMap || (await loadAMapSDK());
      if (AMap && AMap.Geocoder) {
        return new Promise((resolve) => {
          const geocoder = new AMap.Geocoder();
          geocoder.getAddress([lng, lat], (status: string, result: any) => {
            if (status === 'complete' && result && result.regeocode) {
              resolve({
                address: result.regeocode.formattedAddress || '已选定位点',
                district: result.regeocode.addressComponent?.district || '',
              });
            } else {
              resolve({ address: `定位点 (${lng.toFixed(4)}, ${lat.toFixed(4)})`, district: '' });
            }
          });
        });
      }
    } catch (e) {
      console.warn('Reverse geocoding failed:', e);
    }
  }
  return { address: `定位坐标 [${lng.toFixed(4)}, ${lat.toFixed(4)}]`, district: '' };
}

import { PRESET_POPULAR_COMMUNITIES } from './mapFeatures';

function getLocalFilteredPresets(keyword: string): PlaceSuggestion[] {
  const kw = keyword.toLowerCase().trim();
  return PRESET_POPULAR_COMMUNITIES
    .filter((p) => p.name.toLowerCase().includes(kw) || p.address.toLowerCase().includes(kw) || p.district.toLowerCase().includes(kw))
    .map((p) => ({
      name: p.name,
      address: p.address,
      district: p.district,
      lng: p.lng,
      lat: p.lat,
    }));
}

/**
 * 权威精准的地标与小区 Fallback 匹配
 */
function getFallbackShenzhenCoords(address: string): GeocodeResult {
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
  if (lower.includes('pgh') || lower.includes('研宿') || lower.includes('中文大学')) {
    return { lng: 114.2052, lat: 22.4195, district: '香港·沙田区', formattedAddress: '香港新界沙田马料水香港中文大学研究生宿舍' };
  }

  // 4. 南山 / 后海 / 科技园
  if (lower.includes('后海') || lower.includes('深圳湾') || lower.includes('海岸城') || lower.includes('漾日湾')) {
    return { lng: 113.939882, lat: 22.517521, district: '南山区' };
  }
  if (lower.includes('科技园') || lower.includes('高新') || lower.includes('白石洲') || lower.includes('华侨城')) {
    return { lng: 113.971212, lat: 22.538914, district: '南山区' };
  }
  if (lower.includes('蛇口') || lower.includes('前海') || lower.includes('赤湾')) {
    return { lng: 113.918932, lat: 22.498912, district: '南山区' };
  }

  // 5. 福田各片区
  if (lower.includes('莲花北') || lower.includes('青莲') || lower.includes('莲花山') || lower.includes('彩田')) {
    return { lng: 114.058312, lat: 22.562145, district: '福田区' };
  }
  if (lower.includes('梅林') || lower.includes('下梅林') || lower.includes('上梅林')) {
    return { lng: 114.048932, lat: 22.571412, district: '福田区' };
  }
  if (lower.includes('景田') || lower.includes('香蜜湖') || lower.includes('车公庙') || lower.includes('竹子林')) {
    return { lng: 114.028932, lat: 22.538412, district: '福田区' };
  }
  if (lower.includes('岗厦') || lower.includes('市民中心') || lower.includes('会展中心') || lower.includes('华强北')) {
    return { lng: 114.068932, lat: 22.541412, district: '福田区' };
  }
  if (lower.includes('皇岗') || lower.includes('皇御苑') || lower.includes('福田南')) {
    return { lng: 114.086432, lat: 22.527319, district: '福田区' };
  }
  if (lower.includes('沙尾') || lower.includes('沙头') || lower.includes('红树林')) {
    return { lng: 114.041832, lat: 22.518641, district: '福田区' };
  }
  if (lower.includes('水围') || lower.includes('福民') || lower.includes('福田口岸') || lower.includes('落马洲') || lower.includes('海悦')) {
    return { lng: 114.062125, lat: 22.522814, district: '福田区' };
  }

  // 6. 罗湖
  if (lower.includes('罗湖') || lower.includes('春风路') || lower.includes('东门') || lower.includes('国贸') || lower.includes('文锦渡')) {
    return { lng: 114.118932, lat: 22.536412, district: '罗湖区' };
  }

  // 7. 龙华 / 深圳北站
  if (lower.includes('龙华') || lower.includes('民治') || lower.includes('红山') || lower.includes('深圳北')) {
    return { lng: 114.024512, lat: 22.614214, district: '龙华区' };
  }

  // 默认福田口岸核心区
  return { lng: 114.062125 + (Math.random() - 0.5) * 0.02, lat: 22.522814 + (Math.random() - 0.5) * 0.02, district: '福田区' };
}

/**
 * Generates custom HTML for minimalist map markers with university, community name, and rent stats
 */
export function createHandDrawnMarkerContent(
  communityName: string,
  totalStudents: number,
  avgRent: number = 3200,
  primaryUni: string = 'HKU',
  isHighlighted = false,
  isPreset = false
): string {
  const uniColors: Record<string, { bg: string; text: string; dot: string }> = {
    HKU: { bg: '#EBF3EE', text: '#21573B', dot: '#21573B' },
    CUHK: { bg: '#F9ECEF', text: '#6D2034', dot: '#6D2034' },
    HKUST: { bg: '#EBF1F7', text: '#1D3B5C', dot: '#1D3B5C' },
    PolyU: { bg: '#F8ECEE', text: '#7D222E', dot: '#7D222E' },
    CityU: { bg: '#F7ECEF', text: '#731D33', dot: '#731D33' },
    HKBU: { bg: '#EBF2F7', text: '#194168', dot: '#194168' },
    LingU: { bg: '#F9ECEC', text: '#852929', dot: '#852929' },
    EdUHK: { bg: '#EAF5F6', text: '#1B656F', dot: '#1B656F' },
  };

  const current = uniColors[primaryUni] || { bg: '#F2F2EF', text: '#3E424B', dot: '#3E424B' };

  if (isPreset && totalStudents === 0) {
    // Elegant candidate marker awaiting first pioneer
    return `
      <div style="cursor: pointer; transform: ${isHighlighted ? 'scale(1.08)' : 'scale(1)'}; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); user-select: none; font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif;">
        <div style="
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.95);
          border: 1px dashed ${isHighlighted ? '#1C1E21' : '#B8BCB5'};
          border-radius: 8px;
          padding: 4px 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          white-space: nowrap;
        ">
          <span style="
            background: #F4F4F0;
            color: #7A7E85;
            font-weight: 500;
            font-size: 10px;
            padding: 1px 5px;
            border-radius: 3px;
          ">
            待点亮
          </span>
          <div style="display: flex; flex-direction: column; text-align: left;">
            <span style="font-weight: 600; font-size: 11px; color: #4A4E57; line-height: 1.2;">
              ${communityName.split('/')[0]}
            </span>
            <span style="font-size: 10px; color: #9A9EA6; line-height: 1.1;">
              参考 ¥${avgRent}/月
            </span>
          </div>
        </div>
        <div style="
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 4px solid ${isHighlighted ? '#1C1E21' : '#B8BCB5'};
          margin: 0 auto;
          margin-top: -1px;
        "></div>
      </div>
    `;
  }

  return `
    <div style="cursor: pointer; transform: ${isHighlighted ? 'scale(1.08)' : 'scale(1)'}; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); user-select: none; font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif;">
      <div style="
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: #FFFFFF;
        border: 1px solid ${isHighlighted ? '#1C1E21' : '#E2E2DC'};
        border-radius: 8px;
        padding: 5px 10px;
        box-shadow: ${isHighlighted ? '0 8px 24px -4px rgba(0, 0, 0, 0.16)' : '0 4px 14px -2px rgba(0, 0, 0, 0.07)'};
        white-space: nowrap;
      ">
        <span style="
          background: ${current.bg};
          color: ${current.text};
          font-weight: 600;
          font-size: 11px;
          padding: 1.5px 6px;
          border-radius: 4px;
          letter-spacing: 0.02em;
        ">
          ${primaryUni}
        </span>
        <div style="display: flex; flex-direction: column; text-align: left;">
          <span style="font-weight: 600; font-size: 12px; color: #1C1E21; line-height: 1.2;">
            ${communityName.split('/')[0]}
          </span>
          <span style="font-size: 11px; font-weight: 500; color: #6E727A; line-height: 1.1;">
            ¥${avgRent}/月 · <span style="color: #21573B; font-weight: 600;">${totalStudents}位校友</span>
          </span>
        </div>
        <div style="width: 5px; height: 5px; border-radius: 50%; background-color: ${current.dot};"></div>
      </div>
      <div style="
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid ${isHighlighted ? '#1C1E21' : '#E2E2DC'};
        margin: 0 auto;
        margin-top: -1px;
      "></div>
    </div>
  `;
}

/**
 * Custom Pill Marker for Shenzhen-HK Border Checkpoint Ports
 */
export function createPortMarkerContent(
  portName: string,
  subText: string,
  tag: string
): string {
  return `
    <div style="cursor: pointer; user-select: none; font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif;">
      <div style="
        display: inline-flex;
        align-items: center;
        gap: 7px;
        background: #232E28;
        color: #FFFFFF;
        border: 1px solid #141C17;
        border-radius: 20px;
        padding: 4px 10px 4px 8px;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
        white-space: nowrap;
      ">
        <span style="
          width: 18px;
          height: 18px;
          background: #3B4B42;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
        ">
          🛂
        </span>
        <div style="display: flex; flex-direction: column; text-align: left;">
          <div style="display: flex; align-items: center; gap: 4px;">
            <span style="font-weight: 600; font-size: 11px; color: #FFFFFF; line-height: 1.1;">
              ${portName}
            </span>
            <span style="
              background: #3B4B42;
              color: #B4C7BC;
              font-size: 9px;
              padding: 0.5px 4px;
              border-radius: 3px;
              font-weight: 500;
            ">
              ${tag}
            </span>
          </div>
          <span style="font-size: 9.5px; color: #B4C7BC; line-height: 1.1; margin-top: 1px;">
            ${subText}
          </span>
        </div>
      </div>
      <div style="
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 5px solid #232E28;
        margin: 0 auto;
        margin-top: -1px;
      "></div>
    </div>
  `;
}

/**
 * Custom Floating Badge Label for Living Area Clusters
 */
export function createAreaLabelContent(areaName: string, badge: string, color: string = '#2D3A34'): string {
  return `
    <div style="
      user-select: none;
      pointer-events: none;
      font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif;
      text-align: center;
    ">
      <div style="
        display: inline-flex;
        align-items: center;
        gap: 5px;
        background: rgba(255, 255, 255, 0.92);
        backdrop-filter: blur(8px);
        border: 1px solid ${color}33;
        border-radius: 6px;
        padding: 2.5px 7px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
        white-space: nowrap;
      ">
        <span style="width: 5px; height: 5px; border-radius: 50%; background-color: ${color};"></span>
        <span style="font-weight: 600; font-size: 10.5px; color: #1C1E21;">
          ${areaName}
        </span>
        <span style="font-size: 9.5px; color: #7A7E85;">
          ${badge}
        </span>
      </div>
    </div>
  `;
}

