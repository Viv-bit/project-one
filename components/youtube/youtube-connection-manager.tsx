"use client";

import { useEffect, useState, useCallback } from "react";
import { type YouTubeConnectionState } from "@/lib/api";
import { getYouTubeConnection } from "@/lib/youtube";
import { YouTubeConnectCard } from "./youtube-connect-card";
import { YouTubeConnectedCard } from "./youtube-connected-card";
import { YouTubeLoadingCard } from "./youtube-loading-card";
import { YouTubeErrorBanner } from "./youtube-error-banner";
import { Icon } from "@/components/ui/icon";

type YouTubeConnectionManagerProps = {
  initialError?: string;
};

export function YouTubeConnectionManager({
  initialError,
}: YouTubeConnectionManagerProps) {
  const [connectionState, setConnectionState] =
    useState<YouTubeConnectionState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check URL params for error
  useEffect(() => {
    // Check initial prop or window.location.search
    let errorParam = initialError;
    if (!errorParam && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      errorParam = params.get("error") ?? undefined;
    }

    if (errorParam === "youtube") {
      setErrorMessage(
        "YouTube account connection was not completed. Google consent was cancelled or an error occurred during authorization.",
      );
    } else if (errorParam) {
      setErrorMessage(
        `Connection notice: ${errorParam}. Please try connecting again.`,
      );
    }
  }, [initialError]);

  const loadConnection = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getYouTubeConnection();
      setConnectionState(data);
    } catch (err: unknown) {
      console.error("Failed to fetch YouTube connection status:", err);
      // If unauthorized, could be that session expired
      if (err instanceof Error && err.message === "UNAUTHORIZED") {
        setErrorMessage(
          "Your creator session could not be verified. Please ensure you are logged in.",
        );
      }
      // Set default not connected state so the user can still see the connect button
      setConnectionState({ connected: false });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConnection();
  }, [loadConnection]);

  const handleDisconnected = () => {
    setConnectionState({ connected: false });
    showToast("YouTube account disconnected successfully.");
  };

  const handleDismissError = () => {
    setErrorMessage(null);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.searchParams.has("error")) {
        url.searchParams.delete("error");
        window.history.replaceState({}, "", url.pathname + url.search);
      }
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  return (
    <div className="w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-line bg-ink px-4 py-3 text-sm text-cream shadow-2xl animate-in slide-in-from-bottom-3 duration-200"
        >
          <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Icon name="check" className="size-3" />
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Error banner from URL parameter or fetch error */}
      {errorMessage && (
        <YouTubeErrorBanner
          message={errorMessage}
          onDismiss={handleDismissError}
        />
      )}

      {/* Main Connection State */}
      {isLoading ? (
        <YouTubeLoadingCard />
      ) : connectionState?.connected ? (
        <YouTubeConnectedCard
          channel={connectionState.channel}
          onRefresh={async () => {
            await loadConnection();
            showToast("Channel metrics updated from YouTube API.");
          }}
          onDisconnected={handleDisconnected}
        />
      ) : (
        <YouTubeConnectCard />
      )}
    </div>
  );
}
