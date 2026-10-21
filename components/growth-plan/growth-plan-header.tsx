"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui";

type GrowthPlanHeaderProps = {
  onBeginSprint?: () => void;
  onSyncWorkspace?: () => void;
  onDownloadDeck?: () => void;
};

export function GrowthPlanHeader({
  onBeginSprint,
  onSyncWorkspace,
  onDownloadDeck,
}: GrowthPlanHeaderProps) {
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleAction(msg: string, callback?: () => void) {
    setFeedback(msg);
    callback?.();
    setTimeout(() => setFeedback(null), 3000);
  }

  return (
    <div className="space-y-4">
      {/* Breadcrumbs & Synced Badge Row */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs">
        <div className="flex items-center gap-1.5 text-[#7a7167]">
          <span>Analytics Engine</span>
          <span className="text-[#c4bbb0]">/</span>
          <span className="font-semibold text-brand">Growth Strategy &amp; Roadmap</span>
          <span className="text-[#c4bbb0]">/</span>
          <span className="text-ink font-medium">The Minimalist Studio</span>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-[#e4ddd4] bg-white/80 px-3 py-1 text-[11px] font-medium text-[#70675c] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <span className="size-2 rounded-full bg-brand animate-pulse" />
          <span>Engine V2.4 Model Synced • 50 Historical Posts Calibrated</span>
        </div>
      </div>

      {/* Main Title & Action Buttons Row */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between pt-1">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-md border border-[#e6decf] bg-[#fbf9f4] px-2.5 py-1 text-xs font-semibold text-[#6e6355]">
            <Icon name="shield" className="size-3.5 text-brand" />
            <span>Deterministic 90-Day Growth Engine</span>
          </div>

          {/* Heading */}
          <h1 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-normal tracking-tight text-ink">
            Personalized Creator{" "}
            <span className="text-brand font-medium">Growth Roadmap</span>
          </h1>

          {/* Description */}
          <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-[#686056]">
            Derived from your 50-post historical baseline (
            <strong className="text-ink font-semibold">41,850 avg 72h velocity</strong>,{" "}
            <strong className="text-ink font-semibold">74.2% hook retention</strong>). Follow
            these sequenced sprints to unlock{" "}
            <strong className="text-brand font-semibold">+45% sustained retention</strong> and scale
            from 420K to 750K subscribers.
          </p>
        </div>

        {/* 3 Action Buttons (Stacked Vertically on right) */}
        <div className="flex flex-col gap-2.5 sm:w-56 shrink-0">
          <button
            onClick={() => handleAction("Exporting Executive Deck (PDF)...", onDownloadDeck)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e2dcd2] bg-white px-4 py-2.5 text-xs font-semibold text-ink shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all hover:bg-[#faf7f3] hover:border-brand/40"
          >
            <Icon name="download" className="size-3.5 text-[#7a7167]" />
            <span>Executive Deck (PDF)</span>
          </button>

          <button
            onClick={() => handleAction("Syncing with Notion & Asana workspaces...", onSyncWorkspace)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e2dcd2] bg-white px-4 py-2.5 text-xs font-semibold text-ink shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all hover:bg-[#faf7f3] hover:border-brand/40"
          >
            <Icon name="refresh" className="size-3.5 text-[#7a7167]" />
            <span>Sync Notion / Asana</span>
          </button>

          <button
            onClick={() => handleAction("Sprint 1 execution mode activated!", onBeginSprint)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs font-semibold text-white shadow-[0_4px_14px_rgba(224,124,58,0.3)] transition-all hover:bg-brand-strong active:scale-[0.99]"
          >
            <Icon name="play" className="size-3.5" />
            <span>Begin Sprint 1</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2 text-xs font-medium text-emerald-800 animate-in fade-in">
          <Icon name="check-circle" className="size-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}
    </div>
  );
}
