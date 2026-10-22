import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "@/components/auth/brand";
import { IngestionPipelineView } from "@/components/onboarding/ingestion-pipeline-view";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = {
  title: "Historical Content Ingestion Pipeline",
  description:
    "Real-time pipeline monitoring for 10–20 historical uploads. Audio extraction, Whisper STT transcripts, and hook retention modeling.",
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2] text-ink antialiased">
      {/* Top Header */}
      <header className="border-b border-[#e6e0d6] bg-white/80 px-4 py-3.5 sm:px-8 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Brand />
            <span className="hidden sm:inline-block h-4 w-px bg-[#e6e0d6]" />
            <span className="hidden sm:inline-block text-xs font-semibold text-muted">
              Historical Ingestion Engine (Batch 1: 16 Uploads)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/youtube"
              className="text-xs text-muted hover:text-ink transition-colors flex items-center gap-1.5"
            >
              <Icon name="youtube" className="size-3.5 text-red-600" />
              <span>Channel Settings</span>
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-black transition-colors"
            >
              <span>Dashboard</span>
              <Icon name="arrow-right" className="size-3" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        <IngestionPipelineView />
      </main>
    </div>
  );
}
