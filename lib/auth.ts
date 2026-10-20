import {
  authSigninUrl,
  authSignupUrl,
  googleAuthUrl,
  type AuthSuccessResponse,
  type AuthValidationErrorResponse,
} from "./api";

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
  const response = await fetch(authSignupUrl, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email: credentials.email.trim(),
      password: credentials.password,
    }),
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as
      | AuthValidationErrorResponse
      | null;

    const message =
      errorBody?.message ??
      (response.status === 409
        ? "An account with this email already exists"
        : `Signup failed (${response.status})`);

    throw new AuthApiError(message, response.status, errorBody?.errors);
  }

  return (await response.json()) as AuthSuccessResponse;
}

/**
 * Sign in an existing user with email and password.
 * Backend sets an HttpOnly access_token cookie upon success (200).
 */
export async function signinUser(
  credentials: SigninCredentials,
): Promise<AuthSuccessResponse> {
  const response = await fetch(authSigninUrl, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email: credentials.email.trim(),
      password: credentials.password,
    }),
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as
      | AuthValidationErrorResponse
      | null;

    const message =
      errorBody?.message ??
      (response.status === 401
        ? "Invalid email or password"
        : `Sign-in failed (${response.status})`);

    throw new AuthApiError(message, response.status, errorBody?.errors);
  }

  return (await response.json()) as AuthSuccessResponse;
}

/**
 * Redirect browser to initiate Google OAuth flow.
 */
export function startGoogleOAuth(): void {
  window.location.href = googleAuthUrl;
}
