'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { geocodeAddress } from '@/lib/amap';
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
  QrCode
} from 'lucide-react';

interface SubmissionFormProps {
  lang: Language;
  onSuccess?: (marker?: CommunityMarker) => void;
  onClose?: () => void;
  onOpenShare?: (communityName: string, university: string) => void;
  initialCommunityName?: string;
}

const POPULAR_COMMUNITIES = [
  '海悦华城',
  '城投青莲公寓',
  '皇御苑',
  '福田水围村',
  '置地逸轩',
  '漾日湾畔',
  '水榭春天',
];

const HOUSING_SOURCES = [
  '个人中介',
  '贝壳',
  '自如',
  '链家',
  '乐有家',
  '物业直租',
  '其他',
];

export const SubmissionForm: React.FC<SubmissionFormProps> = ({
  lang,
  onSuccess,
  onClose,
  onOpenShare,
  initialCommunityName,
}) => {
  const t = translations[lang];

  const [university, setUniversity] = useState('HKU');
  const [emailPrefix, setEmailPrefix] = useState('');
  const [communityName, setCommunityName] = useState(initialCommunityName || '');
  const [address, setAddress] = useState('');
  const [monthlyRent, setMonthlyRent] = useState<number>(3500);
  const [rentalType, setRentalType] = useState<'entire' | 'shared'>('shared');
  const [housingSource, setHousingSource] = useState('自如');
  const [nearestPort, setNearestPort] = useState('福田口岸');
  const [review, setReview] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isUpdateNotice, setIsUpdateNotice] = useState(false);

  // Active theme based on university selection
  const currentTheme: UniversityTheme = useMemo(() => {
    return UNIVERSITY_THEMES[university] || UNIVERSITY_THEMES.HKU;
  }, [university]);

  // Track form_opened on mount
  useEffect(() => {
    trackAnalyticsEvent('form_opened');
  }, []);

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

      // Geocode address
      const targetQuery = address.trim() ? `${address} ${communityName}` : communityName;
      const geo = await geocodeAddress(targetQuery);

      // Submit record (upsert on email)
      const res = await submitHousingRecord({
        university,
        studentEmail: fullEmail,
        communityName: communityName.trim(),
        address: address.trim() || communityName.trim(),
        district: geo.district || '福田区',
        monthlyRent: Number(monthlyRent),
        rentalType,
        housingSource,
        commuteMinutes: nearestPort.includes('福田') ? 15 : nearestPort.includes('深圳湾') ? 25 : 20,
        nearestPort,
        review: review.trim(),
        lng: geo.lng,
        lat: geo.lat,
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
    <div className="zen-card w-full max-w-lg bg-white border border-[#E4E4E0] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      {/* Dynamic University Theme Skin Banner */}
      <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-[#1C1E21]">
        {/* Background Artwork */}
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

        {/* Banner Content (Airy & Atmospheric) */}
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

          <span className="text-[10px] text-white/70 bg-white/15 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/20 hidden sm:inline-block">
            全季极简 · 定制皮肤
          </span>
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
          {/* Action Buttons */}
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
        /* Form Content with Generous Breathing Room */
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 flex flex-col gap-5 text-xs max-h-[72vh] overflow-y-auto">
          
          {/* Error Notice */}
          {errorMsg && (
            <div className="p-3 bg-[#FCF1F2] border border-[#F5D2D6] rounded-xl text-[#942735] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. University Selection (Triggers Skin Switch) */}
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

          {/* 2. Student Email (Prefix + Auto Domain) */}
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

          {/* 3. Community Name & Quick Chips */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold text-[#6E727A] tracking-wider uppercase">
              {t.step3Community}
            </label>
            <input
              type="text"
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
              placeholder={t.step3CommunityPlaceholder}
              className="zen-input text-xs py-2.5"
              required
            />
            {/* Quick suggested chips */}
            <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
              <span className="text-[10px] text-[#9A9EA6]">{t.step3HotLabel}</span>
              {POPULAR_COMMUNITIES.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setCommunityName(name)}
                  className="text-[11px] px-2.5 py-0.5 rounded-lg bg-[#F4F4F0] hover:bg-[#EBEBE6] text-[#4E525B] transition-colors"
                >
                  {name}
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
              max="9000"
              step="100"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(Number(e.target.value))}
              className="zen-slider w-full mt-1 cursor-pointer"
            />
            <div className="flex gap-1.5 mt-1">
              {[2500, 3200, 4200, 5500].map((preset) => (
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

          {/* 5. Rental Type (STRICTLY 合租 / 整租 ONLY) & Nearest Port */}
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
                {t.step6Port}
              </label>
              <select
                value={nearestPort}
                onChange={(e) => setNearestPort(e.target.value)}
                className="zen-input text-xs py-2"
              >
                <option value="福田口岸">{t.nearestPortFutian}</option>
                <option value="深圳湾口岸">{t.nearestPortShenzhenBay}</option>
                <option value="皇岗口岸">{t.nearestPortHuanggang}</option>
                <option value="罗湖口岸">{t.nearestPortLuohu}</option>
                <option value="西九龙高铁">{t.nearestPortWestKowloon}</option>
              </select>
            </div>
          </div>

          {/* 6. Housing Source (NEW: 个人中介/贝壳/自如/链家/乐有家/物业/其他) */}
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

          {/* 7. One-sentence Review / Tip */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-[#6E727A] tracking-wider uppercase flex items-center justify-between">
              <span>{t.step7Review}</span>
              <span className="text-[10px] text-[#9A9EA6] font-normal">{t.step7ReviewHint}</span>
            </label>
            <input
              type="text"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder={t.step7ReviewPlaceholder}
              className="zen-input text-xs py-2.5"
            />
          </div>

          {/* Submit Button (Styled with University Accent Color) */}
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
    </div>
  );
};
