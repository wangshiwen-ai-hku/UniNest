'use client';

import React from 'react';
import { UNIVERSITY_LIST, Language, translations } from '@/lib/i18n';

interface UniversityFilterProps {
  selectedUni: string;
  onSelectUni: (uniCode: string) => void;
  lang: Language;
  stats?: Record<string, number>;
}

export const UniversityFilter: React.FC<UniversityFilterProps> = ({
  selectedUni,
  onSelectUni,
  lang,
  stats = {},
}) => {
  const t = translations[lang];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs text-[#6E727A]">
        <span className="font-medium">高校生源筛选</span>
        {selectedUni !== 'ALL' && (
          <button
            onClick={() => onSelectUni('ALL')}
            className="text-[11px] text-[#2D3A34] hover:underline cursor-pointer font-medium"
          >
            重置全部 ↺
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => onSelectUni('ALL')}
          className={`px-2.5 py-1 text-xs rounded-lg border transition-all cursor-pointer font-medium ${
            selectedUni === 'ALL'
              ? 'bg-[#2D3A34] text-white border-[#2D3A34]'
              : 'bg-white text-[#4A4E57] border-[#E4E4E0] hover:bg-[#F9F9F7]'
          }`}
        >
          全部高校
        </button>

        {UNIVERSITY_LIST.map((uni) => {
          const isSelected = selectedUni === uni.code;
          const count = stats[uni.code];

          return (
            <button
              key={uni.code}
              onClick={() => onSelectUni(uni.code)}
              className={`px-2.5 py-1 text-xs rounded-lg border transition-all flex items-center gap-1 cursor-pointer font-medium ${
                isSelected
                  ? 'bg-[#2D3A34] text-white border-[#2D3A34]'
                  : 'bg-white text-[#4A4E57] border-[#E4E4E0] hover:bg-[#F9F9F7]'
              }`}
            >
              <span>{uni.code}</span>
              {count !== undefined && count > 0 && (
                <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-[#9A9EA6]'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
