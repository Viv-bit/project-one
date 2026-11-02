import {
  useQuery,
  useMutation,
  useQueryClient,
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

// ==========================================
// Query Hooks
// ==========================================

export function useCurrentUserQuery(
  options?: Omit<UseQueryOptions<AuthUser | null>, "queryKey" | "queryFn">,
) {
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
    ...options,
  });
}

export function useYouTubeConnectionQuery(
  options?: Omit<UseQueryOptions<YouTubeConnectionState>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.youtube.connection(),
    queryFn: async (): Promise<YouTubeConnectionState> => {
      try {
        return await getYouTubeConnection();
      } catch {
        return { connected: false };
      }
    },
    ...options,
  });
}

export function useYouTubeVideosQuery(
  limit?: number,
  options?: Omit<UseQueryOptions<YouTubeVideoItem[]>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.youtube.videos(limit),
    queryFn: () => getYouTubeVideos(),
    ...options,
  });
}

export function useCreatorProfileQuery(
  options?: Omit<UseQueryOptions<CreatorProfileResponse>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.creator.profile(),
    queryFn: getCreatorProfile,
    ...options,
  });
}

export function useCreatorOverviewQuery(
  options?: Omit<UseQueryOptions<CreatorOverviewResponse>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.creator.overview(),
    queryFn: getCreatorOverview,
    ...options,
  });
}

export function useCreatorContentQuery(
  options?: Omit<UseQueryOptions<CreatorContentResponse>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.creator.content(),
    queryFn: getCreatorContent,
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
  options?: Omit<UseQueryOptions<RecommendationsResponse>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.insights.recommendations(),
    queryFn: getRecommendations,
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
  options?: Omit<UseQueryOptions<BenchmarkComparisonResult>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.benchmarks.creator(),
    queryFn: getCreatorBenchmark,
    ...options,
  });
}

export function useBenchmarkGroupsQuery(
  options?: Omit<UseQueryOptions<BenchmarkGroupsResponse>, "queryKey" | "queryFn">,
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
    onSuccess: async () => {
      // Invalidate all dependent data when YouTube videos are synced
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.youtube.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.creator.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.insights.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.benchmarks.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.experiments.all }),
      ]);
    },
  });
}

export function useDisconnectYouTubeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: disconnectYouTubeConnection,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.youtube.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.creator.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.insights.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.benchmarks.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.experiments.all }),
      ]);
    },
  });
}

export function useAnalyzeYouTubeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options?: AnalyzeYouTubeOptions) =>
      analyzeYouTubeVideos(options),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.creator.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.insights.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.benchmarks.all }),
      ]);
    },
  });
}

export function useCreateExperimentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateExperimentPayload) =>
      createExperiment(payload),
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
