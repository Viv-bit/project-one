import { describe, it, expect, beforeEach } from "vitest";
import {
  useAnalyticsStore,
  selectLoggedInAnalytics,
} from "../store/analytics-store";

describe("lib/store/analytics-store", () => {
  const sampleUser = {
    id: "user-1",
    email: "creator@example.com",
    name: "Creator",
    createdAt: "2026-01-01T00:00:00Z",
  };

  beforeEach(() => {
    useAnalyticsStore.setState({
      hasHydrated: true,
      currentUser: null,
      analyticsByUser: {},
      autoSyncStage: "idle",
      syncVersion: 0,
      youtubeReconnectMessage: null,
      youtubeReconnectToast: null,
    });
  });

  it("merges pending analytics into user bucket when setAuthenticatedUser is called", () => {
    const store = useAnalyticsStore.getState();
    store.saveConnection({ connected: false });

    expect(useAnalyticsStore.getState().analyticsByUser["__pending__"]).toBeDefined();

    useAnalyticsStore.getState().setAuthenticatedUser(sampleUser);

    const state = useAnalyticsStore.getState();
    expect(state.currentUser).toEqual(sampleUser);
    expect(state.analyticsByUser["__pending__"]).toBeUndefined();
    expect(state.analyticsByUser[sampleUser.id]?.connection).toEqual({
      connected: false,
    });
  });

  it("compacts saved videos to at most 50 items and trims descriptions to 240 chars", () => {
    useAnalyticsStore.getState().setAuthenticatedUser(sampleUser);

    const longDesc = "a".repeat(500);
    const videos = Array.from({ length: 60 }, (_, idx) => ({
      id: `v-${idx}`,
      externalId: `yt-${idx}`,
      title: `Video ${idx}`,
      description: longDesc,
      publishedAt: "2026-01-01T00:00:00Z",
      metrics: [
        { views: 100, likes: 10, comments: 2 },
        { views: 90, likes: 9, comments: 1 },
      ],
    }));

    useAnalyticsStore.getState().saveVideos(videos);

    const saved = selectLoggedInAnalytics(useAnalyticsStore.getState());
    expect(saved?.videos).toHaveLength(50);
    expect(saved?.videos[0].description).toHaveLength(240);
    expect(saved?.videos[0].metrics).toHaveLength(1);
  });

  it("preserves user analytics cache across clearSession and restores upon re-login", () => {
    useAnalyticsStore.getState().setAuthenticatedUser(sampleUser);
    useAnalyticsStore.getState().markSynced(1700000000000);

    useAnalyticsStore.getState().clearSession();
    expect(useAnalyticsStore.getState().currentUser).toBeNull();
    expect(selectLoggedInAnalytics(useAnalyticsStore.getState())).toBeNull();

    useAnalyticsStore.getState().setAuthenticatedUser(sampleUser);
    expect(
      selectLoggedInAnalytics(useAnalyticsStore.getState())?.lastSyncedAt,
    ).toBe(1700000000000);
  });
});

