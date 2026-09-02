import React, { useEffect, useRef, useState, useMemo } from 'react';
import { loadAMapSDK, createHandDrawnMarkerContent, createPortMarkerContent, createAreaLabelContent } from '@/lib/amap';
import { CommunityMarker } from '@/lib/mockData';
import { BORDER_PORTS, HOT_LIVING_AREAS } from '@/lib/mapFeatures';
import { HIGHLIGHT_TRANSIT_ROUTES, estimateDoorToDoorCommute, STATIC_UNI_COMMUTE_RULES } from '@/lib/transitData';
import { Language, translations } from '@/lib/i18n';
import { UNIVERSITY_THEMES } from '@/lib/universityThemes';
import {
  MapPin,
  Train,
  Plus,
  Minus,
  Navigation,
  Quote,
  X,
  Compass,
  Building2,
  Sparkles,
  Route,
  Clock,
  ArrowRight,
  ShieldCheck,
  Footprints
} from 'lucide-react';

interface MapProps {
  communities: CommunityMarker[];
  selectedCommunity: CommunityMarker | null;
  onSelectCommunity: (community: CommunityMarker | null) => void;
  selectedUni: string;
  lang: Language;
  onOpenForm?: (initialCommunityName?: string) => void;
}

export const MapComponent: React.FC<MapProps> = ({
  communities,
  selectedCommunity,
  onSelectCommunity,
  selectedUni,
  lang,
  onOpenForm,
}) => {
  const t = translations[lang];
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const portMarkersRef = useRef<any[]>([]);
  const areaOverlaysRef = useRef<any[]>([]);
  const routeOverlaysRef = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showTransitRoutes, setShowTransitRoutes] = useState(true);

  // Commute calculator active university target (default to selectedUni or HKU)
  const [commuteUni, setCommuteUni] = useState<string>(selectedUni === 'ALL' ? 'HKU' : selectedUni);

  // Sync commute target when selectedUni changes
  useEffect(() => {
    if (selectedUni !== 'ALL') {
      setCommuteUni(selectedUni);
    }
  }, [selectedUni]);

  // Filtered communities based on active university filter
  const filteredCommunities = useMemo(() => {
    if (selectedUni === 'ALL') return communities;
    return communities.filter((c) => {
      if (c.totalStudents === 0) return true; // Keep candidate presets visible for orientation
      return Boolean(c.universityDistribution && c.universityDistribution[selectedUni]);
    });
  }, [communities, selectedUni]);

  // Initialize AMap 2.0
  useEffect(() => {
    let isMounted = true;

    async function initAMap() {
      try {
        const AMap = await loadAMapSDK();
        if (!isMounted || !mapContainerRef.current) return;

        const map = new AMap.Map(mapContainerRef.current, {
          zoom: 12.5,
          center: [114.055, 22.535],
          mapStyle: 'amap://styles/whitesmoke', // Clean, understated light map style
          viewMode: '2D',
          showLabel: true,
          showIndoorMap: false,
        });

        mapInstanceRef.current = map;
        setMapLoaded(true);
      } catch (err) {
        console.warn('AMap initialization failed:', err);
      }
    }

    initAMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Render Hot Areas, Border Ports, and High-Speed Transit Routes
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded || typeof window === 'undefined') return;
    const AMap = (window as any).AMap;
    if (!AMap) return;

    // Clear previous area & port overlays
    areaOverlaysRef.current.forEach((o) => mapInstanceRef.current.remove(o));
    areaOverlaysRef.current = [];
    portMarkersRef.current.forEach((p) => mapInstanceRef.current.remove(p));
    portMarkersRef.current = [];

    const newOverlays: any[] = [];
    const newPortMarkers: any[] = [];

    // 1. Render subtle soft-tinted Circles for Hot Living Areas
    HOT_LIVING_AREAS.forEach((area) => {
      const circle = new AMap.Circle({
        center: new AMap.LngLat(area.center[0], area.center[1]),
        radius: area.radius,
        fillColor: area.fillColor,
        fillOpacity: 0.07,
        strokeColor: area.strokeColor,
        strokeOpacity: 0.35,
        strokeWeight: 1.5,
        strokeStyle: 'dashed',
        strokeDasharray: [6, 6],
        zIndex: 10,
        bubble: true,
      });

      // Area label badge marker
      const labelMarker = new AMap.Marker({
        position: new AMap.LngLat(area.center[0], area.center[1] + (area.radius / 111000) * 0.85),
        content: createAreaLabelContent(
          lang === 'en' ? area.nameEn : area.name,
          lang === 'en' ? area.badgeEn : area.badge,
          area.fillColor
        ),
        offset: new AMap.Pixel(-90, -14),
        zIndex: 12,
      });

      mapInstanceRef.current.add(circle);
      mapInstanceRef.current.add(labelMarker);
      newOverlays.push(circle, labelMarker);
    });

    // 2. Render Border Ports Markers
    BORDER_PORTS.forEach((port) => {
      const portMarker = new AMap.Marker({
        position: new AMap.LngLat(port.lng, port.lat),
        content: createPortMarkerContent(
          lang === 'en' ? port.nameEn : port.name,
          lang === 'en' ? port.subEn : port.sub,
          lang === 'en' ? port.tagEn : port.tag
        ),
        offset: new AMap.Pixel(-85, -42),
        zIndex: 25,
      });

      portMarker.on('click', () => {
        mapInstanceRef.current.setZoomAndCenter(14.5, [port.lng, port.lat]);
      });

      mapInstanceRef.current.add(portMarker);
      newPortMarkers.push(portMarker);
    });

    areaOverlaysRef.current = newOverlays;
    portMarkersRef.current = newPortMarkers;
  }, [mapLoaded, lang]);

  // Render Highlighted Metro & Bus Transit Lines
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded || typeof window === 'undefined') return;
    const AMap = (window as any).AMap;
    if (!AMap) return;

    // Clear previous routes
    routeOverlaysRef.current.forEach((r) => mapInstanceRef.current.remove(r));
    routeOverlaysRef.current = [];

    if (!showTransitRoutes) return;

    const newRouteObjects: any[] = [];

    HIGHLIGHT_TRANSIT_ROUTES.forEach((route) => {
      const linePath = route.stops.map((s) => new AMap.LngLat(s.coord[0], s.coord[1]));

      const polyline = new AMap.Polyline({
        path: linePath,
        isOutline: true,
        outlineColor: '#FFFFFF',
        borderWeight: 1.5,
        strokeColor: route.color,
        strokeOpacity: route.opacity,
        strokeWeight: route.weight,
        strokeStyle: route.dashArray ? 'dashed' : 'solid',
        strokeDasharray: route.dashArray,
        lineJoin: 'round',
        lineCap: 'round',
        zIndex: 15,
      });

      // Subtle Line Name Badge Marker on route midpoint
      const midIndex = Math.floor(route.stops.length / 2);
      const midStop = route.stops[midIndex];
      const labelContent = `
        <div style="
          background: ${route.color};
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 600;
          padding: 2px 7px;
          border-radius: 9999px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
          white-space: nowrap;
          opacity: 0.9;
          letter-spacing: 0.3px;
        ">
          ${lang === 'en' ? route.nameEn.split('(')[0] : route.name.split(' ')[1] || route.name}
        </div>
      `;

      const routeLabel = new AMap.Marker({
        position: new AMap.LngLat(midStop.coord[0], midStop.coord[1]),
        content: labelContent,
        offset: new AMap.Pixel(-30, -10),
        zIndex: 16,
      });

      mapInstanceRef.current.add(polyline);
      mapInstanceRef.current.add(routeLabel);
      newRouteObjects.push(polyline, routeLabel);
    });

    routeOverlaysRef.current = newRouteObjects;
  }, [mapLoaded, showTransitRoutes, lang]);

  // Update AMap Community Markers whenever filtered communities or selection changes
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded || typeof window === 'undefined') return;
    const AMap = (window as any).AMap;
    if (!AMap) return;

    // Clear previous community markers
    markersRef.current.forEach((m) => mapInstanceRef.current.remove(m));
    markersRef.current = [];

    const newMarkers: any[] = [];
    filteredCommunities.forEach((comm) => {
      const topUni = Object.entries(comm.universityDistribution || {})
        .sort(([, a], [, b]) => b - a)[0]?.[0] || 'HKU';

      const isSelected = selectedCommunity?.id === comm.id || selectedCommunity?.name === comm.name;
      const isPreset = Boolean(comm.isPreset && comm.totalStudents === 0);

      const markerContent = createHandDrawnMarkerContent(
        comm.name,
        comm.totalStudents,
        comm.avgRent,
        topUni,
        isSelected,
        isPreset
      );

      const marker = new AMap.Marker({
        position: new AMap.LngLat(comm.lng, comm.lat),
        content: markerContent,
        offset: new AMap.Pixel(-70, -32),
        zIndex: isSelected ? 35 : isPreset ? 18 : 22,
        extData: { community: comm },
      });

      marker.on('click', () => {
        onSelectCommunity(comm);
        mapInstanceRef.current.setZoomAndCenter(15, [comm.lng, comm.lat]);
      });

      mapInstanceRef.current.add(marker);
      newMarkers.push(marker);
    });

    markersRef.current = newMarkers;

    // Auto fit view on initial load or if selection is cleared
    if (newMarkers.length > 0 && !selectedCommunity) {
      const activeMarkers = newMarkers.filter((m) => {
        const c = m.getExtData()?.community;
        return c && c.totalStudents > 0;
      });

      const targetsToFit = activeMarkers.length > 0 ? activeMarkers : newMarkers;
      mapInstanceRef.current.setFitView(targetsToFit, false, [80, 80, 80, 80], 14);
    }
  }, [filteredCommunities, selectedCommunity, mapLoaded, onSelectCommunity]);

  // Handle map controls
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleResetView = () => {
    onSelectCommunity(null);
    if (mapInstanceRef.current) {
      const activeMarkers = markersRef.current.filter((m) => {
        const c = m.getExtData()?.community;
        return c && c.totalStudents > 0;
      });
      if (activeMarkers.length > 0) {
        mapInstanceRef.current.setFitView(activeMarkers, false, [80, 80, 80, 80], 14);
      } else {
        mapInstanceRef.current.setZoomAndCenter(12.5, [114.055, 22.535]);
      }
    }
  };

  // Compute Door-to-Door commute estimate for selected community
  const commuteEstimate = useMemo(() => {
    if (!selectedCommunity) return null;
    return estimateDoorToDoorCommute(
      selectedCommunity.commuteMinutes || 15,
      selectedCommunity.nearestPort || '福田口岸',
      commuteUni
    );
  }, [selectedCommunity, commuteUni]);

  return (
    <div className="relative w-full h-full bg-[#F7F7F5] overflow-hidden select-none">
      {/* Real AMap Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full"
      />

      {/* Loading Screen */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-[#F7F7F5] flex flex-col items-center justify-center gap-3 z-30">
          <div className="w-8 h-8 border-2 border-[#E4E4E0] border-t-[#2D3A34] rounded-full animate-spin" />
          <span className="text-xs tracking-wider text-[#6E727A]">{t.loadingMapText}</span>
        </div>
      )}

      {/* Clean Zoom & Transit Controls (Floating bottom right) */}
      <div className="absolute bottom-8 right-6 z-20 flex flex-col gap-1.5 pointer-events-auto">
        {/* Transit Routes Toggle */}
        <button
          onClick={() => setShowTransitRoutes(!showTransitRoutes)}
          className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all mb-1 ${
            showTransitRoutes
              ? 'bg-[#1C1E21] text-white border-[#1C1E21]'
              : 'bg-white/90 backdrop-blur-sm text-[#555] border-[#E4E4E0] hover:bg-white'
          }`}
          title="切换深港地铁与大巴高亮路线"
        >
          <Route className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{lang === 'en' ? 'Transit' : '交通动线'}</span>
        </button>

        <button
          onClick={handleZoomIn}
          className="w-9 h-9 rounded-lg bg-white/90 backdrop-blur-sm border border-[#E4E4E0] hover:bg-white text-[#1C1E21] flex items-center justify-center shadow-sm transition-all"
          title={t.zoomInTitle}
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-9 h-9 rounded-lg bg-white/90 backdrop-blur-sm border border-[#E4E4E0] hover:bg-white text-[#1C1E21] flex items-center justify-center shadow-sm transition-all"
          title={t.zoomOutTitle}
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetView}
          className="w-9 h-9 rounded-lg bg-white/90 backdrop-blur-sm border border-[#E4E4E0] hover:bg-white text-[#1C1E21] flex items-center justify-center shadow-sm transition-all mt-1"
          title={t.resetViewTitle}
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* Selected Community InfoWindow Overlay (Ji Hotel Zen Card) */}
      {selectedCommunity && (
        <div className="absolute top-6 right-6 w-[calc(100vw-32px)] sm:w-[410px] max-w-full z-30 zen-card bg-white/95 backdrop-blur-xl border border-[#E4E4E0] p-5 sm:p-6 rounded-3xl flex flex-col gap-4 max-h-[86vh] overflow-y-auto shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-[#1C1E21] tracking-tight">
                {selectedCommunity.name}
              </h3>
              <p className="text-xs text-[#7B8089] mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#9A9EA6]" />
                {selectedCommunity.address}
              </p>
            </div>

            <button
              onClick={() => onSelectCommunity(null)}
              className="w-7 h-7 rounded-full bg-[#F4F4F0] hover:bg-[#EBEBE6] text-xs text-[#555] flex items-center justify-center shrink-0 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Key Metrics Strip (Zen minimal) */}
          <div className="flex items-end justify-between p-3.5 bg-[#F9F9F7] rounded-2xl border border-[#EEEEEC]">
            <div>
              <span className="text-[11px] font-medium text-[#7A7E85]">{t.referenceRent}</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold text-[#1C1E21]">
                  ¥{selectedCommunity.avgRent}
                </span>
                <span className="text-xs text-[#9A9EA6]">/{lang === 'en' ? 'mo' : '月'}</span>
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <div className="flex items-center gap-1 text-xs font-semibold text-[#2D3A34]">
                <Train className="w-3.5 h-3.5 text-[#304138]" />
                <span>~{selectedCommunity.commuteMinutes} {t.minutes}</span>
              </div>
              <span className="text-[10px] text-[#7A7E85] mt-0.5">
                {t.commuteToPort(selectedCommunity.nearestPort)}
              </span>
            </div>
          </div>

          {/* 🎓 Door-to-Door Commute Estimation Engine */}
          <div className="p-4 bg-[#F8FAF8] rounded-2xl border border-[#E0E8E2] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#21573B]" />
                <span className="text-xs font-bold text-[#1C1E21]">{t.commuteCalcTitle}</span>
              </div>
              {commuteEstimate && (
                <div className="text-xs font-bold text-[#21573B] bg-[#EAF3EC] px-2.5 py-0.5 rounded-full">
                  ~{commuteEstimate.totalTimeMin}-{commuteEstimate.totalTimeMax} {t.minutes}
                </div>
              )}
            </div>

            {/* Target University Selector Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
              {Object.keys(STATIC_UNI_COMMUTE_RULES).map((uniCode) => {
                const isActive = commuteUni === uniCode;
                const theme = UNIVERSITY_THEMES[uniCode];
                return (
                  <button
                    key={uniCode}
                    type="button"
                    onClick={() => setCommuteUni(uniCode)}
                    style={isActive ? { backgroundColor: theme?.primaryColor || '#21573B', color: '#FFF' } : {}}
                    className={`px-2.5 py-1 text-[11px] rounded-lg font-medium shrink-0 transition-all ${
                      isActive
                        ? 'shadow-2xs scale-[1.02]'
                        : 'bg-white text-[#5F6368] border border-[#E2E6E2] hover:bg-[#F2F4F2]'
                    }`}
                  >
                    {uniCode}
                  </button>
                );
              })}
            </div>

            {/* Door-to-Door 3-Step Ladder Breakdown */}
            {commuteEstimate && (
              <div className="flex flex-col gap-2 pt-1">
                {commuteEstimate.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs">
                    <div className="w-5 h-5 rounded-full bg-white border border-[#D5E0D8] text-[#21573B] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#1C1E21]">{step.title}</span>
                        <span className="font-medium text-[#21573B] text-[11px]">{step.timeText}</span>
                      </div>
                      <p className="text-[11px] text-[#6E727A] leading-snug mt-0.5">{step.detail}</p>
                    </div>
                  </div>
                ))}

                {/* Practical Commute Tip */}
                <div className="mt-1 p-2.5 bg-white rounded-xl border border-[#E5EDE7] text-[11px] text-[#4E5651] leading-relaxed">
                  💡 <strong>{lang === 'en' ? 'Tip' : '通学贴士'}：</strong>
                  {STATIC_UNI_COMMUTE_RULES[commuteUni]?.customTips}
                </div>
              </div>
            )}
          </div>

          {/* If Preset Community with 0 students: Call To Action to Pioneer and Light Up */}
          {selectedCommunity.totalStudents === 0 ? (
            <div className="flex flex-col gap-3 py-1">
              <div className="p-3.5 bg-[#F9FAF9] rounded-xl border border-[#D5DDD8] text-xs text-[#2D3A34] flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-xs text-[#21573B]">
                  <Sparkles className="w-4 h-4 text-[#21573B]" />
                  <span>虚位以待 · 成为首位点亮校友</span>
                </div>
                <p className="text-[11px] text-[#555E59] leading-relaxed">
                  {selectedCommunity.description || '该小区为深港跨境热选居住圈，目前尚无校友提交。一人一票，抢先留下你的入住心得！'}
                </p>
              </div>

              {onOpenForm && (
                <button
                  onClick={() => onOpenForm(selectedCommunity.name)}
                  className="zen-button-primary w-full py-3 text-xs flex items-center justify-center gap-2 shadow-sm mt-1"
                >
                  <span>📝 抢先登记点亮此小区</span>
                </button>
              )}
            </div>
          ) : (
            /* If Community Has Real Submissions: Show live stats & reviews */
            <>
              {/* Visual Distribution Charts */}
              <div className="flex flex-col gap-3.5 text-xs">
                {/* University Distribution */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[#6E727A]">
                    <span>{t.uniDistributionTitle}</span>
                    <span className="text-[11px] text-[#9A9EA6]">{t.registeredCount(selectedCommunity.totalStudents)}</span>
                  </div>
                  <div className="flex h-2 w-full rounded-full overflow-hidden bg-[#EEEEEC]">
                    {Object.entries(selectedCommunity.universityDistribution || {}).map(([uni, count]) => {
                      const percent = (count / selectedCommunity.totalStudents) * 100;
                      const uniColors: Record<string, string> = {
                        HKU: '#21573B', CUHK: '#6D2034', HKUST: '#1D3B5C', PolyU: '#7D222E', CityU: '#731D33', HKBU: '#194168', LingU: '#852929', EdUHK: '#1B656F'
                      };
                      return (
                        <div
                          key={uni}
                          style={{ width: `${percent}%`, backgroundColor: uniColors[uni] || '#4A505A' }}
                          title={`${uni}: ${count}`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-0.5 text-[11px] text-[#6E727A]">
                    {Object.entries(selectedCommunity.universityDistribution || {}).map(([uni, count]) => {
                      const percent = Math.round((count / selectedCommunity.totalStudents) * 100);
                      return (
                        <span key={uni} className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1C1E21]" />
                          {uni} <span className="text-[#9A9EA6]">{percent}%</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Rental Types */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[#6E727A]">{t.rentalTypeSplitTitle}</span>
                  <div className="flex h-2 w-full rounded-full overflow-hidden bg-[#EEEEEC]">
                    <div style={{ width: `${selectedCommunity.rentalTypes.shared}%`, backgroundColor: '#304138' }} />
                    <div style={{ width: `${selectedCommunity.rentalTypes.entire}%`, backgroundColor: '#7B8880' }} />
                  </div>
                  <div className="flex gap-4 text-[11px] text-[#7A7E85]">
                    <span>{t.rentTypeShared} {selectedCommunity.rentalTypes.shared}%</span>
                    <span>{t.rentTypeEntire} {selectedCommunity.rentalTypes.entire}%</span>
                  </div>
                </div>
              </div>

              {/* Student Reviews */}
              <div className="flex flex-col gap-2 pt-1 border-t border-[#F0F0EC]">
                <span className="text-xs font-semibold text-[#1C1E21]">{t.reviewsTitle}</span>
                <div className="flex flex-col gap-2">
                  {selectedCommunity.reviews && selectedCommunity.reviews.length > 0 ? (
                    selectedCommunity.reviews.map((rev, idx) => (
                      <div key={idx} className="p-3 bg-[#F9F9F7] rounded-xl text-xs text-[#2A2E35] leading-relaxed border border-[#EEEEEC]">
                        {rev}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 bg-[#F9F9F7] rounded-xl text-xs text-[#9A9EA6] text-center border border-dashed border-[#E4E4E0]">
                      {t.noReviewsYet}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

        </div>
      )}
    </div>
  );
};
