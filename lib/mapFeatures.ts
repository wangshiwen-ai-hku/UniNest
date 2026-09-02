export interface BorderPort {
  id: string;
  name: string;
  nameEn: string;
  lng: number;
  lat: number;
  sub: string;
  subEn: string;
  tag: string;
  tagEn: string;
}

export interface HotLivingArea {
  id: string;
  name: string;
  nameEn: string;
  center: [number, number]; // [lng, lat]
  radius: number; // in meters
  badge: string;
  badgeEn: string;
  desc: string;
  descEn: string;
  fillColor: string;
  strokeColor: string;
}

export interface PresetCommunity {
  id: string;
  name: string;
  district: string;
  address: string;
  lng: number;
  lat: number;
  nearestPort: string;
  commuteMinutes: number;
  approxRent: number;
  desc: string;
  descEn: string;
}

/**
 * 核心深港通关口岸标注
 */
export const BORDER_PORTS: BorderPort[] = [
  {
    id: 'port-futian',
    name: '福田口岸',
    nameEn: 'Futian Port',
    lng: 114.0683,
    lat: 22.5186,
    sub: '4/10号线直通 · 连落马洲支线',
    subEn: 'Metro Line 4/10 · Direct to Lok Ma Chau',
    tag: '跨境首选',
    tagEn: 'Top Choice',
  },
  {
    id: 'port-huanggang',
    name: '皇岗口岸',
    nameEn: 'Huanggang Port',
    lng: 114.0770,
    lat: 22.5190,
    sub: '24小时全天候通关 · 跨境直通巴',
    subEn: '24-hour Border Checkpoint · Cross-border Coach',
    tag: '24h通关',
    tagEn: '24 Hours',
  },
  {
    id: 'port-shenzhenbay',
    name: '深圳湾口岸',
    nameEn: 'Shenzhen Bay Port',
    lng: 113.9450,
    lat: 22.4930,
    sub: '一地两检 · 直达屯门/西九龙/港大',
    subEn: 'Co-location · Direct to Tuen Mun & HKU',
    tag: '南山核心',
    tagEn: 'Nanshan Hub',
  },
  {
    id: 'port-luohu',
    name: '罗湖口岸',
    nameEn: 'Luohu Port',
    lng: 114.1170,
    lat: 22.5315,
    sub: '1号线直连 · 港铁东铁线起点',
    subEn: 'Metro Line 1 · MTR East Rail Line Start',
    tag: '商圈繁华',
    tagEn: 'Metro Line 1',
  },
  {
    id: 'port-westkowloon',
    name: '深圳北站 (高铁)',
    nameEn: 'Shenzhen North (HSR)',
    lng: 114.0290,
    lat: 22.6090,
    sub: '高铁18分钟直达香港西九龙',
    subEn: '18 mins HSR to HK West Kowloon',
    tag: '极速高铁',
    tagEn: 'High Speed Rail',
  },
];

/**
 * 热门高校生源聚居片区（浅淡色底晕区分）
 */
export const HOT_LIVING_AREAS: HotLivingArea[] = [
  {
    id: 'area-futian-shuiwei',
    name: '福田口岸 / 水围生活圈',
    nameEn: 'Futian Port & Shuiwei Cluster',
    center: [114.0620, 22.5230],
    radius: 950,
    badge: '校友高密聚集片区',
    badgeEn: 'High Density Alumni Zone',
    desc: '步行直达福田口岸，楼下茶餐厅美食聚集，港校生源最集中',
    descEn: 'Walk to Futian Port, vibrant local food, most popular for HK students',
    fillColor: '#304138', // Zen forest green tint
    strokeColor: '#304138',
  },
  {
    id: 'area-jingtian-lianhua',
    name: '景田 / 莲花北生活圈',
    nameEn: 'Jingtian & Lianhuabei Cluster',
    center: [114.0530, 22.5600],
    radius: 1200,
    badge: '4号线直通 · 宁静宜居',
    badgeEn: 'Line 4 Direct · Peaceful Living',
    desc: '紧邻莲花山公园，4号线直接坐到福田口岸过关，绿化高、居住安静舒适',
    descEn: 'Next to Lianhua Hill Park, Line 4 straight to Futian Port, serene & green',
    fillColor: '#21573B', // HKU emerald tint
    strokeColor: '#21573B',
  },
  {
    id: 'area-shenzhenbay-houhai',
    name: '深圳湾 / 后海品质圈',
    nameEn: 'Shenzhen Bay & Houhai Cluster',
    center: [113.9380, 22.5130],
    radius: 1300,
    badge: '近深圳湾口岸 · 品质海景',
    badgeEn: 'Near Shenzhen Bay Port · Coastal Living',
    desc: '深圳湾口岸直通香港，周边商圈发达，港大/科大热门高品质小区集中地',
    descEn: 'Close to Shenzhen Bay Port, premium complexes favored by HKU/HKUST',
    fillColor: '#1D3B5C', // HKUST navy slate tint
    strokeColor: '#1D3B5C',
  },
  {
    id: 'area-huanggang-cbd',
    name: '皇岗口岸 / 福田CBD生活圈',
    nameEn: 'Huanggang Port & CBD Cluster',
    center: [114.0830, 22.5280],
    radius: 900,
    badge: '24小时通关 · CBD便利',
    badgeEn: '24h Border · CBD Convenience',
    desc: '大型成熟社区（如皇御苑），24小时随时通关香港，生活机能极强',
    descEn: 'Large mature complexes (Imperial Garden), 24-hr border transit to HK',
    fillColor: '#6D2034', // CUHK burgundy tint
    strokeColor: '#6D2034',
  },
];

/**
 * 预先标注的热门候选小区（如果数据库尚无登记，则呈现“待点亮”，若已有提交则以真实数据点亮）
 */
export const PRESET_POPULAR_COMMUNITIES: PresetCommunity[] = [
  {
    id: 'preset-huangyuyuan',
    name: '皇御苑',
    district: '福田区',
    address: '深圳市福田区福田南路7号 (近皇岗口岸)',
    lng: 114.0845,
    lat: 22.5273,
    nearestPort: '皇岗口岸 (24h)',
    commuteMinutes: 8,
    approxRent: 3500,
    desc: '皇岗口岸旁大型成熟社区，楼下配套齐全，24小时通关直通香港',
    descEn: 'Large complex right by Huanggang Port, 24-hr transit to HK',
  },
  {
    id: 'preset-haiyue',
    name: '海悦华城',
    district: '福田区',
    address: '深圳市福田区福田口岸西侧裕亨路',
    lng: 114.0621,
    lat: 22.5228,
    nearestPort: '福田口岸',
    commuteMinutes: 5,
    approxRent: 3800,
    desc: '福田口岸地铁站A出口步行3分钟，港校同学合租头号热门标的',
    descEn: '3 mins walk to Futian Port exit A, prime choice for HK students',
  },
  {
    id: 'preset-qinglian',
    name: '城投青莲公寓',
    district: '福田区',
    address: '深圳市福田区莲花街道青莲路2号',
    lng: 114.057731,
    lat: 22.561361,
    nearestPort: '福田口岸',
    commuteMinutes: 15,
    approxRent: 5300,
    desc: '紧邻4号线莲花北站，直达福田口岸，高品质国有长租公寓',
    descEn: 'Next to Line 4 Lianhuabei Metro, direct to Futian Port, quality state-owned rental',
  },
  {
    id: 'preset-zhidi',
    name: '置地逸轩',
    district: '福田区',
    address: '深圳市福田区金田路与福民路交汇处',
    lng: 114.0612,
    lat: 22.5245,
    nearestPort: '福田口岸',
    commuteMinutes: 8,
    approxRent: 4000,
    desc: '4号线/10号线福民站上盖，两站直达福田口岸，生活极便利',
    descEn: 'Above Fumin Station (Line 4/10), 2 stops to Futian Port',
  },
  {
    id: 'preset-shuiwei',
    name: '福田水围村',
    district: '福田区',
    address: '深圳市福田区水围文化商业街',
    lng: 114.0558,
    lat: 22.5195,
    nearestPort: '福田口岸',
    commuteMinutes: 7,
    approxRent: 3000,
    desc: '步行到口岸仅需7分钟，青年公寓密集，文化与烟火气极浓',
    descEn: '7 mins walk to port, lively nightlife and affordable youth apartments',
  },
  {
    id: 'preset-yangriwan',
    name: '漾日湾畔',
    district: '南山区',
    address: '深圳市南山区后海滨路与海德三道交汇处',
    lng: 113.9398,
    lat: 22.5175,
    nearestPort: '深圳湾口岸',
    commuteMinutes: 12,
    approxRent: 5500,
    desc: '后海海岸城核心圈，2号线/11号线后海站旁，直达深圳湾口岸',
    descEn: 'Houhai prime area next to Coastal City, convenient to Shenzhen Bay Port',
  },
  {
    id: 'preset-caitian',
    name: '彩田村',
    district: '福田区',
    address: '深圳市福田区莲花街道彩田路',
    lng: 114.0625,
    lat: 22.5645,
    nearestPort: '福田口岸',
    commuteMinutes: 15,
    approxRent: 3600,
    desc: '莲花北地铁站旁成熟大型绿化社区，4号线直通福田口岸',
    descEn: 'Green mature community next to Lianhuabei Station, direct line 4',
  },
];
