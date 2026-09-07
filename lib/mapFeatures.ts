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
  region?: 'SZ' | 'HK';
  category?: 'dorm' | 'apartment' | 'residential';
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
  {
    id: 'area-hk-taiwai',
    name: '香港大围 / 沙田生活圈',
    nameEn: 'HK Tai Wai & Sha Tin Cluster',
    center: [114.1800, 22.3740],
    radius: 1100,
    badge: '港铁双线 · 港校合租大本营',
    badgeEn: 'MTR Dual Line · Student Hub',
    desc: '东铁线与屯马线枢纽，中大/城大/浸会同学聚集，生活机能与商圈极其成熟',
    descEn: 'MTR East Rail & Tuen Ma Hub, favored by CUHK/CityU/HKBU students',
    fillColor: '#7D222E', // PolyU/CityU crimson tint
    strokeColor: '#7D222E',
  },
  {
    id: 'area-hk-hunghom',
    name: '香港红磡 / 黄埔生活圈',
    nameEn: 'HK Hung Hom & Whampoa Cluster',
    center: [114.1870, 22.3040],
    radius: 1000,
    badge: '理大步行圈 · 海景宜居',
    badgeEn: 'PolyU Walking Dist · Harbourfront',
    desc: '步行直达香港理工大学与红磡站，黄埔天地美食购物便利，生活氛围极佳',
    descEn: 'Walk to PolyU & Hung Hom MTR, vibrant dining and shopping at Whampoa',
    fillColor: '#21573B', // HKU emerald tint
    strokeColor: '#21573B',
  },
];

/**
 * 预先标注的热门候选小区（如果数据库尚无登记，则呈现“待点亮”，若已有提交则以真实数据点亮）
 */
export const PRESET_POPULAR_COMMUNITIES: PresetCommunity[] = [
  // ================= 深圳跨境热门小区 =================
  {
    id: 'preset-jindimingjin',
    name: '金地名津',
    district: '福田区',
    address: '深圳市福田区港田路与裕亨路交汇处 (福田口岸正对面)',
    lng: 114.0664,
    lat: 22.5195,
    nearestPort: '福田口岸',
    commuteMinutes: 3,
    approxRent: 3800,
    desc: '福田口岸东侧正对面步行2分钟即达，深港双城极速通勤标杆，港校校友高密聚集',
    descEn: '2 mins walk directly opposite Futian Port, iconic cross-border student complex',
    region: 'SZ',
    category: 'residential',
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
    region: 'SZ',
    category: 'residential',
  },
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
    region: 'SZ',
    category: 'residential',
  },
  {
    id: 'preset-luohu-zhidi',
    name: '置地广场 (罗湖)',
    district: '罗湖区',
    address: '深圳市罗湖区春风路3068号 (近罗湖口岸/文锦渡)',
    lng: 114.1235,
    lat: 22.5368,
    nearestPort: '罗湖口岸',
    commuteMinutes: 8,
    approxRent: 3500,
    desc: '罗湖春风路核心商圈，近罗湖口岸与文锦渡口岸，东铁线起点通勤极方便',
    descEn: 'Chunfeng Rd Luohu hub, quick transit to Luohu Port & Man Kam To',
    region: 'SZ',
    category: 'residential',
  },
  {
    id: 'preset-zhidi',
    name: '置地逸轩 (福田)',
    district: '福田区',
    address: '深圳市福田区金田路与福民路交汇处 (福民站上盖)',
    lng: 114.0612,
    lat: 22.5245,
    nearestPort: '福田口岸',
    commuteMinutes: 6,
    approxRent: 4000,
    desc: '4号线/10号线福民站上盖，两站直达福田口岸，生活极便利',
    descEn: 'Above Fumin Station (Line 4/10), 2 stops to Futian Port',
    region: 'SZ',
    category: 'residential',
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
    region: 'SZ',
    category: 'apartment',
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
    region: 'SZ',
    category: 'apartment',
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
    region: 'SZ',
    category: 'residential',
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
    region: 'SZ',
    category: 'residential',
  },

  // ================= 香港租房地点样本 (校舍宿舍 + 热门学生楼盘) =================
  {
    id: 'preset-hk-hku-village',
    name: '港大赛马会第一学生村',
    district: '香港·中西区',
    address: '香港薄扶林道93号 (何东夫人纪念堂/施德堂)',
    lng: 114.1352,
    lat: 22.2828,
    nearestPort: '香港本地 (免通关)',
    commuteMinutes: 5,
    approxRent: 3300,
    desc: '港大历史悠久的学生村，依山傍海，校巴或步行5分钟直达港大本部教学区',
    descEn: 'HKU Jockey Club Student Village I, 5 mins shuttle/walk to main campus',
    region: 'HK',
    category: 'dorm',
  },
  {
    id: 'preset-hk-cuhk-pgh',
    name: '中大研究生宿舍 (PGH)',
    district: '香港·沙田区',
    address: '香港新界沙田马料水香港中文大学校内',
    lng: 114.2052,
    lat: 22.4195,
    nearestPort: '香港本地 (免通关)',
    commuteMinutes: 6,
    approxRent: 3600,
    desc: '港中大校内研究生专属宿舍，免费校巴穿梭全校各学部，依山傍海清幽舒适',
    descEn: 'CUHK Postgraduate Halls on campus, internal shuttles connect all departments',
    region: 'HK',
    category: 'dorm',
  },
  {
    id: 'preset-hk-festival-city',
    name: '大围名城 (Festival City)',
    district: '香港·沙田区',
    address: '香港新界沙田大围美田路1号 (大围站上盖)',
    lng: 114.1785,
    lat: 22.3732,
    nearestPort: '香港本地 (免通关)',
    commuteMinutes: 12,
    approxRent: 6800,
    desc: '港铁大围站上盖双轨交汇，中大、城大、浸会同学最热门合租大盘，会所设施极豪华',
    descEn: 'Above Tai Wai Station, prime shared accommodation for CUHK/CityU/HKBU students',
    region: 'HK',
    category: 'residential',
  },
  {
    id: 'preset-hk-harbour-place',
    name: '红磡海滨南岸 (Harbour Place)',
    district: '香港·九龙城区',
    address: '香港九龙红磡爱景街8号 (近红磡站/黄埔站)',
    lng: 114.1882,
    lat: 22.3025,
    nearestPort: '香港本地 (免通关)',
    commuteMinutes: 10,
    approxRent: 7500,
    desc: '理大、城大首选合租标杆，步行10分钟直通香港理工大学及红磡港铁站',
    descEn: 'Harbour Place, 10 mins walk to PolyU & Hung Hom MTR, top choice for PolyU',
    region: 'HK',
    category: 'residential',
  },
  {
    id: 'preset-hk-residence-oasis',
    name: '坑口蔚蓝湾畔 (Residence Oasis)',
    district: '香港·西贡区',
    address: '香港新界将军澳培成路15号 (坑口站上盖)',
    lng: 114.2642,
    lat: 22.3168,
    nearestPort: '香港本地 (免通关)',
    commuteMinutes: 15,
    approxRent: 6500,
    desc: '科大（HKUST）合租大本营，楼下专线小巴11M直达科大北闸仅需10分钟',
    descEn: 'Above Hang Hau Station, 10 mins green minibus 11M directly to HKUST North Gate',
    region: 'HK',
    category: 'residential',
  },
  {
    id: 'preset-hk-the-merton',
    name: '坚尼地城泓都 (The Merton)',
    district: '香港·中西区',
    address: '香港港岛坚尼地城新海旁38号',
    lng: 114.1278,
    lat: 22.2845,
    nearestPort: '香港本地 (免通关)',
    commuteMinutes: 12,
    approxRent: 8000,
    desc: '港岛高品质海景住宅，坚尼地城站1站直抵港大站，周边网红咖啡与美食云集',
    descEn: 'Near Kennedy Town MTR, 1 stop to HKU Station, favored premium HKU rental',
    region: 'HK',
    category: 'residential',
  },
];
