import {
  authSigninUrl,
  authSignupUrl,
  authLogoutUrl,
  googleAuthUrl,
  logoutUser,
  handleAuthError,
  apiFetch,
  type AuthSuccessResponse,
  type AuthValidationErrorResponse,
} from "./api";

export { authLogoutUrl, logoutUser, handleAuthError, apiFetch };

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
