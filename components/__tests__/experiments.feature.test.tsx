import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as apiModule from "@/lib/api";
import { ExperimentBacklogView } from "@/components/experiments/experiment-backlog-view";
import { useAnalyticsStore } from "@/lib/store/analytics-store";
import type { ApiExperiment } from "@/lib/experiments";

const sampleExperiments: ApiExperiment[] = [
  {
    id: "exp-1",
    userId: "user-1",
    title: "Contrarian Question Openers",
    hypothesis: "Opening with a polarizing question lifts median views by 30%.",
    category: "HOOKS",
    primaryMetric: "median_views",
    targetPostCount: 3,
    durationDays: 14,
    status: "ACTIVE",
    baselineMetricValue: 2000,
    startDate: "2026-10-25T00:00:00Z",
    posts: [
      { id: "ep-1", postId: "v-1", addedAt: "2026-10-26T00:00:00Z" },
      { id: "ep-2", postId: "v-2", addedAt: "2026-10-28T00:00:00Z" },
    ],
    progress: {
      currentPostsCount: 2,
      targetPostCount: 3,
      daysElapsed: 5,
      durationDays: 14,
      isDataSufficient: false,
    },
  },
];

const sampleVideos = [
  {
    id: "v-1",
    externalId: "yt-1",
    title: "Why Minimalist Setups Fail",
    publishedAt: "2026-10-26T00:00:00Z",
    views: 3400,
    features: { hookType: "CONTRARIAN" },
  },
  {
    id: "v-2",
    externalId: "yt-2",
    title: "Do You Really Need 4K?",
    publishedAt: "2026-10-28T00:00:00Z",
    views: 4100,
    features: { hookType: "QUESTION" },
  },
  {
    id: "v-3",
    externalId: "yt-3",
    title: "The Desk Layout Nobody Talks About",
    publishedAt: "2026-11-01T00:00:00Z",
    views: 5200,
    features: { hookType: "CURIOSITY" },
  },
];

function renderBacklog() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ExperimentBacklogView />
    </QueryClientProvider>,
  );
}

describe("Feature: Hypothesis & Experiment Backlog (ExperimentBacklogView)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useAnalyticsStore.setState({
      hasHydrated: true,
      currentUser: {
        id: "user-1",
        email: "creator@lumen.studio",
        name: "Creator",
        createdAt: "2026-01-01T00:00:00Z",
      },
      analyticsByUser: {},
    });
  });

  it("renders tracked experiments, data sufficiency progress, and evaluates outcome", async () => {
    vi.spyOn(apiModule, "apiFetch").mockImplementation(async (input, init) => {
      const url = typeof input === "string" ? input : input.toString();
      const method = init?.method ?? "GET";

      if (url.includes("/api/experiments") && method === "GET") {
        return new Response(JSON.stringify(sampleExperiments), { status: 200 });
      }
      if (url.includes("/api/youtube/videos") && method === "GET") {
        return new Response(JSON.stringify(sampleVideos), { status: 200 });
      }
      if (url.includes("/api/experiments/exp-1/results") && method === "POST") {
        return new Response(
          JSON.stringify({
            id: "res-1",
            baselineValue: 2000,
            experimentValue: 4233,
            deltaPercent: 111.6,
            sampleSize: 3,
            isDataSufficient: true,
            conclusion: "POSITIVE",
            summary: "Statistically validated +111.6% lift.",
            evaluatedAt: "2026-11-09T00:00:00Z",
          }),
          { status: 200 },
        );
      }
      return new Response(JSON.stringify({}), { status: 200 });
    });

    renderBacklog();

    expect(
      await screen.findByText("Contrarian Question Openers"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/2 of 3 Target Uploads Evaluated/i),
    ).toBeInTheDocument();

    const evalButton = screen.getByRole("button", {
      name: /Evaluate Outcome/i,
    });
    fireEvent.click(evalButton);

    expect(
      await screen.findByText(/Evaluation complete: POSITIVE \(\+111\.6% lift\)!/i),
    ).toBeInTheDocument();
  });

  it("links an ingested YouTube video to an active experiment cohort", async () => {
    let linkCalledWith: { postId?: string } | null = null;

    vi.spyOn(apiModule, "apiFetch").mockImplementation(async (input, init) => {
      const url = typeof input === "string" ? input : input.toString();
      const method = init?.method ?? "GET";

      if (url.includes("/api/experiments") && method === "GET") {
        return new Response(JSON.stringify(sampleExperiments), { status: 200 });
      }
      if (url.includes("/api/youtube/videos") && method === "GET") {
        return new Response(JSON.stringify(sampleVideos), { status: 200 });
      }
      if (url.includes("/api/experiments/exp-1/posts") && method === "POST") {
        linkCalledWith = JSON.parse(String(init?.body ?? "{}"));
        return new Response(JSON.stringify(sampleExperiments[0]), {
          status: 200,
        });
      }
      return new Response(JSON.stringify({}), { status: 200 });
    });

    renderBacklog();

    const openLinkModalBtn = await screen.findByRole("button", {
      name: /Link Ingested Upload/i,
    });
    fireEvent.click(openLinkModalBtn);

    const selectEl = await screen.findByRole("combobox");
    fireEvent.change(selectEl, { target: { value: "v-3" } });

    const confirmLinkBtn = screen.getByRole("button", {
      name: /^Link Video$/i,
    });
    fireEvent.click(confirmLinkBtn);

    await waitFor(() => {
      expect(linkCalledWith).toEqual({ postId: "v-3" });
      expect(
        screen.getByText(/Video linked successfully!/i),
      ).toBeInTheDocument();
    });
  });
});

