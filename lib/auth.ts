import {
  authSigninUrl,
  authSignupUrl,
  authLogoutUrl,
  authMeUrl,
  googleAuthUrl,
  logoutUser,
  handleAuthError,
  apiFetch,
  type AuthSuccessResponse,
  type AuthValidationErrorResponse,
  type AuthUser,
} from "./api";

export { authLogoutUrl, authMeUrl, logoutUser, handleAuthError, apiFetch };
export type { AuthUser };

export class AuthApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export type SignupCredentials = {
  email: string;
  password: string;
};

export type SigninCredentials = {
  email: string;
  password: string;
};

/**
 * Register a new user with email and password.
 * Backend sets an HttpOnly access_token cookie upon success (201).
 */
export async function signupUser(
  credentials: SignupCredentials,
): Promise<AuthSuccessResponse> {
  const { email, password } = credentials;
  const res = await fetch(authSignupUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorBody = (await res.json().catch(() => null)) as
      | AuthValidationErrorResponse
      | null;

    const message =
      errorBody?.message ??
      (res.status === 409
        ? "An account with this email already exists"
        : `Signup failed (${res.status})`);

    throw new AuthApiError(message, res.status, errorBody?.errors);
  }

  return (await res.json()) as AuthSuccessResponse;
}

/**
 * Sign in an existing user with email and password.
 * Backend sets an HttpOnly access_token cookie upon success (200).
 */
export async function signinUser(
  credentials: SigninCredentials,
): Promise<AuthSuccessResponse> {
  const { email, password } = credentials;
  const res = await fetch(authSigninUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorBody = (await res.json().catch(() => null)) as
      | AuthValidationErrorResponse
      | null;

    const message =
      errorBody?.message ??
      (res.status === 401
        ? "Invalid email or password"
        : `Sign-in failed (${res.status})`);

    throw new AuthApiError(message, res.status, errorBody?.errors);
  }

  return (await res.json()) as AuthSuccessResponse;
}

/**
 * Redirect browser to initiate Google OAuth flow.
 */
export function startGoogleOAuth(): void {
  window.location.href = googleAuthUrl;
}

/**
 * Fetch current authenticated user session details from GET /api/auth/me.
 * Returns null if not authenticated or request fails.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const res = await apiFetch(authMeUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (data?.user) return data.user as AuthUser;
    if (data?.email) return data as AuthUser;
    return null;
  } catch {
    return null;
  }
}

