import {
  apiFetch,
  benchmarksUrl,
  benchmarksGoalsUrl,
  benchmarksDiscoverUrl,
  benchmarksGrowthPlanUrl,
} from "./api";

export type BenchmarkGoalId = "GROW_SUBSCRIBERS" | "IMPROVE_VIEWERSHIP";

export type PeerSelectionStrategy =
  | "GOAL_SUBSCRIBER_RANGE"
  | "CURRENT_RANGE_HIGHER_VIEWS";

export type PeerGrowthFocusArea =
  | "HOOKS"
  | "TOPICS"
  | "PILLARS"
  | "PACKAGING"
  | "CADENCE"
  | "DURATION";

export interface BenchmarkGoalOption {
  id: BenchmarkGoalId;
  title: string;
  shortLabel: string;
  primaryMetric: "subscriberCount" | "medianViews";
  peerSelectionStrategy: PeerSelectionStrategy;
  description: string;
  isSelected: boolean;
  targetCohortCriteria: {
    minSubscribers: number;
    maxSubscribers: number;
    rangeLabel: string;
    targetSubscriberMilestone: number | null;
    minMedianViewsAbove: number | null;
    summary: string;
  };
}

export interface BenchmarkGoalsResponse {
  selectedGoalId: BenchmarkGoalId;
  creatorSnapshot: {
    channelTitle: string;
    subscriberCount: number;
    medianViews: number;
    currentSubscriberRange: { min: number; max: number; label: string };
    immediateSubscriberMilestone: number;
    goalSubscriberRange: { min: number; max: number; label: string };
  };
  goals: BenchmarkGoalOption[];
}

export interface PeerSampleVideo {
  videoId: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  engagementRate: number;
  durationSeconds: number | null;
  publishedAt: string;
  thumbnailUrl: string | null;
  spokenHook?: string | null;
  topic?: string | null;
  pillar?: string | null;
  hookType?: string | null;
  ctaType?: string | null;
}

export interface PeerGrowthPlanStep {
  stepNumber: number;
  focusArea: PeerGrowthFocusArea;
  title: string;
  whyItWorksForPeers: string;
  concreteAction: string;
  peerExamples: string[];
  targetMetric: string;
  suggestedExperiment: {
    hypothesis: string;
    targetPostCount: number;
    suggestedDurationDays: number;
    primaryMetric: "median_views" | "engagement_rate";
  };
}

export interface PeerGrowthPlan {
  headline: string;
  goalSummary: string;
  whatPeersDoDifferently: string[];
  steps: PeerGrowthPlanStep[];
  generatedBy: "GEMINI_AND_DETERMINISTIC_DATA" | "DETERMINISTIC_ENGINE";
  generatedAt: string;
}

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
  channelId: string;
  channelTitle: string;
  channelHandle?: string | null;
  thumbnailUrl?: string | null;
  subscriberCount: number;
  videoCount?: number | null;
  medianViews: number;
  engagementRate: number;
  monthlyPostFrequency: number;
  avgDurationSeconds?: number | null;
  viewsPerSubscriber?: number | null;
  topTopic?: string | null;
  topHookType?: string | null;
  topPillar?: string | null;
  topCtaType?: string | null;
  sampleVideos?: PeerSampleVideo[];
  isPublicData: boolean;
}

export interface BenchmarkGroup {
  id: string;
  name: string;
  platform: string;
  niche: string;
  tier: string;
  source: "YOUTUBE_LIVE" | "SEED" | string;
  goalType?: string | null;
  targetMilestone?: number | null;
  searchQueries?: string[];
  lastScrapedAt?: string | null;
  minFollowers: number;
  maxFollowers: number;
  sampleCreatorCount: number;
  samplePostCount: number;
  description?: string | null;
}

export interface BenchmarkSelectedGoal {
  id: BenchmarkGoalId;
  title: string;
  shortLabel: string;
  peerSelectionStrategy: PeerSelectionStrategy;
  immediateSubscriberMilestone: number;
  currentSubscriberRange: { min: number; max: number; label: string };
  targetPeerRange: { min: number; max: number; label: string };
}

export interface BenchmarkComparisonResult {
  hasData: boolean;
  selectedGoal: BenchmarkSelectedGoal;
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
  growthPlan: PeerGrowthPlan | null;
  peerCreators: PeerCreator[];
  disclaimer: string;
}

export interface BenchmarkGrowthPlanResponse {
  hasData: boolean;
  selectedGoal: BenchmarkSelectedGoal;
  benchmarkGroup: BenchmarkGroup | null;
  growthPlan: PeerGrowthPlan | null;
  peerInsights: PeerInsight[];
  peerCreators: PeerCreator[];
}

export interface BenchmarkGroupsResponse {
  totalGroups: number;
  groups: BenchmarkGroup[];
}

export interface UpdateBenchmarkGoalPayload {
  goalId: BenchmarkGoalId;
  refreshPeers?: boolean;
}

export async function getBenchmarkGoals(): Promise<BenchmarkGoalsResponse> {
  const response = await apiFetch(benchmarksGoalsUrl, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("UNAUTHORIZED");
    const err = await response.json().catch(() => null);
    throw new Error(
      err?.message ?? `Failed to fetch benchmark goals (${response.status})`,
    );
  }

  return (await response.json()) as BenchmarkGoalsResponse;
}

export async function updateBenchmarkGoal(
  payload: UpdateBenchmarkGoalPayload,
): Promise<{
  message?: string;
  selectedGoalId?: BenchmarkGoalId;
  goal?: BenchmarkGoalOption;
}> {
  const response = await apiFetch(benchmarksGoalsUrl, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("UNAUTHORIZED");
    const err = await response.json().catch(() => null);
    throw new Error(
      err?.message ?? `Failed to update benchmark goal (${response.status})`,
    );
  }

  return await response.json();
}

export async function getCreatorBenchmark(params?: {
  goal?: BenchmarkGoalId;
  refresh?: boolean;
}): Promise<BenchmarkComparisonResult> {
  const searchParams = new URLSearchParams();
  if (params?.goal) {
    searchParams.set("goal", params.goal);
  }
  if (params?.refresh) {
    searchParams.set("refresh", "true");
  }
  const qs = searchParams.toString();
  const targetUrl = qs ? `${benchmarksUrl}?${qs}` : benchmarksUrl;

  const response = await apiFetch(targetUrl, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("UNAUTHORIZED");
    const err = await response.json().catch(() => null);
    throw new Error(
      err?.message ?? `Failed to fetch benchmarks (${response.status})`,
    );
  }

  return (await response.json()) as BenchmarkComparisonResult;
}

export async function discoverBenchmarkPeers(payload?: {
  goalId?: BenchmarkGoalId;
}): Promise<BenchmarkComparisonResult> {
  const response = await apiFetch(benchmarksDiscoverUrl, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload ?? {}),
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("UNAUTHORIZED");
    const err = await response.json().catch(() => null);
    throw new Error(
      err?.message ??
        `Failed to refresh live YouTube peers (${response.status})`,
    );
  }

  return (await response.json()) as BenchmarkComparisonResult;
}

export async function getBenchmarkGrowthPlan(): Promise<BenchmarkGrowthPlanResponse> {
  const response = await apiFetch(benchmarksGrowthPlanUrl, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("UNAUTHORIZED");
    const err = await response.json().catch(() => null);
    throw new Error(
      err?.message ??
        `Failed to fetch benchmark growth plan (${response.status})`,
    );
  }

  return (await response.json()) as BenchmarkGrowthPlanResponse;
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
    throw new Error(
      err?.message ?? `Failed to fetch benchmark groups (${response.status})`,
    );
  }

  return (await response.json()) as BenchmarkGroupsResponse;
}

export async function selectBenchmarkGroup(
  benchmarkGroupId: string,
): Promise<{ message: string; benchmarkGroup: BenchmarkGroup }> {
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
    throw new Error(
      err?.message ?? `Failed to select benchmark group (${response.status})`,
    );
  }

  return (await response.json()) as {
    message: string;
    benchmarkGroup: BenchmarkGroup;
  };
}
