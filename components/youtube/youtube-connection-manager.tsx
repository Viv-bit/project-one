"use client";

import { useState } from "react";
import { useYouTubeConnection } from "@/lib/youtube-connection-context";
import {
  DEFAULT_YOUTUBE_RECONNECT_MESSAGE,
  YOUTUBE_RECONNECT_REQUIRED_CODE,
} from "@/lib/youtube";
import { useAnalyticsStore } from "@/lib/store/analytics-store";
import { YouTubeConnectCard } from "./youtube-connect-card";
import { YouTubeConnectedCard } from "./youtube-connected-card";
import { YouTubeLoadingCard } from "./youtube-loading-card";
import { YouTubeErrorBanner } from "./youtube-error-banner";
import { Icon } from "@/components/ui/icon";

type YouTubeConnectionManagerProps = {
  initialError?: string;
  initialMessage?: string;
};

export function YouTubeConnectionManager({
  initialError,
  initialMessage,
}: YouTubeConnectionManagerProps) {
  const {
    connectionState,
    isLoading,
    error: connectionError,
    refreshConnection,
    triggerAutoSync,
  } = useYouTubeConnection();

  const youtubeReconnectMessage = useAnalyticsStore(
    (s) => s.youtubeReconnectMessage,
  );
  const clearYouTubeReconnectError = useAnalyticsStore(
    (s) => s.clearYouTubeReconnectError,
  );

  const [dismissedUrlError, setDismissedUrlError] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isReconnectUrlError = initialError === YOUTUBE_RECONNECT_REQUIRED_CODE;

  const urlErrorMessage = !dismissedUrlError
    ? isReconnectUrlError
      ? initialMessage || DEFAULT_YOUTUBE_RECONNECT_MESSAGE
      : initialError === "youtube"
        ? "YouTube account connection was not completed. Google consent was cancelled or an error occurred during authorization."
        : initialError
          ? `Connection notice: ${initialError}. Please try connecting again.`
          : connectionError === "UNAUTHORIZED"
            ? "Your creator session could not be verified. Please ensure you are logged in."
            : null
    : null;

  const errorMessage = youtubeReconnectMessage ?? urlErrorMessage;
  const isReconnectRequired = Boolean(
    youtubeReconnectMessage || (!dismissedUrlError && isReconnectUrlError),
  );

  const handleDisconnected = () => {
    useAnalyticsStore.getState().clearActiveChannelAnalytics();
    void refreshConnection();
    showToast("YouTube account disconnected successfully.");
  };

  const handleDismissError = () => {
    clearYouTubeReconnectError();
    setDismissedUrlError(true);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.searchParams.has("error") || url.searchParams.has("message")) {
        url.searchParams.delete("error");
        url.searchParams.delete("message");
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
          title={
            isReconnectRequired
              ? "YouTube Reconnection Required"
              : "YouTube Connection Failed"
          }
          actionLabel={
            isReconnectRequired ? "Reconnect YouTube Account" : "Try Again"
          }
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
          reconnectRequired={isReconnectRequired}
          onRefresh={async () => {
            await refreshConnection();
            const synced = await triggerAutoSync({ force: true });
            if (synced) {
              showToast("Channel metrics, medians, and AI analysis updated.");
            }
          }}
          onDisconnected={handleDisconnected}
        />
      ) : (
        <YouTubeConnectCard />
      )}
    </div>
  );
}
