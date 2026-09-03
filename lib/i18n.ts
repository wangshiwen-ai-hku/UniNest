export type Language = 'zh-CN' | 'zh-TW' | 'en';

export interface TranslationDict {
  appName: string;
  tagline: string;
  heroSub: string;
  verifiedBadge: string;
  verifiedDesc: string;
  liveStatsPrefix: string;
  liveStatsSuffix: string;
  popularCommunities: string;
  popularCommunitiesSub: string;
  filterByUni: string;
  allUniversities: string;
  submitData: string;
  submitDataDesc: string;
  openForm: string;
  closeForm: string;
  
  // Landing Page & Navigation
  landingTitleLine1: string;
  landingTitleLine2: string;
  landingSubtitle: string;
  liveStatsText: (students: number, communities: number) => string;
  moduleExploreMap: string;
  moduleExploreMapTag: string;
  moduleExploreMapSub: string;
  moduleRegisterHousing: string;
  moduleRegisterHousingTag: string;
  moduleRegisterHousingSub: string;
  backToHome: string;
  communityRanking: string;
  analyticsTitle: string;
  footerVerifyNotice: string;
  footerSlogan: string;

  // Form fields
  formTitle: string;
  formSubtitle: string;
  step1Uni: string;
  step2Email: string;
  step2EmailHint: string;
  step2EmailPlaceholder: string;
  step3Community: string;
  step3CommunityPlaceholder: string;
  step3HotLabel: string;
  step4Rent: string;
  step5Type: string;
  stepHousingSource: string;
  stepHousingSourceHint: string;
  step6Port: string;
  step7Review: string;
  step7ReviewHint: string;
  step7ReviewPlaceholder: string;
  submitButtonText: string;
  submittingText: string;
  submitSuccessTitle: string;
  submitUpdateTitle: string;
  submitSuccessDesc: string;
  returnToMapView: string;
  emailPrefixRequired: string;
  communityRequired: string;

  // Rental Types
  rentTypeEntire: string;
  rentTypeShared: string;
  rentTypeSingle: string;

  // Commute Estimations
  commuteCalcTitle: string;
  commuteCalcSub: string;
  doorToDoorTotal: string;

  // Ports
  nearestPortFutian: string;
  nearestPortLuohu: string;
  nearestPortShenzhenBay: string;
  nearestPortHuanggang: string;
  nearestPortWestKowloon: string;
  nearestPortWenjindu: string;
  
  // InfoWindow & Cards & Empty States
  emptyStateTitle: string;
  emptyStateDesc: string;
  emptyStateAction: string;
  emptySidebarDesc: string;
  zoomInTitle: string;
  zoomOutTitle: string;
  resetViewTitle: string;
  referenceRent: string;
  commuteToPort: (port: string) => string;
  minutes: string;
  uniDistributionTitle: string;
  registeredCount: (count: number) => string;
  rentalTypeSplitTitle: string;
  reviewsTitle: string;
  noReviewsYet: string;
  loadingMapText: string;
  sidebarNotice: string;
  sidebarSlogan: string;

  // Analytics Modal
  analyticsModalTitle: string;
  analyticsLiveStudents: string;
  analyticsCoveredCommunities: string;
  analyticsFunnelTitle: string;
  analyticsMapOpened: string;
  analyticsMapOpenedSub: string;
  analyticsFormOpened: string;
  analyticsFormOpenedSub: string;
  analyticsFormCompleted: string;
  analyticsFormCompletedSub: string;
  analyticsConversionRate: string;
  analyticsDatabaseNotice: string;
  
  // Universities
  unis: {
    HKU: string;
    CUHK: string;
    HKUST: string;
    PolyU: string;
    CityU: string;
    HKBU: string;
    LingU: string;
    EdUHK: string;
    Other: string;
  };

  // Onboarding & Vision
  onboardingNavButton: string;
  onboardingSkip: string;
  onboardingNext: string;
  onboardingPrev: string;
  onboardingStartExplore: string;
  onboardingGoSubmit: string;
  onboardingClose: string;
  
  // Slide 1 (Vision)
  onboardingSlide1Tag: string;
  onboardingSlide1Title: string;
  onboardingSlide1Sub: string;
  onboardingSlide1StatAlumni: string;
  onboardingSlide1StatComm: string;
  onboardingSlide1Pill: string;

  // Slide 2 (Pain Points & Multimodal Visuals)
  onboardingSlide2Tag: string;
  onboardingSlide2Title: string;
  onboardingSlide2Sub: string;
  onboardingPainChatTitle: string;
  onboardingPainChatDesc: string;
  onboardingPainSpamTitle: string;
  onboardingPainSpamDesc: string;
  onboardingPainDistortTitle: string;
  onboardingPainDistortDesc: string;
  onboardingClickToEnlarge: string;

  // Slide 3 (Solution & Real Verification Cards)
  onboardingSlide3Tag: string;
  onboardingSlide3Title: string;
  onboardingSlide3Sub: string;
  onboardingCardSoundproof: string;
  onboardingCardFormaldehyde: string;
  onboardingCardDeposit: string;
  onboardingCardUtility: string;
  onboardingCardRealPhotoTag: string;
  onboardingCardRealPhotoNote: string;

  // Slide 4 (Beacon & Action)
  onboardingSlide4Tag: string;
  onboardingSlide4Title: string;
  onboardingSlide4Sub: string;
  onboardingSlide4ActionMapTitle: string;
  onboardingSlide4ActionMapDesc: string;
  onboardingSlide4ActionFormTitle: string;
  onboardingSlide4ActionFormDesc: string;

  // Form Image Upload (Optional)
  formPhotoUploadTitle: string;
  formPhotoUploadOptional: string;
  formPhotoUploadHint: string;
  formPhotoTagInterior: string;
  formPhotoTagExterior: string;
  formPhotoTagStreet: string;
  formPhotoTagProof: string;
  formPhotoAddButton: string;
  formPhotoCompressing: string;
  formPhotoLimitReached: string;
  formPhotoDelete: string;
  
  // Community Details Gallery
  communityPhotosTitle: string;
  noPhotosYet: string;
  viewLargePhoto: string;
}

export const translations: Record<Language, TranslationDict> = {
  'zh-CN': {
    appName: '广厦 · UniNest',
    tagline: '港硕深住 · 同学校友租房透明地图',
    heroSub: '用真实校友数据，绘制清晰透明的深圳租房生活图谱',
    verifiedBadge: '100% 港校学生认证',
    verifiedDesc: '仅限 @*.edu.hk 邮箱登记，严格保护隐私，点亮校友聚集地',
    liveStatsPrefix: '已有',
    liveStatsSuffix: '位港校同学登记在深租房分布',
    popularCommunities: '热门入驻社区榜单',
    popularCommunitiesSub: '按登记人数排序',
    filterByUni: '按目标高校筛选',
    allUniversities: '全部高校',
    submitData: '登记我的租房',
    submitDataDesc: '花 1 分钟点亮你的小区，帮助更多学弟学妹避坑',
    openForm: '登记我的租房',
    closeForm: '收起表单',

    landingTitleLine1: '深港跨境学子',
    landingTitleLine2: '透明租房指南',
    landingSubtitle: '全季极简美学 · 真实校友一人一票去重 · 口岸通勤与均价全景呈现',
    liveStatsText: (students, communities) => `实时入驻 ${students} 位校友 · 覆盖 ${communities} 个社区`,
    moduleExploreMap: '查看实时地图',
    moduleExploreMapTag: '高德 2.0',
    moduleExploreMapSub: '各口岸房源均价、高校生源聚居地分布',
    moduleRegisterHousing: '登记我的租房',
    moduleRegisterHousingTag: '~30秒',
    moduleRegisterHousingSub: '凭大学邮箱登记点亮小区，杜绝中介重复虚假',
    backToHome: '返回首页',
    communityRanking: '社区榜单',
    analyticsTitle: '数据洞察与埋点统计',
    footerVerifyNotice: '港校邮箱一人一票去重认证',
    footerSlogan: 'UniNest · 冷静透明',

    formTitle: '登记租房 · 30秒加入社群',
    formSubtitle: '透明公开 · 匿名聚合 · 为港深跨境学子点亮生活',
    step1Uni: '1. 毕业 / 就读高校',
    step2Email: '2. 大学邮箱（防重复凭证）',
    step2EmailHint: '仅用于一人一票去重，绝不对外公开',
    step2EmailPlaceholder: '例如: alex123',
    step3Community: '3. 小区 / 公寓全称',
    step3CommunityPlaceholder: '例如: 皇御苑 / 海悦华城 / 置地逸轩',
    step3HotLabel: '热门:',
    step4Rent: '4. 个人人均月租',
    step5Type: '5. 居住形态',
    stepHousingSource: '6. 房源获取渠道',
    stepHousingSourceHint: '选填 · 帮校友避开黑中介',
    step6Port: '7. 临近过关口岸',
    step7Review: '8. 一句避坑或居住心得',
    step7ReviewHint: '选填',
    step7ReviewPlaceholder: '例如: 离口岸步行5分钟，楼下茶餐厅很多，隔音不错',
    submitButtonText: '立即提交 · 点亮小区',
    submittingText: '正在登记...',
    submitSuccessTitle: '成功点亮小区！',
    submitUpdateTitle: '已同步更新您的最新租房登记',
    submitSuccessDesc: '感谢你为港校校友租房透明化贡献的宝贵数据。数据已实时入库并同步在全景地图中。',
    returnToMapView: '返回地图查看',
    emailPrefixRequired: '请填写您的大学邮箱前缀（作为防重复登记的身份凭据）',
    communityRequired: '请填写居住小区或公寓名称',

    rentTypeEntire: '整租',
    rentTypeShared: '合租',
    rentTypeSingle: '单间',

    commuteCalcTitle: '门到门通勤权威测算',
    commuteCalcSub: '结合深圳地铁、跨境通关与港铁/大巴实时推算',
    doorToDoorTotal: '门到门预计总耗时',

    nearestPortFutian: '福田口岸',
    nearestPortLuohu: '罗湖口岸',
    nearestPortShenzhenBay: '深圳湾口岸',
    nearestPortHuanggang: '皇岗口岸 (24h)',
    nearestPortWestKowloon: '西九龙高铁 (深圳北)',
    nearestPortWenjindu: '文锦渡口岸',

    emptyStateTitle: '全城首发 · 虚位以待',
    emptyStateDesc: '当前暂无登记，成为首位点亮小区的校友',
    emptyStateAction: '点亮小区',
    emptySidebarDesc: '目前尚无真实校友登记，欢迎点击上方“登记租房”抢先点亮',
    zoomInTitle: '放大地图',
    zoomOutTitle: '缩小地图',
    resetViewTitle: '重置全景',
    referenceRent: '人均参考月租',
    commuteToPort: (port) => `至 ${port}`,
    minutes: '分钟',
    uniDistributionTitle: '校友生源分布',
    registeredCount: (count) => `共 ${count} 人登记`,
    rentalTypeSplitTitle: '居住形态比例',
    reviewsTitle: '校友真实心得',
    noReviewsYet: '暂无入住心得，等待校友留下第一句建议',
    loadingMapText: '正在载入实时高德地图...',
    sidebarNotice: '全平台数据均由香港八大高校学生邮箱真实登记，一人一票去重，拒绝中介与虚假房源广告。',
    sidebarSlogan: '冷淡克制 · 纯粹透明',

    analyticsModalTitle: 'UniNest 数据洞察与埋点统计',
    analyticsLiveStudents: '实时已入驻校友',
    analyticsCoveredCommunities: '覆盖深圳社区',
    analyticsFunnelTitle: '全站漏斗转化埋点',
    analyticsMapOpened: '打开地图浏览人次',
    analyticsMapOpenedSub: '累计触发 map_opened',
    analyticsFormOpened: '点开登记表单人次',
    analyticsFormOpenedSub: '累计触发 form_opened',
    analyticsFormCompleted: '完成提交登记人次',
    analyticsFormCompletedSub: '累计触发 form_completed',
    analyticsConversionRate: '表单填写完成率 (Conversion)',
    analyticsDatabaseNotice: '数据由 Supabase 实时原子级写入与聚合',

    unis: {
      HKU: '香港大学 HKU',
      CUHK: '香港中文大学 CUHK',
      HKUST: '香港科技大学 HKUST',
      PolyU: '香港理工大学 PolyU',
      CityU: '香港城市大学 CityU',
      HKBU: '香港浸会大学 HKBU',
      LingU: '岭南大学 LingU',
      EdUHK: '香港教育大学 EdUHK',
      Other: '其他高校 Other',
    },

    // Onboarding & Vision
    onboardingNavButton: '新手指南 · 愿景',
    onboardingSkip: '跳过',
    onboardingNext: '下一步',
    onboardingPrev: '上一步',
    onboardingStartExplore: '立即探索地图',
    onboardingGoSubmit: '花 30 秒登记避坑',
    onboardingClose: '关闭',

    // Slide 1 (Vision)
    onboardingSlide1Tag: '初遇 · 愿景',
    onboardingSlide1Title: '深圳很大，但你不会孤单单漂着',
    onboardingSlide1Sub: '这是由高校学子共同点亮的「纯净租房图鉴」。告别中介套路与信息黑盒，让同学校友的真实肉身经历为你撑伞。',
    onboardingSlide1StatAlumni: '已入驻真实校友',
    onboardingSlide1StatComm: '已点亮深圳小区',
    onboardingSlide1Pill: '去中介化 · 100% 真实高校认证',

    // Slide 2 (Pain Points & Multimodal Visuals)
    onboardingSlide2Tag: '扎心 · 痛点',
    onboardingSlide2Title: '网上精修低价引流，私聊全是套路',
    onboardingSlide2Sub: '小红书评论区全都是中介小号刷‘私’；签完约才发现超广角背后是暗无天日的城中村握手楼和满地装修废料...',
    onboardingPainChatTitle: '中介钓鱼套路',
    onboardingPainChatDesc: '“这套刚交定金租掉了，带你看别的（+2000元）”',
    onboardingPainSpamTitle: '评论区水军引流',
    onboardingPainSpamDesc: '假冒学长学姐，清一色刷屏“已私/看房私我”',
    onboardingPainDistortTitle: '超广角照骗 vs 现实废料',
    onboardingPainDistortDesc: '鱼眼拉伸假豪宅，推窗是昏暗握手楼与装修垃圾',
    onboardingClickToEnlarge: '点击可查看原图实录',

    // Slide 3 (Solution & Real Verification Cards)
    onboardingSlide3Tag: '守护 · 破局',
    onboardingSlide3Title: '真实校友实拍 + 避坑打分清单',
    onboardingSlide3Sub: '拒绝广角精修！看学长学姐随手拍的真实采光与街区，查清甲醛通风、隔音效果、水电刺客与房东信用。',
    onboardingCardSoundproof: '隔音防噪',
    onboardingCardFormaldehyde: '甲醛通风期',
    onboardingCardDeposit: '退押金信用',
    onboardingCardUtility: '水电合规度',
    onboardingCardRealPhotoTag: '校友手机无滤镜实拍',
    onboardingCardRealPhotoNote: '书桌采光充足 · 真实街景 · 杜绝串串房',

    // Slide 4 (Beacon & Action)
    onboardingSlide4Tag: '启程 · 互助',
    onboardingSlide4Title: '今天你被真实照亮，明天也是别人的灯塔',
    onboardingSlide4Sub: '你可以立即探索深圳高校租房热点；也可以花 30 秒晒出你的真实房源与实拍图，帮助下一届学弟学妹避坑。',
    onboardingSlide4ActionMapTitle: '开启深圳租房地图',
    onboardingSlide4ActionMapDesc: '查看真实分布、门到门过关耗时与社区评级',
    onboardingSlide4ActionFormTitle: '登记我的房源 (支持传图)',
    onboardingSlide4ActionFormDesc: '30秒快速点亮，可随手上传无广角真实照片',

    // Form Image Upload (Optional)
    formPhotoUploadTitle: '上传真实照片',
    formPhotoUploadOptional: '选填',
    formPhotoUploadHint: '欢迎上传房间内装、开窗采光、楼栋外观或周边街道，帮助学弟学妹粉碎中介虚假精修图（最多3张，系统将自动极速轻量压缩）',
    formPhotoTagInterior: '室内实景',
    formPhotoTagExterior: '楼栋/小区',
    formPhotoTagStreet: '周边街道',
    formPhotoTagProof: '避坑/证据',
    formPhotoAddButton: '添加照片',
    formPhotoCompressing: '正在智能压缩...',
    formPhotoLimitReached: '最多上传 3 张照片',
    formPhotoDelete: '删除',

    // Community Details Gallery
    communityPhotosTitle: '校友实拍图鉴',
    noPhotosYet: '暂无校友上传实拍，欢迎你在表单中点亮第一张！',
    viewLargePhoto: '查看大图',
  },
  'zh-TW': {
    appName: '廣廈 · UniNest',
    tagline: '港碩深住 · 同學校友租房透明地圖',
    heroSub: '用真實校友數據，繪製清晰透明的深圳租房生活圖譜',
    verifiedBadge: '100% 港校學生認證',
    verifiedDesc: '僅限 @*.edu.hk 電郵登記，嚴格保護隱私，點亮校友聚集地',
    liveStatsPrefix: '已有',
    liveStatsSuffix: '位港校同學登記在深租房分佈',
    popularCommunities: '熱門入駐社區榜單',
    popularCommunitiesSub: '按登記人數排序',
    filterByUni: '按目標高校篩選',
    allUniversities: '全部高校',
    submitData: '登記我的租房',
    submitDataDesc: '花 1 分鐘點亮你的屋苑，幫助更多學弟學妹避坑',
    openForm: '登記我的租房',
    closeForm: '收起表單',

    landingTitleLine1: '深港跨境學子',
    landingTitleLine2: '透明租房指南',
    landingSubtitle: '全季極簡美學 · 真實校友一人一票去重 · 口岸通勤與均價全景呈現',
    liveStatsText: (students, communities) => `實時入駐 ${students} 位校友 · 覆蓋 ${communities} 個社區`,
    moduleExploreMap: '查看實時地圖',
    moduleExploreMapTag: '高德 2.0',
    moduleExploreMapSub: '各口岸房源均價、高校生源聚居地分佈',
    moduleRegisterHousing: '登記我的租房',
    moduleRegisterHousingTag: '~30秒',
    moduleRegisterHousingSub: '憑大學電郵登記點亮小區，杜絕中介重複虛假',
    backToHome: '返回首頁',
    communityRanking: '社區榜單',
    analyticsTitle: '數據洞察與埋點統計',
    footerVerifyNotice: '港校電郵一人一票去重認證',
    footerSlogan: 'UniNest · 冷靜透明',

    formTitle: '登記租房 · 30秒加入社群',
    formSubtitle: '透明公開 · 匿名聚合 · 為港深跨境學子點亮生活',
    step1Uni: '1. 畢業 / 就讀高校',
    step2Email: '2. 大學電郵（防重複憑證）',
    step2EmailHint: '僅用於一人一票去重，絕不對外公開',
    step2EmailPlaceholder: '例如: alex123',
    step3Community: '3. 屋苑 / 公寓全稱',
    step3CommunityPlaceholder: '例如: 皇御苑 / 海悅華城 / 置地逸軒',
    step3HotLabel: '熱門:',
    step4Rent: '4. 個人人均月租',
    step5Type: '5. 居住形態',
    stepHousingSource: '6. 房源獲取渠道',
    stepHousingSourceHint: '選填 · 助校友避開黑中介',
    step6Port: '7. 臨近過關口岸',
    step7Review: '8. 一句避坑或居住心得',
    step7ReviewHint: '選填',
    step7ReviewPlaceholder: '例如: 離口岸步行5分鐘，樓下茶餐廳很多，隔音不錯',
    submitButtonText: '立即提交 · 點亮屋苑',
    submittingText: '正在登記...',
    submitSuccessTitle: '成功點亮屋苑！',
    submitUpdateTitle: '已同步更新您的最新租房登記',
    submitSuccessDesc: '感謝你為港校校友租房透明化貢獻的寶貴數據。數據已實時入庫並同步在全景地圖中。',
    returnToMapView: '返回地圖查看',
    emailPrefixRequired: '請填寫您的大學電郵前綴（作為防重複登記的身份憑據）',
    communityRequired: '請填寫居住屋苑或公寓名稱',

    rentTypeEntire: '整租',
    rentTypeShared: '合租',
    rentTypeSingle: '單間',

    commuteCalcTitle: '門到門通勤權威測算',
    commuteCalcSub: '結合深圳地鐵、跨境通關與港鐵/大巴實時推算',
    doorToDoorTotal: '門到門預計總耗時',

    nearestPortFutian: '福田口岸',
    nearestPortLuohu: '羅湖口岸',
    nearestPortShenzhenBay: '深圳灣口岸',
    nearestPortHuanggang: '皇崗口岸 (24h)',
    nearestPortWestKowloon: '西九龍高鐵 (深圳北)',
    nearestPortWenjindu: '文錦渡口岸',

    emptyStateTitle: '全城首發 · 虛位以待',
    emptyStateDesc: '當前暫無登記，成為首位點亮小區的校友',
    emptyStateAction: '點亮小區',
    emptySidebarDesc: '目前尚無真實校友登記，歡迎點擊上方“登記租房”搶先點亮',
    zoomInTitle: '放大地圖',
    zoomOutTitle: '縮小地圖',
    resetViewTitle: '重置全景',
    referenceRent: '人均參考月租',
    commuteToPort: (port) => `至 ${port}`,
    minutes: '分鐘',
    uniDistributionTitle: '校友生源分佈',
    registeredCount: (count) => `共 ${count} 人登記`,
    rentalTypeSplitTitle: '居住形態比例',
    reviewsTitle: '校友真實心得',
    noReviewsYet: '暫無入住心得，等待校友留下第一句建議',
    loadingMapText: '正在載入實時高德地圖...',
    sidebarNotice: '全平台數據均由香港八大高校學生電郵真實登記，一人一票去重，拒絕中介與虛假房源廣告。',
    sidebarSlogan: '冷淡克制 · 純粹透明',

    analyticsModalTitle: 'UniNest 數據洞察與埋點統計',
    analyticsLiveStudents: '實時已入駐校友',
    analyticsCoveredCommunities: '覆蓋深圳社區',
    analyticsFunnelTitle: '全站漏斗轉化埋點',
    analyticsMapOpened: '打開地圖瀏覽人次',
    analyticsMapOpenedSub: '累計觸發 map_opened',
    analyticsFormOpened: '點開登記表單人次',
    analyticsFormOpenedSub: '累計觸發 form_opened',
    analyticsFormCompleted: '完成提交登記人次',
    analyticsFormCompletedSub: '累計觸發 form_completed',
    analyticsConversionRate: '表單填寫完成率 (Conversion)',
    analyticsDatabaseNotice: '數據由 Supabase 實時原子級寫入與聚合',

    unis: {
      HKU: '香港大學 HKU',
      CUHK: '香港中文大學 CUHK',
      HKUST: '香港科技大學 HKUST',
      PolyU: '香港理工大學 PolyU',
      CityU: '香港城市大學 CityU',
      HKBU: '香港浸會大學 HKBU',
      LingU: '嶺南大學 LingU',
      EdUHK: '香港教育大學 EdUHK',
      Other: '其他高校 Other',
    },

    // Onboarding & Vision
    onboardingNavButton: '新手指南 · 願景',
    onboardingSkip: '略過',
    onboardingNext: '下一步',
    onboardingPrev: '上一步',
    onboardingStartExplore: '立即探索地圖',
    onboardingGoSubmit: '花 30 秒登記避坑',
    onboardingClose: '關閉',

    // Slide 1 (Vision)
    onboardingSlide1Tag: '初遇 · 願景',
    onboardingSlide1Title: '深圳很大，但你不會孤單單漂著',
    onboardingSlide1Sub: '這是由高校學子共同點亮的「純淨租房圖鑒」。告別中介套路與信息黑盒，讓同學校友的真實肉身經歷為你撐傘。',
    onboardingSlide1StatAlumni: '已入駐真實校友',
    onboardingSlide1StatComm: '已點亮深圳社區',
    onboardingSlide1Pill: '去中介化 · 100% 真實高校認證',

    // Slide 2 (Pain Points & Multimodal Visuals)
    onboardingSlide2Tag: '扎心 · 痛點',
    onboardingSlide2Title: '網上精修低價引流，私聊全是套路',
    onboardingSlide2Sub: '小紅書評論區全都是中介小號刷‘私’；簽完約才發現超廣角背後是暗無天日的城中村握手樓和滿地裝修廢料...',
    onboardingPainChatTitle: '中介釣魚套路',
    onboardingPainChatDesc: '「這套剛交定金租掉了，帶你看別的（+2000元）」',
    onboardingPainSpamTitle: '評論區水軍引流',
    onboardingPainSpamDesc: '假冒學長學姐，清一色刷屏「已私/看房私我」',
    onboardingPainDistortTitle: '超廣角照騙 vs 現實廢料',
    onboardingPainDistortDesc: '魚眼拉伸假豪宅，推窗是昏暗握手樓與裝修垃圾',
    onboardingClickToEnlarge: '點擊可查看原圖實錄',

    // Slide 3 (Solution & Real Verification Cards)
    onboardingSlide3Tag: '守護 · 破局',
    onboardingSlide3Title: '真實校友實拍 + 避坑打分清單',
    onboardingSlide3Sub: '拒絕廣角精修！看學長學姐隨手拍的真實採光與街區，查清甲醛通風、隔音效果、水電刺客與房東信用。',
    onboardingCardSoundproof: '隔音防噪',
    onboardingCardFormaldehyde: '甲醛通風期',
    onboardingCardDeposit: '退押金信用',
    onboardingCardUtility: '水電合規度',
    onboardingCardRealPhotoTag: '校友手機無濾鏡實拍',
    onboardingCardRealPhotoNote: '書桌採光充足 · 真實街景 · 杜絕串串房',

    // Slide 4 (Beacon & Action)
    onboardingSlide4Tag: '啟程 · 互助',
    onboardingSlide4Title: '今天你被真實照亮，明天也是別人的燈塔',
    onboardingSlide4Sub: '你可以立即探索深圳高校租房熱點；也可以花 30 秒曬出你的真實房源與實拍圖，幫助下一屆學弟學妹避坑。',
    onboardingSlide4ActionMapTitle: '開啟深圳租房地圖',
    onboardingSlide4ActionMapDesc: '查看真實分佈、門到門過關耗時與社區評級',
    onboardingSlide4ActionFormTitle: '登記我的房源 (支持傳圖)',
    onboardingSlide4ActionFormDesc: '30秒快速點亮，可隨手上傳無廣角真實照片',

    // Form Image Upload (Optional)
    formPhotoUploadTitle: '上傳真實照片',
    formPhotoUploadOptional: '選填',
    formPhotoUploadHint: '歡迎上傳房間內裝、開窗採光、樓棟外觀或周邊街道，幫助學弟學妹粉碎中介虛假精修圖（最多3張，系統將自動極速輕量壓縮）',
    formPhotoTagInterior: '室內實景',
    formPhotoTagExterior: '樓棟/社區',
    formPhotoTagStreet: '周邊街道',
    formPhotoTagProof: '避坑/證據',
    formPhotoAddButton: '新增照片',
    formPhotoCompressing: '正在智能壓縮...',
    formPhotoLimitReached: '最多上傳 3 張照片',
    formPhotoDelete: '刪除',

    // Community Details Gallery
    communityPhotosTitle: '校友實拍圖鑒',
    noPhotosYet: '暫無校友上傳實拍，歡迎你在表單中點亮第一張！',
    viewLargePhoto: '查看大圖',
  },
  'en': {
    appName: 'UniNest',
    tagline: 'Cross-Border Living · Peer Rental Transparency Guide',
    heroSub: 'Real student-sourced data mapping trusted Shenzhen residences for HK university peers',
    verifiedBadge: '100% Student Verified',
    verifiedDesc: 'Restricted to university emails. Strict privacy, peer-powered community.',
    liveStatsPrefix: 'Over',
    liveStatsSuffix: 'HK students registered their Shenzhen residences',
    popularCommunities: 'Top Rated Communities',
    popularCommunitiesSub: 'Ranked by student residents',
    filterByUni: 'Filter by University',
    allUniversities: 'All Universities',
    submitData: 'Register My Housing',
    submitDataDesc: 'Take 30 seconds to light up your residence and help upcoming peers',
    openForm: 'Register My Housing',
    closeForm: 'Close Form',

    landingTitleLine1: 'Cross-Border HK Students',
    landingTitleLine2: 'Transparent Rental Guide',
    landingSubtitle: 'Zen Minimalism · 100% Peer Verified (One Student One Entry) · Real Commutes & Prices',
    liveStatsText: (students, communities) => `Live: ${students} Alumni Residing · Across ${communities} Communities`,
    moduleExploreMap: 'Explore Live Map',
    moduleExploreMapTag: 'AMap 2.0',
    moduleExploreMapSub: 'Rental prices across ports & peer university distributions',
    moduleRegisterHousing: 'Register My Housing',
    moduleRegisterHousingTag: '~30s',
    moduleRegisterHousingSub: 'Light up your residence via official uni email, zero broker spam',
    backToHome: 'Back to Home',
    communityRanking: 'Leaderboard',
    analyticsTitle: 'Analytics & Insights',
    footerVerifyNotice: 'One-student-one-entry verified by HK university email',
    footerSlogan: 'UniNest · Calm & Transparent',

    formTitle: 'Register Housing · 30s Join Community',
    formSubtitle: 'Transparent · Anonymized & Aggregated · Lighting up cross-border living',
    step1Uni: '1. University Attended',
    step2Email: '2. University Email (Verification ID)',
    step2EmailHint: 'Used solely for 1-person-1-entry deduplication, never disclosed',
    step2EmailPlaceholder: 'e.g. alex123',
    step3Community: '3. Community / Complex Name',
    step3CommunityPlaceholder: 'e.g. Imperial Garden / Harbour Plaza',
    step3HotLabel: 'Hot:',
    step4Rent: '4. Avg Monthly Rent per Person',
    step5Type: '5. Rental Type',
    stepHousingSource: '6. Housing Source',
    stepHousingSourceHint: 'Optional · Help peers avoid bad agents',
    step6Port: '7. Nearest Checkpoint Port',
    step7Review: '8. Quick Tip or Living Experience',
    step7ReviewHint: 'Optional',
    step7ReviewPlaceholder: 'e.g. 5 mins walk to Futian port, great cafes downstairs, quiet',
    submitButtonText: 'Submit Now · Light Up Community',
    submittingText: 'Registering...',
    submitSuccessTitle: 'Successfully Lighted Up!',
    submitUpdateTitle: 'Updated Your Existing Registration',
    submitSuccessDesc: 'Thank you for contributing to cross-border rental transparency. Data is updated in real time.',
    returnToMapView: 'View on Map',
    emailPrefixRequired: 'Please enter your university email prefix (as unique verification)',
    communityRequired: 'Please enter the community or complex name',

    rentTypeEntire: 'Entire Unit',
    rentTypeShared: 'Shared',
    rentTypeSingle: 'Studio',

    commuteCalcTitle: 'Door-to-Door Commute Estimation',
    commuteCalcSub: 'Calculated via Shenzhen Metro, Border Clearance & HK MTR / Bus',
    doorToDoorTotal: 'Estimated Total Door-to-Door Time',

    nearestPortFutian: 'Futian Port',
    nearestPortLuohu: 'Luohu Port',
    nearestPortShenzhenBay: 'Shenzhen Bay Port',
    nearestPortHuanggang: 'Huanggang Port (24h)',
    nearestPortWestKowloon: 'West Kowloon High-Speed Rail',
    nearestPortWenjindu: 'Man Kam To Port',

    emptyStateTitle: 'City Premiere · Awaiting First Light',
    emptyStateDesc: 'No entries registered yet. Be the first alumnus to light up your community!',
    emptyStateAction: 'Light Up',
    emptySidebarDesc: 'No alumni registered yet. Click "Register My Housing" above to be the pioneer!',
    zoomInTitle: 'Zoom In',
    zoomOutTitle: 'Zoom Out',
    resetViewTitle: 'Reset Overview',
    referenceRent: 'Avg Ref Monthly Rent',
    commuteToPort: (port) => `to ${port}`,
    minutes: 'mins',
    uniDistributionTitle: 'Peer Distribution',
    registeredCount: (count) => `${count} registered`,
    rentalTypeSplitTitle: 'Housing Type Split',
    reviewsTitle: 'Peer Living Insights',
    noReviewsYet: 'No reviews yet. Be the first to leave a suggestion!',
    loadingMapText: 'Loading live AMap...',
    sidebarNotice: 'All data is contributed by verified HK university students (1-person-1-entry). No agents or fake ads.',
    sidebarSlogan: 'Calm & Restrained · Pure & Transparent',

    analyticsModalTitle: 'UniNest Data Insights & Funnel Analytics',
    analyticsLiveStudents: 'Live Registered Students',
    analyticsCoveredCommunities: 'Communities Covered',
    analyticsFunnelTitle: 'Site Conversion Funnel',
    analyticsMapOpened: 'Map Views Count',
    analyticsMapOpenedSub: 'Total map_opened events',
    analyticsFormOpened: 'Form Open Count',
    analyticsFormOpenedSub: 'Total form_opened events',
    analyticsFormCompleted: 'Form Completed Count',
    analyticsFormCompletedSub: 'Total form_completed events',
    analyticsConversionRate: 'Form Completion Rate',
    analyticsDatabaseNotice: 'Data updated and aggregated atomically by Supabase',

    unis: {
      HKU: 'University of Hong Kong (HKU)',
      CUHK: 'Chinese University of Hong Kong (CUHK)',
      HKUST: 'Hong Kong University of Science and Technology (HKUST)',
      PolyU: 'Hong Kong Polytechnic University (PolyU)',
      CityU: 'City University of Hong Kong (CityU)',
      HKBU: 'Hong Kong Baptist University (HKBU)',
      LingU: 'Lingnan University (LingU)',
      EdUHK: 'Education University of Hong Kong (EdUHK)',
      Other: 'Other University',
    },

    // Onboarding & Vision
    onboardingNavButton: 'Guide & Vision',
    onboardingSkip: 'Skip',
    onboardingNext: 'Next',
    onboardingPrev: 'Back',
    onboardingStartExplore: 'Explore Live Map',
    onboardingGoSubmit: 'Share My Rental (30s)',
    onboardingClose: 'Close',

    // Slide 1 (Vision)
    onboardingSlide1Tag: 'Vision & Mission',
    onboardingSlide1Title: "Shenzhen is huge, but you won't drift alone",
    onboardingSlide1Sub: 'A pure, peer-verified housing guide built by university students. No agency noise, no hidden tricks—just authentic peer support.',
    onboardingSlide1StatAlumni: 'Verified Alumni',
    onboardingSlide1StatComm: 'Communities Lit',
    onboardingSlide1Pill: 'Zero Agents · 100% Peer Verified',

    // Slide 2 (Pain Points & Multimodal Visuals)
    onboardingSlide2Tag: 'Real Pain Points',
    onboardingSlide2Title: 'Bait-and-switch ads, spam comments & fish-eye traps',
    onboardingSlide2Sub: 'Online forums flooded with deceptive agent accounts. You arrive only to find a 5m² dark room facing messy construction debris and handshake alleys.',
    onboardingPainChatTitle: 'Deceptive Agent Bait',
    onboardingPainChatDesc: '"Just rented out! Let me show you another (+¥2,000)"',
    onboardingPainSpamTitle: 'Spam Comments Trap',
    onboardingPainSpamDesc: 'Fake senior profiles mass-spamming "PM me" to bait freshers',
    onboardingPainDistortTitle: 'Wide-Angle Trick vs Harsh Reality',
    onboardingPainDistortDesc: 'Fisheye distortion room vs dark alley with toxic debris',
    onboardingClickToEnlarge: 'Click to view authentic screenshot',

    // Slide 3 (Solution & Real Verification Cards)
    onboardingSlide3Tag: 'The Peer Solution',
    onboardingSlide3Title: 'Authentic Peer Photos + Anti-Trap Scores',
    onboardingSlide3Sub: 'Say no to misleading lenses! Explore honest smartphone photos of natural light, neighborhood streets, soundproofing, and deposit safety.',
    onboardingCardSoundproof: 'Soundproofing',
    onboardingCardFormaldehyde: 'Air Safety / Ventilation',
    onboardingCardDeposit: 'Deposit Refund',
    onboardingCardUtility: 'Utility Transparency',
    onboardingCardRealPhotoTag: 'Verified Alumni Smartphone Shot',
    onboardingCardRealPhotoNote: 'Natural study desk light · Real street view · Toxic-free',

    // Slide 4 (Beacon & Action)
    onboardingSlide4Tag: 'Begin Your Journey',
    onboardingSlide4Title: 'Guided by peers today, lighting the way tomorrow',
    onboardingSlide4Sub: 'Explore real commute times & verified rentals across Shenzhen now, or take 30 seconds to log your residence and help freshers navigate safely.',
    onboardingSlide4ActionMapTitle: 'Explore Live Map',
    onboardingSlide4ActionMapDesc: 'View genuine peer distribution & door-to-door commute',
    onboardingSlide4ActionFormTitle: 'Share My Rental (Upload Photos)',
    onboardingSlide4ActionFormDesc: '30s quick check-in with optional honest smartphone shots',

    // Form Image Upload (Optional)
    formPhotoUploadTitle: 'Upload Authentic Photos',
    formPhotoUploadOptional: 'Optional',
    formPhotoUploadHint: 'Upload photos of room layout, natural sunlight, exterior, or neighborhood. Helps peers spot deceptive listings (up to 3 photos, auto-compressed).',
    formPhotoTagInterior: 'Interior',
    formPhotoTagExterior: 'Exterior',
    formPhotoTagStreet: 'Street View',
    formPhotoTagProof: 'Evidence',
    formPhotoAddButton: 'Add Photo',
    formPhotoCompressing: 'Compressing...',
    formPhotoLimitReached: 'Max 3 photos reached',
    formPhotoDelete: 'Delete',

    // Community Details Gallery
    communityPhotosTitle: 'Alumni Photo Gallery',
    noPhotosYet: 'No peer photos yet. Be the first to upload one!',
    viewLargePhoto: 'View Full Photo',
  },
};


export const UNIVERSITY_LIST = [
  { code: 'HKU', name: '香港大学', domain: '@connect.hku.hk', color: '#006F45', lightColor: '#E8F5E9', border: '#006F45' },
  { code: 'CUHK', name: '香港中文大学', domain: '@link.cuhk.edu.hk', color: '#761937', lightColor: '#FCE4EC', border: '#761937' },
  { code: 'HKUST', name: '香港科技大学', domain: '@connect.ust.hk', color: '#003366', lightColor: '#E3F2FD', border: '#003366' },
  { code: 'PolyU', name: '香港理工大学', domain: '@connect.polyu.hk', color: '#A81E32', lightColor: '#FFEBEE', border: '#A81E32' },
  { code: 'CityU', name: '香港城市大学', domain: '@my.cityu.edu.hk', color: '#881337', lightColor: '#FFF1F2', border: '#881337' },
  { code: 'HKBU', name: '香港浸会大学', domain: '@life.hkbu.edu.hk', color: '#003C71', lightColor: '#E1F5FE', border: '#003C71' },
  { code: 'LingU', name: '岭南大学', domain: '@ln.hk', color: '#C62828', lightColor: '#FFEBEE', border: '#C62828' },
  { code: 'EdUHK', name: '香港教育大学', domain: '@s.eduhk.hk', color: '#00838F', lightColor: '#E0F7FA', border: '#00838F' },
] as const;
