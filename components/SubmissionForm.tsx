'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  geocodeAddress,
  searchPlaceSuggestions,
  reverseGeocodeCoords,
  loadAMapSDK,
  PlaceSuggestion
} from '@/lib/amap';
import { submitHousingRecord, trackAnalyticsEvent } from '@/lib/supabase';
import { CommunityMarker } from '@/lib/mockData';
import { Language, translations } from '@/lib/i18n';
import { UNIVERSITY_THEMES, UniversityTheme } from '@/lib/universityThemes';
import {
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  Sparkles,
  Home,
  Users2,
  Building2,
  Train,
  ShieldCheck,
  QrCode,
  Camera,
  MapPin,
  Search,
  Crosshair,
  Calendar,
  Check,
  ChevronDown,
  Navigation,
  Plus
} from 'lucide-react';
import { compressImage } from '@/lib/imageUtils';

interface SubmissionFormProps {
  lang: Language;
  onSuccess?: (marker?: CommunityMarker) => void;
  onClose?: () => void;
  onOpenShare?: (communityName: string, university: string) => void;
  initialCommunityName?: string;
}

const POPULAR_SZ_COMMUNITIES = [
  '金地名津',
  '海悦华城',
  '皇御苑',
  '置地广场 (罗湖)',
  '置地逸轩 (福田)',
  '城投青莲公寓',
  '福田水围村',
  '漾日湾畔',
];

const POPULAR_HK_COMMUNITIES = [
  '港大赛马会第一学生村',
  '大围名城 (Festival City)',
  '红磡海滨南岸 (Harbour Place)',
  '中大研究生宿舍 (PGH)',
  '坑口蔚蓝湾畔',
  '坚尼地城泓都',
];

const HOUSING_SOURCES = [
  '个人中介',
  '贝壳',
  '自如',
  '链家',
  '乐有家',
  '物业直租',
  '校舍/舍堂',
  '其他',
];

const LEASE_DATE_PRESETS = [
  { label: '2025秋季 (最新)', value: '2025-08' },
  { label: '2025春季', value: '2025-02' },
  { label: '2024秋季', value: '2024-08' },
  { label: '更早/2023', value: '2023-08' },
  { label: '2026预约', value: '2026-08' },
];

export const SubmissionForm: React.FC<SubmissionFormProps> = ({
  lang,
  onSuccess,
  onClose,
  onOpenShare,
  initialCommunityName,
}) => {
  const t = translations[lang];

  // Region switcher: Shenzhen cross-border vs Hong Kong local
  const [region, setRegion] = useState<'SZ' | 'HK'>('SZ');

  const [university, setUniversity] = useState('HKU');
  const [emailPrefix, setEmailPrefix] = useState('');
  const [communityName, setCommunityName] = useState(initialCommunityName || '');
  const [address, setAddress] = useState('');
  const [customDistrict, setCustomDistrict] = useState('福田区');
  const [confirmedCoords, setConfirmedCoords] = useState<{ lng: number; lat: number } | null>(null);

  const [monthlyRent, setMonthlyRent] = useState<number>(3800);
  const [leaseStartDate, setLeaseStartDate] = useState<string>('2025-08');
  const [rentalType, setRentalType] = useState<'entire' | 'shared'>('shared');
  const [housingSource, setHousingSource] = useState('自如');
  const [nearestPort, setNearestPort] = useState('福田口岸');
  const [review, setReview] = useState('');

  // POI search suggestions state
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isSearchingPOI, setIsSearchingPOI] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Takeaway-style map pin modal state
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const pinMapContainerRef = useRef<HTMLDivElement>(null);
  const pinMapInstanceRef = useRef<any>(null);
  const [pinCenterAddress, setPinCenterAddress] = useState('定位中...');
  const [pinCenterCoords, setPinCenterCoords] = useState<{ lng: number; lat: number }>({
    lng: 114.0664,
    lat: 22.5195, // Default Futian Port Jindimingjin area
  });
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isUpdateNotice, setIsUpdateNotice] = useState(false);

  // Optional photos state (up to 3 photos with tags)
  const [photos, setPhotos] = useState<Array<{ url: string; tag: string }>>([]);
  const [isCompressing, setIsCompressing] = useState(false);

  // Active theme based on university selection
  const currentTheme: UniversityTheme = useMemo(() => {
    return UNIVERSITY_THEMES[university] || UNIVERSITY_THEMES.HKU;
  }, [university]);

  // Track form_opened on mount and pre-warm AMap SDK
  useEffect(() => {
    trackAnalyticsEvent('form_opened');
    loadAMapSDK().catch(() => {});
  }, []);

  // Update nearest port & district when region changes
  const handleRegionSwitch = (targetRegion: 'SZ' | 'HK') => {
    setRegion(targetRegion);
    if (targetRegion === 'HK') {
      setNearestPort('香港本地');
      setCustomDistrict('香港·中西区');
      if (monthlyRent < 4500) setMonthlyRent(6500);
      setHousingSource('物业直租');
    } else {
      setNearestPort('福田口岸');
      setCustomDistrict('福田区');
      if (monthlyRent > 5000) setMonthlyRent(3800);
      setHousingSource('自如');
    }
  };

  // Debounced POI suggestion query
  const handleCommunityInputChange = (value: string) => {
    setCommunityName(value);
    setConfirmedCoords(null); // Clear previous locked coords
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setShowSuggestions(true);
    setIsSearchingPOI(true);

    searchDebounceRef.current = setTimeout(async () => {
      try {
        const results = await searchPlaceSuggestions(value, region === 'HK' ? '香港' : '深圳');
        setSuggestions(results);
      } catch (err) {
        console.warn('POI search error:', err);
      } finally {
        setIsSearchingPOI(false);
      }
    }, 280);
  };

  // Select POI item from dropdown
  const handleSelectSuggestion = (item: PlaceSuggestion) => {
    setCommunityName(item.name);
    setAddress(item.address);
    if (item.district) setCustomDistrict(item.district);
    setConfirmedCoords({ lng: item.lng, lat: item.lat });
    setShowSuggestions(false);
  };

  // Quick preset click
  const handleQuickPresetClick = (name: string) => {
    setCommunityName(name);
    handleCommunityInputChange(name);
  };

  // Open takeaway-style pin map modal
  const handleOpenPinMap = async () => {
    setIsPinModalOpen(true);

    const initialPos = confirmedCoords || (region === 'HK'
      ? { lng: 114.1785, lat: 22.3732 } // Tai Wai HK
      : { lng: 114.0664, lat: 22.5195 } // Futian Port SZ
    );

    setPinCenterCoords(initialPos);

    setTimeout(async () => {
      try {
        const AMap = await loadAMapSDK();
        if (!pinMapContainerRef.current) return;

        if (pinMapInstanceRef.current) {
          pinMapInstanceRef.current.destroy();
        }

        const map = new AMap.Map(pinMapContainerRef.current, {
          zoom: 16,
          center: [initialPos.lng, initialPos.lat],
          mapStyle: 'amap://styles/whitesmoke',
          viewMode: '2D',
        });

        pinMapInstanceRef.current = map;

        // Perform initial reverse geocode
        reverseGeocodeCoords(initialPos.lng, initialPos.lat).then((res) => {
          setPinCenterAddress(res.address);
        });

        // Listen to map moveend event
        map.on('moveend', async () => {
          const center = map.getCenter();
          const lng = center.getLng();
          const lat = center.getLat();
          setPinCenterCoords({ lng, lat });
          setIsReverseGeocoding(true);
          try {
            const res = await reverseGeocodeCoords(lng, lat);
            setPinCenterAddress(res.address);
            if (res.district) setCustomDistrict(res.district);
          } catch (e) {
            console.warn(e);
          } finally {
            setIsReverseGeocoding(false);
          }
        });
      } catch (err) {
        console.warn('Init pin map failed:', err);
      }
    }, 150);
  };

  // Confirm pin map location
  const handleConfirmPinLocation = () => {
    setConfirmedCoords(pinCenterCoords);
    if (!communityName.trim() || communityName.includes('定位点')) {
      const parts = pinCenterAddress.split(/[市区县街道号]/);
      const cleanName = parts[parts.length - 1]?.trim() || pinCenterAddress;
      setCommunityName(cleanName.length > 2 ? cleanName : pinCenterAddress);
    }
    setAddress(pinCenterAddress);
    setIsPinModalOpen(false);
  };

  // Photos upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (photos.length >= 3) {
      alert(t.formPhotoLimitReached);
      return;
    }

    setIsCompressing(true);
    try {
      const files = Array.from(e.target.files).slice(0, 3 - photos.length);
      const compressedList = await Promise.all(
        files.map(async (file) => {
          const compressed = await compressImage(file);
          return { url: compressed, tag: t.formPhotoTagInterior };
        })
      );
      setPhotos((prev) => [...prev, ...compressedList]);
    } catch (err) {
      console.warn('Image compression error:', err);
    } finally {
      setIsCompressing(false);
      e.target.value = '';
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangePhotoTag = (index: number, newTag: string) => {
    setPhotos((prev) =>
      prev.map((item, i) => (i === index ? { ...item, tag: newTag } : item))
    );
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!emailPrefix.trim()) {
      setErrorMsg(t.emailPrefixRequired);
      return;
    }

    if (!communityName.trim()) {
      setErrorMsg(t.communityRequired);
      return;
    }

    setLoading(true);

    try {
      // Assemble full email
      const trimmedPrefix = emailPrefix.trim();
      const fullEmail = trimmedPrefix.includes('@')
        ? trimmedPrefix
        : `${trimmedPrefix}@${currentTheme.emailDomain}`;

      // Resolve final coordinates
      let finalLng = confirmedCoords?.lng;
      let finalLat = confirmedCoords?.lat;
      let finalDistrict = customDistrict;

      if (!finalLng || !finalLat) {
        const targetQuery = address.trim() ? `${address} ${communityName}` : communityName;
        const geo = await geocodeAddress(targetQuery, region === 'HK' ? '香港' : '深圳');
        finalLng = geo.lng;
        finalLat = geo.lat;
        if (geo.district) finalDistrict = geo.district;
      }

      // Compute commute minutes to port or campus
      const commuteMinutes = region === 'HK'
        ? 12
        : nearestPort.includes('福田') ? 5 : nearestPort.includes('深圳湾') ? 15 : 10;

      // Submit record
      const res = await submitHousingRecord({
        university,
        studentEmail: fullEmail,
        communityName: communityName.trim(),
        address: address.trim() || communityName.trim(),
        district: finalDistrict || (region === 'HK' ? '香港·沙田区' : '福田区'),
        monthlyRent: Number(monthlyRent),
        rentalType,
        housingSource,
        commuteMinutes,
        nearestPort,
        review: review.trim(),
        photos: photos.map((p) => p.url),
        lng: finalLng,
        lat: finalLat,
        leaseStartDate,
        region,
      });

      if (!res.success) {
        setErrorMsg(res.message || '提交失败，请重试');
        setLoading(false);
        return;
      }

      setIsUpdateNotice(Boolean(res.isUpdate));
      setIsSuccess(true);
      setLoading(false);

      if (onSuccess) {
        onSuccess(res.marker);
      }
    } catch (err: any) {
      setErrorMsg(err.message || '提交异常，请稍后重试');
      setLoading(false);
    }
  };

  return (
    <div className="zen-card w-full max-w-lg bg-white border border-[#E4E4E0] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
      {/* Dynamic University Theme Skin Banner */}
      <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-[#1C1E21]">
        <img
          src={currentTheme.skinImage}
          alt={currentTheme.name}
          className="w-full h-full object-cover object-center opacity-90 transition-all duration-700 transform scale-105"
        />

        {/* Soft Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

        {/* Top Floating Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 z-10 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 text-white/90 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Banner Content */}
        <div className="absolute bottom-3.5 left-5 right-5 flex items-end justify-between">
          <div className="flex flex-col gap-0.5 text-white">
            <div className="flex items-center gap-2">
              <span
                style={{ backgroundColor: currentTheme.primaryColor }}
                className="w-2 h-2 rounded-full ring-2 ring-white/40"
              />
              <span className="text-xs font-semibold tracking-wide uppercase text-white/90">
                {currentTheme.name} · {currentTheme.code}
              </span>
            </div>
            <p className="text-[11px] text-white/75 font-normal tracking-wide">
              {lang === 'en' ? currentTheme.taglineEn : currentTheme.tagline}
            </p>
          </div>

          {/* Region Switch Pill */}
          <div className="flex items-center bg-black/50 backdrop-blur-md p-1 rounded-full border border-white/20">
            <button
              type="button"
              onClick={() => handleRegionSwitch('SZ')}
              className={`px-2.5 py-0.5 text-[10px] rounded-full font-medium transition-all ${
                region === 'SZ'
                  ? 'bg-white text-[#1C1E21] shadow-xs'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              深圳跨境
            </button>
            <button
              type="button"
              onClick={() => handleRegionSwitch('HK')}
              className={`px-2.5 py-0.5 text-[10px] rounded-full font-medium transition-all ${
                region === 'HK'
                  ? 'bg-white text-[#1C1E21] shadow-xs'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              香港本地
            </button>
          </div>
        </div>
      </div>

      {/* Success View */}
      {isSuccess ? (
        <div className="p-8 text-center flex flex-col items-center gap-3">
          <div
            style={{ backgroundColor: currentTheme.badgeBg, color: currentTheme.primaryColor }}
            className="w-12 h-12 rounded-full flex items-center justify-center"
          >
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-[#1C1E21]">
            {isUpdateNotice ? t.submitUpdateTitle : t.submitSuccessTitle}
          </h3>
          <p className="text-xs text-[#6E727A] max-w-xs leading-relaxed">
            {t.submitSuccessDesc}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full mt-2">
            {onOpenShare && (
              <button
                type="button"
                onClick={() => onOpenShare(communityName, university)}
                style={{ backgroundColor: currentTheme.primaryColor, borderColor: currentTheme.primaryColor }}
                className="zen-button-primary flex-1 w-full py-3 text-xs flex items-center justify-center gap-2 shadow-sm font-semibold text-white"
              >
                <QrCode className="w-4 h-4" />
                <span>生成我的专属点亮海报 / 分享社群</span>
              </button>
            )}

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 text-xs rounded-xl border border-[#E8E8E4] bg-[#FAF9F7] hover:bg-white text-[#6E727A] font-medium transition-colors"
              >
                {t.returnToMapView}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Form Content */
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 flex flex-col gap-5 text-xs max-h-[72vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-[#FCF1F2] border border-[#F5D2D6] rounded-xl text-[#942735] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. University Selection */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-[#6E727A] tracking-wider uppercase flex items-center gap-1.5">
                <span>{t.step1Uni}</span>
                <span className="text-[10px] text-[#9A9EA6] font-normal">(点击切换高校皮肤)</span>
              </label>
              <span className="text-[11px] font-medium" style={{ color: currentTheme.primaryColor }}>
                @{currentTheme.emailDomain}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {Object.values(UNIVERSITY_THEMES).map((u) => {
                const isSelected = university === u.code;
                return (
                  <button
                    key={u.code}
                    type="button"
                    onClick={() => setUniversity(u.code)}
                    style={
                      isSelected
                        ? { backgroundColor: u.primaryColor, borderColor: u.primaryColor, color: '#FFFFFF' }
                        : {}
                    }
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all duration-150 ${
                      isSelected
                        ? 'shadow-xs scale-[1.02]'
                        : 'bg-[#FAF9F7] text-[#4A4E57] border-[#E4E4DF] hover:bg-white hover:border-[#D0D0CA]'
                    }`}
                  >
                    {u.code}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-[#F0F0EC]" />

          {/* 2. Student Email */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold text-[#6E727A] tracking-wider uppercase flex items-center justify-between">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#21573B]" />
                {t.step2Email}
              </span>
              <span className="text-[10px] text-[#9A9EA6] font-normal">{t.step2EmailHint}</span>
            </label>
            <div className="flex items-center rounded-xl border border-[#E4E4DF] bg-white overflow-hidden focus-within:border-[#2D3A34] transition-colors shadow-2xs">
              <input
                type="text"
                value={emailPrefix}
                onChange={(e) => setEmailPrefix(e.target.value)}
                placeholder={t.step2EmailPlaceholder}
                className="flex-1 px-3.5 py-2.5 text-xs text-[#1C1E21] outline-none"
                required
              />
              <span className="px-3 py-2.5 bg-[#F8F8F5] border-l border-[#EEEEEC] text-[11px] font-semibold text-[#6E727A]">
                {emailPrefix.includes('@') ? '' : `@${currentTheme.emailDomain}`}
              </span>
            </div>
          </div>

          {/* 3. Community Name with Real-time POI Suggestions + Takeaway Map Pin Selector */}
          <div className="flex flex-col gap-2 relative">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-[#6E727A] tracking-wider uppercase flex items-center gap-1.5">
                <span>{region === 'HK' ? '香港租住地 / 校舍宿舍' : t.step3Community}</span>
              </label>

              {/* Takeaway Map Pin Button */}
              <button
                type="button"
                onClick={handleOpenPinMap}
                className="text-[11px] text-[#21573B] font-medium hover:text-[#183E2A] flex items-center gap-1 py-0.5 px-2 rounded-lg bg-[#EBF3EE] hover:bg-[#E0ECE4] transition-colors"
                title="在地图上拖动大头针精准定位"
              >
                <Crosshair className="w-3.5 h-3.5 text-[#21573B]" />
                <span>地图选点 / 微调</span>
              </button>
            </div>

            {/* Input with Search Icon */}
            <div className="relative">
              <div className="flex items-center rounded-xl border border-[#E4E4DF] bg-white overflow-hidden focus-within:border-[#2D3A34] transition-colors shadow-2xs">
                <Search className="w-4 h-4 text-[#9A9EA6] ml-3 shrink-0" />
                <input
                  type="text"
                  value={communityName}
                  onChange={(e) => handleCommunityInputChange(e.target.value)}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                  placeholder={region === 'HK' ? '例如：大围名城、红磡海滨南岸、港大赛马会村' : '输入小区名称，支持高德实时精准联想...'}
                  className="w-full px-2.5 py-2.5 text-xs text-[#1C1E21] outline-none"
                  required
                />
                {isSearchingPOI && (
                  <div className="mr-3 w-3.5 h-3.5 border-2 border-[#2D3A34] border-t-transparent rounded-full animate-spin shrink-0" />
                )}
              </div>

              {/* Real-time POI Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#E4E4E0] rounded-2xl shadow-xl z-50 overflow-hidden max-h-56 overflow-y-auto">
                  <div className="px-3 py-1.5 bg-[#FAF9F7] border-b border-[#F0F0EC] text-[10px] text-[#7A7E85] font-medium flex items-center justify-between">
                    <span>高德地图官方实时 POI 联想</span>
                    <button
                      type="button"
                      onClick={() => setShowSuggestions(false)}
                      className="text-[#9A9EA6] hover:text-[#1C1E21]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  {suggestions.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectSuggestion(item)}
                      className="p-2.5 hover:bg-[#F5F8F6] cursor-pointer border-b border-[#F5F5F2] last:border-b-0 flex items-start gap-2.5 transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-[#21573B] shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs text-[#1C1E21] truncate">{item.name}</span>
                          {item.district && (
                            <span className="text-[9px] px-1.5 py-0.2 bg-[#F0F2F0] text-[#555] rounded font-normal">
                              {item.district}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#7A7E85] truncate mt-0.5">{item.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirmed Coords Badge */}
            {confirmedCoords && (
              <div className="flex items-center justify-between text-[11px] px-3 py-1.5 bg-[#EBF3EE] border border-[#D5E4D8] rounded-xl text-[#21573B]">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#21573B]" />
                  <span>已精准锁定位置坐标: {confirmedCoords.lng.toFixed(4)}, {confirmedCoords.lat.toFixed(4)} ({customDistrict})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmedCoords(null)}
                  className="text-[10px] text-[#557A64] hover:underline"
                >
                  重选
                </button>
              </div>
            )}

            {/* Quick suggested chips */}
            <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
              <span className="text-[10px] text-[#9A9EA6]">{t.step3HotLabel}</span>
              {(region === 'HK' ? POPULAR_HK_COMMUNITIES : POPULAR_SZ_COMMUNITIES).map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleQuickPresetClick(name)}
                  className="text-[11px] px-2.5 py-0.5 rounded-lg bg-[#F4F4F0] hover:bg-[#EBEBE6] text-[#4E525B] transition-colors"
                >
                  {name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-[#F0F0EC]" />

          {/* 4. Monthly Rent Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-[#6E727A] tracking-wider uppercase">
                {t.step4Rent}
              </label>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-bold text-[#1C1E21]">¥{monthlyRent}</span>
                <span className="text-[10px] text-[#9A9EA6]">/{lang === 'en' ? 'mo' : '月'}</span>
              </div>
            </div>
            <input
              type="range"
              min="1500"
              max="12000"
              step="100"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(Number(e.target.value))}
              className="zen-slider w-full mt-1 cursor-pointer"
            />
            <div className="flex gap-1.5 mt-1">
              {(region === 'HK' ? [3500, 5500, 7000, 8500] : [2500, 3200, 4200, 5500]).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setMonthlyRent(preset)}
                  className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all ${
                    monthlyRent === preset
                      ? 'bg-[#2D3A34] text-white border-[#2D3A34]'
                      : 'bg-[#FAF9F7] text-[#6E727A] border-[#E8E8E4] hover:bg-white'
                  }`}
                >
                  ¥{preset}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Lease Start Date Collection (起租时间采集 · 应对近年租金波动) */}
          <div className="flex flex-col gap-2 p-3 bg-[#F9F9F7] rounded-2xl border border-[#EEEEEC]">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-[#4A4E57] tracking-wider uppercase flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#21573B]" />
                <span>起租时间 / 入住年份</span>
              </label>
              <input
                type="month"
                value={leaseStartDate}
                onChange={(e) => setLeaseStartDate(e.target.value)}
                className="text-[11px] px-2 py-0.5 border border-[#DCDCD8] rounded-lg bg-white text-[#1C1E21] outline-none"
              />
            </div>

            <p className="text-[10px] text-[#888C94] leading-relaxed">
              💡 租金随年份与每年7-8月旺季常有波动，记录起租时间有助于学弟学妹参考最新行情。
            </p>

            {/* Quick Year/Quarter Pills */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {LEASE_DATE_PRESETS.map((p) => {
                const isSelected = leaseStartDate === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setLeaseStartDate(p.value)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all ${
                      isSelected
                        ? 'bg-[#21573B] text-white border-[#21573B] shadow-2xs'
                        : 'bg-white text-[#6E727A] border-[#E2E2DC] hover:bg-[#F4F4F0]'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Rental Type & Nearest Port */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-[#6E727A] tracking-wider uppercase">
                {t.step5Type}
              </label>
              <div className="flex rounded-xl border border-[#E4E4DF] p-1 bg-[#F9F9F7]">
                {(
                  [
                    { key: 'shared', label: t.rentTypeShared, icon: Users2 },
                    { key: 'entire', label: t.rentTypeEntire, icon: Home },
                  ] as const
                ).map((item) => {
                  const Icon = item.icon;
                  const isActive = rentalType === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setRentalType(item.key)}
                      style={isActive ? { borderColor: currentTheme.primaryColor } : {}}
                      className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                        isActive
                          ? 'bg-white text-[#1C1E21] shadow-xs border'
                          : 'text-[#7A7E85] hover:text-[#1C1E21]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-[#6E727A] tracking-wider uppercase">
                {region === 'HK' ? '通学通道' : t.step6Port}
              </label>
              <select
                value={nearestPort}
                onChange={(e) => setNearestPort(e.target.value)}
                className="zen-input text-xs py-2"
              >
                {region === 'HK' ? (
                  <>
                    <option value="香港本地">香港本地 (港铁/小巴直通)</option>
                    <option value="校舍宿舍">校内宿舍 (步行/校巴)</option>
                  </>
                ) : (
                  <>
                    <option value="福田口岸">{t.nearestPortFutian}</option>
                    <option value="深圳湾口岸">{t.nearestPortShenzhenBay}</option>
                    <option value="皇岗口岸">{t.nearestPortHuanggang}</option>
                    <option value="罗湖口岸">{t.nearestPortLuohu}</option>
                    <option value="西九龙高铁">{t.nearestPortWestKowloon}</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* 7. Housing Source */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-[#6E727A] tracking-wider uppercase">
                {t.stepHousingSource}
              </label>
              <span className="text-[10px] text-[#9A9EA6] font-normal">{t.stepHousingSourceHint}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {HOUSING_SOURCES.map((source) => {
                const isSelected = housingSource === source;
                return (
                  <button
                    key={source}
                    type="button"
                    onClick={() => setHousingSource(source)}
                    style={
                      isSelected
                        ? { backgroundColor: currentTheme.primaryColor, borderColor: currentTheme.primaryColor, color: '#FFFFFF' }
                        : {}
                    }
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      isSelected
                        ? 'shadow-xs scale-[1.02]'
                        : 'bg-[#FAF9F7] text-[#555A63] border-[#E4E4DF] hover:bg-white hover:border-[#D0D0CA]'
                    }`}
                  >
                    {source}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 8. One-sentence Review */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-[#6E727A] tracking-wider uppercase flex items-center justify-between">
              <span>{t.step7Review}</span>
              <span className="text-[10px] text-[#9A9EA6] font-normal">{t.step7ReviewHint}</span>
            </label>
            <input
              type="text"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder={region === 'HK' ? '例如：大围名城楼下就是商场，去中大只需11分钟！' : t.step7ReviewPlaceholder}
              className="zen-input text-xs py-2.5"
            />
          </div>

          {/* 9. Photos Upload */}
          <div className="flex flex-col gap-2 p-3.5 bg-[#FAF9F7] rounded-xl border border-[#E8E8E4]">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-[#4A4E57] tracking-wider uppercase flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#21573B]" />
                <span>{t.formPhotoUploadTitle}</span>
              </label>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#EBF3EE] text-[#21573B]">
                {t.formPhotoUploadOptional}
              </span>
            </div>

            <p className="text-[11px] text-[#7A7E85] leading-relaxed">
              {t.formPhotoUploadHint}
            </p>

            <div className="grid grid-cols-3 gap-2.5 pt-1">
              {photos.map((item, idx) => (
                <div key={idx} className="relative group rounded-lg overflow-hidden border border-[#DCE2DC] bg-white aspect-square flex flex-col shadow-2xs">
                  <div className="relative w-full h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors shadow-xs"
                      title={t.formPhotoDelete}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="p-1 bg-white/95 border-t border-[#E8E8E4] flex items-center justify-between">
                    <select
                      value={item.tag}
                      onChange={(e) => handleChangePhotoTag(idx, e.target.value)}
                      className="w-full text-[9px] text-[#4A4E57] bg-transparent border-none outline-none font-medium truncate"
                    >
                      <option value={t.formPhotoTagInterior}>{t.formPhotoTagInterior}</option>
                      <option value={t.formPhotoTagExterior}>{t.formPhotoTagExterior}</option>
                      <option value={t.formPhotoTagStreet}>{t.formPhotoTagStreet}</option>
                      <option value={t.formPhotoTagProof}>{t.formPhotoTagProof}</option>
                    </select>
                  </div>
                </div>
              ))}

              {photos.length < 3 && (
                <label className={`aspect-square rounded-lg border-2 border-dashed border-[#D0D4CF] hover:border-[#2D3A34] bg-white/60 hover:bg-white flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  isCompressing ? 'opacity-60 pointer-events-none' : ''
                }`}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={isCompressing}
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  {isCompressing ? (
                    <div className="w-4 h-4 border-2 border-[#2D3A34] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-[#6E727A]" />
                      <span className="text-[10px] text-[#6E727A] font-medium">{t.formPhotoAddButton}</span>
                      <span className="text-[8px] text-[#9A9EA6]">({photos.length}/3)</span>
                    </>
                  )}
                </label>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: currentTheme.primaryColor, borderColor: currentTheme.primaryColor }}
              className="zen-button-primary w-full py-3.5 text-xs flex items-center justify-center gap-2 shadow-sm font-semibold tracking-wide transition-all hover:opacity-95"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t.submittingText}</span>
                </>
              ) : (
                <>
                  <span>{t.submitButtonText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* Takeaway-style Map Pin Selector Modal (外卖式大头针拖拽微调定位组件) */}
      {/* ========================================================================= */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="w-full max-w-lg h-[82vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-[#E8E8E4]">
            {/* Header */}
            <div className="p-4 border-b border-[#F0F0EC] bg-[#FAF9F7] flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm text-[#1C1E21] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#21573B]" />
                  <span>拖动地图微调定位 (所见即所得)</span>
                </h4>
                <p className="text-[11px] text-[#7A7E85] mt-0.5">
                  平移地图让大头针准确指向您居住的小区或宿舍楼
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPinModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#EAEAE5] hover:bg-[#DCDCD5] flex items-center justify-center text-[#555] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Map Canvas with Center Fixed Pin */}
            <div className="flex-1 relative overflow-hidden">
              <div ref={pinMapContainerRef} className="w-full h-full" />

              {/* Center Fixed Pin (Takeaway style) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none z-20 flex flex-col items-center">
                <div className="px-2.5 py-1 rounded-full bg-[#1C1E21] text-white text-[10px] font-medium shadow-lg mb-1 whitespace-nowrap animate-bounce">
                  您的位置在此处
                </div>
                <div className="relative">
                  <MapPin className="w-9 h-9 text-[#D83B01] fill-[#D83B01] drop-shadow-md" />
                </div>
                <div className="w-2.5 h-1 bg-black/30 rounded-full blur-[1px] -mt-0.5" />
              </div>

              {/* Quick Jump Buttons (SZ Futian Port / HK Tai Wai) */}
              <div className="absolute top-3 left-3 z-10 flex gap-1.5 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => {
                    if (pinMapInstanceRef.current) {
                      pinMapInstanceRef.current.setZoomAndCenter(16, [114.0664, 22.5195]); // Futian Port Jindimingjin
                    }
                  }}
                  className="px-2.5 py-1 text-[10px] font-medium bg-white/95 backdrop-blur-md rounded-lg border border-[#E2E2DC] shadow-xs text-[#21573B] hover:bg-white"
                >
                  📍 深圳福田口岸
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (pinMapInstanceRef.current) {
                      pinMapInstanceRef.current.setZoomAndCenter(16, [114.1235, 22.5368]); // Luohu Zhidi
                    }
                  }}
                  className="px-2.5 py-1 text-[10px] font-medium bg-white/95 backdrop-blur-md rounded-lg border border-[#E2E2DC] shadow-xs text-[#21573B] hover:bg-white"
                >
                  📍 深圳罗湖置地
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (pinMapInstanceRef.current) {
                      pinMapInstanceRef.current.setZoomAndCenter(16, [114.1785, 22.3732]); // HK Tai Wai
                    }
                  }}
                  className="px-2.5 py-1 text-[10px] font-medium bg-white/95 backdrop-blur-md rounded-lg border border-[#E2E2DC] shadow-xs text-[#21573B] hover:bg-white"
                >
                  📍 香港大围/沙田
                </button>
              </div>
            </div>

            {/* Bottom Current Location Strip & Action */}
            <div className="p-4 bg-white border-t border-[#F0F0EC] flex flex-col gap-3">
              <div className="flex items-start gap-2 text-xs">
                <Navigation className="w-4 h-4 text-[#21573B] shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#1C1E21]">针尖所在位置:</span>
                    {isReverseGeocoding && (
                      <span className="text-[10px] text-[#9A9EA6]">解析中...</span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#6E727A] truncate mt-0.5 font-mono">
                    {pinCenterAddress}
                  </p>
                  <p className="text-[10px] text-[#9A9EA6] font-mono mt-0.5">
                    经纬度: {pinCenterCoords.lng.toFixed(5)}, {pinCenterCoords.lat.toFixed(5)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPinModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E2E2DC] text-xs text-[#6E727A] hover:bg-[#F9F9F7]"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPinLocation}
                  className="flex-1 zen-button-primary py-2.5 text-xs text-white font-semibold flex items-center justify-center gap-1.5 shadow-sm bg-[#21573B] border-[#21573B]"
                >
                  <Check className="w-4 h-4" />
                  <span>确定选用此精准定位</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
