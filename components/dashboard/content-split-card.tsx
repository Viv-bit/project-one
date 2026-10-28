"use client";

import Link from "next/link";
import { Icon } from "@/components/ui";
import { CONTENT_SPLIT_ITEMS } from "@/lib/data/intelligence-mock-data";
import { startYouTubeOAuth } from "@/lib/youtube";
import { useYouTubeConnection } from "@/lib/youtube-connection-context";

export function ContentSplitCard() {
  const { isConnected } = useYouTubeConnection();

  // Empty state when YouTube is not connected
  if (!isConnected) {
    return (
      <div className="rounded-2xl border border-dashed border-[#ded4c6] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-[#f2ede4] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-ink">
                Top vs Underperforming Content Split
              </h2>
              <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                Awaiting Uploads
              </span>
            </div>
            <p className="text-xs text-[#82786e]">
              Direct comparative taxonomy analysis across your video catalog
            </p>
          </div>
          <span className="text-xs font-medium text-[#998f84]">
            0 videos ingested
          </span>
        </div>

        {/* Side-by-side Ghost Video Cards Grid */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Top Decile Ghost Card */}
          <div className="flex flex-col justify-between rounded-xl border border-dashed border-emerald-300/80 bg-emerald-50/15 p-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-semibold">
                  Top Decile Benchmark
                </span>
                <span className="text-[11px] font-mono text-[#8c8277]">
                  Top 10%
                </span>
              </div>

              {/* Ghost Thumbnail */}
              <div className="mt-3 flex h-28 w-full flex-col items-center justify-center rounded-lg border border-dashed border-emerald-200 bg-white/70 p-3 text-center">
                <div className="grid size-9 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                  <Icon name="play" className="size-4" />
                </div>
                <p className="mt-2 text-[11px] font-medium text-emerald-800">
                  Highest Hook Hold Uploads
                </p>
              </div>

              <h3 className="mt-3 text-xs font-bold text-ink">
                Top Performing Catalog Analysis
              </h3>
              <p className="mt-1 text-xs text-[#6e6459] leading-relaxed">
                Connect your YouTube channel to rank your winning uploads by 0-3s hook retention and learn why your top videos succeed.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-200/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800/80">
                AWAITING 1ST INGESTION
              </span>
            </div>
          </div>

          {/* Underperforming Ghost Card */}
          <div className="flex flex-col justify-between rounded-xl border border-dashed border-rose-300/80 bg-rose-50/15 p-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-rose-100 text-rose-800 px-2 py-0.5 text-[10px] font-semibold">
                  Underperforming Benchmark
                </span>
                <span className="text-[11px] font-mono text-[#8c8277]">
                  Bottom 10%
                </span>
              </div>

              {/* Ghost Thumbnail */}
              <div className="mt-3 flex h-28 w-full flex-col items-center justify-center rounded-lg border border-dashed border-rose-200 bg-white/70 p-3 text-center">
                <div className="grid size-9 place-items-center rounded-full bg-rose-100 text-rose-700">
                  <Icon name="alert-triangle" className="size-4" />
                </div>
                <p className="mt-2 text-[11px] font-medium text-rose-800">
                  Hook Churn &amp; Drop-off Dips
                </p>
              </div>

              <h3 className="mt-3 text-xs font-bold text-ink">
                Underperforming Taxonomy Audit
              </h3>
              <p className="mt-1 text-xs text-[#6e6459] leading-relaxed">
                Automatically identifies common drop-off causes, weak curiosity gaps, and dead-zone intros to eliminate churn.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-rose-200/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800/80">
                AWAITING 1ST INGESTION
              </span>
            </div>
          </div>
        </div>

        {/* Action Callout */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl bg-[#faf7f2] border border-[#ede5d8] p-3">
          <span className="text-xs text-[#6e6459]">
            Connect your YouTube channel to rank your uploads into deciles and compare winning formats.
          </span>
          <button
            onClick={() => startYouTubeOAuth()}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#e62117] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#cc1810] shrink-0"
          >
            <Icon name="youtube" className="size-3.5" />
            <span>Connect Channel</span>
          </button>
        </div>
      </div>
    );
  }

  // Connected state
  return (
    <div className="rounded-2xl border border-[#e6e0d6] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-[#f2ede4] pb-4">
        <div>
          <h2 className="text-base font-semibold text-ink">
            Top vs Underperforming Content Split
          </h2>
          <p className="text-xs text-[#82786e]">
            Direct comparative taxonomy analysis of recent 16 uploads
          </p>
        </div>
        <Link
          href="/dashboard/content"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand transition-colors hover:text-brand-strong"
        >
          <span>View all 16 posts</span>
          <Icon name="arrow-right" className="size-3" />
        </Link>
      </div>

      {/* Side-by-side Video Cards Grid */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CONTENT_SPLIT_ITEMS.map((item) => {
          const isTop = item.type === "top_decile";
          return (
            <div
              key={item.id}
              className={`flex flex-col justify-between rounded-xl border p-4 transition-all ${
                isTop
                  ? "border-emerald-200/80 bg-emerald-50/20 hover:border-emerald-300"
                  : "border-rose-200/80 bg-rose-50/20 hover:border-rose-300"
              }`}
            >
              <div>
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      isTop
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {item.badgeLabel}
                  </span>
                  <span className="text-[11px] font-mono text-[#8c8277]">
                    {item.videoDuration}
                  </span>
                </div>

                {/* Simulated Thumbnail */}
                <div
                  className={`mt-3 flex h-28 w-full flex-col justify-between rounded-lg bg-gradient-to-br ${item.thumbnailGradient} p-3 text-white shadow-inner relative overflow-hidden`}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-mono backdrop-blur-sm">
                      HD 4K
                    </span>
                    <div className="grid size-6 place-items-center rounded-full bg-white/20 backdrop-blur-sm">
                      <Icon name="play" className="size-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-white drop-shadow">
                      {item.title}
                    </p>
                  </div>
                </div>

                {/* Video Title & Metrics */}
                <h3 className="mt-3 text-xs font-bold text-ink truncate">
                  {item.title}
                </h3>
                <p className="mt-0.5 text-xs font-medium text-[#736a60]">
                  {item.viewsFormatted} ·{" "}
                  <span
                    className={`font-semibold ${
                      isTop ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {item.hookHoldRate}
                  </span>
                </p>

                {/* Hook Classification Tags */}
                <div className="mt-3 pt-3 border-t border-[#e8e2d8]/60">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#948b81]">
                    HOOK CLASSIFICATION
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {item.hookTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-[#e2dcce] bg-white px-2 py-0.5 text-[11px] font-medium text-[#5c544c]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
