import type { Metadata } from "next";
import Link from "next/link";
import { Brand, CreatorBadge } from "@/components/auth/brand";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { YouTubeConnectionManager } from "@/components/youtube/youtube-connection-manager";
import { Badge, Chip, Icon } from "@/components/ui";

export const metadata: Metadata = {
  title: "Creator Dashboard",
  description:
    "Manage your connected YouTube channel, hook diagnostics, and audience retention metrics on Lumen.",
};

type DashboardPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const error = Array.isArray(params.error) ? params.error[0] : params.error;

  return (
    <div className="min-h-screen bg-[#f3f0f8] text-ink">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-frame/70 bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="transition-opacity hover:opacity-90">
              <Brand badge={<CreatorBadge />} />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-muted">
            <Link
              href="/dashboard"
              className="rounded-lg bg-black/5 px-3 py-1.5 text-ink transition-colors"
            >
              Overview
            </Link>
            <Link
              href="/dashboard/youtube"
              className="rounded-lg px-3 py-1.5 hover:bg-black/5 hover:text-ink transition-colors"
            >
              YouTube Connection
            </Link>
            <span className="rounded-lg px-3 py-1.5 text-muted/60 cursor-not-allowed">
              Retention Experiments
            </span>
          </nav>

          <div className="flex items-center gap-2.5">
            <Chip variant="outline" className="hidden sm:inline-flex" icon={<Icon name="shield" className="size-3 text-brand" />}>
              Session Active
            </Chip>
            <Link
              href="/"
              className="text-xs font-semibold text-muted hover:text-ink transition-colors"
            >
              Sign out
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="brand">Creator Intelligence</Badge>
                <span className="text-xs text-muted">· Live Sync</span>
              </div>
              <h1 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-normal tracking-tight text-ink">
                Creator <span className="text-brand italic">Command Center.</span>
              </h1>
              <p className="mt-2 text-sm sm:text-[15px] text-muted max-w-2xl leading-relaxed">
                Connect your YouTube channel to analyze retention hook drop-offs, benchmark your past 50 uploads, and unlock automated title experiments.
              </p>
            </div>

            {/* Google session switcher */}
            <div className="rounded-2xl border border-line bg-white/70 p-3 sm:p-4 backdrop-blur-sm shadow-sm max-w-xs">
              <p className="text-[11px] font-medium text-muted">Authenticated via Google SSO</p>
              <div className="mt-2">
                <GoogleAuthButton>Switch Google account</GoogleAuthButton>
              </div>
            </div>
          </div>
        </div>

        {/* Primary YouTube Connection Section */}
        <section aria-labelledby="youtube-connection-heading" className="mb-10">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="youtube-connection-heading" className="text-sm font-semibold tracking-wide uppercase text-muted">
              Platform Integration
            </h2>
            <Link
              href="/dashboard/youtube"
              className="text-xs font-medium text-brand hover:underline inline-flex items-center gap-1"
            >
              Dedicated Settings
              <Icon name="arrow-right" className="size-3" />
            </Link>
          </div>

          <YouTubeConnectionManager initialError={error} />
        </section>

        {/* Feature Highlights Grid */}
        <section aria-labelledby="features-heading" className="mt-12">
          <h2 id="features-heading" className="mb-4 text-sm font-semibold tracking-wide uppercase text-muted">
            Creator Intelligence Features
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-line bg-cream p-5 shadow-sm transition-all hover:border-brand/30">
              <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Icon name="activity" className="size-5" />
              </div>
              <h3 className="mt-4 font-semibold text-ink text-base">
                Hook Drop-Off Diagnostics
              </h3>
              <p className="mt-1.5 text-xs text-muted leading-relaxed">
                Detect the exact second where viewer attention drops in the first 30 seconds of your YouTube videos.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-cream p-5 shadow-sm transition-all hover:border-brand/30">
              <div className="flex size-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                <Icon name="zap" className="size-5" />
              </div>
              <h3 className="mt-4 font-semibold text-ink text-base">
                Title &amp; Hook Backlog
              </h3>
              <p className="mt-1.5 text-xs text-muted leading-relaxed">
                Evidence-backed video experiment concepts synthesized from your channel&apos;s best-performing retention patterns.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-cream p-5 shadow-sm transition-all hover:border-brand/30">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Icon name="shield" className="size-5" />
              </div>
              <h3 className="mt-4 font-semibold text-ink text-base">
                Zero Write Permissions
              </h3>
              <p className="mt-1.5 text-xs text-muted leading-relaxed">
                Strict read-only OAuth integration. Your videos, settings, and monetization are never modified or altered.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-line/80 bg-cream/50 py-6 text-center text-xs text-muted">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Lumen Creator Intelligence. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Icon name="shield" className="size-3.5 text-brand" />
              256-bit OAuth Token Encryption
            </span>
            <span>·</span>
            <Link href="/" className="hover:text-ink transition-colors">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
