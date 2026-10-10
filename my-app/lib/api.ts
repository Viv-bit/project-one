export const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const googleAuthUrl = `${apiUrl}/api/auth/google`;
