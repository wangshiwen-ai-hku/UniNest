export interface TransitRoute {
  id: string;
  name: string;
  nameEn: string;
  type: 'metro' | 'cross_bus' | 'mtr_rail';
  color: string;
  weight: number;
  opacity: number;
  dashArray?: number[];
  description: string;
  descriptionEn: string;
  stops: { name: string; coord: [number, number] }[];
}

/**
 * 重点深港公共交通高亮动线数据
 */
export const HIGHLIGHT_TRANSIT_ROUTES: TransitRoute[] = [
  // 1. 深圳地铁4号线（深港核心生命线）
  {
    id: 'sz-metro-4',
    name: '深圳地铁 4号线 (跨境枢纽专线)',
    nameEn: 'Shenzhen Metro Line 4 (Futian Port Lifeline)',
    type: 'metro',
    color: '#D83B01', // Iconic line 4 red
    weight: 4.5,
    opacity: 0.85,
    description: '直通福田口岸，串联水围、莲花北、上梅林与深圳北高铁站',
    descriptionEn: 'Direct to Futian Port, connecting Shuiwei, Lianhuabei & Shenzhen North',
    stops: [
      { name: '福田口岸', coord: [114.0683, 22.5186] },
      { name: '福民', coord: [114.0612, 22.5245] },
      { name: '会展中心', coord: [114.0592, 22.5318] },
      { name: '市民中心', coord: [114.0595, 22.5412] },
      { name: '少年宫', coord: [114.0596, 22.5501] },
      { name: '莲花北 (城投青莲)', coord: [114.0577, 22.5614] },
      { name: '上梅林', coord: [114.0575, 22.5708] },
      { name: '民乐', coord: [114.0450, 22.5890] },
      { name: '深圳北站 (高铁直达西九龙)', coord: [114.0290, 22.6090] },
    ],
  },

  // 2. 深圳地铁10号线（福田口岸双干线）
  {
    id: 'sz-metro-10',
    name: '深圳地铁 10号线 (福田口岸东翼)',
    nameEn: 'Shenzhen Metro Line 10 (East Futian)',
    type: 'metro',
    color: '#E06D96', // Line 10 rose pink
    weight: 3.5,
    opacity: 0.75,
    description: '福田口岸出发，直达岗厦、岗厦北超大枢纽与坂田',
    descriptionEn: 'Futian Port to Gangxia North transport hub',
    stops: [
      { name: '福田口岸', coord: [114.0683, 22.5186] },
      { name: '福民', coord: [114.0612, 22.5245] },
      { name: '岗厦', coord: [114.0658, 22.5348] },
      { name: '岗厦北', coord: [114.0660, 22.5410] },
      { name: '冬瓜岭', coord: [114.0650, 22.5550] },
    ],
  },

  // 3. 深圳地铁1号线（横贯罗湖口岸与南山高新园）
  {
    id: 'sz-metro-1',
    name: '深圳地铁 1号线 (罗湖口岸核心线)',
    nameEn: 'Shenzhen Metro Line 1 (Luohu Port Mainline)',
    type: 'metro',
    color: '#00A854', // Line 1 emerald
    weight: 3.5,
    opacity: 0.75,
    description: '罗湖口岸直通车公庙、白石洲与高新园',
    descriptionEn: 'Direct from Luohu Port to Chegongmiao & High-Tech Park',
    stops: [
      { name: '罗湖口岸', coord: [114.1170, 22.5315] },
      { name: '国贸', coord: [114.1180, 22.5390] },
      { name: '大剧院', coord: [114.1080, 22.5420] },
      { name: '岗厦', coord: [114.0658, 22.5348] },
      { name: '会展中心', coord: [114.0592, 22.5318] },
      { name: '车公庙', coord: [114.0260, 22.5350] },
      { name: '白石洲', coord: [113.9720, 22.5390] },
      { name: '高新园', coord: [113.9530, 22.5410] },
    ],
  },

  // 4. 深圳地铁2/8号线（串联深圳湾后海片区）
  {
    id: 'sz-metro-2',
    name: '深圳地铁 2号线 (深圳湾口岸品质圈)',
    nameEn: 'Shenzhen Metro Line 2 (Shenzhen Bay Cluster)',
    type: 'metro',
    color: '#E8912E', // Line 2 orange
    weight: 3.5,
    opacity: 0.75,
    description: '近深圳湾口岸（海月/登良/后海站），连接后海总部基地与福田',
    descriptionEn: 'Near Shenzhen Bay Port, connecting Houhai and Futian CBD',
    stops: [
      { name: '海月 (深圳湾口岸接驳)', coord: [113.9310, 22.5020] },
      { name: '登良', coord: [113.9350, 22.5110] },
      { name: '后海 (漾日湾畔)', coord: [113.9398, 22.5175] },
      { name: '科苑', coord: [113.9450, 22.5280] },
      { name: '景田', coord: [114.0450, 22.5520] },
      { name: '福田站', coord: [114.0558, 22.5385] },
    ],
  },

  // 5. 港铁东铁线 (落马洲/罗湖 ➔ 香港八大高校大动脉)
  {
    id: 'hk-mtr-eastrail',
    name: '港铁东铁线 (港校直通动脉)',
    nameEn: 'MTR East Rail Line (Direct to HK Universities)',
    type: 'mtr_rail',
    color: '#0083BE', // East Rail Line blue
    weight: 4.5,
    opacity: 0.85,
    dashArray: [8, 4],
    description: '落马洲/罗湖直达香港中文大学(大学站)、城大/浸会(九龙塘)、理大(红磡)、港大(金钟转乘)',
    descriptionEn: 'From Lok Ma Chau directly to CUHK (University), CityU/HKBU (Kowloon Tong), PolyU (Hung Hom) & HKU (Admiralty)',
    stops: [
      { name: '落马洲 (福田口岸对面)', coord: [114.0683, 22.5150] },
      { name: '上水站 (跨境首站)', coord: [114.1280, 22.5015] },
      { name: '大埔墟站 (转乘香港教育大学)', coord: [114.1680, 22.4450] },
      { name: '大学站 (香港中文大学直通)', coord: [114.2090, 22.4130] },
      { name: '沙田站 (大型购物中心)', coord: [114.1880, 22.3830] },
      { name: '九龙塘站 (城大 / 浸会直达)', coord: [114.1780, 22.3370] },
      { name: '旺角东站', coord: [114.1720, 22.3220] },
      { name: '红磡站 (香港理工大学直达)', coord: [114.1820, 22.3030] },
      { name: '会展站 (湾仔会展中心)', coord: [114.1740, 22.2825] },
      { name: '金钟站 (港铁超级换乘·直转港大)', coord: [114.1650, 22.2785] },
    ],
  },

  // 6. 深圳湾公路大桥跨境大巴专线
  {
    id: 'cross-bus-szbay',
    name: '深圳湾口岸跨境大巴快线 (B3X/永东直通)',
    nameEn: 'Shenzhen Bay Cross-Border Bus (B3X & Direct Coach)',
    type: 'cross_bus',
    color: '#1B656F', // Teal bus route
    weight: 3.8,
    opacity: 0.8,
    dashArray: [6, 4],
    description: '深圳湾跨海大桥一地两检，15分钟直达屯门(岭南大学)，快速专线直达西九龙/港大/科大',
    descriptionEn: 'Over Shenzhen Bay Bridge, 15m to Tuen Mun (LingU), express to HKU/HKUST',
    stops: [
      { name: '深圳湾口岸', coord: [113.9450, 22.4930] },
      { name: '深圳湾公路大桥跨海段', coord: [113.9600, 22.4600] },
      { name: '屯门市中心 (转乘岭南大学)', coord: [113.9740, 22.3920] },
    ],
  },
];

export interface CommuteStep {
  title: string;
  timeText: string;
  detail: string;
}

export interface CommuteEstimate {
  targetUni: string;
  targetUniName: string;
  totalTimeMin: number;
  totalTimeMax: number;
  recommendedPort: string;
  steps: CommuteStep[];
}

/**
 * 静态门到门权威通勤测算数据矩阵
 * 根据各高校与口岸、深铁4号线/港铁东铁线/跨境大巴的官方核准时刻表建立
 */
export const STATIC_UNI_COMMUTE_RULES: Record<string, {
  name: string;
  primaryPort: string;
  secondaryPort: string;
  hkTransitTime: number; // minutes from port to campus
  hkTransitLine: string;
  hkTransitStations: number; // stations or transfers
  customTips: string;
}> = {
  CUHK: {
    name: '香港中文大学 (CUHK)',
    primaryPort: '福田口岸',
    secondaryPort: '罗湖口岸',
    hkTransitTime: 28,
    hkTransitLine: '东铁线直达大学站 (无需换乘)',
    hkTransitStations: 4,
    customTips: '东铁线大学站出来即为港中大校巴总站，深港跨境最便捷高校！',
  },
  PolyU: {
    name: '香港理工大学 (PolyU)',
    primaryPort: '福田口岸',
    secondaryPort: '罗湖口岸',
    hkTransitTime: 42,
    hkTransitLine: '东铁线直达红磡站 (A出口直通校园)',
    hkTransitStations: 7,
    customTips: '红磡站天桥直接连入理大校园，全程有顶棚遮风挡雨，极为舒适。',
  },
  CityU: {
    name: '香港城市大学 (CityU)',
    primaryPort: '福田口岸',
    secondaryPort: '罗湖口岸',
    hkTransitTime: 36,
    hkTransitLine: '东铁线直达九龙塘站 (C出口又一城直达)',
    hkTransitStations: 6,
    customTips: '九龙塘站穿过又一城商场直抵城大学术楼，通勤极省心。',
  },
  HKBU: {
    name: '香港浸会大学 (HKBU)',
    primaryPort: '福田口岸',
    secondaryPort: '罗湖口岸',
    hkTransitTime: 39,
    hkTransitLine: '东铁线九龙塘站 (出站换乘25M小巴或步行10分钟)',
    hkTransitStations: 6,
    customTips: '九龙塘站换乘校巴或绿色专线小巴25M直达浸会逸夫校园。',
  },
  HKU: {
    name: '香港大学 (HKU)',
    primaryPort: '深圳湾口岸',
    secondaryPort: '福田口岸',
    hkTransitTime: 48,
    hkTransitLine: '深圳湾跨境快巴 / 东铁线金钟站换港岛线',
    hkTransitStations: 2,
    customTips: '西区海底隧道城巴970/905或金钟转乘港岛线至香港大学站A出口。',
  },
  HKUST: {
    name: '香港科技大学 (HKUST)',
    primaryPort: '福田口岸',
    secondaryPort: '深圳湾口岸',
    hkTransitTime: 55,
    hkTransitLine: '东铁线九龙塘站 ➔ 观塘线彩虹/坑口 ➔ 转11M小巴',
    hkTransitStations: 8,
    customTips: '从彩虹站C出口或坑口站搭乘绿色专线小巴11M直达科大北闸。',
  },
  LingU: {
    name: '岭南大学 (LingU)',
    primaryPort: '深圳湾口岸',
    secondaryPort: '福田口岸',
    hkTransitTime: 25,
    hkTransitLine: '深圳湾口岸搭乘城巴B3X直通屯门',
    hkTransitStations: 1,
    customTips: '深圳湾口岸过桥即达屯门，下车步行或轻铁几分钟即达岭大。',
  },
  EdUHK: {
    name: '香港教育大学 (EdUHK)',
    primaryPort: '福田口岸',
    secondaryPort: '罗湖口岸',
    hkTransitTime: 38,
    hkTransitLine: '东铁线大埔墟站 ➔ 转乘九巴74K / 校巴直达',
    hkTransitStations: 3,
    customTips: '落马洲至大埔墟仅3站约18分钟，大埔墟站有专属教大接驳校巴。',
  },
};

/**
 * 测算从小区的门到门精确通勤用时
 */
export function estimateDoorToDoorCommute(
  communityCommuteToPortMinutes: number = 15,
  nearestPort: string = '福田口岸',
  targetUni: string = 'HKU'
): CommuteEstimate {
  const rule = STATIC_UNI_COMMUTE_RULES[targetUni] || STATIC_UNI_COMMUTE_RULES.HKU;

  // 1. 小区到口岸耗时
  const toPortTime = communityCommuteToPortMinutes || 15;

  // 2. 口岸过关耗时（平峰8分，高峰15分）
  const clearanceMin = 8;
  const clearanceMax = 14;

  // 3. 港铁或跨境大巴耗时
  const hkTime = rule.hkTransitTime;

  const totalMin = toPortTime + clearanceMin + hkTime;
  const totalMax = toPortTime + clearanceMax + hkTime + 5; // 预留换乘缓冲

  const steps: CommuteStep[] = [
    {
      title: '小区 ➔ 边境口岸',
      timeText: `~${toPortTime} 分钟`,
      detail: `地铁/骑行直达 ${nearestPort}`,
    },
    {
      title: '口岸联检大楼',
      timeText: `${clearanceMin}~${clearanceMax} 分钟`,
      detail: `深港两地通关 (学生自助E道极速过关)`,
    },
    {
      title: `${nearestPort} ➔ ${rule.name.split(' ')[0]}`,
      timeText: `~${hkTime} 分钟`,
      detail: rule.hkTransitLine,
    },
  ];

  return {
    targetUni,
    targetUniName: rule.name,
    totalTimeMin: totalMin,
    totalTimeMax: totalMax,
    recommendedPort: nearestPort,
    steps,
  };
}
