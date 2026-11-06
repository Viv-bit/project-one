"use client";

import React, { useState, useEffect, type ReactNode } from "react";
import {
  QueryClient,
  QueryClientProvider,
  isServer,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { hydrateQueryClientFromStore } from "@/lib/queries";
import { isYouTubeReconnectError } from "@/lib/api";
import { useAnalyticsStore } from "@/lib/store/analytics-store";
import { YouTubeReconnectHandler } from "@/components/youtube/youtube-reconnect-handler";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Keep data fresh for 1 minute before marking stale
        staleTime: 60 * 1000,
        // Automatically refetch when user refocuses window
        refetchOnWindowFocus: true,
        // Retry failed queries once unless it's an unauthenticated or YouTube reconnect error
        retry: (failureCount, error) => {
          if (
            (error instanceof Error && error.message === "UNAUTHORIZED") ||
            isYouTubeReconnectError(error)
          ) {
            return false;
          }
          return failureCount < 1;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    // Server: always create a fresh query client
    return makeQueryClient();
  }
  // Browser: make a new query client if we don't already have one
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

export function QueryProvider({ children }: { children: ReactNode }) {
  // QueryClient instance created once per component lifecycle
  const [queryClient] = useState(() => getQueryClient());

  useEffect(() => {
    void Promise.resolve(useAnalyticsStore.persist.rehydrate()).then(() => {
      hydrateQueryClientFromStore(queryClient);
    });

    let previousUserId = useAnalyticsStore.getState().currentUser?.id ?? null;

    const unsubscribe = useAnalyticsStore.subscribe((state) => {
      const nextUserId = state.currentUser?.id ?? null;
      if (nextUserId === previousUserId) {
        return;
      }

      if (!nextUserId) {
        // User logged out: clear in-memory query cache while preserving localStorage snapshot for future logins
        queryClient.removeQueries({ queryKey: queryKeys.auth.all });
        queryClient.removeQueries({ queryKey: queryKeys.youtube.all });
        queryClient.removeQueries({ queryKey: queryKeys.creator.all });
        queryClient.removeQueries({ queryKey: queryKeys.insights.all });
        queryClient.removeQueries({ queryKey: queryKeys.benchmarks.all });
        queryClient.removeQueries({ queryKey: queryKeys.experiments.all });
      } else {
        // User logged in (or switched accounts): clear previous user's in-memory queries & pull saved localStorage analytics
        if (previousUserId && previousUserId !== nextUserId) {
          queryClient.clear();
        }
        hydrateQueryClientFromStore(queryClient);
      }

      previousUserId = nextUserId;
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <YouTubeReconnectHandler />
    </QueryClientProvider>
  );
}
