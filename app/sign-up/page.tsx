import type { Metadata } from "next";
import { AuthIntro } from "@/components/auth/auth-intro";
import { AuthShell } from "@/components/auth/auth-shell";
import { Brand, CreatorBadge } from "@/components/auth/brand";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { YouTubeSignInButton } from "@/components/youtube/youtube-sign-in-button";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { SignUpAside } from "@/components/auth/sign-up-aside";
import {
  Divider,
  TextLink,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Create your account",
  description:
    "Create a free Lumen creator account to analyze uploads, retention hooks, and content experiments.",
};

export default function SignUpPage() {
  return (
    <AuthShell aside={<SignUpAside />}>
      <Brand badge={<CreatorBadge />} />
      <AuthIntro
        title={
          <>
            Start with <span className="text-brand italic">clarity.</span>
            <br />
            Grow with data.
          </>
        }
      >
        Create your free creator account to analyze your past 50 uploads, uncover
        retention hooks, and see evidence-backed content experiments.
      </AuthIntro>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <GoogleAuthButton>Google</GoogleAuthButton>
        <YouTubeSignInButton label="YouTube ID" />
      </div>

      <Divider className="my-5">Or register with creator email</Divider>

      <SignUpForm />

      <p className="mt-4 text-center text-sm text-muted">
        Already have a Lumen account? <TextLink href="/">Sign in</TextLink>
      </p>
    </AuthShell>
  );
}
