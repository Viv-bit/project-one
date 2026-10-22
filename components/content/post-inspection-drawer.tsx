"use client";

import { Icon } from "@/components/ui/icon";
import type { IngestedVideoPost } from "@/lib/types/creator-intelligence";

type PostInspectionDrawerProps = {
  post: IngestedVideoPost | null;
  onClose: () => void;
};

export function PostInspectionDrawer({
  post,
  onClose,
}: PostInspectionDrawerProps) {
  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative flex w-full max-w-lg flex-col justify-between border-l border-[#e6e0d6] bg-white p-6 shadow-2xl overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#f0ebe1]">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted">
                Post Inspection · {post.externalId}
              </span>
              <h3 className="font-serif text-2xl font-normal text-ink mt-0.5 leading-snug">
                {post.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted hover:bg-black/5 hover:text-ink transition-colors"
            >
              <Icon name="x" className="size-4" />
            </button>
          </div>

          {/* Visual Preview Banner */}
          <div
            className={`relative aspect-video w-full rounded-2xl bg-gradient-to-br ${post.thumbnailGradient} p-4 text-white shadow-md flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-black/60 px-2 py-0.5 text-xs font-mono backdrop-blur-sm">
                {post.durationFormatted}
              </span>
              <span
                className={`rounded-md px-2 py-0.5 text-xs font-semibold backdrop-blur-sm ${
                  post.tier === "top_decile"
                    ? "bg-emerald-500 text-white"
                    : post.tier === "underperformed"
                    ? "bg-red-500 text-white"
                    : "bg-black/60 text-white"
                }`}
              >
                {post.hookHoldPct}% Hook Hold
              </span>
            </div>

            <div>
              <span className="rounded bg-black/50 px-2 py-1 text-[11px] backdrop-blur-sm">
                Published {post.publishedAt}
              </span>
            </div>
          </div>

          {/* Core Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-[#f0ebe1] bg-[#faf7f2] p-3">
              <span className="text-[10px] font-bold uppercase text-muted">Views</span>
              <p className="font-serif text-xl font-normal text-ink mt-0.5">
                {post.viewsFormatted}
              </p>
            </div>
            <div className="rounded-xl border border-[#f0ebe1] bg-[#faf7f2] p-3">
              <span className="text-[10px] font-bold uppercase text-muted">0-3s Hold</span>
              <p className="font-serif text-xl font-normal text-ink mt-0.5">
                {post.hookHoldPct}%
              </p>
            </div>
            <div className="rounded-xl border border-[#f0ebe1] bg-[#faf7f2] p-3">
              <span className="text-[10px] font-bold uppercase text-muted">Likes</span>
              <p className="font-serif text-xl font-normal text-ink mt-0.5">
                {post.likes.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-[#f0ebe1] bg-[#faf7f2] p-3">
              <span className="text-[10px] font-bold uppercase text-muted">View/Sub</span>
              <p className="font-serif text-xl font-normal text-ink mt-0.5">
                {post.viewToSubRatio}%
              </p>
            </div>
          </div>

          {/* AI Extracted Taxonomy */}
          <div className="space-y-3 rounded-2xl border border-[#e6e0d6] bg-[#faf7f2] p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
              AI Feature Classification
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted block text-[11px]">Hook Typology</span>
                <span className="font-semibold text-ink inline-flex items-center gap-1 mt-0.5">
                  <Icon name="zap" className="size-3 text-brand" />
                  {post.hookType}
                </span>
              </div>

              <div>
                <span className="text-muted block text-[11px]">Topic Pillar</span>
                <span className="font-semibold text-ink inline-flex items-center gap-1 mt-0.5">
                  <Icon name="layers" className="size-3 text-brand" />
                  {post.topicPillar}
                </span>
              </div>

              <div>
                <span className="text-muted block text-[11px]">Call To Action</span>
                <span className="font-semibold text-ink inline-flex items-center gap-1 mt-0.5">
                  <Icon name="arrow-up" className="size-3 text-brand" />
                  {post.ctaType}
                </span>
              </div>

              <div>
                <span className="text-muted block text-[11px]">Editorial Tone</span>
                <span className="font-semibold text-ink inline-flex items-center gap-1 mt-0.5">
                  <Icon name="spark" className="size-3 text-brand" />
                  {post.tone}
                </span>
              </div>
            </div>
          </div>

          {/* Transcript Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
                Whisper STT Hook Excerpt (0:00 - 0:08)
              </h4>
              <span className="text-[10px] font-mono text-emerald-700 font-semibold flex items-center gap-1">
                <Icon name="check" className="size-3" />
                Word Timestamps Calibrated
              </span>
            </div>

            <div className="rounded-xl border border-[#e6e0d6] bg-white p-3.5 text-xs text-ink leading-relaxed italic border-l-4 border-l-brand">
              &ldquo;{post.transcriptHookSnippet}&rdquo;
            </div>
          </div>

          {/* Performance Diagnostic Note */}
          <div className="rounded-xl border border-line bg-white p-3.5 text-xs space-y-1.5">
            <span className="font-bold text-ink text-[11px] uppercase tracking-wider">
              Diagnostic Verdict
            </span>
            <p className="text-muted leading-relaxed">
              {post.tier === "top_decile"
                ? "Overperformed the calibrated 16-post baseline by 28%. Problem-first pain articulation prevented early drop-off."
                : post.tier === "underperformed"
                ? "Underperformed baseline due to slow conversational ramp and broad rhetorical questioning. Churn spiked before 0:42s."
                : "Aligned with channel baseline. Satisfied audience expectations with consistent 70%+ mid-video retention."}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#f0ebe1] flex items-center justify-between">
          <span className="text-xs text-muted">Sampled in 16-upload batch</span>
          <button
            onClick={onClose}
            className="rounded-xl bg-ink px-4 py-2 text-xs font-semibold text-white hover:bg-black transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
