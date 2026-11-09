import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as apiModule from "@/lib/api";
import { YouTubeConnectionProvider } from "@/lib/youtube-connection-context";
import { YouTubeConnectionManager } from "@/components/youtube/youtube-connection-manager";
import { useAnalyticsStore } from "@/lib/store/analytics-store";
import { YOUTUBE_RECONNECT_REQUIRED_CODE } from "@/lib/youtube";

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <YouTubeConnectionProvider>{ui}</YouTubeConnectionProvider>
    </QueryClientProvider>,
  );
}

describe("Feature: YouTube Connection Manager", () => {
  const sampleUser = {
    id: "user-yt-1",
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

  it("renders connect card when user has not connected a YouTube channel", async () => {
    vi.spyOn(apiModule, "apiFetch").mockImplementation(async (input) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url.includes("/api/auth/me")) {
        return new Response(JSON.stringify({ user: sampleUser }), { status: 200 });
      }
      if (url.includes("/api/youtube/connection")) {
        return new Response(JSON.stringify({ connected: false }), { status: 200 });
      }
      return new Response(JSON.stringify({}), { status: 200 });
    });

    renderWithProviders(<YouTubeConnectionManager />);

    expect(
      await screen.findByText(/Connect Your YouTube Channel/i),
    ).toBeInTheDocument();
  });

  it("renders connected channel details and runs manual sync with toast confirmation", async () => {
    const channelData = {
      id: "UC-1234567890",
      title: "Creative Flow Lab",
      handle: "@creativeflowlab",
      thumbnailUrl: null,
      subscriberCount: 24500,
      videoCount: 68,
    };

    vi.spyOn(apiModule, "apiFetch").mockImplementation(async (input, init) => {
      const url = typeof input === "string" ? input : input.toString();
      const method = init?.method ?? "GET";

      if (url.includes("/api/auth/me")) {
        return new Response(JSON.stringify({ user: sampleUser }), { status: 200 });
      }
      if (url.includes("/api/youtube/connection")) {
        return new Response(
          JSON.stringify({ connected: true, channel: channelData }),
          { status: 200 },
        );
      }
      if (url.includes("/api/youtube/sync") && method === "POST") {
        return new Response(
          JSON.stringify({
            message: "Synced",
            syncedCount: 20,
            classifiedCount: 20,
            posts: [
              {
                id: "v1",
                externalId: "yt1",
                title: "Video 1",
                publishedAt: "2026-01-01T00:00:00Z",
                features: { topic: "Design", hookType: "QUESTION" },
              },
            ],
          }),
          { status: 200 },
        );
      }
      return new Response(JSON.stringify({}), { status: 200 });
    });

    renderWithProviders(<YouTubeConnectionManager />);

    expect(
      await screen.findByText("Creative Flow Lab"),
    ).toBeInTheDocument();
    expect(screen.getByText("24.5K")).toBeInTheDocument();
    expect(screen.getByText("68")).toBeInTheDocument();

    const syncButton = screen.getByRole("button", { name: /Sync Channel/i });
    fireEvent.click(syncButton);

    expect(
      await screen.findByText(
        /Channel metrics, medians, and AI analysis updated/i,
      ),
    ).toBeInTheDocument();
  });

  it("displays YouTube Reconnection Required banner and allows dismissing it", async () => {
    useAnalyticsStore.setState({
      youtubeReconnectMessage:
        "YouTube OAuth token expired. Please reconnect your channel.",
    });

    vi.spyOn(apiModule, "apiFetch").mockResolvedValue(
      new Response(JSON.stringify({ connected: false }), { status: 200 }),
    );

    renderWithProviders(
      <YouTubeConnectionManager
        initialError={YOUTUBE_RECONNECT_REQUIRED_CODE}
      />,
    );

    expect(
      await screen.findByText(/YouTube Reconnection Required/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /YouTube OAuth token expired\. Please reconnect your channel\./i,
      ),
    ).toBeInTheDocument();

    const dismissBtn = screen.getByRole("button", { name: /^Dismiss$/ });
    fireEvent.click(dismissBtn);

    await waitFor(() => {
      expect(
        useAnalyticsStore.getState().youtubeReconnectMessage,
      ).toBeNull();
    });
  });
});
