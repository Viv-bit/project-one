import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import type { AuthUser, YouTubeConnectionState } from "@/lib/api";
import type {
  CreatorProfileResponse,
  CreatorOverviewResponse,
  CreatorContentResponse,
} from "@/lib/creator";
import type { YouTubeVideoItem } from "@/lib/youtube";
import type { RecommendationsResponse } from "@/lib/insights";
import type { BenchmarkComparisonResult } from "@/lib/benchmarks";

const STORAGE_KEY = "lumen-creator-analytics-v1";
const PENDING_USER_KEY = "__pending__";
const MAX_CACHED_VIDEOS = 50;

export type CachedUserAnalytics = {
  connection: YouTubeConnectionState | null;
  profile: CreatorProfileResponse | null;
  overview: CreatorOverviewResponse | null;
  videos: YouTubeVideoItem[];
  content: CreatorContentResponse | null;
  recommendations: RecommendationsResponse | null;
  benchmark: BenchmarkComparisonResult | null;
  lastSyncedAt: number | null;
  lastAnalyzedAt: number | null;
  updatedAt: number;
};

function createEmptyAnalytics(): CachedUserAnalytics {
  return {
    connection: null,
    profile: null,
    overview: null,
    videos: [],
    content: null,
    recommendations: null,
    benchmark: null,
    lastSyncedAt: null,
    lastAnalyzedAt: null,
    updatedAt: Date.now(),
  };
}

/**
 * Trim heavy fields (like long video descriptions) before persisting to localStorage
 * so the store remains fast and well within browser storage quotas.
 */
function compactVideos(videos: YouTubeVideoItem[]): YouTubeVideoItem[] {
  return videos.slice(0, MAX_CACHED_VIDEOS).map((v) => ({
    ...v,
    description: v.description ? v.description.slice(0, 240) : v.description,
    metrics: v.metrics ? v.metrics.slice(0, 1) : v.metrics,
  }));
}

function mergeAnalytics(
  base: CachedUserAnalytics | undefined,
  incoming: Partial<CachedUserAnalytics>,
): CachedUserAnalytics {
  const target = base ?? createEmptyAnalytics();
  return {
    ...target,
    ...incoming,
    videos:
      incoming.videos !== undefined
        ? compactVideos(incoming.videos)
        : target.videos,
    updatedAt: Date.now(),
  };
}

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export type AutoSyncStage = "idle" | "checking" | "syncing" | "analyzing";

export type AnalyticsStoreState = {
  hasHydrated: boolean;
  currentUser: AuthUser | null;
  analyticsByUser: Record<string, CachedUserAnalytics>;
  autoSyncStage: AutoSyncStage;
  syncVersion: number;

  // Lifecycle & Auth actions
  setHasHydrated: (hydrated: boolean) => void;
  setAuthenticatedUser: (user: AuthUser | null) => void;
  clearSession: () => void;
  setAutoSyncStage: (stage: AutoSyncStage) => void;
  incrementSyncVersion: () => void;

  // Analytics persistence actions
  saveConnection: (connection: YouTubeConnectionState) => void;
  saveProfile: (profile: CreatorProfileResponse) => void;
  saveOverview: (overview: CreatorOverviewResponse) => void;
  saveVideos: (videos: YouTubeVideoItem[]) => void;
  saveContent: (content: CreatorContentResponse) => void;
  saveRecommendations: (recommendations: RecommendationsResponse) => void;
  saveBenchmark: (benchmark: BenchmarkComparisonResult) => void;
  markSynced: (timestamp?: number) => void;
  markAnalyzed: (timestamp?: number) => void;
  clearActiveChannelAnalytics: () => void;
};

function resolveBucketKey(currentUser: AuthUser | null): string {
  return currentUser?.id ?? PENDING_USER_KEY;
}

export const useAnalyticsStore = create<AnalyticsStoreState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      currentUser: null,
      analyticsByUser: {},
      autoSyncStage: "idle",
      syncVersion: 0,

      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
      setAutoSyncStage: (stage) => set({ autoSyncStage: stage }),
      incrementSyncVersion: () =>
        set((state) => ({ syncVersion: state.syncVersion + 1 })),

      setAuthenticatedUser: (user) =>
        set((state) => {
          if (!user) {
            const nextMap = { ...state.analyticsByUser };
            delete nextMap[PENDING_USER_KEY];
            return { currentUser: null, analyticsByUser: nextMap };
          }

          const pending = state.analyticsByUser[PENDING_USER_KEY];
          const existing = state.analyticsByUser[user.id];
          const nextMap = { ...state.analyticsByUser };
          delete nextMap[PENDING_USER_KEY];

          if (pending) {
            nextMap[user.id] = {
              connection: pending.connection ?? existing?.connection ?? null,
              profile: pending.profile ?? existing?.profile ?? null,
              overview: pending.overview ?? existing?.overview ?? null,
              videos:
                pending.videos.length > 0
                  ? pending.videos
                  : (existing?.videos ?? []),
              content: pending.content ?? existing?.content ?? null,
              recommendations:
                pending.recommendations ?? existing?.recommendations ?? null,
              benchmark: pending.benchmark ?? existing?.benchmark ?? null,
              lastSyncedAt:
                pending.lastSyncedAt ?? existing?.lastSyncedAt ?? null,
              lastAnalyzedAt:
                pending.lastAnalyzedAt ?? existing?.lastAnalyzedAt ?? null,
              updatedAt: Date.now(),
            };
          } else if (!existing) {
            nextMap[user.id] = createEmptyAnalytics();
          }

          return {
            currentUser: user,
            analyticsByUser: nextMap,
          };
        }),

      clearSession: () =>
        set((state) => {
          const nextMap = { ...state.analyticsByUser };
          delete nextMap[PENDING_USER_KEY];
          // Preserve analyticsByUser[userId] in localStorage so cached analytics
          // can be pulled immediately the next time that user logs in.
          return {
            currentUser: null,
            analyticsByUser: nextMap,
          };
        }),

      saveConnection: (connection) =>
        set((state) => {
          const key = resolveBucketKey(state.currentUser);
          return {
            analyticsByUser: {
              ...state.analyticsByUser,
              [key]: mergeAnalytics(state.analyticsByUser[key], { connection }),
            },
          };
        }),

      saveProfile: (profile) =>
        set((state) => {
          const key = resolveBucketKey(state.currentUser);
          return {
            analyticsByUser: {
              ...state.analyticsByUser,
              [key]: mergeAnalytics(state.analyticsByUser[key], { profile }),
            },
          };
        }),

      saveOverview: (overview) =>
        set((state) => {
          const key = resolveBucketKey(state.currentUser);
          return {
            analyticsByUser: {
              ...state.analyticsByUser,
              [key]: mergeAnalytics(state.analyticsByUser[key], { overview }),
            },
          };
        }),

      saveVideos: (videos) =>
        set((state) => {
          const key = resolveBucketKey(state.currentUser);
          return {
            analyticsByUser: {
              ...state.analyticsByUser,
              [key]: mergeAnalytics(state.analyticsByUser[key], { videos }),
            },
          };
        }),

      saveContent: (content) =>
        set((state) => {
          const key = resolveBucketKey(state.currentUser);
          return {
            analyticsByUser: {
              ...state.analyticsByUser,
              [key]: mergeAnalytics(state.analyticsByUser[key], { content }),
            },
          };
        }),

      saveRecommendations: (recommendations) =>
        set((state) => {
          const key = resolveBucketKey(state.currentUser);
          return {
            analyticsByUser: {
              ...state.analyticsByUser,
              [key]: mergeAnalytics(state.analyticsByUser[key], {
                recommendations,
              }),
            },
          };
        }),

      saveBenchmark: (benchmark) =>
        set((state) => {
          const key = resolveBucketKey(state.currentUser);
          return {
            analyticsByUser: {
              ...state.analyticsByUser,
              [key]: mergeAnalytics(state.analyticsByUser[key], { benchmark }),
            },
          };
        }),

      markSynced: (timestamp = Date.now()) =>
        set((state) => {
          const key = resolveBucketKey(state.currentUser);
          return {
            analyticsByUser: {
              ...state.analyticsByUser,
              [key]: mergeAnalytics(state.analyticsByUser[key], {
                lastSyncedAt: timestamp,
              }),
            },
          };
        }),

      markAnalyzed: (timestamp = Date.now()) =>
        set((state) => {
          const key = resolveBucketKey(state.currentUser);
          return {
            analyticsByUser: {
              ...state.analyticsByUser,
              [key]: mergeAnalytics(state.analyticsByUser[key], {
                lastAnalyzedAt: timestamp,
              }),
            },
          };
        }),

      clearActiveChannelAnalytics: () =>
        set((state) => {
          const key = resolveBucketKey(state.currentUser);
          return {
            analyticsByUser: {
              ...state.analyticsByUser,
              [key]: {
                ...createEmptyAnalytics(),
                connection: { connected: false },
              },
            },
          };
        }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : noopStorage,
      ),
      skipHydration: true,
      partialize: (state) => ({
        currentUser: state.currentUser,
        analyticsByUser: Object.fromEntries(
          Object.entries(state.analyticsByUser).filter(
            ([key]) => key !== PENDING_USER_KEY,
          ),
        ),
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

/**
 * Selector returning saved analytics from localStorage ONLY when the user is logged in.
 */
export function selectLoggedInAnalytics(
  state: AnalyticsStoreState,
): CachedUserAnalytics | null {
  if (!state.hasHydrated || !state.currentUser) {
    return null;
  }
  return state.analyticsByUser[state.currentUser.id] ?? null;
}
