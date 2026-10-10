import type { Metadata } from "next";
import { AuthIntro } from "@/components/auth/auth-intro";
import { AuthShell } from "@/components/auth/auth-shell";
import { Brand, CreatorBadge } from "@/components/auth/brand";
import { SignUpAside } from "@/components/auth/sign-up-aside";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Icon,
  TextField,
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
        <Button variant="secondary" fullWidth leadingIcon={<Icon name="google" />}>
          Google
        </Button>
        <Button variant="secondary" fullWidth leadingIcon={<Icon name="youtube" />}>
          YouTube ID
        </Button>
      </div>

      <Divider className="my-5">Or register with creator email</Divider>

      <Form className="flex flex-col gap-3.5">
        <TextField
          label="Full Name"
          name="name"
          autoComplete="name"
          placeholder="e.g. Alex Rivers"
          required
        />
        <TextField
          label="Work or Creator Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="alex@creativeflow.studio"
          required
        />
        <TextField
          label="Password"
          name="password"
          autoComplete="new-password"
          placeholder="Create secure password"
          hint="8+ characters + 1 number"
          revealable
          minLength={8}
          required
        />
        <TextField
          label="Creator Channel URL or Primary Handle"
          name="channel"
          autoComplete="url"
          placeholder="youtube.com/@alexrivers or alexcreats"
          hint="Optional"
          leading={<Icon name="youtube" className="size-4" />}
        />
        <Checkbox
          name="terms"
          required
          className="mt-1"
          label={
            <>
              I agree to Lumen&apos;s <TextLink href="/sign-up">Terms of Service</TextLink> and{" "}
              <TextLink href="/sign-up">Privacy Policy</TextLink>. Lumen requests strictly
              100% read-only platform permissions.
            </>
          }
        />
        <Button
          type="submit"
          fullWidth
          size="lg"
          className="mt-1"
          trailingIcon={<Icon name="arrow-right" />}
        >
          Create Free Account
        </Button>
      </Form>

      <p className="mt-4 text-center text-sm text-muted">
        Already have a Lumen account? <TextLink href="/sign-in">Sign in</TextLink>
      </p>
    </AuthShell>
  );
}
