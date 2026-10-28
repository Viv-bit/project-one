import { apiFetch, insightsUrl, recommendationsUrl } from "./api";

export type InsightPriority = "HIGH" | "MEDIUM" | "EXPERIMENTAL";

export type InsightEvidence = {
  metric: string;
  creatorValue: number | string;
  baselineValue?: number | string;
  deltaPercent?: number;
  sampleSize: number;
  sourcePostIds: string[];
};

export type ApiInsight = {
  id: string;
  category: string;
  priority: InsightPriority;
  title: string;
  observation: string;
  evidence: InsightEvidence;
  confidence: number;
  interpretation?: string;
  recommendation?: string;
};

export type InsightsResponse = {
  totalInsights: number;
  highPriorityCount: number;
  insights: ApiInsight[];
};

export type RecommendationExperimentTemplate = {
  hypothesis: string;
  suggestedDurationDays: number;
  targetPostCount: number;
  primaryMetric: string;
  baselineValue: number;
};

export type ApiRecommendation = {
  id: string;
  category: string;
  priority: InsightPriority;
  title: string;
  why: string;
  evidence: InsightEvidence[];
  action: string;
  measurement: string;
  confidence: number;
  experimentTemplate: RecommendationExperimentTemplate;
};

export type RecommendationsResponse = {
  totalRecommendations: number;
  highPriorityCount: number;
  recommendations: ApiRecommendation[];
};

export async function getInsights(filters?: {
  priority?: string;
  category?: string;
}): Promise<InsightsResponse> {
  const url = new URL(insightsUrl);
  if (filters?.priority) url.searchParams.set("priority", filters.priority);
  if (filters?.category) url.searchParams.set("category", filters.category);

  const response = await apiFetch(url.toString(), {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("UNAUTHORIZED");
    const err = await response.json().catch(() => null);
    throw new Error(err?.message ?? `Failed to fetch insights (${response.status})`);
  }

  const data = await response.json();
  if (Array.isArray(data)) {
    return {
      totalInsights: data.length,
      highPriorityCount: data.filter((i) => i.priority === "HIGH").length,
      insights: data,
    };
  }
  return data as InsightsResponse;
}

export async function getRecommendations(): Promise<RecommendationsResponse> {
  const response = await apiFetch(recommendationsUrl, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("UNAUTHORIZED");
    const err = await response.json().catch(() => null);
    throw new Error(err?.message ?? `Failed to fetch recommendations (${response.status})`);
  }

  const data = await response.json();
  if (Array.isArray(data)) {
    return {
      totalRecommendations: data.length,
      highPriorityCount: data.filter((r) => r.priority === "HIGH").length,
      recommendations: data,
    };
  }
  return data as RecommendationsResponse;
}

export async function getRecommendationById(
  id: string,
): Promise<ApiRecommendation | null> {
  const response = await apiFetch(`${recommendationsUrl}/${encodeURIComponent(id)}`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("UNAUTHORIZED");
    if (response.status === 404) return null;
    const err = await response.json().catch(() => null);
    throw new Error(err?.message ?? `Failed to fetch recommendation (${response.status})`);
  }

  return (await response.json()) as ApiRecommendation;
}
