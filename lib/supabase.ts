import { createClient } from '@supabase/supabase-js';
import { CommunityMarker, MOCK_COMMUNITIES } from './mockData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if valid production supabase credentials are provided
const isConfigured = 
  Boolean(supabaseUrl) && 
  Boolean(supabaseAnonKey) && 
  !supabaseUrl.includes('你的项目ID') &&
  !supabaseAnonKey.includes('你的Anon_Key');

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export interface SubmissionPayload {
  university: string;
  studentEmail: string;
  communityName: string;
  address: string;
  district?: string;
  monthlyRent: number;
  rentalType: 'entire' | 'shared';
  housingSource?: string;
  bedroomCount?: number;
  commuteMinutes?: number;
  nearestPort?: string;
  review?: string;
  lat?: number;
  lng?: number;
}

export interface AnalyticsSummary {
  map_opened: number;
  form_opened: number;
  form_completed: number;
  total_students: number;
  total_communities: number;
}

// In-memory runtime cache for optimistic fallback
let runtimeCommunities: CommunityMarker[] = [...MOCK_COMMUNITIES];

/**
 * Validates if the given email is an authentic Hong Kong university student email.
 */
export function isValidHkStudentEmail(email: string): boolean {
  if (!email) return false;
  const trimmed = email.trim().toLowerCase();
  
  const hkEduPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu\.hk$/;
  const hkuConnectPattern = /^[a-zA-Z0-9._%+-]+@connect\.hku\.hk$/;
  const cuhkLinkPattern = /^[a-zA-Z0-9._%+-]+@link\.cuhk\.edu\.hk$/;
  const polyuConnectPattern = /^[a-zA-Z0-9._%+-]+@connect\.polyu\.hk$/;
  const ustPattern = /^[a-zA-Z0-9._%+-]+@(connect\.)?ust\.hk$/;
  const cityuPattern = /^[a-zA-Z0-9._%+-]+@my\.cityu\.edu\.hk$/;
  const hkbuPattern = /^[a-zA-Z0-9._%+-]+@life\.hkbu\.edu\.hk$/;
  
  return (
    hkEduPattern.test(trimmed) ||
    hkuConnectPattern.test(trimmed) ||
    cuhkLinkPattern.test(trimmed) ||
    polyuConnectPattern.test(trimmed) ||
    ustPattern.test(trimmed) ||
    cityuPattern.test(trimmed) ||
    hkbuPattern.test(trimmed)
  );
}

/**
 * Track user interactions (map_opened, form_opened, form_completed)
 */
export async function trackAnalyticsEvent(eventType: 'map_opened' | 'form_opened' | 'form_completed') {
  if (!supabase) return;
  try {
    const { error } = await supabase.rpc('increment_analytic_counter', { event_type: eventType });
    if (error) {
      // Fallback: direct update if RPC fails
      await supabase
        .from('site_analytics')
        .upsert(
          { event_name: eventType, count: 1, last_updated: new Date().toISOString() },
          { onConflict: 'event_name' }
        );
    }
  } catch (err) {
    console.warn('Analytics event tracking warning:', err);
  }
}

/**
 * Fetch summary analytics for the dashboard
 */
export async function fetchAnalyticsSummary(): Promise<AnalyticsSummary> {
  const defaultSummary: AnalyticsSummary = {
    map_opened: 0,
    form_opened: 0,
    form_completed: 0,
    total_students: 0,
    total_communities: 0,
  };

  if (!supabase) return defaultSummary;

  try {
    // 1. Fetch event counters
    const { data: events } = await supabase
      .from('site_analytics')
      .select('event_name, count');

    if (events) {
      events.forEach((row: { event_name: string; count: number }) => {
        if (row.event_name === 'map_opened') defaultSummary.map_opened = Number(row.count);
        if (row.event_name === 'form_opened') defaultSummary.form_opened = Number(row.count);
        if (row.event_name === 'form_completed') defaultSummary.form_completed = Number(row.count);
      });
    }

    // 2. Fetch actual student submission count and distinct communities
    const { count: studentCount } = await supabase
      .from('student_submissions')
      .select('*', { count: 'exact', head: true });

    defaultSummary.total_students = studentCount || 0;

    const { data: markers } = await supabase
      .from('map_markers')
      .select('name');

    defaultSummary.total_communities = markers?.length || 0;

    return defaultSummary;
  } catch (err) {
    console.warn('Failed to fetch analytics summary:', err);
    return defaultSummary;
  }
}

import { PRESET_POPULAR_COMMUNITIES } from './mapFeatures';

/**
 * Fetch all aggregated map markers from Supabase `map_markers` view,
 * merged with pre-marked candidate communities (showing "待点亮" if 0 submissions)
 */
export async function fetchCommunityMarkers(): Promise<CommunityMarker[]> {
  let dbMarkers: CommunityMarker[] = [];

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('map_markers')
        .select('*');

      if (!error && data) {
        dbMarkers = data.map((item: any) => ({
          id: item.name || `comm-${Math.random()}`,
          name: item.name,
          district: item.district || '福田区',
          address: item.address || item.name,
          lng: Number(item.lng),
          lat: Number(item.lat),
          totalStudents: Number(item.total_students) || 1,
          avgRent: Number(item.avg_rent) || 3000,
          minRent: Number(item.min_rent) || 2000,
          maxRent: Number(item.max_rent) || 5000,
          nearestPort: item.nearest_port || '福田口岸',
          commuteMinutes: Number(item.commute_minutes) || 20,
          rentalTypes: item.rental_types || { entire: 30, shared: 50, single: 20 },
          universityDistribution: item.university_distribution || {},
          tags: ['真实校友登记', '极速通关'],
          reviews: item.reviews || [],
          isPreset: false,
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch failed:', err);
    }
  }

  // Names of communities that are already registered
  const registeredNames = new Set(dbMarkers.map((m) => m.name.toLowerCase()));

  // Pre-marked candidate communities that are awaiting first pioneer
  const presetCandidates: CommunityMarker[] = PRESET_POPULAR_COMMUNITIES
    .filter((p) => !registeredNames.has(p.name.toLowerCase()))
    .map((p) => ({
      id: p.id,
      name: p.name,
      district: p.district,
      address: p.address,
      lng: p.lng,
      lat: p.lat,
      totalStudents: 0,
      avgRent: p.approxRent,
      minRent: p.approxRent,
      maxRent: p.approxRent,
      nearestPort: p.nearestPort,
      commuteMinutes: p.commuteMinutes,
      rentalTypes: { entire: 0, shared: 0, single: 0 },
      universityDistribution: {},
      tags: ['热门备选', '待点亮'],
      reviews: [],
      isPreset: true,
      description: p.desc,
    }));

  return [...dbMarkers, ...presetCandidates];
}

/**
 * Submit a student rental entry (upsert based on student_email)
 */
export async function submitHousingRecord(payload: SubmissionPayload): Promise<{
  success: boolean;
  message?: string;
  marker?: CommunityMarker;
  isUpdate?: boolean;
}> {
  const coords = {
    lng: payload.lng || 114.062125 + (Math.random() - 0.5) * 0.02,
    lat: payload.lat || 22.522814 + (Math.random() - 0.5) * 0.02,
  };

  let isUpdate = false;

  if (supabase) {
    try {
      // 1. Check if email already exists to notify user of updating
      const { data: existing } = await supabase
        .from('student_submissions')
        .select('id')
        .eq('student_email', payload.studentEmail)
        .maybeSingle();

      if (existing) {
        isUpdate = true;
      }

      // 2. Perform Upsert with student_email as unique constraint
      const { error: dbError } = await supabase.from('student_submissions').upsert({
        university: payload.university,
        student_email: payload.studentEmail,
        community_name: payload.communityName,
        address: payload.address || payload.communityName,
        district: payload.district || '福田区',
        monthly_rent: payload.monthlyRent,
        rental_type: payload.rentalType,
        housing_source: payload.housingSource || '其他',
        bedroom_count: payload.bedroomCount || 1,
        commute_minutes: payload.commuteMinutes || 20,
        nearest_port: payload.nearestPort || '福田口岸',
        review: payload.review || '',
        lng: coords.lng,
        lat: coords.lat,
      }, { onConflict: 'student_email' });

      if (dbError) {
        console.error('Supabase upsert error:', dbError);
        return { success: false, message: dbError.message };
      }

      // 3. Increment completion counter
      trackAnalyticsEvent('form_completed');

      // 4. Try to fetch the freshly aggregated marker from map_markers view
      const { data: dbMarker } = await supabase
        .from('map_markers')
        .select('*')
        .eq('name', payload.communityName)
        .maybeSingle();

      if (dbMarker) {
        const resultingMarker: CommunityMarker = {
          id: dbMarker.name,
          name: dbMarker.name,
          district: dbMarker.district || payload.district || '福田区',
          address: dbMarker.address || payload.address || dbMarker.name,
          lng: Number(dbMarker.lng) || coords.lng,
          lat: Number(dbMarker.lat) || coords.lat,
          totalStudents: Number(dbMarker.total_students) || 1,
          avgRent: Number(dbMarker.avg_rent) || payload.monthlyRent,
          minRent: Number(dbMarker.min_rent) || payload.monthlyRent,
          maxRent: Number(dbMarker.max_rent) || payload.monthlyRent,
          nearestPort: dbMarker.nearest_port || payload.nearestPort || '福田口岸',
          commuteMinutes: Number(dbMarker.commute_minutes) || payload.commuteMinutes || 20,
          rentalTypes: dbMarker.rental_types || { entire: 0, shared: 100, single: 0 },
          universityDistribution: dbMarker.university_distribution || { [payload.university]: 1 },
          tags: ['真实校友登记', '极速通关'],
          reviews: dbMarker.reviews || (payload.review ? [payload.review] : []),
        };

        // Sync runtimeCommunities cache
        const cacheIndex = runtimeCommunities.findIndex(
          (c) => c.name.toLowerCase() === payload.communityName.toLowerCase()
        );
        if (cacheIndex >= 0) {
          runtimeCommunities[cacheIndex] = resultingMarker;
        } else {
          runtimeCommunities.unshift(resultingMarker);
        }

        return { success: true, marker: resultingMarker, isUpdate };
      }

    } catch (err: any) {
      console.warn('Supabase submission error:', err);
      return { success: false, message: err?.message || '网络连接异常' };
    }
  }

  // Fallback if not using Supabase or if view fetch returned null
  const existingIndex = runtimeCommunities.findIndex(
    (c) => c.name.toLowerCase() === payload.communityName.toLowerCase()
  );

  let resultingMarker: CommunityMarker;

  if (existingIndex >= 0) {
    const target = { ...runtimeCommunities[existingIndex] };
    if (!isUpdate) {
      target.totalStudents += 1;
      target.avgRent = Math.round((target.avgRent * (target.totalStudents - 1) + payload.monthlyRent) / target.totalStudents);
      target.universityDistribution = {
        ...target.universityDistribution,
        [payload.university]: (target.universityDistribution[payload.university] || 0) + 1,
      };
    } else {
      target.avgRent = payload.monthlyRent;
    }
    if (payload.review) {
      target.reviews = [payload.review, ...target.reviews.filter((r) => r !== payload.review)].slice(0, 3);
    }
    runtimeCommunities[existingIndex] = target;
    resultingMarker = target;
  } else {
    const newMarker: CommunityMarker = {
      id: `comm-${Date.now()}`,
      name: payload.communityName,
      district: payload.district || '福田区',
      address: payload.address,
      lng: coords.lng,
      lat: coords.lat,
      totalStudents: 1,
      avgRent: payload.monthlyRent,
      minRent: payload.monthlyRent,
      maxRent: payload.monthlyRent,
      nearestPort: payload.nearestPort || '福田口岸',
      commuteMinutes: payload.commuteMinutes || 20,
      rentalTypes: {
        entire: payload.rentalType === 'entire' ? 100 : 0,
        shared: payload.rentalType === 'shared' ? 100 : 0,
        single: 0,
      },
      universityDistribution: {
        [payload.university]: 1,
      },
      tags: ['新点亮小区', '校友推荐'],
      reviews: payload.review ? [payload.review] : [],
    };
    runtimeCommunities.unshift(newMarker);
    resultingMarker = newMarker;
  }

  return { success: true, marker: resultingMarker, isUpdate };
}
