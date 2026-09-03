'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Language, translations } from '@/lib/i18n';
import {
  X,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Sparkles,
  Camera,
  AlertTriangle,
  ZoomIn,
  CheckCircle2,
  FileText,
  Map as MapIcon,
  Volume2,
  Wind,
  CreditCard,
  Zap,
  Building,
  Users
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  lang: Language;
  onClose: () => void;
  onExploreMap: () => void;
  onOpenForm: () => void;
  totalStudents?: number;
  communitiesCount?: number;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  lang,
  onClose,
  onExploreMap,
  onOpenForm,
  totalStudents = 100,
  communitiesCount = 12,
}) => {
  const t = translations[lang];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lightboxImg, setLightboxImg] = useState<{ src: string; title: string } | null>(null);

  // Touch swipe support
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const minSwipeDistance = 45;

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSlide < 3) {
      setCurrentSlide((prev) => prev + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxImg) {
          setLightboxImg(null);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight' && currentSlide < 3) {
        setCurrentSlide((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentSlide > 0) {
        setCurrentSlide((prev) => prev - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlide, lightboxImg, onClose]);

  if (!isOpen) return null;

  const handleFinish = (action: 'map' | 'form' | 'close') => {
    try {
      localStorage.setItem('uninest_onboarding_shown', 'true');
    } catch (e) {
      // Ignore localstorage errors
    }
    onClose();
    if (action === 'map') onExploreMap();
    if (action === 'form') onOpenForm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Lightbox for Enlarge Preview */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-60 bg-black/90 flex flex-col items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightboxImg(null)}
        >
          <div className="relative max-w-lg w-full max-h-[85vh] flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxImg.src}
              alt={lightboxImg.title}
              className="max-w-full max-h-[75vh] object-contain rounded-xl border border-white/20 shadow-2xl"
            />
            <div className="mt-3 px-4 py-1.5 rounded-full bg-black/70 text-white text-xs backdrop-blur-sm">
              {lightboxImg.title} (点击任意处关闭)
            </div>
          </div>
        </div>
      )}

      {/* Main Dialog Modal */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="relative w-full max-w-xl bg-[#FAF9F7] border border-[#E8E8E4] rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[92vh] sm:max-h-[85vh] animate-in zoom-in-95 duration-200"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#E8E8E4] bg-white/70 backdrop-blur-xs">
          {/* Step Indicator */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#21573B] animate-pulse" />
            <span className="text-xs font-semibold tracking-wider text-[#4A4E57] uppercase">
              {currentSlide === 0 && t.onboardingSlide1Tag}
              {currentSlide === 1 && t.onboardingSlide2Tag}
              {currentSlide === 2 && t.onboardingSlide3Tag}
              {currentSlide === 3 && t.onboardingSlide4Tag}
            </span>
            <span className="text-[11px] text-[#9A9EA6] ml-1">
              ({currentSlide + 1} / 4)
            </span>
          </div>

          {/* Skip / Close Button */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleFinish('close')}
              className="px-2.5 py-1 text-xs font-medium text-[#7A7E85] hover:text-[#1C1E21] hover:bg-[#F2F1ED] rounded-lg transition-colors"
            >
              {t.onboardingSkip}
            </button>
            <button
              onClick={() => handleFinish('close')}
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#7A7E85] hover:text-[#1C1E21] hover:bg-[#F2F1ED] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Carousel Slides Body */}
        <div className="p-5 sm:p-7 flex-1 overflow-y-auto">
          {/* ========================================================================= */}
          {/* Slide 1: Vision & Mission */}
          {/* ========================================================================= */}
          {currentSlide === 0 && (
            <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-3 duration-250">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF3EE] border border-[#DCE8DF] text-[#21573B] text-xs font-medium w-fit">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.onboardingSlide1Pill}</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1E21] leading-snug">
                  {t.onboardingSlide1Title}
                </h2>
                <p className="text-xs sm:text-sm text-[#6E727A] leading-relaxed">
                  {t.onboardingSlide1Sub}
                </p>
              </div>

              {/* Live verified stats visual card */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white border border-[#E8E8E4] shadow-2xs">
                <div className="flex flex-col gap-1 border-r border-[#F0F0EC] pr-2">
                  <span className="text-[11px] text-[#7A7E85] font-medium flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#21573B]" />
                    {t.onboardingSlide1StatAlumni}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-bold text-[#1C1E21]">
                      {totalStudents}
                    </span>
                    <span className="text-[10px] text-[#21573B] font-semibold">+ 实时</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 pl-2">
                  <span className="text-[11px] text-[#7A7E85] font-medium flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-[#21573B]" />
                    {t.onboardingSlide1StatComm}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-bold text-[#21573B]">
                      {communitiesCount}
                    </span>
                    <span className="text-[10px] text-[#7A7E85]">个聚居区</span>
                  </div>
                </div>
              </div>

              {/* Key Features Pill Badges */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="p-2.5 rounded-xl bg-white border border-[#E8E8E4] flex flex-col items-center gap-1">
                  <span className="text-base">🚫</span>
                  <span className="text-[11px] font-semibold text-[#1C1E21]">0 中介进驻</span>
                  <span className="text-[9px] text-[#8E929A]">纯校友真实网络</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#E8E8E4] flex flex-col items-center gap-1">
                  <span className="text-base">⏱️</span>
                  <span className="text-[11px] font-semibold text-[#1C1E21]">实测门到门</span>
                  <span className="text-[9px] text-[#8E929A]">过关通勤精确推算</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#E8E8E4] flex flex-col items-center gap-1">
                  <span className="text-base">🛡️</span>
                  <span className="text-[11px] font-semibold text-[#1C1E21]">避坑红黑榜</span>
                  <span className="text-[9px] text-[#8E929A]">甲醛/隔音/押金打分</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* Slide 2: Pain Points & Multimodal Visual Proof */}
          {/* ========================================================================= */}
          {currentSlide === 1 && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-3 duration-250">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1F0] border border-[#FFCCC7] text-[#CF1322] text-xs font-medium w-fit">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{t.onboardingSlide2Tag}</span>
              </div>

              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1E21]">
                  {t.onboardingSlide2Title}
                </h2>
                <p className="text-xs text-[#6E727A] leading-relaxed">
                  {t.onboardingSlide2Sub}
                </p>
              </div>

              {/* 3 Multimodal Visual Cards (Click to Enlarge) */}
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                {/* Visual A: Agent Chat Trap */}
                <div
                  onClick={() =>
                    setLightboxImg({
                      src: '/onboarding/fake_agent_chat.jpg',
                      title: t.onboardingPainChatTitle,
                    })
                  }
                  className="group relative rounded-xl overflow-hidden border border-[#E8E8E4] bg-white cursor-pointer shadow-2xs hover:border-[#CF1322] transition-all flex flex-col"
                >
                  <div className="relative aspect-3/4 w-full overflow-hidden bg-black/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/onboarding/fake_agent_chat.jpg"
                      alt={t.onboardingPainChatTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                      <ZoomIn className="w-5 h-5 drop-shadow" />
                    </div>
                  </div>
                  <div className="p-1.5 flex flex-col bg-white">
                    <span className="text-[10px] font-bold text-[#CF1322] truncate">
                      {t.onboardingPainChatTitle}
                    </span>
                    <span className="text-[8px] text-[#7A7E85] line-clamp-2 mt-0.5">
                      {t.onboardingPainChatDesc}
                    </span>
                  </div>
                </div>

                {/* Visual B: Social Media Spam Comments */}
                <div
                  onClick={() =>
                    setLightboxImg({
                      src: '/onboarding/social_spam_comments.jpg',
                      title: t.onboardingPainSpamTitle,
                    })
                  }
                  className="group relative rounded-xl overflow-hidden border border-[#E8E8E4] bg-white cursor-pointer shadow-2xs hover:border-[#CF1322] transition-all flex flex-col"
                >
                  <div className="relative aspect-3/4 w-full overflow-hidden bg-black/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/onboarding/social_spam_comments.jpg"
                      alt={t.onboardingPainSpamTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                      <ZoomIn className="w-5 h-5 drop-shadow" />
                    </div>
                  </div>
                  <div className="p-1.5 flex flex-col bg-white">
                    <span className="text-[10px] font-bold text-[#CF1322] truncate">
                      {t.onboardingPainSpamTitle}
                    </span>
                    <span className="text-[8px] text-[#7A7E85] line-clamp-2 mt-0.5">
                      {t.onboardingPainSpamDesc}
                    </span>
                  </div>
                </div>

                {/* Visual C: Distortion vs Urban Village Debris */}
                <div
                  onClick={() =>
                    setLightboxImg({
                      src: '/onboarding/distorted_room_trash.jpg',
                      title: t.onboardingPainDistortTitle,
                    })
                  }
                  className="group relative rounded-xl overflow-hidden border border-[#E8E8E4] bg-white cursor-pointer shadow-2xs hover:border-[#CF1322] transition-all flex flex-col"
                >
                  <div className="relative aspect-3/4 w-full overflow-hidden bg-black/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/onboarding/distorted_room_trash.jpg"
                      alt={t.onboardingPainDistortTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                      <ZoomIn className="w-5 h-5 drop-shadow" />
                    </div>
                  </div>
                  <div className="p-1.5 flex flex-col bg-white">
                    <span className="text-[10px] font-bold text-[#CF1322] truncate">
                      {t.onboardingPainDistortTitle}
                    </span>
                    <span className="text-[8px] text-[#7A7E85] line-clamp-2 mt-0.5">
                      {t.onboardingPainDistortDesc}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <span className="text-[10px] text-[#9A9EA6]">
                  🔍 {t.onboardingClickToEnlarge}
                </span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* Slide 3: Peer Solution - Honest Photos & Anti-Trap Score Card */}
          {/* ========================================================================= */}
          {currentSlide === 2 && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-3 duration-250">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF3EE] border border-[#DCE8DF] text-[#21573B] text-xs font-medium w-fit">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.onboardingSlide3Tag}</span>
              </div>

              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1E21]">
                  {t.onboardingSlide3Title}
                </h2>
                <p className="text-xs text-[#6E727A] leading-relaxed">
                  {t.onboardingSlide3Sub}
                </p>
              </div>

              {/* Realistic Peer Verification Sample Card */}
              <div className="rounded-2xl border border-[#DCE2DC] bg-white p-3.5 shadow-sm flex flex-col gap-3">
                {/* Photo Header */}
                <div className="relative rounded-xl overflow-hidden aspect-16/9 bg-[#F0F2EF] border border-[#E4E8E4]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/onboarding/verified_alumni_room.jpg"
                    alt="Authentic Alumni Room"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] backdrop-blur-xs flex items-center gap-1 font-medium">
                    <Camera className="w-3 h-3 text-[#52C41A]" />
                    <span>{t.onboardingCardRealPhotoTag}</span>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded-lg bg-black/60 text-white text-[10px] backdrop-blur-xs">
                    {t.onboardingCardRealPhotoNote}
                  </div>
                </div>

                {/* 4 Anti-Trap Verification Criteria */}
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <div className="p-2 rounded-lg bg-[#F8F9F8] border border-[#E8ECE8] flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-[#21573B] shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold text-[#1C1E21]">
                        {t.onboardingCardSoundproof}
                      </span>
                      <span className="text-[9px] text-[#52C41A] font-medium">
                        实测实墙隔音 4.8★
                      </span>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-[#F8F9F8] border border-[#E8ECE8] flex items-center gap-2">
                    <Wind className="w-4 h-4 text-[#21573B] shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold text-[#1C1E21]">
                        {t.onboardingCardFormaldehyde}
                      </span>
                      <span className="text-[9px] text-[#52C41A] font-medium">
                        已通风1年·无异味
                      </span>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-[#F8F9F8] border border-[#E8ECE8] flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#21573B] shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold text-[#1C1E21]">
                        {t.onboardingCardDeposit}
                      </span>
                      <span className="text-[9px] text-[#52C41A] font-medium">
                        校友全额退还押金
                      </span>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-[#F8F9F8] border border-[#E8ECE8] flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#21573B] shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold text-[#1C1E21]">
                        {t.onboardingCardUtility}
                      </span>
                      <span className="text-[9px] text-[#52C41A] font-medium">
                        标准民水电·无暗加
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* Slide 4: Beacon & Call To Action */}
          {/* ========================================================================= */}
          {currentSlide === 3 && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-3 duration-250">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF3EE] border border-[#DCE8DF] text-[#21573B] text-xs font-medium w-fit">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.onboardingSlide4Tag}</span>
              </div>

              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1E21]">
                  {t.onboardingSlide4Title}
                </h2>
                <p className="text-xs text-[#6E727A] leading-relaxed">
                  {t.onboardingSlide4Sub}
                </p>
              </div>

              {/* Two Prominent Action Cards */}
              <div className="grid grid-cols-1 gap-3 pt-2">
                {/* Action 1: Explore Map */}
                <div
                  onClick={() => handleFinish('map')}
                  className="p-4 rounded-2xl bg-white border-2 border-[#2D3A34] cursor-pointer hover:bg-[#F5F8F6] transition-all flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#2D3A34] text-white flex items-center justify-center shrink-0">
                      <MapIcon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#1C1E21]">
                        {t.onboardingSlide4ActionMapTitle}
                      </span>
                      <span className="text-[11px] text-[#6E727A] mt-0.5">
                        {t.onboardingSlide4ActionMapDesc}
                      </span>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#FAF9F7] group-hover:bg-[#2D3A34] group-hover:text-white flex items-center justify-center text-[#2D3A34] transition-colors shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Action 2: Share Rental & Photos */}
                <div
                  onClick={() => handleFinish('form')}
                  className="p-4 rounded-2xl bg-white border border-[#DCE2DC] hover:border-[#21573B] cursor-pointer hover:bg-[#F7FAF8] transition-all flex items-center justify-between group shadow-2xs"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EBF3EE] text-[#21573B] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#1C1E21]">
                          {t.onboardingSlide4ActionFormTitle}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#EBF3EE] text-[#21573B] font-medium">
                          +晒实拍图
                        </span>
                      </div>
                      <span className="text-[11px] text-[#6E727A] mt-0.5">
                        {t.onboardingSlide4ActionFormDesc}
                      </span>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#FAF9F7] group-hover:bg-[#21573B] group-hover:text-white flex items-center justify-center text-[#6E727A] transition-colors shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation & Indicator Controls */}
        <div className="px-5 py-3.5 border-t border-[#E8E8E4] bg-white/80 backdrop-blur-xs flex items-center justify-between">
          {/* Prev button or placeholder */}
          {currentSlide > 0 ? (
            <button
              onClick={() => setCurrentSlide((prev) => prev - 1)}
              className="px-3 py-1.5 rounded-xl border border-[#E8E8E4] text-[#4A4E57] hover:bg-[#FAF9F7] text-xs font-medium flex items-center gap-1 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.onboardingPrev}</span>
            </button>
          ) : (
            <div className="w-16" />
          )}

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3].map((index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentSlide === index
                    ? 'w-6 h-2 bg-[#2D3A34]'
                    : 'w-2 h-2 bg-[#D5D8D3] hover:bg-[#A8ACA6]'
                }`}
                title={`Slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Next or Finish button */}
          {currentSlide < 3 ? (
            <button
              onClick={() => setCurrentSlide((prev) => prev + 1)}
              className="px-4 py-1.5 rounded-xl bg-[#2D3A34] text-white text-xs font-semibold flex items-center gap-1 hover:bg-[#1C2521] shadow-xs transition-all"
            >
              <span>{t.onboardingNext}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => handleFinish('map')}
              className="px-4 py-1.5 rounded-xl bg-[#21573B] text-white text-xs font-semibold flex items-center gap-1 hover:bg-[#18422C] shadow-xs transition-all"
            >
              <span>{t.onboardingStartExplore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
