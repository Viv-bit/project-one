import type { Metadata } from "next";
import Link from "next/link";
import { Brand, CreatorBadge } from "@/components/auth/brand";
import { YouTubeConnectionManager } from "@/components/youtube/youtube-connection-manager";
import { Chip, Icon } from "@/components/ui";

export const metadata: Metadata = {
  title: "YouTube Channel Settings",
  description: "Connect and manage your YouTube channel integration on Lumen.",
};

type YouTubePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function YouTubePage({ searchParams }: YouTubePageProps) {
  const params = await searchParams;
  const error = Array.isArray(params.error) ? params.error[0] : params.error;

  return (
    <div className="max-w-5xl space-y-8 pb-16">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-medium text-muted">
            <Link href="/dashboard" className="hover:text-ink">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-brand">Integrations</span>
            <span>/</span>
            <span>YouTube</span>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-md">
              <Icon name="youtube" className="size-6" />
            </span>
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-ink">
                YouTube Integration Settings
              </h1>
              <p className="mt-1 text-sm text-muted">
                Manage your channel authentication, telemetry sync, and read-only Google permissions.
              </p>
            </div>
          </div>
        </div>

        {/* Connection Manager Card */}
        <div className="mb-8">
          <YouTubeConnectionManager initialError={error} />
        </div>

        {/* Security & FAQ Section */}
        <div className="rounded-2xl border border-line bg-cream p-6 sm:p-8">
          <h2 className="font-serif text-xl sm:text-2xl font-normal text-ink">
            Frequently Asked Questions
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-ink">
                Can Lumen delete or publish videos to my channel?
              </h3>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                No. Lumen requests strictly the <code className="rounded bg-black/5 px-1 py-0.5 text-ink font-mono text-[11px]">youtube.readonly</code> scope. We have zero permissions to edit, upload, modify, or delete any content.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-ink">
                Can I connect a brand channel or multiple channels?
              </h3>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                Yes. During the Google Consent screen, select the YouTube brand channel you wish to connect to Lumen. Each Lumen creator account pairs with one active channel at a time.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-ink">
                How often are subscriber and video counts synced?
              </h3>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                Counts and telemetry are refreshed on page load, automatically every 6 hours, or anytime you click the &quot;Sync Channel&quot; button in the card above.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-ink">
                What happens when I disconnect my channel?
              </h3>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                Lumen immediately revokes your stored OAuth tokens with Google and removes the connection from our database. You can reconnect whenever you like.
              </p>
            </div>
          </div>
        </div>
    </div>
  );
}
