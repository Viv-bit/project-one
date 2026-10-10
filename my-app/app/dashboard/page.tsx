import type { Metadata } from "next";
import { AuthIntro } from "@/components/auth/auth-intro";
import { AuthShell } from "@/components/auth/auth-shell";
import { Brand } from "@/components/auth/brand";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Lumen creator account.",
};

export default function DashboardPage() {
  return (
    <AuthShell className="lg:grid-cols-1">
      <Brand />
      <AuthIntro
        title={
          <>
            You&apos;re <span className="text-brand italic">in.</span>
          </>
        }
      >
        Your Google account is connected. Lumen saved the session from the local
        API.
      </AuthIntro>
      <div className="mt-6">
        <GoogleAuthButton>Use a different Google account</GoogleAuthButton>
      </div>
    </AuthShell>
  );
}
