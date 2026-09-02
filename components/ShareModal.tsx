'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Download, Copy, Check, QrCode, Share2, Sparkles, ShieldCheck, Heart, ExternalLink } from 'lucide-react';
import { Language } from '@/lib/i18n';
import { UNIVERSITY_THEMES } from '@/lib/universityThemes';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  totalStudents: number;
  registeredCommunitiesCount: number;
  highlightCommunity?: string;
  highlightUni?: string;
}

const POSTER_TEXTS = {
  'zh-CN': {
    modalTitle: '专属点亮海报 · 分享校友社群',
    brandName: 'UNINEST · 广厦',
    sloganMain: '港硕深住 · 同学校友租房透明地图',
    sloganSub: '山海同行 · 点亮深港学子在深第一所家',
    verifiedBadge: '100% 港校学生邮箱认证 · 一人一票去重',
    scanHint: '长按保存图片 · 微信扫码直达',
    downloadButton: '一键下载高清海报 (PNG)',
    downloading: '正在生成高清海报...',
    copyLink: '复制链接',
    copied: '已复制链接',
    liveStat: (students: number, comms: number) => `实时已入驻 ${students} 位港校校友 · 覆盖 ${comms} 个小区`,
    litUpTitle: (comm: string) => `✨ 已点亮 ${comm}`,
    uniAlliance: '香港八大公立高校深港互助联盟',
    appUrlDisplay: 'uninest.aurahk.me',
  },
  'zh-TW': {
    modalTitle: '專屬點亮海報 · 分享校友社群',
    brandName: 'UNINEST · 廣廈',
    sloganMain: '港碩深住 · 同學校友租房透明地圖',
    sloganSub: '山海同行 · 點亮深港學子在深第一所家',
    verifiedBadge: '100% 港校學生電郵認證 · 一人一票去重',
    scanHint: '長按保存圖片 · 微信掃碼直達',
    downloadButton: '一鍵下載高清海報 (PNG)',
    downloading: '正在生成高清海報...',
    copyLink: '複製鏈接',
    copied: '已複製鏈接',
    liveStat: (students: number, comms: number) => `即時已入駐 ${students} 位港校校友 · 覆蓋 ${comms} 個屋苑`,
    litUpTitle: (comm: string) => `✨ 已點亮 ${comm}`,
    uniAlliance: '香港八大公立高校深港互助聯盟',
    appUrlDisplay: 'uninest.aurahk.me',
  },
  'en': {
    modalTitle: 'Share Poster · Invite Alumni',
    brandName: 'UNINEST',
    sloganMain: 'Cross-Border Living Map for HK Students',
    sloganSub: 'Transparent, peer-verified housing across Shenzhen & HK',
    verifiedBadge: '100% Verified HK Student Emails · Zero Fake Agents',
    scanHint: 'Long press to save · Scan with WeChat or Camera',
    downloadButton: 'Download HD Poster (PNG)',
    downloading: 'Generating Poster...',
    copyLink: 'Copy Link',
    copied: 'Link Copied',
    liveStat: (students: number, comms: number) => `${students} Verified Alumni · ${comms} Lit-up Communities`,
    litUpTitle: (comm: string) => `✨ Lighted Up ${comm}`,
    uniAlliance: 'HK Top Universities Cross-Border Alliance',
    appUrlDisplay: 'uninest.aurahk.me',
  },
};

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  lang: initialLang,
  totalStudents,
  registeredCommunitiesCount,
  highlightCommunity,
  highlightUni = 'HKU',
}) => {
  const [activeLang, setActiveLang] = useState<Language>(initialLang);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Synchronize language if initialLang updates
  useEffect(() => {
    setActiveLang(initialLang);
  }, [initialLang]);

  // Target public URL (guaranteed valid for custom domain uninest.aurahk.me)
  const targetUrl = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
    ? window.location.origin
    : 'https://uninest.aurahk.me';

  // Crisp high-resolution server-side proxied QR code URL
  const qrApiUrl = `/api/qrcode?text=${encodeURIComponent(targetUrl)}&size=360x360&color=14-56-37`;

  const pt = POSTER_TEXTS[activeLang];
  const theme = UNIVERSITY_THEMES[highlightUni] || UNIVERSITY_THEMES.HKU;

  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  /**
   * Generate and trigger download of high-resolution 900x1200 poster
   */
  const handleDownloadPoster = async () => {
    setIsGenerating(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 900;
      const height = 1200;
      canvas.width = width;
      canvas.height = height;

      // 1. Draw Master Watercolor Background
      const bgImg = new Image();
      bgImg.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        bgImg.onload = () => resolve();
        bgImg.onerror = () => resolve(); // fallback gracefully
        bgImg.src = '/images/poster_bg.jpg';
      });

      if (bgImg.width > 0) {
        ctx.drawImage(bgImg, 0, 0, width, height);
      } else {
        // Fallback elegant washi paper background
        ctx.fillStyle = '#F7F7F5';
        ctx.fillRect(0, 0, width, height);
      }

      // Soft upper glow overlay to ensure crisp text readability
      const grad = ctx.createLinearGradient(0, 0, 0, 700);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.94)');
      grad.addColorStop(0.6, 'rgba(255, 255, 255, 0.88)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, 700);

      // 2. Header Brand Tag
      ctx.textAlign = 'center';
      ctx.fillStyle = '#21573B';
      ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(pt.brandName, width / 2, 80);

      // 3. Main Slogan
      ctx.fillStyle = '#1C1E21';
      ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(pt.sloganMain, width / 2, 135);

      // 4. Sub Slogan
      ctx.fillStyle = '#6E727A';
      ctx.font = '500 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(pt.sloganSub, width / 2, 175);

      // Optional Lit-up Community Banner
      if (highlightCommunity) {
        ctx.fillStyle = '#21573B';
        ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(pt.litUpTitle(highlightCommunity), width / 2, 225);
      }

      // 5. Center Card for QR Code
      const cardX = (width - 340) / 2;
      const cardY = highlightCommunity ? 260 : 220;
      const cardW = 340;
      const cardH = 390;

      // Draw Card Background with soft shadow
      ctx.fillStyle = 'rgba(255, 255, 255, 0.97)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
      ctx.shadowBlur = 25;
      ctx.shadowOffsetY = 10;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 24);
      ctx.fill();
      ctx.shadowColor = 'transparent'; // reset shadow

      // Draw QR Code Image inside card
      const qrImg = new Image();
      qrImg.crossOrigin = 'anonymous';
      await new Promise<void>((resolve) => {
        qrImg.onload = () => resolve();
        qrImg.onerror = () => resolve();
        qrImg.src = qrApiUrl;
      });

      const qrSize = 250;
      const qrX = (width - qrSize) / 2;
      const qrY = cardY + 28;
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

      // Draw Brand Logo Badge at QR center
      const badgeSize = 44;
      const badgeX = (width - badgeSize) / 2;
      const badgeY = qrY + (qrSize - badgeSize) / 2;
      ctx.fillStyle = '#21573B';
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeSize, badgeSize, 10);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('港', width / 2, badgeY + 29);

      // Verified Trust Slogan under QR code
      ctx.fillStyle = '#1C1E21';
      ctx.font = '600 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(pt.verifiedBadge, width / 2, cardY + 315);

      ctx.fillStyle = '#7A7E85';
      ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(pt.scanHint, width / 2, cardY + 345);

      // 6. Live Stats Ribbon
      const statY = cardY + cardH + 45;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.roundRect((width - 480) / 2, statY - 26, 480, 42, 21);
      ctx.fill();
      ctx.strokeStyle = '#D5DDD7';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#21573B';
      ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(pt.liveStat(totalStudents, registeredCommunitiesCount), width / 2, statY);

      // 7. Footer Alliance & App Domain
      ctx.fillStyle = 'rgba(28, 30, 33, 0.75)';
      ctx.font = '500 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(`🌐 ${pt.appUrlDisplay} · ${pt.uniAlliance}`, width / 2, height - 40);

      // Trigger automatic PNG download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `UniNest-港校深住海报-${activeLang}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error('Failed to generate poster:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="zen-card w-full max-w-md bg-white rounded-3xl border border-[#E8E8E4] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Sticky Top Controls: Title, Language Switcher & Close Button */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F0F0EC] bg-[#FAFAF8] shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#21573B]" />
            <span className="text-xs font-semibold text-[#1C1E21] tracking-tight">
              {pt.modalTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* 3-Language Selector */}
            <div className="flex items-center rounded-lg border border-[#E4E4DF] bg-white p-0.5 text-[11px]">
              {(['zh-CN', 'zh-TW', 'en'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setActiveLang(l)}
                  className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                    activeLang === l
                      ? 'bg-[#21573B] text-white shadow-2xs'
                      : 'text-[#6E727A] hover:text-[#1C1E21]'
                  }`}
                >
                  {l === 'zh-CN' ? '简' : l === 'zh-TW' ? '繁' : 'EN'}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-[#EFEFEA] hover:bg-[#E4E4DF] text-[#6E727A] flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Visual Poster Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col items-center">
          
          {/* Poster Paper Card with Master Collage Artwork */}
          <div className="relative w-full rounded-2xl overflow-hidden shadow-md border border-[#DCE2DC] bg-[#FAF9F6]">
            
            {/* Background Master Graphic Poster Artwork */}
            <img
              src="/images/poster_bg.jpg"
              alt="Shenzhen-Hong Kong Cross-border Map Artwork"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-90"
            />

            {/* Gradient Overlay for Text Clarity */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/85 to-white/40" />

            {/* Poster Content Layer with Generous Bottom Padding */}
            <div className="relative px-4 pt-5 pb-8 sm:px-6 sm:pt-6 sm:pb-9 flex flex-col items-center text-center gap-3">
              
              {/* Header Slogans */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-[11px] font-bold tracking-widest text-[#21573B] uppercase">
                  {pt.brandName}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#1C1E21] leading-tight max-w-xs">
                  {pt.sloganMain}
                </h3>
                <p className="text-[11px] text-[#555E59] font-medium leading-relaxed">
                  {pt.sloganSub}
                </p>

                {highlightCommunity && (
                  <div className="mt-0.5 px-3 py-1 rounded-full bg-[#21573B]/10 border border-[#21573B]/25 text-[#21573B] text-xs font-bold">
                    {pt.litUpTitle(highlightCommunity)}
                  </div>
                )}
              </div>

              {/* Scannable High-Contrast QR Code Card */}
              <div className="relative p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-[#D0DDD4] shadow-md flex flex-col items-center gap-2">
                <div className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-xl overflow-hidden bg-white flex items-center justify-center p-1">
                  <img
                    src={qrApiUrl}
                    alt="Scan to open UniNest"
                    className="w-full h-full object-contain"
                  />
                  {/* Center Brand Logo */}
                  <div className="absolute inset-0 m-auto w-8 h-8 rounded-lg bg-[#21573B] text-white flex items-center justify-center shadow-md border-2 border-white">
                    <span className="text-xs font-bold tracking-tight">港</span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-[11px] font-semibold text-[#1C1E21] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#21573B]" />
                    {pt.verifiedBadge}
                  </span>
                  <span className="text-[10px] text-[#7A7E85]">
                    {pt.scanHint}
                  </span>
                </div>
              </div>

              {/* Live Alumni Count Capsule */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#D0DDD4] text-xs text-[#2D3A34] shadow-xs mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#21573B] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#21573B]"></span>
                </span>
                <span className="font-medium text-[11px]">
                  {pt.liveStat(totalStudents, registeredCommunitiesCount)}
                </span>
              </div>

              {/* Footer Alliance Line (With ample bottom clearance) */}
              <p className="text-[10px] sm:text-[11px] text-[#4F5652] tracking-tight font-medium mt-1">
                {pt.uniAlliance} · {pt.appUrlDisplay}
              </p>

            </div>
          </div>

        </div>

        {/* Sticky Action Footer: 1-Click Download Poster & Copy Link */}
        <div className="p-4 sm:px-5 sm:py-3.5 border-t border-[#F0F0EC] bg-white shrink-0 flex flex-col gap-2 shadow-xs">
          <button
            onClick={handleDownloadPoster}
            disabled={isGenerating}
            className="zen-button-primary w-full py-3 text-xs flex items-center justify-center gap-2 shadow-sm font-semibold tracking-wide"
          >
            {isGenerating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{pt.downloading}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{pt.downloadButton}</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={targetUrl}
              className="flex-1 px-3 py-1.5 text-xs bg-[#F7F7F5] border border-[#E8E8E4] rounded-xl text-[#6E727A] outline-none select-all"
            />
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-1.5 rounded-xl border border-[#21573B] text-[#21573B] hover:bg-[#F2F7F4] text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#21573B]" />
                  <span>{pt.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{pt.copyLink}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
