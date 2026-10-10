import type { Metadata } from "next";
import { AuthError } from "@/components/auth/auth-error";
import { AuthIntro } from "@/components/auth/auth-intro";
import { AuthShell } from "@/components/auth/auth-shell";
import { Brand } from "@/components/auth/brand";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { SignInAside } from "@/components/auth/sign-in-aside";
import {
  Badge,
  Button,
  Checkbox,
  Divider,
  Form,
  Icon,
  TextField,
  TextLink,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to the Lumen Creator Intelligence Dashboard for hook diagnostics and content experiments.",
};

type SignInPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const error = Array.isArray(params.error) ? params.error[0] : params.error;

  return (
    <AuthShell aside={<SignInAside />} asideLayout="fill">
      <div className="flex items-center justify-between gap-3">
        <Brand />
        <Badge>Creator Beta</Badge>
      </div>
      <AuthIntro
        title={
          <>
            Welcome back. See
            <br />
            <span className="text-brand italic">what&apos;s working.</span>
          </>
        }
      >
        Sign in to access your Creator Intelligence Dashboard, live hook
        diagnostics, and content experiment backlog.
      </AuthIntro>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <GoogleAuthButton>Google SSO</GoogleAuthButton>
        <Button variant="secondary" fullWidth leadingIcon={<Icon name="youtube" />}>
          YouTube Verified
        </Button>
      </div>
      <AuthError error={error} />

      <Divider className="my-5">Or continue with email</Divider>

      <Form className="flex flex-col gap-3.5">
        <TextField
          label="Creator Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="alex@creativeflow.studio"
          hint="Verified ID"
          leading={<Icon name="at" />}
          required
        />
        <TextField
          label="Password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••••••"
          hint={
            <TextLink href="/sign-in" className="text-xs font-medium">
              Forgot password?
            </TextLink>
          }
          leading={<Icon name="lock" />}
          revealable
          required
        />
        <Checkbox name="remember" label="Remember this device for 30 days" />
        <Button
          type="submit"
          fullWidth
          size="lg"
          className="mt-1"
          trailingIcon={<Icon name="arrow-right" />}
        >
          Sign In to Dashboard
        </Button>
      </Form>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted">
        <Icon name="shield" className="size-3.5 text-brand" />
        SOC2 Type II Certified · 256-bit Token Encryption
      </p>
      <p className="mt-3 text-center text-sm text-muted">
        Don&apos;t have a Lumen creator account yet?{" "}
        <TextLink href="/sign-up">Sign up free</TextLink>
      </p>
    </AuthShell>
  );
}
