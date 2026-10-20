import type { Metadata } from "next";
import { AuthError } from "@/components/auth/auth-error";
import { AuthIntro } from "@/components/auth/auth-intro";
import { AuthShell } from "@/components/auth/auth-shell";
import { Brand } from "@/components/auth/brand";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { YouTubeSignInButton } from "@/components/youtube/youtube-sign-in-button";
import { SignInForm } from "@/components/auth/sign-in-form";
import { SignInAside } from "@/components/auth/sign-in-aside";
import {
  Badge,
  Divider,
  Icon,
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
        <YouTubeSignInButton label="YouTube Verified" />
      </div>
      <AuthError error={error} />

      <Divider className="my-5">Or continue with email</Divider>

      <SignInForm />

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
