'use client';

import React, { useEffect, useState } from 'react';
import { fetchAnalyticsSummary, AnalyticsSummary } from '@/lib/supabase';
import { X, BarChart3, Users, Building, Eye, FileText, CheckCircle, RefreshCw } from 'lucide-react';

import { Language, translations } from '@/lib/i18n';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ isOpen, onClose, lang }) => {
  const t = translations[lang];
  const [data, setData] = useState<AnalyticsSummary>({
    map_opened: 0,
    form_opened: 0,
    form_completed: 0,
    total_students: 0,
    total_communities: 0,
  });
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    setLoading(true);
    const res = await fetchAnalyticsSummary();
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadStats();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const conversionRate = data.form_opened > 0
    ? Math.round((data.form_completed / data.form_opened) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="zen-card w-full max-w-md bg-white border border-[#E8E8E4] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F0EC] bg-[#FAFAF8]">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#2D3A34]" />
            <h3 className="text-sm font-semibold text-[#1C1E21] tracking-tight">
              {t.analyticsModalTitle}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadStats}
              disabled={loading}
              title="刷新数据"
              className="p-1 rounded text-[#7A7E85] hover:text-[#1C1E21] hover:bg-[#EFEFEA] transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-[#7A7E85] hover:text-[#1C1E21] hover:bg-[#EFEFEA] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4">
          {/* Top Live Counters */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-[#F9F9F7] rounded-xl border border-[#EEEEEC] flex flex-col">
              <span className="text-[11px] text-[#7A7E85] font-medium flex items-center gap-1">
                <Users className="w-3 h-3 text-[#2D3A34]" /> {t.analyticsLiveStudents}
              </span>
              <div className="text-2xl font-bold text-[#1C1E21] mt-1">
                {data.total_students}
              </div>
            </div>

            <div className="p-4 bg-[#F9F9F7] rounded-xl border border-[#EEEEEC] flex flex-col">
              <span className="text-[11px] text-[#7A7E85] font-medium flex items-center gap-1">
                <Building className="w-3 h-3 text-[#2D3A34]" /> {t.analyticsCoveredCommunities}
              </span>
              <div className="text-2xl font-bold text-[#1C1E21] mt-1">
                {data.total_communities}
              </div>
            </div>
          </div>

          {/* Interaction Flow Analytics */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#F0F0EC]">
            <span className="text-[11px] font-semibold text-[#6E727A] uppercase tracking-wider">
              {t.analyticsFunnelTitle}
            </span>

            <div className="flex flex-col gap-2 text-xs">
              {/* Metric 1: Map Opened */}
              <div className="flex items-center justify-between p-3 bg-white border border-[#E8E8E4] rounded-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-[#F4F4F0] flex items-center justify-center text-[#4A4E57]">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-[#1C1E21]">{t.analyticsMapOpened}</span>
                    <span className="text-[10px] text-[#9A9EA6]">{t.analyticsMapOpenedSub}</span>
                  </div>
                </div>
                <span className="font-bold text-[#1C1E21] text-sm">
                  {data.map_opened}
                </span>
              </div>

              {/* Metric 2: Form Opened */}
              <div className="flex items-center justify-between p-3 bg-white border border-[#E8E8E4] rounded-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-[#F4F4F0] flex items-center justify-center text-[#4A4E57]">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-[#1C1E21]">{t.analyticsFormOpened}</span>
                    <span className="text-[10px] text-[#9A9EA6]">{t.analyticsFormOpenedSub}</span>
                  </div>
                </div>
                <span className="font-bold text-[#1C1E21] text-sm">
                  {data.form_opened}
                </span>
              </div>

              {/* Metric 3: Form Completed */}
              <div className="flex items-center justify-between p-3 bg-white border border-[#E8E8E4] rounded-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-[#EBF3EE] flex items-center justify-center text-[#21573B]">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-[#1C1E21]">{t.analyticsFormCompleted}</span>
                    <span className="text-[10px] text-[#9A9EA6]">{t.analyticsFormCompletedSub}</span>
                  </div>
                </div>
                <span className="font-bold text-[#21573B] text-sm">
                  {data.form_completed}
                </span>
              </div>

              {/* Metric 4: Conversion Rate */}
              <div className="flex items-center justify-between p-3 bg-[#FAFAF8] border border-[#E8E8E4] rounded-lg mt-1">
                <span className="text-xs text-[#6E727A]">{t.analyticsConversionRate}</span>
                <span className="text-xs font-bold text-[#2D3A34]">
                  {conversionRate}%
                </span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#9A9EA6] text-center pt-1">
            {t.analyticsDatabaseNotice}
          </p>
        </div>
      </div>
    </div>
  );
};
