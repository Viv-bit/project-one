export const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "https://project-one-be-eb1t.onrender.com";

export const googleAuthUrl = `${apiUrl}/api/auth/google`;
export const authSignupUrl = `${apiUrl}/api/auth/signup`;
export const authSigninUrl = `${apiUrl}/api/auth/signin`;
export const authLogoutUrl = `${apiUrl}/api/auth/logout`;
export const youtubeConnectUrl = `${apiUrl}/api/youtube/connect`;
export const youtubeConnectionUrl = `${apiUrl}/api/youtube/connection`;
export const youtubeSyncUrl = `${apiUrl}/api/youtube/sync`;
export const youtubeAnalyzeUrl = `${apiUrl}/api/youtube/analyze`;
export const youtubeVideosUrl = `${apiUrl}/api/youtube/videos`;

export const creatorUrl = `${apiUrl}/api/creator`;
export const creatorOverviewUrl = `${apiUrl}/api/creator/overview`;
export const creatorContentUrl = `${apiUrl}/api/creator/content`;

export const insightsUrl = `${apiUrl}/api/insights`;
export const recommendationsUrl = `${apiUrl}/api/recommendations`;
export const experimentsUrl = `${apiUrl}/api/experiments`;

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
};

export type AuthSuccessResponse = {
  message: string;
  user: AuthUser;
};

export type AuthValidationErrorResponse = {
  message: string;
  errors?: Record<string, string[]>;
};

export type YouTubeChannel = {
  id: string;
  title: string;
  handle: string | null;
  thumbnailUrl: string | null;
  subscriberCount: number | null;
  videoCount: number | null;
};

export type YouTubeConnectionState =
  | {
      connected: true;
      channel: YouTubeChannel;
    }
  | {
      connected: false;
      channel?: never;
    };

let logoutPromise: Promise<void> | null = null;

/**
 * Handle authentication errors across any endpoint:
 * 1. Log the user out via POST /api/auth/logout
 * 2. Redirect the user to the sign in page (/sign-in)
 * Deduplicates concurrent calls so multiple parallel failures only issue one logout request.
 */
export async function handleAuthError(): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  if (!logoutPromise) {
    logoutPromise = (async () => {
      try {
        await fetch(authLogoutUrl, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
      } catch (err) {
        console.error("Auto-logout request failed:", err);
      } finally {
        if (typeof window !== "undefined") {
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = "/sign-in";
        }
      }
    })();
  }

  await logoutPromise;
}

/**
 * Explicit logout helper that calls POST /api/auth/logout and redirects to /sign-in.
 */
export async function logoutUser(redirectToSignIn = true): Promise<void> {
  try {
    await fetch(authLogoutUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  } catch (err) {
    console.error("Logout request failed:", err);
  } finally {
    if (redirectToSignIn && typeof window !== "undefined") {
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/sign-in";
    }
  }
}

/**
 * Check whether a response represents an authentication error.
 */
async function isAuthenticationError(response: Response): Promise<boolean> {
  if (response.status === 401) {
    return true;
  }

  if (response.status === 403 || response.status === 400) {
    try {
      const cloned = response.clone();
      const data = await cloned.json();
      const message = (data?.message || data?.error || "").toString().toLowerCase();
      if (
        message.includes("unauthorized") ||
        message.includes("unauthenticated") ||
        message.includes("jwt expired") ||
        message.includes("token expired") ||
        message.includes("invalid token") ||
        message.includes("session expired") ||
        message.includes("authentication required") ||
        message.includes("not authenticated")
      ) {
        return true;
      }
    } catch {
      // Body not JSON or already consumed
    }
  }

  return false;
}

/**
 * Centralized fetch client for all endpoints.
 * Automatically handles credentials, JSON accept headers, and triggers logout/redirect on 401/auth errors.
 */
export async function apiFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const headers = new Headers(init?.headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  const response = await fetch(input, {
    credentials: "include",
    ...init,
    headers,
  });

  const urlStr =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;

  const isExcludedAuthUrl =
    urlStr.includes("/api/auth/signin") ||
    urlStr.includes("/api/auth/signup") ||
    urlStr.includes("/api/auth/logout");

  if (!isExcludedAuthUrl && (await isAuthenticationError(response))) {
    await handleAuthError();
    throw new Error("UNAUTHORIZED");
  }

  return response;
}


