'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { CommunityMarker, MOCK_COMMUNITIES } from '@/lib/mockData';
import { fetchCommunityMarkers, trackAnalyticsEvent } from '@/lib/supabase';
import { Language, translations } from '@/lib/i18n';
import { Sidebar } from '@/components/Sidebar';
import { SubmissionForm } from '@/components/SubmissionForm';
import { AnalyticsModal } from '@/components/AnalyticsModal';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ShareModal } from '@/components/ShareModal';
import {
  MapPin,
  Map as MapIcon,
  FileText,
  BarChart3,
  ArrowRight,
  Shield,
  Sparkles,
  Users,
  Building,
  Menu,
  X,
  Compass,
  QrCode
} from 'lucide-react';

const MapComponent = dynamic(
  () => import('@/components/Map').then((mod) => mod.MapComponent),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#F7F7F5] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-[#E4E4E0] border-t-[#2D3A34] rounded-full animate-spin" />
        <span className="text-xs text-[#6E727A] tracking-wider">正在加载高德地图...</span>
      </div>
    ),
  }
);

export default function HomePage() {
  const [lang, setLang] = useState<Language>('zh-CN');
  const t = translations[lang];
  const [communities, setCommunities] = useState<CommunityMarker[]>(MOCK_COMMUNITIES);
  const [selectedUni, setSelectedUni] = useState<string>('ALL');
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityMarker | null>(null);

  // View state: 'landing' (Initial QR scan landing) vs 'map' (Active Map inspection)
  const [currentView, setCurrentView] = useState<'landing' | 'map'>('landing');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const [isMonitorAllowed, setIsMonitorAllowed] = useState(false);
  const [formInitialCommunity, setFormInitialCommunity] = useState<string>('');
  const [highlightCommunity, setHighlightCommunity] = useState<string>('');
  const [highlightUni, setHighlightUni] = useState<string>('HKU');

  // Load live community data
  const loadData = async () => {
    try {
      const data = await fetchCommunityMarkers();
      setCommunities(data || []);
    } catch (e) {
      console.warn('Failed to load community markers:', e);
    }
  };

  useEffect(() => {
    loadData();
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#map') {
        setCurrentView('map');
      }
      const params = new URLSearchParams(window.location.search);
      if (params.get('monitor') === '1' || window.location.hash.includes('monitor')) {
        setIsMonitorAllowed(true);
      }
    }
  }, []);

  // Filtered communities based on selected university
  const filteredCommunities = useMemo(() => {
    if (selectedUni === 'ALL') return communities;
    return communities.filter((c) => {
      if (c.totalStudents === 0) return true; // Keep preset candidate communities visible
      return Boolean(c.universityDistribution && c.universityDistribution[selectedUni]);
    });
  }, [communities, selectedUni]);

  // Total student count (from real submissions in database)
  const totalStudents = useMemo(() => {
    return communities.reduce((acc, c) => acc + c.totalStudents, 0);
  }, [communities]);

  // Number of communities that have at least 1 verified student registration
  const registeredCommunitiesCount = useMemo(() => {
    return communities.filter((c) => c.totalStudents > 0).length;
  }, [communities]);

  // Actions
  const handleOpenMap = () => {
    setCurrentView('map');
    if (typeof window !== 'undefined') window.location.hash = 'map';
    trackAnalyticsEvent('map_opened');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    if (typeof window !== 'undefined') {
      history.pushState('', document.title, window.location.pathname);
    }
  };

  const handleOpenForm = (initialName?: string) => {
    setFormInitialCommunity(initialName || '');
    setIsFormModalOpen(true);
    trackAnalyticsEvent('form_opened');
  };

  const handleSelectCommunity = (comm: CommunityMarker | null) => {
    setSelectedCommunity(comm);
    if (comm && isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  };

  return (
    <main className="w-screen h-screen overflow-hidden relative bg-[#F7F7F5] font-sans text-[#1C1E21] select-none">
      
      {/* ========================================================================= */}
      {/* 1. INITIAL LANDING SCREEN (Optimized for Mobile QR code scan) */}
      {/* ========================================================================= */}
      {currentView === 'landing' ? (
        <div className="w-full h-full flex flex-col justify-between p-6 sm:p-10 max-w-xl mx-auto overflow-y-auto">
          
          {/* Top Header: Logo, Language (Stats button hidden for regular users, monitor accessible via ?monitor=1) */}
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2D3A34]" />
              <span className="text-base font-semibold tracking-tight text-[#1C1E21]">
                {t.appName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsShareOpen(true)}
                className="px-2.5 py-1.5 rounded-lg border border-[#E8E8E4] bg-white hover:bg-[#F9F9F7] text-[#4A4E57] text-xs flex items-center gap-1.5 shadow-2xs transition-all"
                title="分享海报与二维码"
              >
                <QrCode className="w-3.5 h-3.5 text-[#21573B]" />
                <span className="hidden sm:inline">海报 / 二维码</span>
              </button>

              <LanguageSwitcher currentLang={lang} onLanguageChange={setLang} />
              
              {/* Secret Admin Monitor Button (Only visible if ?monitor=1) */}
              {isMonitorAllowed && (
                <button
                  onClick={() => setIsAnalyticsOpen(true)}
                  className="px-2.5 py-1 rounded-md border border-[#2D3A34] bg-[#2D3A34] text-[#F7F7F5] text-xs flex items-center gap-1 transition-colors"
                  title="站长后台埋点监控"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>后台</span>
                </button>
              )}
            </div>
          </header>

          {/* Central Hero: Title & Two Prominent Modules */}
          <section className="my-auto py-8 flex flex-col gap-6">
            
            {/* Title & Highly Prominent Live Alumni Badge */}
            <div className="flex flex-col gap-3.5">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-[#DCE2DC] shadow-sm w-fit transition-all">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#21573B] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#21573B]"></span>
                </span>
                <span className="text-xs font-medium text-[#4B524E]">
                  {lang === 'en' ? 'Live Verified Alumni:' : '实时已入驻校友:'}{' '}
                  <strong className="text-sm font-bold text-[#1C1E21] ml-0.5">{totalStudents}</strong>
                  <span className="mx-2 text-[#CBD0CA]">·</span>
                  {lang === 'en' ? 'Communities Covered:' : '已点亮小区:'}{' '}
                  <strong className="text-sm font-bold text-[#21573B] ml-0.5">{registeredCommunitiesCount}</strong>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1C1E21] leading-tight">
                {t.landingTitleLine1}<br />
                <span className="text-[#2D3A34]">{t.landingTitleLine2}</span>
              </h1>
              
              <p className="text-xs sm:text-sm text-[#7A7E85] leading-relaxed max-w-md">
                {t.landingSubtitle}
              </p>
            </div>

            {/* The Two Main Modules */}
            <div className="grid grid-cols-1 gap-4 pt-2">
              
              {/* Module 1: Explore Live Map */}
              <div
                onClick={handleOpenMap}
                className="zen-card p-5 bg-white border border-[#E8E8E4] rounded-2xl cursor-pointer group flex items-center justify-between hover:border-[#2D3A34] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F2F5F3] group-hover:bg-[#2D3A34] text-[#2D3A34] group-hover:text-white flex items-center justify-center transition-colors">
                    <MapIcon className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-semibold text-[#1C1E21]">
                        {t.moduleExploreMap}
                      </h2>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F4F4F0] text-[#6E727A]">
                        {t.moduleExploreMapTag}
                      </span>
                    </div>
                    <span className="text-xs text-[#7A7E85] mt-0.5">
                      {t.moduleExploreMapSub}
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full border border-[#E8E8E4] group-hover:border-[#2D3A34] flex items-center justify-center text-[#7A7E85] group-hover:text-[#2D3A34] transition-colors shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Module 2: Quick Registration (30s) */}
              <div
                onClick={() => handleOpenForm()}
                className="zen-card p-5 bg-white border border-[#E8E8E4] rounded-2xl cursor-pointer group flex items-center justify-between hover:border-[#2D3A34] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F5F4F0] group-hover:bg-[#2D3A34] text-[#4A4E57] group-hover:text-white flex items-center justify-center transition-colors">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-semibold text-[#1C1E21]">
                        {t.moduleRegisterHousing}
                      </h2>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EBF3EE] text-[#21573B] font-medium">
                        {t.moduleRegisterHousingTag}
                      </span>
                    </div>
                    <span className="text-xs text-[#7A7E85] mt-0.5">
                      {t.moduleRegisterHousingSub}
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full border border-[#E8E8E4] group-hover:border-[#2D3A34] flex items-center justify-center text-[#7A7E85] group-hover:text-[#2D3A34] transition-colors shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

            </div>
          </section>

          {/* Footer note */}
          <footer className="pt-6 border-t border-[#EEEEEC] flex items-center justify-between text-[11px] text-[#9A9EA6]">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#2D3A34]" />
              {t.footerVerifyNotice}
            </span>
            <span>{t.footerSlogan}</span>
          </footer>

        </div>
      ) : (
        /* ========================================================================= */
        /* 2. REAL-TIME MAP VIEW MODE */
        /* ========================================================================= */
        <div className="w-full h-full flex flex-row relative overflow-hidden">
          
          {/* Desktop Left Sidebar (>= md) */}
          <div className="hidden md:flex w-[380px] lg:w-[400px] h-full shrink-0 z-20">
            <Sidebar
              communities={communities}
              filteredCommunities={filteredCommunities}
              selectedUni={selectedUni}
              onSelectUni={setSelectedUni}
              selectedCommunityId={selectedCommunity?.id}
              onSelectCommunity={handleSelectCommunity}
              lang={lang}
              onLanguageChange={setLang}
              onRefreshData={loadData}
            />
          </div>

          {/* Main Map Canvas Area */}
          <div className="flex-1 h-full w-full relative">
            
            {/* Top Navigation Bar (Sleek, Responsive, No Overlap) */}
            <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-30 flex items-center justify-between pointer-events-none gap-1.5 sm:gap-2">
              <div className="flex items-center gap-1.5 pointer-events-auto shrink-0">
                <button
                  onClick={handleBackToLanding}
                  className="h-8 px-2.5 rounded-xl bg-white/95 backdrop-blur-md border border-[#E8E8E4] text-xs font-medium text-[#1C1E21] hover:bg-white shadow-xs transition-all flex items-center gap-1 shrink-0"
                  title={t.backToHome}
                >
                  <span>←</span>
                  <span className="hidden sm:inline">{t.backToHome}</span>
                </button>

                {/* Mobile drawer toggle */}
                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="md:hidden h-8 px-2.5 rounded-xl bg-white/95 backdrop-blur-md border border-[#E8E8E4] text-xs font-medium text-[#1C1E21] hover:bg-white shadow-xs transition-all flex items-center gap-1 shrink-0"
                >
                  <Menu className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Rank' : '榜单'}</span>
                </button>
              </div>

              {/* Top right actions (Single-row flex-nowrap) */}
              <div className="flex items-center gap-1.5 pointer-events-auto shrink-0">
                {isMonitorAllowed && (
                  <button
                    onClick={() => setIsAnalyticsOpen(true)}
                    className="h-8 px-2 rounded-xl border border-[#2D3A34] bg-[#2D3A34] text-[#F7F7F5] text-[11px] flex items-center gap-1 transition-colors shrink-0"
                    title="站长后台埋点监控"
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => setIsShareOpen(true)}
                  className="h-8 px-2 sm:px-2.5 rounded-xl bg-white/95 backdrop-blur-md border border-[#E8E8E4] text-[#4A4E57] hover:bg-white text-xs flex items-center gap-1 shadow-xs transition-all shrink-0"
                  title="分享海报与二维码"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#21573B]" />
                  <span className="hidden sm:inline">海报</span>
                </button>

                <LanguageSwitcher currentLang={lang} onLanguageChange={setLang} />

                <button
                  onClick={() => handleOpenForm()}
                  className="zen-button-primary h-8 px-2.5 sm:px-3.5 text-xs flex items-center gap-1 shadow-xs shrink-0 whitespace-nowrap"
                >
                  <span>+</span>
                  <span>{lang === 'en' ? 'Register' : '登记租房'}</span>
                </button>
              </div>
            </div>

            {/* Prominent Floating Live Alumni Counter Capsule (Bottom-left on Mobile, Top-center on Desktop) */}
            <div className="absolute bottom-7 left-4 sm:bottom-auto sm:top-4 sm:left-1/2 sm:-translate-x-1/2 z-20 pointer-events-auto">
              <div className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#DCE2DC] shadow-md flex items-center gap-2 transition-all hover:shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#21573B] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#21573B]"></span>
                </span>
                <div className="flex items-center gap-1 text-[11px] sm:text-xs">
                  <span className="text-[#656A66] font-medium hidden sm:inline">{lang === 'en' ? 'Live Alumni:' : '实时已入驻校友:'}</span>
                  <span className="text-[#1C1E21] font-bold text-xs sm:text-sm">{totalStudents}</span>
                  <span className="text-[#656A66] font-medium sm:hidden">{lang === 'en' ? 'Alumni' : '位校友'}</span>
                  <span className="text-[#CBD0CA] mx-0.5">·</span>
                  <span className="text-[#656A66] font-medium hidden sm:inline">{lang === 'en' ? 'Communities:' : '已点亮小区:'}</span>
                  <span className="text-[#21573B] font-bold text-xs sm:text-sm">{registeredCommunitiesCount}</span>
                  <span className="text-[#656A66] font-medium sm:hidden">{lang === 'en' ? 'Comms' : '个小区'}</span>
                </div>
              </div>
            </div>

            {/* Real AMap Component */}
            <MapComponent
              communities={communities}
              selectedCommunity={selectedCommunity}
              onSelectCommunity={handleSelectCommunity}
              selectedUni={selectedUni}
              lang={lang}
              onOpenForm={handleOpenForm}
            />

            {/* Mobile Drawer (Slide in for < md) */}
            {isMobileSidebarOpen && (
              <div className="md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm flex">
                <div className="w-[85vw] max-w-sm h-full bg-white shadow-2xl animate-in slide-in-from-left duration-200">
                  <Sidebar
                    communities={communities}
                    filteredCommunities={filteredCommunities}
                    selectedUni={selectedUni}
                    onSelectUni={setSelectedUni}
                    selectedCommunityId={selectedCommunity?.id}
                    onSelectCommunity={handleSelectCommunity}
                    lang={lang}
                    onLanguageChange={setLang}
                    onRefreshData={loadData}
                    onCloseMobile={() => setIsMobileSidebarOpen(false)}
                  />
                </div>
                <div
                  className="flex-1 h-full"
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
              </div>
            )}

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. RAPID SUBMISSION MODAL */}
      {/* ========================================================================= */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <SubmissionForm
            lang={lang}
            initialCommunityName={formInitialCommunity}
            onOpenShare={(comm, uni) => {
              setHighlightCommunity(comm);
              setHighlightUni(uni);
              setIsFormModalOpen(false);
              setIsShareOpen(true);
            }}
            onSuccess={(newMarker) => {
              loadData();
              if (newMarker) {
                setSelectedCommunity(newMarker);
                setHighlightCommunity(newMarker.name);
                const topUni = Object.keys(newMarker.universityDistribution || {})[0] || 'HKU';
                setHighlightUni(topUni);
              }
              // Immediately open the Share Poster when submission completes!
              setIsFormModalOpen(false);
              setIsShareOpen(true);
              setCurrentView('map');
              if (typeof window !== 'undefined') window.location.hash = 'map';
            }}
            onClose={() => {
              setIsFormModalOpen(false);
              setFormInitialCommunity('');
              setCurrentView('map');
              if (typeof window !== 'undefined') window.location.hash = 'map';
            }}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ANALYTICS & STATS MODAL */}
      {/* ========================================================================= */}
      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        lang={lang}
      />

      {/* ========================================================================= */}
      {/* 5. SHARE POSTER & QR CODE MODAL */}
      {/* ========================================================================= */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => {
          setIsShareOpen(false);
          setHighlightCommunity('');
        }}
        lang={lang}
        totalStudents={totalStudents}
        registeredCommunitiesCount={registeredCommunitiesCount}
        highlightCommunity={highlightCommunity}
        highlightUni={highlightUni}
      />

    </main>
  );
}
