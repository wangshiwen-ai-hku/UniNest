'use client';

import React from 'react';
import { CommunityMarker } from '@/lib/mockData';
import { Language, translations } from '@/lib/i18n';
import { Train, Users, ArrowUpRight } from 'lucide-react';

interface LeaderboardProps {
  communities: CommunityMarker[];
  selectedCommunityId?: string;
  onSelectCommunity: (community: CommunityMarker) => void;
  lang: Language;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  communities,
  selectedCommunityId,
  onSelectCommunity,
  lang,
}) => {
  const t = translations[lang];

  const topList = [...communities]
    .sort((a, b) => b.totalStudents - a.totalStudents)
    .slice(0, 5);

  if (topList.length === 0) return null;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-[#1C1E21] tracking-tight">
          {t.popularCommunities}
        </h3>
        <span className="text-[11px] text-[#9A9EA6]">
          {t.popularCommunitiesSub}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {topList.map((comm, idx) => {
          const isSelected = selectedCommunityId === comm.id;
          
          return (
            <div
              key={comm.id}
              onClick={() => onSelectCommunity(comm)}
              className={`p-3 rounded-xl border transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-[#F9FAF9] border-[#2D3A34] shadow-sm'
                  : 'bg-white border-[#E8E8E4] hover:border-[#D0D0CA] hover:bg-[#FCFCFA]'
              }`}
            >
              {/* Header: Index + Title + Count */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-[#8A8E96] w-4 text-center">
                    0{idx + 1}
                  </span>
                  <span className="font-semibold text-xs text-[#1C1E21] truncate">
                    {comm.name}
                  </span>
                </div>

                <span className={`text-[11px] font-medium px-2 py-0.5 rounded text-right shrink-0 ${
                  comm.totalStudents > 0
                    ? 'text-[#2D3A34] bg-[#F2F5F3]'
                    : 'text-[#7A7E85] bg-[#F4F4F0]'
                }`}>
                  {comm.totalStudents > 0 ? t.registeredCount(comm.totalStudents) : '待点亮'}
                </span>
              </div>

              {/* Metrics: Rent & Commute */}
              <div className="flex items-center justify-between text-[11px] text-[#6E727A] pt-2 mt-2 border-t border-[#F0F0EC]">
                <div className="flex items-baseline gap-1">
                  <span>{t.referenceRent}</span>
                  <span className="font-semibold text-[#1C1E21]">
                    ¥{comm.avgRent}
                  </span>
                  <span className="text-[10px] text-[#9A9EA6]">/{lang === 'en' ? 'mo' : '月'}</span>
                </div>

                <div className="flex items-center gap-1 text-[11px]">
                  <span>{comm.nearestPort.split(' ')[0]}</span>
                  <span className="text-[#9A9EA6]">·</span>
                  <span>~{comm.commuteMinutes}{t.minutes}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
