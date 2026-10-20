import {
  apiUrl,
  youtubeConnectionUrl,
  type YouTubeConnectionState,
} from "./api";

export async function getYouTubeConnection(): Promise<YouTubeConnectionState> {
  const response = await fetch(youtubeConnectionUrl, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }
    throw new Error(`Failed to fetch YouTube connection status (${response.status})`);
  }

  const data = (await response.json()) as YouTubeConnectionState;
  return data;
}

export async function disconnectYouTubeConnection(): Promise<{ message: string }> {
  const response = await fetch(youtubeConnectionUrl, {
    method: "DELETE",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? "Failed to disconnect YouTube account");
  }

  const data = (await response.json()) as { message: string };
  return data;
}

export function startYouTubeOAuth(): void {
  // Directly redirect browser to the connect endpoint as required by OAuth specifications
  window.location.href = `${apiUrl}/api/youtube/connect`;
}

export function formatCount(count: number | null | undefined): string {
  if (count === null || count === undefined) {
    return "—";
  }

  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return count.toLocaleString();
}
