import type { Metadata } from "next";
import { AuthIntro } from "@/components/auth/auth-intro";
import { AuthShell } from "@/components/auth/auth-shell";
import { Brand } from "@/components/auth/brand";
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

export default function SignInPage() {
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
        <Button variant="secondary" fullWidth leadingIcon={<Icon name="google" />}>
          Google SSO
        </Button>
        <Button variant="secondary" fullWidth leadingIcon={<Icon name="youtube" />}>
          YouTube Verified
        </Button>
      </div>

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
