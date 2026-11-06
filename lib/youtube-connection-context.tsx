"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";
import { type YouTubeConnectionState, type YouTubeChannel } from "./api";
import {
  getYouTubeConnection,
  getYouTubeVideos,
  syncYouTubeVideos,
  analyzeYouTubeVideos,
  startYouTubeOAuth,
  YOUTUBE_RECONNECT_REQUIRED_CODE,
  isYouTubeReconnectError,
} from "./youtube";
import {
  getCreatorProfile,
  getCreatorOverview,
  getCreatorContent,
} from "./creator";
import { getRecommendations } from "./insights";
import { getCreatorBenchmark } from "./benchmarks";
import {
  useCurrentUserQuery,
  useYouTubeConnectionQuery,
  invalidateAllCreatorData,
} from "./queries";
import {
  useAnalyticsStore,
  selectLoggedInAnalytics,
  type AutoSyncStage,
} from "./store/analytics-store";

export type { AutoSyncStage };

const AUTO_SYNC_STALE_MS = 15 * 60 * 1000; // Refresh channel telemetry automatically every 15 minutes

type YouTubeConnectionContextValue = {
  connectionState: YouTubeConnectionState | null;
  isLoading: boolean;
  isConnected: boolean;
  channel: YouTubeChannel | null;
  error: string | null;
  refreshConnection: () => Promise<void>;
  connectYouTube: () => void;
  // Demo mode toggle for previewing empty vs populated states
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  // Automatic sync & analysis state
  isAutoSyncing: boolean;
  autoSyncStage: AutoSyncStage;
  syncVersion: number;
  triggerAutoSync: (options?: { force?: boolean }) => Promise<boolean>;
};

const YouTubeConnectionContext = createContext<
  YouTubeConnectionContextValue | undefined
>(undefined);

export function YouTubeConnectionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const queryClient = useQueryClient();

  const hasHydrated = useAnalyticsStore((s) => s.hasHydrated);
  const currentUserId = useAnalyticsStore((s) => s.currentUser?.id ?? null);
  const autoSyncStage = useAnalyticsStore((s) => s.autoSyncStage);
  const syncVersion = useAnalyticsStore((s) => s.syncVersion);
  const youtubeReconnectMessage = useAnalyticsStore(
    (s) => s.youtubeReconnectMessage,
  );
  const cachedConnection = useAnalyticsStore(
    (s) => selectLoggedInAnalytics(s)?.connection ?? null,
  );

  // Resolve authenticated user & YouTube connection via TanStack Query + Zustand cache
  useCurrentUserQuery();
  const {
    data: queryConnectionState,
    isLoading: isQueryLoading,
    error: queryError,
    refetch: refetchConnectionQuery,
  } = useYouTubeConnectionQuery();

  const [isDemoMode, setIsDemoMode] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        new URLSearchParams(window.location.search).get("demo") === "connected"
      );
    }
    return false;
  });

  const syncInFlightRef = useRef(false);
  const checkedKeysRef = useRef<Set<string>>(new Set());

  const connectionState: YouTubeConnectionState =
    queryConnectionState ?? cachedConnection ?? { connected: false };

  const isLoading = !cachedConnection && isQueryLoading;
  const error =
    queryError instanceof Error
      ? queryError.message === "UNAUTHORIZED"
        ? "UNAUTHORIZED"
        : "NOT_CONNECTED"
      : null;

  const refreshConnection = useCallback(async () => {
    await refetchConnectionQuery();
  }, [refetchConnectionQuery]);

  const realConnected = Boolean(connectionState.connected);
  const realChannelId = connectionState.connected
    ? connectionState.channel.id
    : null;

  const isConnected = isDemoMode ? true : realConnected;

  const channel: YouTubeChannel | null = isConnected
    ? connectionState.connected
      ? connectionState.channel
      : isDemoMode
        ? {
            id: "demo-channel",
            title: "The Minimalist Studio",
            handle: "@minimaliststudio",
            thumbnailUrl: null,
            subscriberCount: 420000,
            videoCount: 16,
          }
        : null
    : null;

  /**
   * Automatically syncs the user's YouTube videos, computes overview medians,
   * runs Gemini AI feature classification when needed, and persists basic analytics to localStorage.
   */
  const runAutoSyncPipeline = useCallback(
    async (options?: { force?: boolean }): Promise<boolean> => {
      if (syncInFlightRef.current) return false;
      if (isDemoMode || !realConnected || !realChannelId) return false;

      syncInFlightRef.current = true;
      const storeActions = useAnalyticsStore.getState();

      try {
        const cachedBefore = selectLoggedInAnalytics(
          useAnalyticsStore.getState(),
        );
        const lastSyncedAt = cachedBefore?.lastSyncedAt ?? null;
        const isSyncStale =
          !lastSyncedAt || Date.now() - lastSyncedAt > AUTO_SYNC_STALE_MS;

        // If we have no cached medians yet, indicate checking right away so UI doesn't flash empty state
        if (!cachedBefore?.overview?.totals?.totalVideos) {
          storeActions.setAutoSyncStage("checking");
        }

        const [existingVideos, existingOverview] = await Promise.all([
          getYouTubeVideos().catch((err) => {
            if (isYouTubeReconnectError(err)) throw err;
            return [];
          }),
          getCreatorOverview().catch((err) => {
            if (isYouTubeReconnectError(err)) throw err;
            return null;
          }),
        ]);

        let latestVideos = Array.isArray(existingVideos) ? existingVideos : [];
        if (latestVideos.length > 0) {
          useAnalyticsStore.getState().saveVideos(latestVideos);
          queryClient.setQueryData(queryKeys.youtube.videos(), latestVideos);
        }
        if (existingOverview) {
          useAnalyticsStore.getState().saveOverview(existingOverview);
          queryClient.setQueryData(
            queryKeys.creator.overview(),
            existingOverview,
          );
        }

        const missingMedians =
          !existingOverview?.totals?.totalVideos ||
          existingOverview.totals.totalVideos === 0 ||
          existingOverview.medians?.views == null;

        const needsSync =
          Boolean(options?.force) ||
          latestVideos.length === 0 ||
          missingMedians ||
          isSyncStale;

        let didMutate = false;

        if (needsSync) {
          useAnalyticsStore.getState().setAutoSyncStage("syncing");

          try {
            const syncRes = await syncYouTubeVideos({
              count: 20,
              classify: true,
            });
            didMutate = true;
            const st = useAnalyticsStore.getState();
            st.markSynced();
            if (syncRes.classifiedCount && syncRes.classifiedCount > 0) {
              st.markAnalyzed();
            }

            if (Array.isArray(syncRes.posts) && syncRes.posts.length > 0) {
              latestVideos = syncRes.posts;
            } else {
              latestVideos = await getYouTubeVideos().catch(() => latestVideos);
            }

            if (latestVideos.length > 0) {
              useAnalyticsStore.getState().saveVideos(latestVideos);
              queryClient.setQueryData(
                queryKeys.youtube.videos(),
                latestVideos,
              );
            }
          } catch (syncErr) {
            if (isYouTubeReconnectError(syncErr)) {
              return false;
            }
            console.warn("Automatic YouTube video sync failed:", syncErr);
          }
        }

        // Automatically run Gemini AI classification if any ingested videos lack hook/topic features
        const hasUnanalyzedVideos =
          latestVideos.length > 0 &&
          latestVideos.some(
            (v) => !v.features?.topic && !v.features?.hookType,
          );

        if (hasUnanalyzedVideos) {
          useAnalyticsStore.getState().setAutoSyncStage("analyzing");

          try {
            await analyzeYouTubeVideos({ force: false });
            didMutate = true;
            useAnalyticsStore.getState().markAnalyzed();
          } catch (analyzeErr) {
            if (isYouTubeReconnectError(analyzeErr)) {
              return false;
            }
            console.warn("Automatic Gemini video analysis failed:", analyzeErr);
          }
        }

        // Refresh and persist all core analytics snapshots to Zustand localStorage + TanStack Query
        const needsCacheWarmup =
          didMutate ||
          !cachedBefore?.profile ||
          !cachedBefore?.overview ||
          !cachedBefore?.recommendations ||
          !cachedBefore?.benchmark;

        if (needsCacheWarmup) {
          const [
            connRes,
            profileRes,
            overviewRes,
            videosRes,
            contentRes,
            recsRes,
            benchRes,
          ] = await Promise.allSettled([
            getYouTubeConnection(),
            getCreatorProfile(),
            getCreatorOverview(),
            getYouTubeVideos(),
            getCreatorContent(),
            getRecommendations(),
            getCreatorBenchmark(),
          ]);

          const store = useAnalyticsStore.getState();

          if (connRes.status === "fulfilled") {
            store.saveConnection(connRes.value);
            queryClient.setQueryData(
              queryKeys.youtube.connection(),
              connRes.value,
            );
          }
          if (profileRes.status === "fulfilled") {
            store.saveProfile(profileRes.value);
            queryClient.setQueryData(
              queryKeys.creator.profile(),
              profileRes.value,
            );
          }
          if (overviewRes.status === "fulfilled") {
            store.saveOverview(overviewRes.value);
            queryClient.setQueryData(
              queryKeys.creator.overview(),
              overviewRes.value,
            );
          }
          if (videosRes.status === "fulfilled") {
            store.saveVideos(videosRes.value);
            queryClient.setQueryData(
              queryKeys.youtube.videos(),
              videosRes.value,
            );
          }
          if (contentRes.status === "fulfilled") {
            store.saveContent(contentRes.value);
            queryClient.setQueryData(
              queryKeys.creator.content(),
              contentRes.value,
            );
          }
          if (recsRes.status === "fulfilled") {
            store.saveRecommendations(recsRes.value);
            queryClient.setQueryData(
              queryKeys.insights.recommendations(),
              recsRes.value,
            );
          }
          if (benchRes.status === "fulfilled") {
            store.saveBenchmark(benchRes.value);
            queryClient.setQueryData(
              queryKeys.benchmarks.creator(),
              benchRes.value,
            );
          }

          if (didMutate) {
            await invalidateAllCreatorData(queryClient);
            useAnalyticsStore.getState().incrementSyncVersion();
          }
        }

        return true;
      } catch (err) {
        if (!isYouTubeReconnectError(err)) {
          console.warn("Automatic sync & analysis pipeline error:", err);
        }
        return false;
      } finally {
        syncInFlightRef.current = false;
        useAnalyticsStore.getState().setAutoSyncStage("idle");
      }
    },
    [isDemoMode, realConnected, realChannelId, queryClient],
  );

  // Automatically trigger sync + analysis once Zustand store has hydrated and a real channel is connected
  useEffect(() => {
    if (
      !hasHydrated ||
      isDemoMode ||
      !realConnected ||
      !realChannelId ||
      Boolean(youtubeReconnectMessage)
    ) {
      return;
    }

    if (
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("error") ===
        YOUTUBE_RECONNECT_REQUIRED_CODE
    ) {
      return;
    }

    const sessionCheckKey = `${currentUserId ?? "anon"}:${realChannelId}`;
    if (checkedKeysRef.current.has(sessionCheckKey)) {
      return;
    }

    checkedKeysRef.current.add(sessionCheckKey);
    void runAutoSyncPipeline();
  }, [
    hasHydrated,
    isDemoMode,
    realConnected,
    realChannelId,
    currentUserId,
    youtubeReconnectMessage,
    runAutoSyncPipeline,
  ]);

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => !prev);
  };

  const isAutoSyncing =
    autoSyncStage === "checking" ||
    autoSyncStage === "syncing" ||
    autoSyncStage === "analyzing";

  return (
    <YouTubeConnectionContext.Provider
      value={{
        connectionState,
        isLoading,
        isConnected,
        channel,
        error,
        refreshConnection,
        connectYouTube: startYouTubeOAuth,
        isDemoMode,
        toggleDemoMode,
        isAutoSyncing,
        autoSyncStage,
        syncVersion,
        triggerAutoSync: runAutoSyncPipeline,
      }}
    >
      {children}
    </YouTubeConnectionContext.Provider>
  );
}

export function useYouTubeConnection(): YouTubeConnectionContextValue {
  const context = useContext(YouTubeConnectionContext);
  if (!context) {
    throw new Error(
      "useYouTubeConnection must be used within a YouTubeConnectionProvider",
    );
  }
  return context;
}
