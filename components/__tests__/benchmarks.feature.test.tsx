import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as apiModule from "@/lib/api";
import { YouTubeConnectionProvider } from "@/lib/youtube-connection-context";
import { BenchmarksView } from "@/components/benchmarks/benchmarks-view";
import { useAnalyticsStore } from "@/lib/store/analytics-store";
import type {
  BenchmarkComparisonResult,
  BenchmarkGoalsResponse,
} from "@/lib/benchmarks";

const mockGoalsResponse: BenchmarkGoalsResponse = {
  selectedGoalId: "GROW_SUBSCRIBERS",
  creatorSnapshot: {
    channelTitle: "Lumen Studio",
    subscriberCount: 4200,
    medianViews: 1800,
    currentSubscriberRange: { min: 1000, max: 10000, label: "1K – 10K Subs" },
    immediateSubscriberMilestone: 10000,
    goalSubscriberRange: { min: 10000, max: 50000, label: "10K – 50K Subs" },
  },
  goals: [
    {
      id: "GROW_SUBSCRIBERS",
      title: "Grow Subscriber Count",
      shortLabel: "Grow Subscribers",
      primaryMetric: "subscriberCount",
      peerSelectionStrategy: "GOAL_SUBSCRIBER_RANGE",
      description: "Benchmark against channels in your next milestone tier.",
      isSelected: true,
      targetCohortCriteria: {
        minSubscribers: 10000,
        maxSubscribers: 50000,
        rangeLabel: "10K – 50K Subs",
        targetSubscriberMilestone: 10000,
        minMedianViewsAbove: null,
        summary: "Peers in 10K – 50K subscriber range.",
      },
    },
    {
      id: "IMPROVE_VIEWERSHIP",
      title: "Increase Video Views",
      shortLabel: "Increase Views",
      primaryMetric: "medianViews",
      peerSelectionStrategy: "CURRENT_RANGE_HIGHER_VIEWS",
      description:
        "Benchmark against channels in your current tier with higher median views.",
      isSelected: false,
      targetCohortCriteria: {
        minSubscribers: 1000,
        maxSubscribers: 10000,
        rangeLabel: "1K – 10K Subs",
        targetSubscriberMilestone: null,
        minMedianViewsAbove: 2500,
        summary: "Peers in 1K – 10K range with >2.5K median views.",
      },
    },
  ],
};

const mockBenchmarkComparison: BenchmarkComparisonResult = {
  hasData: true,
  selectedGoal: {
    id: "GROW_SUBSCRIBERS",
    title: "Grow Subscriber Count",
    shortLabel: "Grow Subscribers",
    peerSelectionStrategy: "GOAL_SUBSCRIBERS_RANGE" as never,
    immediateSubscriberMilestone: 10000,
    currentSubscriberRange: { min: 1000, max: 10000, label: "1K – 10K Subs" },
    targetPeerRange: { min: 10000, max: 50000, label: "10K – 50K Subs" },
  },
  benchmarkGroup: {
    id: "bg-1",
    name: "Tech Creators · 10K–50K Milestone Cohort",
    platform: "YOUTUBE",
    niche: "Tech & Design",
    tier: "10K-50K",
    source: "YOUTUBE_LIVE",
    minFollowers: 10000,
    maxFollowers: 50000,
    sampleCreatorCount: 8,
    samplePostCount: 96,
  },
  creatorOverview: {
    channelTitle: "Lumen Studio",
    subscriberCount: 4200,
    inferredNiche: "Tech & Design",
    primaryPillar: "Tutorials",
    totalPostsAnalyzed: 20,
  },
  comparativeMetrics: {
    medianViews: {
      metric: "Median Views",
      creatorValue: 1800,
      benchmarkValue: 6400,
      delta: -4600,
      deltaPercent: -71.8,
      unit: "views",
      status: "BELOW_BENCHMARK",
      interpretation: "Peers earn 3.5x higher median views.",
    },
    engagementRate: {
      metric: "Engagement Rate",
      creatorValue: 5.4,
      benchmarkValue: 4.8,
      delta: 0.6,
      deltaPercent: 12.5,
      unit: "%",
      status: "ABOVE_BENCHMARK",
      interpretation: "Strong viewer engagement.",
    },
    monthlyPostFrequency: {
      metric: "Monthly Upload Cadence",
      creatorValue: 4,
      benchmarkValue: 6,
      delta: -2,
      deltaPercent: -33.3,
      unit: "posts/mo",
      status: "BELOW_BENCHMARK",
      interpretation: "Peers publish 6 times per month.",
    },
    avgDurationSeconds: {
      metric: "Average Duration",
      creatorValue: 540,
      benchmarkValue: 720,
      delta: -180,
      deltaPercent: -25,
      unit: "sec",
      status: "BELOW_BENCHMARK",
      interpretation: "Peers publish 12-minute deep dives.",
    },
  },
  hookDistributionComparison: [
    {
      name: "CONTRARIAN",
      creatorShare: 15,
      benchmarkShare: 45,
      deltaShare: -30,
    },
  ],
  pillarDistributionComparison: [
    {
      name: "Case Studies",
      creatorShare: 20,
      benchmarkShare: 50,
      deltaShare: -30,
    },
  ],
  peerInsights: [
    {
      type: "OPPORTUNITY",
      title: "Contrarian Hooks Drive 2.4x Views in 10K–50K Tier",
      observation: "45% of peer hits open with a contrarian statement.",
      evidence: "Sampled across 96 videos.",
      actionableTakeaway: "Test contrarian hooks in your next 3 uploads.",
    },
  ],
  growthPlan: {
    headline: "Roadmap to 10,000 Subscribers",
    goalSummary: "Shift 30% of uploads toward Contrarian Case Studies.",
    whatPeersDoDifferently: [
      "Lead with a contrarian thesis in the first 15 seconds",
    ],
    steps: [
      {
        stepNumber: 1,
        focusArea: "HOOKS",
        title: "Adopt Contrarian Visual Openers",
        whyItWorksForPeers: "Captures curiosity velocity in browse feeds.",
        concreteAction:
          "Replace generic intros with a bold counter-intuitive claim.",
        peerExamples: ["Why 90% of Design Systems Fail (42K views)"],
        targetMetric: "+45% Median Views",
        suggestedExperiment: {
          hypothesis:
            "Contrarian hooks in the first 15s will lift median views by 35%.",
          targetPostCount: 3,
          suggestedDurationDays: 14,
          primaryMetric: "median_views",
        },
      },
    ],
    generatedBy: "GEMINI_AND_DETERMINISTIC_DATA",
    generatedAt: "2026-11-01T12:00:00Z",
  },
  peerCreators: [
    {
      id: "peer-1",
      channelId: "UC-peer-1",
      channelTitle: "Design Systems Weekly",
      channelHandle: "@designsystemsweekly",
      subscriberCount: 22400,
      medianViews: 8900,
      engagementRate: 6.1,
      monthlyPostFrequency: 5,
      isPublicData: true,
      sampleVideos: [],
    },
  ],
  disclaimer: "All peer benchmarks use public YouTube Data API v3 telemetry.",
};

function renderBenchmarksView() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <YouTubeConnectionProvider>
        <BenchmarksView />
      </YouTubeConnectionProvider>
    </QueryClientProvider>,
  );
}

describe("Feature: Goal-Driven Peer Benchmarks (BenchmarksView)", () => {
  const sampleUser = {
    id: "user-bench-1",
    email: "creator@lumen.studio",
    name: "Creator",
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

  it("renders peer cohort comparison, growth plan, and switches active goal", async () => {
    let currentBenchmark = { ...mockBenchmarkComparison };

    vi.spyOn(apiModule, "apiFetch").mockImplementation(async (input, init) => {
      const url = typeof input === "string" ? input : input.toString();
      const method = init?.method ?? "GET";

      if (url.includes("/api/auth/me")) {
        return new Response(JSON.stringify({ user: sampleUser }), { status: 200 });
      }
      if (url.includes("/api/youtube/connection")) {
        return new Response(JSON.stringify({ connected: false }), { status: 200 });
      }
      if (url.includes("/api/benchmarks/goals") && method === "GET") {
        return new Response(JSON.stringify(mockGoalsResponse), { status: 200 });
      }
      if (url.includes("/api/benchmarks/goals") && method === "POST") {
        currentBenchmark = {
          ...mockBenchmarkComparison,
          selectedGoal: {
            ...mockBenchmarkComparison.selectedGoal,
            id: "IMPROVE_VIEWERSHIP",
            title: "Increase Video Views",
            shortLabel: "Increase Views",
          },
        };
        return new Response(
          JSON.stringify({ selectedGoalId: "IMPROVE_VIEWERSHIP" }),
          { status: 200 },
        );
      }
      if (url.includes("/api/benchmarks")) {
        return new Response(JSON.stringify(currentBenchmark), { status: 200 });
      }
      if (url.includes("/api/experiments")) {
        return new Response(JSON.stringify([]), { status: 200 });
      }
      return new Response(JSON.stringify({}), { status: 200 });
    });

    renderBenchmarksView();

    // Verify growth plan and peer creator render
    expect(
      await screen.findByText("Roadmap to 10,000 Subscribers"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Adopt Contrarian Visual Openers"),
    ).toBeInTheDocument();
    expect(screen.getByText("Design Systems Weekly")).toBeInTheDocument();

    // Switch goal to "Increase Video Views"
    const increaseViewsTab = screen.getByRole("tab", {
      name: /Increase Video Views/i,
    });
    fireEvent.click(increaseViewsTab);

    expect(
      await screen.findByText(
        /Switched to Increase Video Views cohort & updated growth plan/i,
      ),
    ).toBeInTheDocument();
  });

  it("converts a Peer Growth Plan step into a tracked experiment in 1 click", async () => {
    vi.spyOn(apiModule, "apiFetch").mockImplementation(async (input, init) => {
      const url = typeof input === "string" ? input : input.toString();
      const method = init?.method ?? "GET";

      if (url.includes("/api/benchmarks/goals")) {
        return new Response(JSON.stringify(mockGoalsResponse), { status: 200 });
      }
      if (url.includes("/api/benchmarks")) {
        return new Response(JSON.stringify(mockBenchmarkComparison), {
          status: 200,
        });
      }
      if (url.includes("/api/experiments") && method === "GET") {
        return new Response(JSON.stringify([]), { status: 200 });
      }
      if (url.includes("/api/experiments") && method === "POST") {
        const body = JSON.parse(String(init?.body ?? "{}"));
        return new Response(
          JSON.stringify({
            id: "exp-created-1",
            title: body.title,
            hypothesis: body.hypothesis,
            category: body.category,
            status: "ACTIVE",
          }),
          { status: 201 },
        );
      }
      return new Response(JSON.stringify({ connected: false }), { status: 200 });
    });

    renderBenchmarksView();

    const startExpBtn = await screen.findByRole("button", {
      name: /Start Experiment/i,
    });
    fireEvent.click(startExpBtn);

    expect(
      await screen.findByText(
        /Started experiment: "Adopt Contrarian Visual Openers"/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Experiment Added to Backlog/i),
    ).toBeInTheDocument();
  });
});

