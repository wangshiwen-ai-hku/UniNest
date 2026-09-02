'use client';

import React, { useState, useEffect } from 'react';
import { X, Copy, Check, QrCode, Share2, Sparkles, ShieldCheck } from 'lucide-react';
import { Language, translations } from '@/lib/i18n';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  totalStudents: number;
  registeredCommunitiesCount: number;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  lang,
  totalStudents,
  registeredCommunitiesCount,
}) => {
  const t = translations[lang];
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.origin);
    }
  }, []);

  if (!isOpen) return null;

  // Use crisp, dynamic QR code image URL encoded with the current site URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=12&data=${encodeURIComponent(
    currentUrl || 'https://uninest.app'
  )}&color=21-87-59`;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="zen-card w-full max-w-sm bg-white rounded-3xl border border-[#E8E8E4] shadow-2xl overflow-hidden p-6 sm:p-7 flex flex-col gap-5 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#21573B]" />
            <span className="text-sm font-semibold text-[#1C1E21] tracking-tight">
              {lang === 'en' ? 'Share & Invite Alumni' : '分享海报 · 邀请校友点亮'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F4F4F0] hover:bg-[#EAEAE5] text-[#6E727A] flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Shareable Card / Poster Body */}
        <div className="p-5 rounded-2xl bg-[#F7F7F5] border border-[#E4E4DF] flex flex-col items-center text-center gap-4">
          
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-bold tracking-wider text-[#21573B] uppercase">
              UniNest · 广厦
            </span>
            <h3 className="text-base font-bold text-[#1C1E21]">
              港硕深住 · 同学校友租房透明地图
            </h3>
            <p className="text-[11px] text-[#7A7E85]">
              100% 港校学生邮箱认证 · 一人一票去重
            </p>
          </div>

          {/* QR Code Container */}
          <div className="relative p-3 bg-white rounded-2xl border border-[#E2E2DC] shadow-sm flex items-center justify-center">
            <img
              src={qrCodeUrl}
              alt="Scan to open UniNest"
              className="w-44 h-44 rounded-lg object-contain"
            />
            {/* Center Logo Dot */}
            <div className="absolute inset-0 m-auto w-9 h-9 rounded-xl bg-[#21573B] text-white flex items-center justify-center shadow-md border-2 border-white">
              <span className="text-xs font-bold tracking-tight">港</span>
            </div>
          </div>

          {/* Live Stats Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#DCE2DC] text-[11px] text-[#555] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#21573B] animate-pulse" />
            <span>
              已入驻 <strong>{totalStudents}</strong> 位校友 · 覆盖 <strong>{registeredCommunitiesCount}</strong> 个小区
            </span>
          </div>

          <p className="text-[10px] text-[#9A9EA6]">
            {lang === 'en' ? 'Long press to save or scan via WeChat' : '长按保存或微信扫码打开'}
          </p>
        </div>

        {/* Copy Link & Action Bar */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={currentUrl}
            className="flex-1 px-3 py-2 text-xs bg-[#F7F7F5] border border-[#E8E8E4] rounded-xl text-[#6E727A] outline-none"
          />
          <button
            onClick={handleCopyLink}
            className="px-3.5 py-2 rounded-xl bg-[#21573B] hover:bg-[#1B4730] text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>已复制</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>复制链接</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
