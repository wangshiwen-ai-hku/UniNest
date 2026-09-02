'use client';

import React from 'react';
import { Language } from '@/lib/i18n';

interface LanguageSwitcherProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLang,
  onLanguageChange,
}) => {
  const options: { code: Language; label: string }[] = [
    { code: 'zh-CN', label: '简' },
    { code: 'zh-TW', label: '繁' },
    { code: 'en', label: 'EN' },
  ];

  return (
    <div className="inline-flex items-center rounded-lg border border-[#E8E8E4] bg-white p-0.5 shadow-sm">
      {options.map((opt) => {
        const isActive = currentLang === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => onLanguageChange(opt.code)}
            className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
              isActive
                ? 'bg-[#2D3A34] text-white'
                : 'text-[#6E727A] hover:text-[#1C1E21] hover:bg-[#F9F9F7]'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
