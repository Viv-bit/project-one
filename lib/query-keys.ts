export const queryKeys = {
  all: ["app"] as const,
  auth: {
    all: ["auth"] as const,
    user: () => [...queryKeys.auth.all, "user"] as const,
  },
  youtube: {
    all: ["youtube"] as const,
    connection: () => [...queryKeys.youtube.all, "connection"] as const,
    videos: (limit?: number) =>
      [...queryKeys.youtube.all, "videos", { limit }] as const,
  },
  creator: {
    all: ["creator"] as const,
    profile: () => [...queryKeys.creator.all, "profile"] as const,
    overview: () => [...queryKeys.creator.all, "overview"] as const,
    content: () => [...queryKeys.creator.all, "content"] as const,
  },
  insights: {
    all: ["insights"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.insights.all, "list", filters ?? {}] as const,
    recommendations: () =>
      [...queryKeys.insights.all, "recommendations"] as const,
  },
  experiments: {
    all: ["experiments"] as const,
    list: (status?: string) =>
      [...queryKeys.experiments.all, "list", { status }] as const,
    detail: (id: string) =>
      [...queryKeys.experiments.all, "detail", id] as const,
  },
  benchmarks: {
    all: ["benchmarks"] as const,
    creator: () => [...queryKeys.benchmarks.all, "creator"] as const,
    goals: () => [...queryKeys.benchmarks.all, "goals"] as const,
    growthPlan: () => [...queryKeys.benchmarks.all, "growth-plan"] as const,
    cohorts: () => [...queryKeys.benchmarks.all, "cohorts"] as const,
    groups: () => [...queryKeys.benchmarks.all, "groups"] as const,
  },
} as const;
