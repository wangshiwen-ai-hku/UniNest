'use client';

import React from 'react';

/**
 * Compact, charming hand-drawn sketch banner
 */
export const HeroSketchBanner: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`relative w-full bg-[#FAF7EE] border-2 border-[#1E293B] rounded-2xl p-3 shadow-sketch ${className}`}
      style={{
        borderRadius: '20px 8px 18px 8px',
      }}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left Text Intro */}
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FEF08A] border border-[#1E293B] rounded-full text-[10px] font-black text-[#1E293B] mb-1">
            <span>✨ 港硕深住 · 双城租房</span>
          </div>
          <h2 className="text-xs sm:text-sm font-black text-[#1E293B] leading-tight truncate">
            用真实校友足迹，点亮深圳每个角落 🏡
          </h2>
          <p className="text-[10px] text-[#64748B] font-bold mt-0.5 leading-tight">
            100% 港校学生认证 · 租金透明 · 口岸通勤避坑
          </p>
        </div>

        {/* Right Compact Doodle SVG */}
        <div className="shrink-0 w-24 h-16 relative flex items-center justify-center">
          <svg
            viewBox="0 0 120 80"
            width="100"
            height="65"
            style={{ maxWidth: '100px', maxHeight: '65px' }}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ground */}
            <path d="M 5 72 Q 60 70 115 72" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />

            {/* Building 1 */}
            <rect x="15" y="25" width="20" height="47" rx="2" fill="#E0F2FE" stroke="#1E293B" strokeWidth="1.8" />
            <line x1="20" y1="35" x2="24" y2="35" stroke="#1E293B" strokeWidth="1.5" />
            <line x1="26" y1="35" x2="30" y2="35" stroke="#1E293B" strokeWidth="1.5" />
            <line x1="20" y1="46" x2="24" y2="46" stroke="#1E293B" strokeWidth="1.5" />
            <line x1="26" y1="46" x2="30" y2="46" stroke="#1E293B" strokeWidth="1.5" />

            {/* House with roof */}
            <polygon points="38,40 50,26 62,40" fill="#FEF08A" stroke="#1E293B" strokeWidth="1.8" />
            <rect x="40" y="40" width="22" height="32" fill="#FEF9C3" stroke="#1E293B" strokeWidth="1.8" />
            <rect x="46" y="48" width="10" height="10" fill="#FAF7EE" stroke="#1E293B" strokeWidth="1.2" />

            {/* Train */}
            <rect x="68" y="50" width="38" height="22" rx="4" fill="#BBF7D0" stroke="#1E293B" strokeWidth="1.8" />
            <rect x="73" y="55" width="8" height="8" rx="1" fill="#FAF7EE" stroke="#1E293B" strokeWidth="1.2" />
            <rect x="85" y="55" width="8" height="8" rx="1" fill="#FAF7EE" stroke="#1E293B" strokeWidth="1.2" />
            <circle cx="78" cy="72" r="2.5" fill="#1E293B" />
            <circle cx="96" cy="72" r="2.5" fill="#1E293B" />

            {/* Sparkle Sun */}
            <path
              d="M 100 16 L 102 10 L 104 16 L 110 18 L 104 20 L 102 26 L 100 20 L 94 18 Z"
              fill="#FDE047"
              stroke="#1E293B"
              strokeWidth="1"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export const VerifiedStudentStampDoodle: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'md' }) => {
  return (
    <div className="verified-stamp text-[11px] font-black select-none inline-flex items-center gap-1 px-2.5 py-1">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
      <span>100% 港校学生认证</span>
    </div>
  );
};
