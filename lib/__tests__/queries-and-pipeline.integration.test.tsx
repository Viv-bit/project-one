import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as apiModule from "../api";
import {
  hydrateQueryClientFromStore,
  invalidateAllCreatorData,
  useSelectBenchmarkGoalMutation,
} from "../queries";
import { queryKeys } from "../query-keys";
import {
  YouTubeConnectionProvider,
  useYouTubeConnection,
} from "../youtube-connection-context";
import { useAnalyticsStore } from "../store/analytics-store";

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

describe("Integration: TanStack Query + Zustand Store + Auto-Sync Pipeline", () => {
  const sampleUser = {
    id: "user-int-1",
    email: "creator@lumen.studio",
    name: "Alex Creator",
    createdAt: "2026-01-01T00:00:00Z",
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    useAnalyticsStore.setState({
      hasHydrated: true,
      currentUser: sampleUser,
      analyticsByUser: {},
      autoSyncStage: "idle",
      syncVersion: 0,
      youtubeReconnectMessage: null,
      youtubeReconnectToast: null,
    });
  });

  it("hydrates QueryClient from Zustand store cache for logged-in user", () => {
    const store = useAnalyticsStore.getState();
    store.setAuthenticatedUser(sampleUser);
    store.saveConnection({
      connected: true,
      channel: {
        id: "ch-1",
        title: "Lumen Creators",
        handle: "@lumencreators",
        thumbnailUrl: null,
        subscriberCount: 15000,
        videoCount: 42,
      },
    });
    store.saveVideos([
      {
        id: "v-1",
        externalId: "yt-1",
        title: "Cached Video",
        publishedAt: "2026-01-01T00:00:00Z",
      },
    ]);

    const queryClient = createTestQueryClient();
    hydrateQueryClientFromStore(queryClient);

    expect(queryClient.getQueryData(queryKeys.auth.user())).toEqual(sampleUser);
    expect(queryClient.getQueryData(queryKeys.youtube.connection())).toEqual({
      connected: true,
      channel: expect.objectContaining({ id: "ch-1", title: "Lumen Creators" }),
    });
    expect(queryClient.getQueryData(queryKeys.youtube.videos())).toHaveLength(1);
  });

  it("invalidates all creator query domains on invalidateAllCreatorData", async () => {
    const queryClient = createTestQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    await invalidateAllCreatorData(queryClient);

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: queryKeys.youtube.all,
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: queryKeys.creator.all,
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: queryKeys.insights.all,
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: queryKeys.benchmarks.all,
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: queryKeys.experiments.all,
    });
  });

  it("runs the full YouTube auto-sync & Gemini analysis pipeline when channel connects", async () => {
    const connectedState = {
      connected: true as const,
      channel: {
        id: "ch-live-1",
        title: "Studio Live",
        handle: "@studiolive",
        thumbnailUrl: null,
        subscriberCount: 8500,
        videoCount: 12,
      },
    };

    const unanalyzedVideo = {
      id: "post-1",
      externalId: "yt-1",
      title: "Unanalyzed Upload",
      publishedAt: "2026-02-01T00:00:00Z",
      features: null,
    };

    const overviewData = {
      totals: { totalVideos: 1, totalViews: 5000, totalLikes: 300, totalComments: 40 },
      medians: {
        views: 5000,
        meanViews: 5000,
        likes: 300,
        comments: 40,
        engagementRate: 6.8,
        viewsPerSubscriberRatio: 0.58,
      },
      percentiles: { top10ThresholdViews: 5000, bottom10ThresholdViews: 5000 },
      cadence: { medianDaysBetweenUploads: 7, postsPerWeek: 1 },
      topHits: [],
    };

    vi.spyOn(apiModule, "apiFetch").mockImplementation(async (input, init) => {
      const url = typeof input === "string" ? input : input.toString();
      const method = init?.method ?? "GET";

      if (url.includes("/api/auth/me")) {
        return new Response(JSON.stringify({ user: sampleUser }), { status: 200 });
      }
      if (url.includes("/api/youtube/connection") && method === "GET") {
        return new Response(JSON.stringify(connectedState), { status: 200 });
      }
      if (url.includes("/api/youtube/videos")) {
        return new Response(JSON.stringify([unanalyzedVideo]), { status: 200 });
      }
      if (url.includes("/api/youtube/sync") && method === "POST") {
        return new Response(
          JSON.stringify({
            message: "Synced",
            syncedCount: 1,
            classifiedCount: 0,
            posts: [unanalyzedVideo],
          }),
          { status: 200 },
        );
      }
      if (url.includes("/api/youtube/analyze") && method === "POST") {
        return new Response(
          JSON.stringify({ message: "Analyzed", analyzedCount: 1 }),
          { status: 200 },
        );
      }
      if (url.includes("/api/creator/overview")) {
        return new Response(JSON.stringify(overviewData), { status: 200 });
      }
      if (url.includes("/api/creator/content")) {
        return new Response(
          JSON.stringify({
            byTopic: [],
            byPillar: [],
            byHookType: [],
            byCtaType: [],
            byDurationTier: [],
            byDayOfWeek: [],
          }),
          { status: 200 },
        );
      }
      if (url.includes("/api/creator")) {
        return new Response(
          JSON.stringify({
            channel: connectedState.channel,
            profile: {
              inferredNiche: "Design",
              audienceScaleTier: "1K-10K",
              classificationCoveragePct: 100,
              totalVideosAnalyzed: 1,
            },
          }),
          { status: 200 },
        );
      }
      if (url.includes("/api/recommendations")) {
        return new Response(
          JSON.stringify({
            totalRecommendations: 0,
            highPriorityCount: 0,
            recommendations: [],
          }),
          { status: 200 },
        );
      }
      if (url.includes("/api/benchmarks")) {
        return new Response(JSON.stringify({ hasData: false }), { status: 200 });
      }
      return new Response(JSON.stringify({}), { status: 200 });
    });

    function ConsumerProbe() {
      const { isConnected, channel, syncVersion, isDemoMode, toggleDemoMode } =
        useYouTubeConnection();
      return (
        <div>
          <span data-testid="connected">{String(isConnected)}</span>
          <span data-testid="channel-title">{channel?.title ?? "none"}</span>
          <span data-testid="sync-version">{syncVersion}</span>
          <span data-testid="demo-mode">{String(isDemoMode)}</span>
          <button onClick={toggleDemoMode}>Toggle Demo</button>
        </div>
      );
    }

    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <YouTubeConnectionProvider>
          <ConsumerProbe />
        </YouTubeConnectionProvider>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("connected")).toHaveTextContent("true");
      expect(screen.getByTestId("channel-title")).toHaveTextContent("Studio Live");
    });

    // Wait for auto-sync + analyze pipeline to complete and increment syncVersion
    await waitFor(() => {
      expect(screen.getByTestId("sync-version")).toHaveTextContent("1");
    });

    const cached = useAnalyticsStore.getState().analyticsByUser[sampleUser.id];
    expect(cached?.lastSyncedAt).not.toBeNull();
    expect(cached?.lastAnalyzedAt).not.toBeNull();
    expect(cached?.overview?.medians.views).toBe(5000);
  });

  it("updates goal and refetches benchmark in useSelectBenchmarkGoalMutation", async () => {
    const updatedBenchmark = {
      hasData: true,
      selectedGoal: {
        id: "IMPROVE_VIEWERSHIP",
        title: "Increase Video Views",
      },
    };

    vi.spyOn(apiModule, "apiFetch").mockImplementation(async (input, init) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url.includes("/api/benchmarks/goals") && init?.method === "POST") {
        return new Response(
          JSON.stringify({ selectedGoalId: "IMPROVE_VIEWERSHIP" }),
          { status: 200 },
        );
      }
      if (url.includes("/api/benchmarks?goal=IMPROVE_VIEWERSHIP")) {
        return new Response(JSON.stringify(updatedBenchmark), { status: 200 });
      }
      return new Response(JSON.stringify({}), { status: 200 });
    });

    let mutateGoal: ((payload: { goalId: "IMPROVE_VIEWERSHIP" }) => Promise<unknown>) | null =
      null;

    function MutationHarness() {
      const mutation = useSelectBenchmarkGoalMutation();
      mutateGoal = mutation.mutateAsync;
      return null;
    }

    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MutationHarness />
      </QueryClientProvider>,
    );

    await act(async () => {
      await mutateGoal!({ goalId: "IMPROVE_VIEWERSHIP" });
    });

    expect(queryClient.getQueryData(queryKeys.benchmarks.creator())).toEqual(
      updatedBenchmark,
    );
    expect(
      useAnalyticsStore.getState().analyticsByUser[sampleUser.id]?.benchmark,
    ).toEqual(updatedBenchmark);
  });
});

