import { describe, it, expect, vi, beforeEach } from "vitest";
import * as apiModule from "../api";
import {
  formatCount,
  getYouTubeConnection,
  disconnectYouTubeConnection,
  syncYouTubeVideos,
  analyzeYouTubeVideos,
  getYouTubeVideos,
} from "../youtube";
import { useAnalyticsStore } from "../store/analytics-store";

describe("lib/youtube", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useAnalyticsStore.setState({
      youtubeReconnectMessage: null,
      youtubeReconnectToast: null,
    });
  });

  describe("formatCount", () => {
    it("formats null and undefined as em-dash", () => {
      expect(formatCount(null)).toBe("—");
      expect(formatCount(undefined)).toBe("—");
    });

    it("formats thousands and millions compactly", () => {
      expect(formatCount(500)).toBe((500).toLocaleString());
      expect(formatCount(1_000)).toBe("1K");
      expect(formatCount(12_400)).toBe("12.4K");
      expect(formatCount(1_000_000)).toBe("1M");
      expect(formatCount(2_500_000)).toBe("2.5M");
    });
  });

  describe("getYouTubeConnection & disconnectYouTubeConnection", () => {
    it("fetches connection state", async () => {
      const state = {
        connected: true,
        channel: {
          id: "ch1",
          title: "Creator Channel",
          handle: "@creator",
          thumbnailUrl: null,
          subscriberCount: 4200,
          videoCount: 30,
        },
      };
      vi.spyOn(apiModule, "apiFetch").mockResolvedValue(
        new Response(JSON.stringify(state), { status: 200 }),
      );

      await expect(getYouTubeConnection()).resolves.toEqual(state);
    });

    it("disconnects YouTube account via DELETE", async () => {
      vi.spyOn(apiModule, "apiFetch").mockResolvedValue(
        new Response(JSON.stringify({ message: "Disconnected" }), {
          status: 200,
        }),
      );

      await expect(disconnectYouTubeConnection()).resolves.toEqual({
        message: "Disconnected",
      });
      expect(apiModule.apiFetch).toHaveBeenCalledWith(
        apiModule.youtubeConnectionUrl,
        expect.objectContaining({ method: "DELETE" }),
      );
    });
  });

  describe("syncYouTubeVideos & analyzeYouTubeVideos", () => {
    it("syncs videos with default options and clears reconnect error", async () => {
      useAnalyticsStore.setState({ youtubeReconnectMessage: "Old error" });
      const syncResult = { message: "Synced", syncedCount: 20 };
      vi.spyOn(apiModule, "apiFetch").mockResolvedValue(
        new Response(JSON.stringify(syncResult), { status: 200 }),
      );

      const res = await syncYouTubeVideos();
      expect(res).toEqual(syncResult);
      expect(useAnalyticsStore.getState().youtubeReconnectMessage).toBeNull();
      expect(apiModule.apiFetch).toHaveBeenCalledWith(
        apiModule.youtubeSyncUrl,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ count: 20, classify: true }),
        }),
      );
    });

    it("analyzes videos with force and postIds", async () => {
      const analyzeResult = { message: "Analyzed", analyzedCount: 2 };
      vi.spyOn(apiModule, "apiFetch").mockResolvedValue(
        new Response(JSON.stringify(analyzeResult), { status: 200 }),
      );

      const res = await analyzeYouTubeVideos({
        force: true,
        postIds: ["p1", "p2"],
      });
      expect(res).toEqual(analyzeResult);
      expect(apiModule.apiFetch).toHaveBeenCalledWith(
        apiModule.youtubeAnalyzeUrl,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ force: true, postIds: ["p1", "p2"] }),
        }),
      );
    });
  });

  describe("getYouTubeVideos", () => {
    it("unwraps array, { videos }, or { posts } responses", async () => {
      const sampleVideo = {
        id: "v1",
        externalId: "yt1",
        title: "Video 1",
        publishedAt: "2026-01-01T00:00:00Z",
      };

      vi.spyOn(apiModule, "apiFetch")
        .mockResolvedValueOnce(
          new Response(JSON.stringify([sampleVideo]), { status: 200 }),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ videos: [sampleVideo] }), {
            status: 200,
          }),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ posts: [sampleVideo] }), {
            status: 200,
          }),
        );

      await expect(getYouTubeVideos()).resolves.toEqual([sampleVideo]);
      await expect(getYouTubeVideos()).resolves.toEqual([sampleVideo]);
      await expect(getYouTubeVideos()).resolves.toEqual([sampleVideo]);
    });
  });
});

