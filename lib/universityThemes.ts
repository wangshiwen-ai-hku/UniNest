export interface UniversityTheme {
  code: string;
  name: string;
  nameEn: string;
  emailDomain: string;
  primaryColor: string;
  lightBg: string;
  badgeBg: string;
  skinImage: string;
  tagline: string;
  taglineEn: string;
}

export const UNIVERSITY_THEMES: Record<string, UniversityTheme> = {
  HKU: {
    code: 'HKU',
    name: '香港大学',
    nameEn: 'The University of Hong Kong',
    emailDomain: 'connect.hku.hk',
    primaryColor: '#21573B', // HKU Forest Emerald
    lightBg: '#F4F7F5',
    badgeBg: '#EBF3EE',
    skinImage: '/images/skins/hku.jpg',
    tagline: '薄扶林山海 · 明德格物',
    taglineEn: 'Sapientia Et Virtus · Pokfulam',
  },
  CUHK: {
    code: 'CUHK',
    name: '香港中文大学',
    nameEn: 'The Chinese University of Hong Kong',
    emailDomain: 'link.cuhk.edu.hk',
    primaryColor: '#6D2034', // CUHK Wine Burgundy
    lightBg: '#F9F5F6',
    badgeBg: '#F9ECEF',
    skinImage: '/images/skins/cuhk.jpg',
    tagline: '博文约礼 · 烽火台瞰吐露港',
    taglineEn: 'Through Learning to Temperance · Tolo Harbour',
  },
  HKUST: {
    code: 'HKUST',
    name: '香港科技大学',
    nameEn: 'The Hong Kong University of Science and Technology',
    emailDomain: 'connect.ust.hk',
    primaryColor: '#1D3B5C', // Oceanic Slate Navy
    lightBg: '#F3F6F9',
    badgeBg: '#EBF1F7',
    skinImage: '/images/skins/hkust.jpg',
    tagline: '求进·求新·创未来 · 清水湾红鸟晨曦',
    taglineEn: 'Hands On The Present, Eyes On The Future · Clear Water Bay',
  },
  PolyU: {
    code: 'PolyU',
    name: '香港理工大学',
    nameEn: 'The Hong Kong Polytechnic University',
    emailDomain: 'connect.polyu.hk',
    primaryColor: '#7D222E', // Terracotta Brick Red
    lightBg: '#F9F4F5',
    badgeBg: '#F8ECEE',
    skinImage: '/images/skins/polyu.jpg',
    tagline: '开物成务·励学利民 · 红磡红砖与创新塔',
    taglineEn: 'To Learn and To Apply · Hung Hom',
  },
  CityU: {
    code: 'CityU',
    name: '香港城市大学',
    nameEn: 'City University of Hong Kong',
    emailDomain: 'my.cityu.edu.hk',
    primaryColor: '#731D33', // Crimson Slate
    lightBg: '#F9F4F6',
    badgeBg: '#F7ECEF',
    skinImage: '/images/skins/cityu.jpg',
    tagline: '敬业乐群 · 狮子山下邵逸夫创意塔',
    taglineEn: 'Officium Et Civitas · Kowloon Tong',
  },
  HKBU: {
    code: 'HKBU',
    name: '香港浸会大学',
    nameEn: 'Hong Kong Baptist University',
    emailDomain: 'life.hkbu.edu.hk',
    primaryColor: '#194168', // Steel Navy
    lightBg: '#F4F6F9',
    badgeBg: '#EBF2F7',
    skinImage: '/images/skins/hkbu.jpg',
    tagline: '笃信力行 · 九龙塘逸夫钟楼林荫',
    taglineEn: 'Faith and Higher Learning · Shaw Campus',
  },
  LingU: {
    code: 'LingU',
    name: '岭南大学',
    nameEn: 'Lingnan University',
    emailDomain: 'ln.hk',
    primaryColor: '#852929', // Warm Rust
    lightBg: '#F9F5F5',
    badgeBg: '#F9ECEC',
    skinImage: '/images/skins/lingu.jpg',
    tagline: '作育英才·服务社会 · 屯门红顶回廊庭院',
    taglineEn: 'Education for Service · Tuen Mun',
  },
  EdUHK: {
    code: 'EdUHK',
    name: '香港教育大学',
    nameEn: 'The Education University of Hong Kong',
    emailDomain: 's.eduhk.hk',
    primaryColor: '#1B656F', // Eucalyptus Teal
    lightBg: '#F3F8F8',
    badgeBg: '#EAF5F6',
    skinImage: '/images/skins/eduhk.jpg',
    tagline: '育德育人 · 大埔翠微林间梯田校区',
    taglineEn: 'Education, Reflection, Innovation · Tai Po Hills',
  },
};
