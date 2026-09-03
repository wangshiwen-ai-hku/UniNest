export interface CommunityMarker {
  id: string;
  name: string;
  district: string;
  address: string;
  lng: number;
  lat: number;
  totalStudents: number;
  avgRent: number;
  minRent: number;
  maxRent: number;
  nearestPort: string;
  commuteMinutes: number;
  rentalTypes: {
    entire: number; // percentage
    shared: number;
    single: number;
  };
  universityDistribution: Record<string, number>; // e.g. { HKU: 25, CUHK: 18, ... }
  tags: string[];
  reviews: string[];
  photos?: string[];
  isPreset?: boolean;
  description?: string;
}

// 清空所有测试伪数据，完全交由扫码用户真实表单点亮
export const MOCK_COMMUNITIES: CommunityMarker[] = [];

export function getTopCommunities(count = 5): CommunityMarker[] {
  return [...MOCK_COMMUNITIES]
    .sort((a, b) => b.totalStudents - a.totalStudents)
    .slice(0, count);
}

export function getTotalStudentCount(): number {
  return MOCK_COMMUNITIES.reduce((acc, curr) => acc + curr.totalStudents, 0);
}
