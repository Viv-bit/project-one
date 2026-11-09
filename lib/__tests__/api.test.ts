import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  apiFetch,
  authLogoutUrl,
  authSigninUrl,
  benchmarksUrl,
  DEFAULT_YOUTUBE_RECONNECT_MESSAGE,
  handleAuthError,
  isYouTubeReconnectError,
  logoutUser,
  YOUTUBE_RECONNECT_REQUIRED_CODE,
  YouTubeReconnectRequiredError,
} from "../api";
import { useAnalyticsStore } from "../store/analytics-store";

describe("lib/api", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.restoreAllMocks();
    useAnalyticsStore.setState({
      currentUser: {
        id: "u1",
        email: "creator@example.com",
        name: "Creator",
        createdAt: "2026-01-01T00:00:00Z",
      },
      youtubeReconnectMessage: null,
      youtubeReconnectToast: null,
    });

    Object.defineProperty(window, "location", {
      configurable: true,
      writable: true,
      value: { href: "http://localhost:3000/dashboard" },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      writable: true,
      value: originalLocation,
    });
  });

  describe("YouTubeReconnectRequiredError & isYouTubeReconnectError", () => {
    it("creates error with default message and code", () => {
      const err = new YouTubeReconnectRequiredError();
      expect(err.message).toBe(DEFAULT_YOUTUBE_RECONNECT_MESSAGE);
      expect(err.code).toBe(YOUTUBE_RECONNECT_REQUIRED_CODE);
      expect(err.name).toBe("YouTubeReconnectRequiredError");
      expect(isYouTubeReconnectError(err)).toBe(true);
    });

    it("detects plain error objects carrying YOUTUBE_RECONNECT_REQUIRED_CODE", () => {
      expect(
        isYouTubeReconnectError({ code: YOUTUBE_RECONNECT_REQUIRED_CODE }),
      ).toBe(true);
      expect(isYouTubeReconnectError(new Error("Normal error"))).toBe(false);
      expect(isYouTubeReconnectError(null)).toBe(false);
    });
  });

  describe("apiFetch", () => {
    it("attaches credentials: include and default Accept header", async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );
      vi.stubGlobal("fetch", fetchMock);

      const res = await apiFetch(benchmarksUrl);
      expect(res.status).toBe(200);
      expect(fetchMock).toHaveBeenCalledTimes(1);

      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe(benchmarksUrl);
      expect(init.credentials).toBe("include");
      expect((init.headers as Headers).get("Accept")).toBe("application/json");
    });

    it("throws YouTubeReconnectRequiredError and updates store when response has YOUTUBE_RECONNECT_REQUIRED code", async () => {
      const customMessage = "Please re-authorize YouTube access.";
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            code: YOUTUBE_RECONNECT_REQUIRED_CODE,
            message: customMessage,
          }),
          { status: 403, headers: { "Content-Type": "application/json" } },
        ),
      );
      vi.stubGlobal("fetch", fetchMock);

      await expect(apiFetch(benchmarksUrl)).rejects.toThrowError(
        new YouTubeReconnectRequiredError(customMessage),
      );

      expect(useAnalyticsStore.getState().youtubeReconnectMessage).toBe(
        customMessage,
      );
    });

    it("triggers auto-logout and throws UNAUTHORIZED on 401 for protected endpoints", async () => {
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ message: "Unauthorized" }), {
            status: 401,
          }),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ ok: true }), { status: 200 }),
        );
      vi.stubGlobal("fetch", fetchMock);

      await expect(apiFetch(benchmarksUrl)).rejects.toThrow("UNAUTHORIZED");

      expect(useAnalyticsStore.getState().currentUser).toBeNull();
      expect(window.location.href).toBe("/sign-in");
    });

    it("does not trigger auto-logout on 401 for excluded auth endpoints", async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "Invalid credentials" }), {
          status: 401,
        }),
      );
      vi.stubGlobal("fetch", fetchMock);

      const res = await apiFetch(authSigninUrl, { method: "POST" });
      expect(res.status).toBe(401);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("detects 403 token expired message as authentication error", async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "JWT expired" }), {
          status: 403,
        }),
      );
      vi.stubGlobal("fetch", fetchMock);

      await expect(apiFetch(benchmarksUrl)).rejects.toThrow("UNAUTHORIZED");
      expect(useAnalyticsStore.getState().currentUser).toBeNull();
    });
  });

  describe("logoutUser & handleAuthError", () => {
    it("logoutUser clears store session, calls logout endpoint, and redirects by default", async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );
      vi.stubGlobal("fetch", fetchMock);

      await logoutUser(true);

      expect(useAnalyticsStore.getState().currentUser).toBeNull();
      expect(fetchMock).toHaveBeenCalledWith(
        authLogoutUrl,
        expect.objectContaining({
          method: "POST",
          credentials: "include",
        }),
      );
      expect(window.location.href).toBe("/sign-in");
    });

    it("logoutUser skips redirect when redirectToSignIn is false", async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );
      vi.stubGlobal("fetch", fetchMock);

      await logoutUser(false);

      expect(useAnalyticsStore.getState().currentUser).toBeNull();
      expect(window.location.href).toBe("http://localhost:3000/dashboard");
    });

    it("handleAuthError clears session even if logout network call rejects", async () => {
      const fetchMock = vi.fn().mockRejectedValue(new Error("Network error"));
      vi.stubGlobal("fetch", fetchMock);

      await handleAuthError();
      expect(useAnalyticsStore.getState().currentUser).toBeNull();
    });
  });
});

