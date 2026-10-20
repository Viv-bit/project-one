export const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const googleAuthUrl = `${apiUrl}/api/auth/google`;
export const authSignupUrl = `${apiUrl}/api/auth/signup`;
export const authSigninUrl = `${apiUrl}/api/auth/signin`;
export const youtubeConnectUrl = `${apiUrl}/api/youtube/connect`;
export const youtubeConnectionUrl = `${apiUrl}/api/youtube/connection`;

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

