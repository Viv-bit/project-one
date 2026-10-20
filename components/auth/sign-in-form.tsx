"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthApiError, signinUser } from "@/lib/auth";
import { AuthError } from "@/components/auth/auth-error";
import {
  Button,
  Checkbox,
  Form,
  Icon,
  TextField,
  TextLink,
} from "@/components/ui";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const trimmedEmail = email.trim();
    const newFieldErrors: { email?: string; password?: string } = {};

    if (!trimmedEmail) {
      newFieldErrors.email = "Email is required";
    }
    if (!password) {
      newFieldErrors.password = "Password is required";
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      await signinUser({
        email: trimmedEmail,
        password,
      });

      // Browser automatically saves HttpOnly access_token cookie from backend response.
      // Redirect to /dashboard where server and client components can access the authenticated session.
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setIsLoading(false);

      if (err instanceof AuthApiError) {
        if (err.status === 401) {
          setFormError("Invalid email or password");
          return;
        }

        if (err.fieldErrors) {
          setFieldErrors({
            email: err.fieldErrors.email?.[0],
            password: err.fieldErrors.password?.[0],
          });
        }

        setFormError(err.message || "Invalid email or password");
        return;
      }

      setFormError("An unexpected error occurred. Please check your connection and try again.");
    }
  }

  return (
    <Form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      {formError ? <AuthError message={formError} className="mt-0 mb-1" /> : null}

      <TextField
        label="Creator Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="alex@creativeflow.studio"
        hint="Verified ID"
        leading={<Icon name="at" />}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (fieldErrors.email) {
            setFieldErrors((prev) => ({ ...prev, email: undefined }));
          }
        }}
        error={fieldErrors.email}
        disabled={isLoading}
        required
      />

      <TextField
        label="Password"
        name="password"
        autoComplete="current-password"
        placeholder="••••••••••••"
        hint={
          <TextLink href="/" className="text-xs font-medium">
            Forgot password?
          </TextLink>
        }
        leading={<Icon name="lock" />}
        revealable
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (fieldErrors.password) {
            setFieldErrors((prev) => ({ ...prev, password: undefined }));
          }
        }}
        error={fieldErrors.password}
        disabled={isLoading}
        required
      />

      <Checkbox
        name="remember"
        label="Remember this device for 30 days"
        checked={remember}
        onChange={(e) => setRemember(e.target.checked)}
        disabled={isLoading}
      />

      <Button
        type="submit"
        fullWidth
        size="lg"
        disabled={isLoading}
        className="mt-1"
        trailingIcon={
          isLoading ? (
            <Icon name="refresh" className="size-4 animate-spin" />
          ) : (
            <Icon name="arrow-right" />
          )
        }
      >
        {isLoading ? "Signing In..." : "Sign In to Dashboard"}
      </Button>
    </Form>
  );
}
