import type { Metadata } from "next";
import { YouTubeConnectionProvider } from "@/lib/youtube-connection-context";
import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import { IngestionPipelineView } from "@/components/onboarding/ingestion-pipeline-view";

export const metadata: Metadata = {
  title: "Historical Content Ingestion Pipeline",
  description:
    "Real-time pipeline monitoring for 10–20 historical uploads. Audio extraction, Whisper STT transcripts, and hook retention modeling.",
};

export default function OnboardingPage() {
  return (
    <YouTubeConnectionProvider>
      <div className="min-h-screen bg-[#faf7f2] text-ink antialiased">
        <OnboardingHeader />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
          <IngestionPipelineView />
        </main>
      </div>
    </YouTubeConnectionProvider>
  );
}
