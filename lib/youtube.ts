import {
  apiUrl,
  youtubeConnectionUrl,
  youtubeSyncUrl,
  youtubeAnalyzeUrl,
  youtubeVideosUrl,
  type YouTubeConnectionState,
} from "./api";

export type YouTubeVideoFeatures = {
  id?: string;
  topic?: string | null;
  pillar?: string | null;
  hookType?: string | null;
  ctaType?: string | null;
  tone?: string | null;
  intent?: string | null;
  targetAudience?: string | null;
  storytellingStyle?: string | null;
  classifiedAt?: string;
};

export type YouTubeVideoItem = {
  id: string;
  externalId: string;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  publishedAt: string;
  durationSeconds?: number | null;
  metrics?: {
    views: number;
    likes: number;
    comments: number;
    recordedAt?: string;
  }[];
  features?: YouTubeVideoFeatures | null;
  views?: number;
  likes?: number;
  comments?: number;
};

export type SyncYouTubeOptions = {
  count?: number;
  classify?: boolean;
};

export type SyncYouTubeResult = {
  message: string;
  syncedCount: number;
  classifiedCount?: number;
  posts?: YouTubeVideoItem[];
};

export type AnalyzeYouTubeOptions = {
  force?: boolean;
  postIds?: string[];
};

export type AnalyzeYouTubeResult = {
  message: string;
  analyzedCount: number;
  results?: Array<{
    postId: string;
    features: YouTubeVideoFeatures;
  }>;
};

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

/**
 * Sync YouTube videos from the connected channel.
 * Optionally runs Gemini AI classification on imported videos.
 */
export async function syncYouTubeVideos(
  options?: SyncYouTubeOptions,
): Promise<SyncYouTubeResult> {
  const response = await fetch(youtubeSyncUrl, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      count: options?.count ?? 20,
      classify: options?.classify ?? true,
    }),
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("UNAUTHORIZED");
    const err = await response.json().catch(() => null);
    throw new Error(err?.message ?? `Failed to sync YouTube videos (${response.status})`);
  }

  return (await response.json()) as SyncYouTubeResult;
}

/**
 * Run Gemini AI classification on unanalyzed posts or re-classify.
 */
export async function analyzeYouTubeVideos(
  options?: AnalyzeYouTubeOptions,
): Promise<AnalyzeYouTubeResult> {
  const response = await fetch(youtubeAnalyzeUrl, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      force: options?.force ?? false,
      ...(options?.postIds && { postIds: options.postIds }),
    }),
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("UNAUTHORIZED");
    const err = await response.json().catch(() => null);
    throw new Error(err?.message ?? `Failed to analyze videos with Gemini (${response.status})`);
  }

  return (await response.json()) as AnalyzeYouTubeResult;
}

/**
 * Fetch all ingested user videos with latest metrics and AI features.
 */
export async function getYouTubeVideos(): Promise<YouTubeVideoItem[]> {
  const response = await fetch(youtubeVideosUrl, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("UNAUTHORIZED");
    const err = await response.json().catch(() => null);
    throw new Error(err?.message ?? `Failed to fetch YouTube videos (${response.status})`);
  }

  const data = await response.json();
  // Handle both array response and wrapped { videos: [...] } or { posts: [...] }
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.videos)) return data.videos;
  if (Array.isArray(data.posts)) return data.posts;
  return [];
}
