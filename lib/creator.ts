import {
  apiFetch,
  creatorUrl,
  creatorOverviewUrl,
  creatorContentUrl,
  type YouTubeChannel,
} from "./api";

export type CreatorProfile = {
  inferredNiche: string;
  primaryPillar?: string;
  targetAudiencePersona?: string;
  audienceScaleTier: string;
  classificationCoveragePct: number;
  totalVideosAnalyzed: number;
};

export type CreatorProfileResponse = {
  channel: YouTubeChannel;
  profile: CreatorProfile;
};

export type OverviewMedians = {
  views: number;
  meanViews: number;
  likes: number;
  comments: number;
  engagementRate: number;
  viewsPerSubscriberRatio: number;
};

export type OverviewPercentiles = {
  top10ThresholdViews: number;
  bottom10ThresholdViews: number;
};

export type OverviewCadence = {
  medianDaysBetweenUploads: number;
  postsPerWeek: number;
};

export type CreatorOverviewResponse = {
  totals: {
    totalVideos: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
  };
  medians: OverviewMedians;
  percentiles: OverviewPercentiles;
  cadence: OverviewCadence;
  topHits: Array<{
    id: string;
    title: string;
    views: number;
    publishedAt: string;
    hookType?: string;
    topic?: string;
  }>;
};

export type ContentDimensionItem = {
  name: string;
  count: number;
  medianViews: number;
  meanViews: number;
  medianEngagementRate: number;
};

export type CreatorContentResponse = {
  byTopic: ContentDimensionItem[];
  byPillar: ContentDimensionItem[];
  byHookType: ContentDimensionItem[];
  byCtaType: ContentDimensionItem[];
  byDurationTier: ContentDimensionItem[];
  byDayOfWeek: ContentDimensionItem[];
};

export async function getCreatorProfile(): Promise<CreatorProfileResponse> {
  const response = await apiFetch(creatorUrl, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("UNAUTHORIZED");
    const err = await response.json().catch(() => null);
    throw new Error(err?.message ?? `Failed to fetch creator profile (${response.status})`);
  }

  return (await response.json()) as CreatorProfileResponse;
}

export async function getCreatorOverview(): Promise<CreatorOverviewResponse> {
  const response = await apiFetch(creatorOverviewUrl, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("UNAUTHORIZED");
    const err = await response.json().catch(() => null);
    throw new Error(err?.message ?? `Failed to fetch creator overview (${response.status})`);
  }

  return (await response.json()) as CreatorOverviewResponse;
}

export async function getCreatorContent(): Promise<CreatorContentResponse> {
  const response = await apiFetch(creatorContentUrl, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("UNAUTHORIZED");
    const err = await response.json().catch(() => null);
    throw new Error(err?.message ?? `Failed to fetch creator content analytics (${response.status})`);
  }

  return (await response.json()) as CreatorContentResponse;
}
