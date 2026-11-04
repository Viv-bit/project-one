import {
  useQuery,
  useMutation,
  useQueryClient,
  type QueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { queryKeys } from "./query-keys";
import { getCurrentUser, type AuthUser } from "./auth";
import {
  getYouTubeConnection,
  getYouTubeVideos,
  syncYouTubeVideos,
  analyzeYouTubeVideos,
  disconnectYouTubeConnection,
  type YouTubeVideoItem,
  type SyncYouTubeOptions,
  type SyncYouTubeResult,
  type AnalyzeYouTubeOptions,
} from "./youtube";
import { type YouTubeConnectionState } from "./api";
import {
  getCreatorProfile,
  getCreatorOverview,
  getCreatorContent,
  type CreatorProfileResponse,
  type CreatorOverviewResponse,
  type CreatorContentResponse,
} from "./creator";
import {
  getInsights,
  getRecommendations,
  type InsightsResponse,
  type RecommendationsResponse,
} from "./insights";
import {
  getExperiments,
  getExperimentById,
  createExperiment,
  updateExperiment,
  linkPostToExperiment,
  evaluateExperimentResults,
  type ApiExperiment,
  type CreateExperimentPayload,
  type UpdateExperimentPayload,
} from "./experiments";
import {
  getCreatorBenchmark,
  getBenchmarkGroups,
  selectBenchmarkGroup,
  type BenchmarkComparisonResult,
  type BenchmarkGroupsResponse,
} from "./benchmarks";
import {
  useAnalyticsStore,
  selectLoggedInAnalytics,
} from "./store/analytics-store";

// ==========================================
// Cache Synchronization Helpers
// ==========================================

/**
 * Invalidate all creator/channel query domains so medians, insights,
 * videos, benchmarks, and experiments refetch automatically.
 */
export async function invalidateAllCreatorData(
  queryClient: QueryClient,
): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.youtube.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.creator.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.insights.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.benchmarks.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.experiments.all }),
  ]);
}

/**
 * Seed TanStack Query cache from Zustand localStorage analytics when a user is logged in.
 * Only populates keys that do not yet have fresh in-memory data.
 */
export function hydrateQueryClientFromStore(queryClient: QueryClient): void {
  const state = useAnalyticsStore.getState();
  if (!state.hasHydrated || !state.currentUser) {
    return;
  }

  if (queryClient.getQueryData(queryKeys.auth.user()) === undefined) {
    queryClient.setQueryData(queryKeys.auth.user(), state.currentUser);
  }

  const cached = selectLoggedInAnalytics(state);
  if (!cached) {
    return;
  }

  if (
    cached.connection &&
    queryClient.getQueryData(queryKeys.youtube.connection()) === undefined
  ) {
    queryClient.setQueryData(queryKeys.youtube.connection(), cached.connection);
  }

  if (
    cached.profile &&
    queryClient.getQueryData(queryKeys.creator.profile()) === undefined
  ) {
    queryClient.setQueryData(queryKeys.creator.profile(), cached.profile);
  }

  if (
    cached.overview &&
    queryClient.getQueryData(queryKeys.creator.overview()) === undefined
  ) {
    queryClient.setQueryData(queryKeys.creator.overview(), cached.overview);
  }

  if (
    cached.content &&
    queryClient.getQueryData(queryKeys.creator.content()) === undefined
  ) {
    queryClient.setQueryData(queryKeys.creator.content(), cached.content);
  }

  if (
    cached.videos.length > 0 &&
    queryClient.getQueryData(queryKeys.youtube.videos()) === undefined
  ) {
    queryClient.setQueryData(queryKeys.youtube.videos(), cached.videos);
  }

  if (
    cached.recommendations &&
    queryClient.getQueryData(queryKeys.insights.recommendations()) === undefined
  ) {
    queryClient.setQueryData(
      queryKeys.insights.recommendations(),
      cached.recommendations,
    );
  }

  if (
    cached.benchmark &&
    queryClient.getQueryData(queryKeys.benchmarks.creator()) === undefined
  ) {
    queryClient.setQueryData(queryKeys.benchmarks.creator(), cached.benchmark);
  }
}

// ==========================================
// Query Hooks
// ==========================================

export function useCurrentUserQuery(
  options?: Omit<UseQueryOptions<AuthUser | null>, "queryKey" | "queryFn">,
) {
  const cachedUser = useAnalyticsStore((s) =>
    s.hasHydrated ? s.currentUser : null,
  );

  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: async (): Promise<AuthUser | null> => {
      try {
        return await getCurrentUser();
      } catch (err: unknown) {
        if (err instanceof Error && err.message === "UNAUTHORIZED") {
          return null;
        }
        throw err;
      }
    },
    placeholderData: cachedUser ?? undefined,
    ...options,
  });
}

export function useYouTubeConnectionQuery(
  options?: Omit<
    UseQueryOptions<YouTubeConnectionState>,
    "queryKey" | "queryFn"
  >,
) {
  const cachedConnection = useAnalyticsStore(
    (s) => selectLoggedInAnalytics(s)?.connection ?? undefined,
  );

  return useQuery({
    queryKey: queryKeys.youtube.connection(),
    queryFn: async (): Promise<YouTubeConnectionState> => {
      try {
        const conn = await getYouTubeConnection();
        useAnalyticsStore.getState().saveConnection(conn);
        return conn;
      } catch {
        const fallback: YouTubeConnectionState = { connected: false };
        return fallback;
      }
    },
    placeholderData: cachedConnection,
    ...options,
  });
}

export function useYouTubeVideosQuery(
  limit?: number,
  options?: Omit<UseQueryOptions<YouTubeVideoItem[]>, "queryKey" | "queryFn">,
) {
  const cachedVideos = useAnalyticsStore((s) => {
    const videos = selectLoggedInAnalytics(s)?.videos;
    if (!videos || videos.length === 0) return undefined;
    return limit ? videos.slice(0, limit) : videos;
  });

  return useQuery({
    queryKey: queryKeys.youtube.videos(limit),
    queryFn: async () => {
      const videos = await getYouTubeVideos();
      useAnalyticsStore.getState().saveVideos(videos);
      return limit ? videos.slice(0, limit) : videos;
    },
    placeholderData: cachedVideos,
    ...options,
  });
}

export function useCreatorProfileQuery(
  options?: Omit<
    UseQueryOptions<CreatorProfileResponse>,
    "queryKey" | "queryFn"
  >,
) {
  const cachedProfile = useAnalyticsStore(
    (s) => selectLoggedInAnalytics(s)?.profile ?? undefined,
  );

  return useQuery({
    queryKey: queryKeys.creator.profile(),
    queryFn: async () => {
      const profile = await getCreatorProfile();
      useAnalyticsStore.getState().saveProfile(profile);
      return profile;
    },
    placeholderData: cachedProfile,
    ...options,
  });
}

export function useCreatorOverviewQuery(
  options?: Omit<
    UseQueryOptions<CreatorOverviewResponse>,
    "queryKey" | "queryFn"
  >,
) {
  const cachedOverview = useAnalyticsStore(
    (s) => selectLoggedInAnalytics(s)?.overview ?? undefined,
  );

  return useQuery({
    queryKey: queryKeys.creator.overview(),
    queryFn: async () => {
      const overview = await getCreatorOverview();
      useAnalyticsStore.getState().saveOverview(overview);
      return overview;
    },
    placeholderData: cachedOverview,
    ...options,
  });
}

export function useCreatorContentQuery(
  options?: Omit<
    UseQueryOptions<CreatorContentResponse>,
    "queryKey" | "queryFn"
  >,
) {
  const cachedContent = useAnalyticsStore(
    (s) => selectLoggedInAnalytics(s)?.content ?? undefined,
  );

  return useQuery({
    queryKey: queryKeys.creator.content(),
    queryFn: async () => {
      const content = await getCreatorContent();
      useAnalyticsStore.getState().saveContent(content);
      return content;
    },
    placeholderData: cachedContent,
    ...options,
  });
}

export function useInsightsQuery(
  filters?: { priority?: string; category?: string; limit?: number },
  options?: Omit<UseQueryOptions<InsightsResponse>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.insights.list(filters),
    queryFn: () => getInsights(filters),
    ...options,
  });
}

export function useRecommendationsQuery(
  options?: Omit<
    UseQueryOptions<RecommendationsResponse>,
    "queryKey" | "queryFn"
  >,
) {
  const cachedRecs = useAnalyticsStore(
    (s) => selectLoggedInAnalytics(s)?.recommendations ?? undefined,
  );

  return useQuery({
    queryKey: queryKeys.insights.recommendations(),
    queryFn: async () => {
      const recs = await getRecommendations();
      useAnalyticsStore.getState().saveRecommendations(recs);
      return recs;
    },
    placeholderData: cachedRecs,
    ...options,
  });
}

export function useExperimentsQuery(
  status?: string,
  options?: Omit<UseQueryOptions<ApiExperiment[]>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.experiments.list(status),
    queryFn: () => getExperiments(),
    ...options,
  });
}

export function useExperimentDetailQuery(
  id: string,
  options?: Omit<UseQueryOptions<ApiExperiment | null>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.experiments.detail(id),
    queryFn: () => getExperimentById(id),
    enabled: Boolean(id),
    ...options,
  });
}

export function useCreatorBenchmarkQuery(
  options?: Omit<
    UseQueryOptions<BenchmarkComparisonResult>,
    "queryKey" | "queryFn"
  >,
) {
  const cachedBenchmark = useAnalyticsStore(
    (s) => selectLoggedInAnalytics(s)?.benchmark ?? undefined,
  );

  return useQuery({
    queryKey: queryKeys.benchmarks.creator(),
    queryFn: async () => {
      const benchmark = await getCreatorBenchmark();
      useAnalyticsStore.getState().saveBenchmark(benchmark);
      return benchmark;
    },
    placeholderData: cachedBenchmark,
    ...options,
  });
}

export function useBenchmarkGroupsQuery(
  options?: Omit<
    UseQueryOptions<BenchmarkGroupsResponse>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: queryKeys.benchmarks.groups(),
    queryFn: getBenchmarkGroups,
    ...options,
  });
}

// ==========================================
// Mutation Hooks (with automatic cache invalidation)
// ==========================================

export function useSyncYouTubeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options?: SyncYouTubeOptions): Promise<SyncYouTubeResult> =>
      syncYouTubeVideos(options),
    onSuccess: async (res) => {
      const store = useAnalyticsStore.getState();
      store.markSynced();
      if (Array.isArray(res.posts) && res.posts.length > 0) {
        store.saveVideos(res.posts);
      }
      if (res.classifiedCount && res.classifiedCount > 0) {
        store.markAnalyzed();
      }
      await invalidateAllCreatorData(queryClient);
    },
  });
}

export function useDisconnectYouTubeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: disconnectYouTubeConnection,
    onSuccess: async () => {
      useAnalyticsStore.getState().clearActiveChannelAnalytics();
      await invalidateAllCreatorData(queryClient);
    },
  });
}

export function useAnalyzeYouTubeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options?: AnalyzeYouTubeOptions) =>
      analyzeYouTubeVideos(options),
    onSuccess: async () => {
      useAnalyticsStore.getState().markAnalyzed();
      await invalidateAllCreatorData(queryClient);
    },
  });
}

export function useCreateExperimentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateExperimentPayload) => createExperiment(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.experiments.all }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.insights.recommendations(),
        }),
      ]);
    },
  });
}

export function useUpdateExperimentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateExperimentPayload;
    }) => updateExperiment(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.experiments.all,
      });
    },
  });
}

export function useLinkPostToExperimentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      experimentId,
      postId,
    }: {
      experimentId: string;
      postId: string;
    }) => linkPostToExperiment(experimentId, postId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.experiments.all,
      });
    },
  });
}

export function useEvaluateExperimentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (experimentId: string) =>
      evaluateExperimentResults(experimentId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.experiments.all,
      });
    },
  });
}

export function useSelectBenchmarkGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => selectBenchmarkGroup(groupId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.benchmarks.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.creator.all }),
      ]);
    },
  });
}
