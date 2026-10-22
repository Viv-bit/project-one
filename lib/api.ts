export const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const googleAuthUrl = `${apiUrl}/api/auth/google`;
export const authSignupUrl = `${apiUrl}/api/auth/signup`;
export const authSigninUrl = `${apiUrl}/api/auth/signin`;
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

