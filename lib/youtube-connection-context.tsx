"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";
import { type YouTubeConnectionState, type YouTubeChannel } from "./api";
import { getYouTubeConnection, startYouTubeOAuth } from "./youtube";

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
  // Automatic sync status
  isAutoSyncing: boolean;
  syncVersion: number;
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

  // Default to unconnected empty state so new users and initial render immediately display empty state
  const [connectionState, setConnectionState] =
    useState<YouTubeConnectionState | null>({ connected: false });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);
  const [syncVersion, setSyncVersion] = useState(0);
  const [isDemoMode, setIsDemoMode] = useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("demo") === "connected";
    }
    return false;
  });

  const fetchConnection = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await getYouTubeConnection();
      setConnectionState(data);
      // Keep TanStack query cache synchronized
      queryClient.setQueryData(queryKeys.youtube.connection(), data);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "UNAUTHORIZED") {
        setError("UNAUTHORIZED");
      } else {
        setError("NOT_CONNECTED");
      }
      setConnectionState({ connected: false });
      queryClient.setQueryData(queryKeys.youtube.connection(), { connected: false });
    } finally {
      setIsLoading(false);
    }
  }, [queryClient]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchConnection();
  }, [fetchConnection]);

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => !prev);
  };

  const isConnected = isDemoMode
    ? true
    : Boolean(connectionState && connectionState.connected);

  const channel = isConnected
    ? connectionState && connectionState.connected
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

  // Auto-sync trigger when channel is connected but has 0 videos synced
  useEffect(() => {
    if (!isConnected || isDemoMode || isAutoSyncing) return;

    let isMounted = true;
    async function checkAndAutoSync() {
      try {
        const { getYouTubeVideos, syncYouTubeVideos } = await import("./youtube");
        const videos = await getYouTubeVideos();
        if (!isMounted) return;

        if (Array.isArray(videos) && videos.length === 0) {
          const channelId = channel?.id || connectionState?.channel?.id || "default";
          const storageKey = `yt_autosync_attempted_${channelId}`;

          if (typeof window !== "undefined" && !sessionStorage.getItem(storageKey)) {
            sessionStorage.setItem(storageKey, "true");
            setIsAutoSyncing(true);

            try {
              await syncYouTubeVideos({ count: 20, classify: true });
              if (isMounted) {
                setSyncVersion((v) => v + 1);
                void fetchConnection();
                // Invalidate all queries across the application to trigger automatic re-fetch
                void queryClient.invalidateQueries({ queryKey: queryKeys.all });
              }
            } catch (syncErr) {
              console.warn("Background auto-sync failed:", syncErr);
            } finally {
              if (isMounted) {
                setIsAutoSyncing(false);
              }
            }
          }
        }
      } catch (err) {
        console.warn("Auto-sync check encountered an error:", err);
      }
    }

    void checkAndAutoSync();

    return () => {
      isMounted = false;
    };
  }, [isConnected, isDemoMode, isAutoSyncing, channel?.id, connectionState?.channel?.id, fetchConnection, queryClient]);

  return (
    <YouTubeConnectionContext.Provider
      value={{
        connectionState,
        isLoading,
        isConnected,
        channel,
        error,
        refreshConnection: fetchConnection,
        connectYouTube: startYouTubeOAuth,
        isDemoMode,
        toggleDemoMode,
        isAutoSyncing,
        syncVersion,
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
