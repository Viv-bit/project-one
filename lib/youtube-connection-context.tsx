"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
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
};

const YouTubeConnectionContext = createContext<
  YouTubeConnectionContextValue | undefined
>(undefined);

export function YouTubeConnectionProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Default to unconnected empty state so new users and initial render immediately display empty state
  const [connectionState, setConnectionState] =
    useState<YouTubeConnectionState | null>({ connected: false });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("demo") === "connected";
    }
    return false;
  });

  const fetchConnection = useCallback(async () => {
    setError(null);
    try {
      const data = await getYouTubeConnection();
      setConnectionState(data);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "UNAUTHORIZED") {
        setError("UNAUTHORIZED");
      } else {
        setError("NOT_CONNECTED");
      }
      setConnectionState({ connected: false });
    }
  }, []);

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
