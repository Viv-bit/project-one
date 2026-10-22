import { experimentsUrl } from "./api";

export type ExperimentCategory =
  | "TOPIC"
  | "HOOK"
  | "FORMAT"
  | "CADENCE"
  | "DURATION";

export type ExperimentStatus =
  | "DRAFT"
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED"
  | "CANCELLED";

export type ExperimentProgress = {
  currentPostsCount: number;
  targetPostCount: number;
  daysElapsed: number;
  durationDays: number;
  isDataSufficient: boolean;
};

export type ExperimentResultData = {
  id: string;
  baselineValue: number;
  experimentValue: number;
  deltaPercent: number;
  sampleSize: number;
  isDataSufficient: boolean;
  conclusion: "POSITIVE" | "NEGATIVE" | "NEUTRAL" | "INCONCLUSIVE";
  summary: string;
  evaluatedAt: string;
};

export type ApiExperiment = {
  id: string;
  userId: string;
  title: string;
  hypothesis: string;
  category: ExperimentCategory;
  primaryMetric: "median_views" | "engagement_rate" | string;
  targetPostCount: number;
  durationDays: number;
  status: ExperimentStatus;
  baselineMetricValue: number;
  currentMetricValue?: number;
  liftPct?: number;
  startDate: string;
  endDate?: string | null;
  recommendationId?: string | null;
  posts?: Array<{
    id: string;
    postId: string;
    addedAt: string;
    post?: {
      id: string;
      title: string;
      publishedAt: string;
      durationSeconds?: number;
      metrics?: Array<{
        views: number;
        likes: number;
        comments: number;
      }>;
      features?: {
        topic?: string;
        hookType?: string;
        pillar?: string;
      };
    };
  }>;
  result?: ExperimentResultData | null;
  progress?: ExperimentProgress;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateExperimentPayload = {
  title: string;
  hypothesis: string;
  category: ExperimentCategory | string;
  primaryMetric?: "median_views" | "engagement_rate" | string;
  targetPostCount?: number;
  durationDays?: number;
  baselineMetricValue?: number;
  recommendationId?: string;
  initialPostIds?: string[];
};

export type UpdateExperimentPayload = {
  title?: string;
  hypothesis?: string;
  status?: ExperimentStatus;
  endDate?: string;
};

export async function getExperiments(): Promise<ApiExperiment[]> {
  const response = await fetch(experimentsUrl, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("UNAUTHORIZED");
    const err = await response.json().catch(() => null);
    throw new Error(err?.message ?? `Failed to fetch experiments (${response.status})`);
  }

  const data = await response.json();
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.experiments)) return data.experiments;
  return [];
}

export async function getExperimentById(id: string): Promise<ApiExperiment | null> {
  const response = await fetch(`${experimentsUrl}/${encodeURIComponent(id)}`, {
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
    throw new Error(err?.message ?? `Failed to fetch experiment detail (${response.status})`);
  }

  return (await response.json()) as ApiExperiment;
}

export async function createExperiment(
  payload: CreateExperimentPayload,
): Promise<ApiExperiment> {
  const response = await fetch(experimentsUrl, {
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
    throw new Error(err?.message ?? `Failed to create experiment (${response.status})`);
  }

  return (await response.json()) as ApiExperiment;
}

export async function updateExperiment(
  id: string,
  payload: UpdateExperimentPayload,
): Promise<ApiExperiment> {
  const response = await fetch(`${experimentsUrl}/${encodeURIComponent(id)}`, {
    method: "PATCH",
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
    throw new Error(err?.message ?? `Failed to update experiment (${response.status})`);
  }

  return (await response.json()) as ApiExperiment;
}

export async function linkPostToExperiment(
  experimentId: string,
  postId: string,
): Promise<ApiExperiment> {
  const response = await fetch(`${experimentsUrl}/${encodeURIComponent(experimentId)}/posts`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ postId }),
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("UNAUTHORIZED");
    const err = await response.json().catch(() => null);
    throw new Error(err?.message ?? `Failed to link post to experiment (${response.status})`);
  }

  return (await response.json()) as ApiExperiment;
}

export async function evaluateExperimentResults(
  experimentId: string,
): Promise<ExperimentResultData> {
  const response = await fetch(`${experimentsUrl}/${encodeURIComponent(experimentId)}/results`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("UNAUTHORIZED");
    const err = await response.json().catch(() => null);
    throw new Error(err?.message ?? `Failed to evaluate experiment results (${response.status})`);
  }

  return (await response.json()) as ExperimentResultData;
}
