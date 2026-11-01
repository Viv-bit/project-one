import { apiFetch, benchmarksUrl } from "./api";

export interface ComparativeMetric {
  metric: string;
  creatorValue: number;
  benchmarkValue: number;
  delta: number;
  deltaPercent: number;
  unit: string;
  status: "ABOVE_BENCHMARK" | "ON_PAR" | "BELOW_BENCHMARK";
  interpretation: string;
}

export interface DistributionComparisonItem {
  name: string;
  creatorShare: number;
  benchmarkShare: number;
  deltaShare: number;
}

export interface PeerInsight {
  type: "OPPORTUNITY" | "STRENGTH" | "GAP";
  title: string;
  observation: string;
  evidence: string;
  actionableTakeaway: string;
}

export interface PeerCreator {
  id: string;
  channelTitle: string;
  channelHandle?: string | null;
  subscriberCount: number;
  medianViews: number;
  engagementRate: number;
  monthlyPostFrequency: number;
  topHookType?: string | null;
  topPillar?: string | null;
  isPublicData: boolean;
}

export interface BenchmarkGroup {
  id: string;
  name: string;
  platform: string;
  niche: string;
  tier: string;
  minFollowers: number;
  maxFollowers: number;
  sampleCreatorCount: number;
  samplePostCount: number;
  description?: string | null;
}

export interface BenchmarkComparisonResult {
  hasData: boolean;
  benchmarkGroup: BenchmarkGroup | null;
  creatorOverview: {
    channelTitle?: string;
    subscriberCount: number;
    inferredNiche: string;
    primaryPillar: string;
    totalPostsAnalyzed: number;
  };
  comparativeMetrics: {
    medianViews: ComparativeMetric;
    engagementRate: ComparativeMetric;
    monthlyPostFrequency: ComparativeMetric;
    avgDurationSeconds: ComparativeMetric;
  };
  hookDistributionComparison: DistributionComparisonItem[];
  pillarDistributionComparison: DistributionComparisonItem[];
  peerInsights: PeerInsight[];
  peerCreators: PeerCreator[];
  disclaimer: string;
}

export interface BenchmarkGroupsResponse {
  totalGroups: number;
  groups: BenchmarkGroup[];
}

export async function getCreatorBenchmark(): Promise<BenchmarkComparisonResult> {
  const response = await apiFetch(benchmarksUrl, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("UNAUTHORIZED");
    const err = await response.json().catch(() => null);
    throw new Error(err?.message ?? `Failed to fetch benchmarks (${response.status})`);
  }

  return (await response.json()) as BenchmarkComparisonResult;
}

export async function getBenchmarkGroups(): Promise<BenchmarkGroupsResponse> {
  const response = await apiFetch(`${benchmarksUrl}/groups`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("UNAUTHORIZED");
    const err = await response.json().catch(() => null);
    throw new Error(err?.message ?? `Failed to fetch benchmark groups (${response.status})`);
  }

  return (await response.json()) as BenchmarkGroupsResponse;
}

export async function selectBenchmarkGroup(benchmarkGroupId: string): Promise<{ message: string; benchmarkGroup: BenchmarkGroup }> {
  const response = await apiFetch(`${benchmarksUrl}/select`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ benchmarkGroupId }),
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("UNAUTHORIZED");
    const err = await response.json().catch(() => null);
    throw new Error(err?.message ?? `Failed to select benchmark group (${response.status})`);
  }

  return (await response.json()) as { message: string; benchmarkGroup: BenchmarkGroup };
}
