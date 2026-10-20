"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthApiError, signupUser } from "@/lib/auth";
import { AuthError } from "@/components/auth/auth-error";
import {
  Button,
  Checkbox,
  Form,
  Icon,
  TextField,
  TextLink,
} from "@/components/ui";

export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [channel, setChannel] = useState("");
  const [terms, setTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    terms?: string;
  }>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const trimmedEmail = email.trim();
    const newFieldErrors: {
      email?: string;
      password?: string;
      terms?: string;
    } = {};

    if (!trimmedEmail) {
      newFieldErrors.email = "Work or creator email is required";
    }

    if (!password) {
      newFieldErrors.password = "Password is required";
    } else if (password.length < 8) {
      newFieldErrors.password = "Password must be at least 8 characters";
    }

    if (!terms) {
      newFieldErrors.terms = "You must agree to the Terms of Service";
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      await signupUser({
        email: trimmedEmail,
        password,
      });

      // Browser automatically saves HttpOnly access_token cookie from backend response.
      // Redirect to /dashboard where creator session is immediately active.
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setIsLoading(false);

      if (err instanceof AuthApiError) {
        if (err.status === 409) {
          const conflictMsg = "An account with this email already exists";
          setFormError(conflictMsg);
          setFieldErrors((prev) => ({ ...prev, email: conflictMsg }));
          return;
        }

        if (err.fieldErrors) {
          setFieldErrors({
            email: err.fieldErrors.email?.[0],
            password: err.fieldErrors.password?.[0],
          });
        }

        setFormError(err.message || "Invalid registration request");
        return;
      }

      setFormError("An unexpected error occurred. Please check your connection and try again.");
    }
  }

  return (
    <Form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      {formError ? <AuthError message={formError} className="mt-0 mb-1" /> : null}

      <TextField
        label="Full Name"
        name="name"
        autoComplete="name"
        placeholder="e.g. Alex Rivers"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isLoading}
        required
      />

      <TextField
        label="Work or Creator Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="alex@creativeflow.studio"
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
        autoComplete="new-password"
        placeholder="Create secure password"
        hint="8+ characters"
        revealable
        minLength={8}
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

      <TextField
        label="Creator Channel URL or Primary Handle"
        name="channel"
        autoComplete="url"
        placeholder="youtube.com/@alexrivers or alexcreats"
        hint="Optional"
        leading={<Icon name="youtube" className="size-4" />}
        value={channel}
        onChange={(e) => setChannel(e.target.value)}
        disabled={isLoading}
      />

      <Checkbox
        name="terms"
        checked={terms}
        onChange={(e) => {
          setTerms(e.target.checked);
          if (fieldErrors.terms) {
            setFieldErrors((prev) => ({ ...prev, terms: undefined }));
          }
        }}
        disabled={isLoading}
        className="mt-1"
        label={
          <>
            I agree to Lumen&apos;s <TextLink href="/sign-up">Terms of Service</TextLink> and{" "}
            <TextLink href="/sign-up">Privacy Policy</TextLink>. Lumen requests strictly
            100% read-only platform permissions.
          </>
        }
        description={
          fieldErrors.terms ? (
            <span className="text-red-600 font-medium">{fieldErrors.terms}</span>
          ) : undefined
        }
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
        {isLoading ? "Creating Account..." : "Create Free Account"}
      </Button>
    </Form>
  );
}
