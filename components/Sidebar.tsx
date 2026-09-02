'use client';

import React, { useState } from 'react';
import { CommunityMarker } from '@/lib/mockData';
import { Language, translations } from '@/lib/i18n';
import { UniversityFilter } from './UniversityFilter';
import { Leaderboard } from './Leaderboard';
import { SubmissionForm } from './SubmissionForm';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Shield, Sparkles, Building, Users, MapPin, X } from 'lucide-react';

interface SidebarProps {
  communities: CommunityMarker[];
  filteredCommunities: CommunityMarker[];
  selectedUni: string;
  onSelectUni: (uni: string) => void;
  selectedCommunityId?: string;
  onSelectCommunity: (comm: CommunityMarker) => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onRefreshData?: () => void;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  communities,
  filteredCommunities,
  selectedUni,
  onSelectUni,
  selectedCommunityId,
  onSelectCommunity,
  lang,
  onLanguageChange,
  onRefreshData,
  onCloseMobile,
}) => {
  const t = translations[lang];
  const [showForm, setShowForm] = useState(false);

  // Calculate live stats
  const totalStudents = communities.reduce((acc, c) => acc + c.totalStudents, 0);

  // Calculate uni counts
  const uniStats: Record<string, number> = {};
  communities.forEach((c) => {
    Object.entries(c.universityDistribution || {}).forEach(([uCode, count]) => {
      uniStats[uCode] = (uniStats[uCode] || 0) + count;
    });
  });

  return (
    <aside className="w-full lg:w-[400px] h-full flex flex-col bg-white border-r border-[#E8E8E4] relative z-20 overflow-hidden select-none">
      {/* Zen Header */}
      <header className="p-4 border-b border-[#F0F0EC] bg-[#FAFAF8] flex flex-col gap-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-[#1C1E21] tracking-tight">
              广厦 · UniNest
            </span>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher currentLang={lang} onLanguageChange={onLanguageChange} />
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="md:hidden p-1 text-[#6E727A] hover:text-[#1C1E21]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Live Counter (Clean Zen Minimal) */}
        <div className="flex items-center justify-between p-2.5 bg-white border border-[#E8E8E4] rounded-lg text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#21573B]" />
            <span className="text-[#6E727A]">
              {t.liveStatsText(totalStudents, communities.filter(c => c.totalStudents > 0).length)}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-1 p-0.5 bg-[#F2F2EE] rounded-lg text-xs">
          <button
            onClick={() => setShowForm(false)}
            className={`py-1.5 font-medium rounded-md transition-all ${
              !showForm
                ? 'bg-white text-[#1C1E21] shadow-sm'
                : 'text-[#6E727A] hover:text-[#1C1E21]'
            }`}
          >
            {t.communityRanking}
          </button>
          <button
            onClick={() => setShowForm(true)}
            className={`py-1.5 font-medium rounded-md transition-all ${
              showForm
                ? 'bg-white text-[#1C1E21] shadow-sm'
                : 'text-[#6E727A] hover:text-[#1C1E21]'
            }`}
          >
            {t.moduleRegisterHousing}
          </button>
        </div>
      </header>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {showForm ? (
          <SubmissionForm
            lang={lang}
            onSuccess={() => {
              setShowForm(false);
              if (onRefreshData) onRefreshData();
            }}
            onClose={() => setShowForm(false)}
          />
        ) : (
          <>
            {/* University Filter */}
            <div className="p-3 bg-[#F9F9F7] border border-[#EEEEEC] rounded-xl">
              <UniversityFilter
                selectedUni={selectedUni}
                onSelectUni={onSelectUni}
                lang={lang}
                stats={uniStats}
              />
            </div>

            {/* Communities list or empty state */}
            {communities.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center gap-2">
                <Building className="w-8 h-8 text-[#C4C4BC] stroke-1" />
                <span className="text-xs font-medium text-[#6E727A]">{t.emptyStateTitle}</span>
                <span className="text-[11px] text-[#9A9EA6] max-w-[220px]">
                  {t.emptySidebarDesc}
                </span>
                <button
                  onClick={() => setShowForm(true)}
                  className="zen-button-primary text-xs px-4 py-2 mt-2"
                >
                  {t.emptyStateAction}
                </button>
              </div>
            ) : (
              <Leaderboard
                communities={filteredCommunities}
                selectedCommunityId={selectedCommunityId}
                onSelectCommunity={onSelectCommunity}
                lang={lang}
              />
            )}

            {/* Verification note */}
            <div className="p-3.5 bg-[#F9F9F7] rounded-xl border border-[#EEEEEC] flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-[#2D3A34] shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#7A7E85] leading-relaxed">
                {t.sidebarNotice}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Subtle Zen Footer */}
      <footer className="px-4 py-3 border-t border-[#F0F0EC] bg-[#FAFAF8] text-[11px] text-[#9A9EA6] flex items-center justify-between shrink-0">
        <span>{t.appName}</span>
        <span>{t.sidebarSlogan}</span>
      </footer>
    </aside>
  );
};
