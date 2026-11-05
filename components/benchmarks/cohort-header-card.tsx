"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { formatCount } from "@/lib/youtube";
import type {
  BenchmarkGroup,
  BenchmarkSelectedGoal,
  BenchmarkComparisonResult,
} from "@/lib/benchmarks";

type CohortHeaderCardProps = {
  benchmarkGroup: BenchmarkGroup | null;
  selectedGoal?: BenchmarkSelectedGoal;
  creatorOverview: BenchmarkComparisonResult["creatorOverview"];
  peerCount: number;
  isRefreshingPeers: boolean;
  isSwitchingGoal: boolean;
  onRefreshPeers: () => void;
};

const DISCOVERY_STAGES = [
  "Searching YouTube for comparable channels matching your niche & goal tier...",
  "Scraping public channel uploads, view velocity, and engagement baselines...",
  "Classifying peer spoken hooks, content pillars, and cadence patterns...",
  "Synthesizing your personalized Peer Growth Plan with Gemini AI...",
];

function formatScrapedTimestamp(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function CohortHeaderCard({
  benchmarkGroup,
  selectedGoal,
  creatorOverview,
  peerCount,
  isRefreshingPeers,
  isSwitchingGoal,
  onRefreshPeers,
}: CohortHeaderCardProps) {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (!isRefreshingPeers) {
      return;
    }
    const interval = setInterval(() => {
      setStageIndex((prev) =>
        prev < DISCOVERY_STAGES.length - 1 ? prev + 1 : prev,
      );
    }, 3500);
    return () => {
      clearInterval(interval);
      setStageIndex(0);
    };
  }, [isRefreshingPeers]);

  const isLive = benchmarkGroup?.source === "YOUTUBE_LIVE";
  const isSeed = !isLive && (benchmarkGroup?.source === "SEED" || !benchmarkGroup?.source);
  const scrapedLabel = formatScrapedTimestamp(benchmarkGroup?.lastScrapedAt);
  const searchQueries = benchmarkGroup?.searchQueries?.filter(Boolean) ?? [];
  const sampleCreators = benchmarkGroup?.sampleCreatorCount ?? peerCount;
  const samplePosts = benchmarkGroup?.samplePostCount ?? 0;

  return (
    <section className="rounded-2xl border border-[#e6e0d6] bg-white p-6 sm:p-8 shadow-sm space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div className="space-y-3">
          {/* Source & Niche Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live YouTube Peers</span>
              </span>
            ) : isSeed ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
                <Icon name="info" className="size-3.5 text-amber-600" />
                <span>Baseline Cohort (Connect/Sync YouTube for Live Peers)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand border border-brand/20">
                <span>{benchmarkGroup?.source}</span>
              </span>
            )}

            <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand border border-brand/20">
              {sampleCreators} Peer Channels
              {samplePosts > 0 ? ` · ${samplePosts} Videos` : ""}
            </span>

            <span className="rounded-full bg-[#faf7f2] border border-[#e8e2d8] px-2.5 py-0.5 text-xs font-medium text-ink">
              {benchmarkGroup?.niche || creatorOverview.inferredNiche || "Creator Niche"}
            </span>

            {selectedGoal?.targetPeerRange?.label && (
              <span className="rounded-full bg-[#faf7f2] border border-[#e8e2d8] px-2.5 py-0.5 text-xs font-mono text-muted">
                Peer Range: {selectedGoal.targetPeerRange.label}
              </span>
            )}

            {!selectedGoal?.targetPeerRange?.label &&
              benchmarkGroup &&
              benchmarkGroup.maxFollowers > 0 && (
                <span className="rounded-full bg-[#faf7f2] border border-[#e8e2d8] px-2.5 py-0.5 text-xs font-mono text-muted">
                  {formatCount(benchmarkGroup.minFollowers)}–
                  {formatCount(benchmarkGroup.maxFollowers)} Subs
                </span>
              )}
          </div>

          {/* Cohort Title & Description */}
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-ink">
              {benchmarkGroup?.name ?? "Goal-Calibrated Peer Cohort"}
            </h1>
            <p className="mt-1.5 text-sm text-muted max-w-2xl leading-relaxed">
              {benchmarkGroup?.description ??
                "Comparing your channel telemetry against comparable public YouTube creators aligned with your selected growth goal."}
            </p>
          </div>

          {/* Timestamp + Search Query Chips for Live Peers */}
          {(scrapedLabel || searchQueries.length > 0) && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {scrapedLabel && (
                <span className="inline-flex items-center gap-1.5 text-[11px] text-muted mr-1">
                  <Icon name="clock" className="size-3 text-muted" />
                  <span>Last scraped {scrapedLabel}</span>
                </span>
              )}

              {searchQueries.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-medium text-muted">
                    Discovery queries:
                  </span>
                  {searchQueries.map((query) => (
                    <span
                      key={query}
                      className="inline-flex items-center gap-1 rounded-md border border-[#e8e2d8] bg-[#faf7f2] px-2 py-0.5 font-mono text-[11px] text-[#5c5348]"
                    >
                      <Icon name="search" className="size-2.5 text-brand" />
                      <span>{query}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Overview Meta + Refresh Peers Action */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onRefreshPeers}
            disabled={isRefreshingPeers || isSwitchingGoal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-strong transition-colors disabled:opacity-60 disabled:cursor-wait cursor-pointer"
          >
            <Icon
              name="refresh-cw"
              className={`size-3.5 ${isRefreshingPeers ? "animate-spin" : ""}`}
            />
            <span>
              {isRefreshingPeers ? "Scraping Live Peers..." : "Refresh Peers"}
            </span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="rounded-xl border border-[#e6e0d6] bg-[#faf7f2] px-3 py-2 text-xs">
              <span className="text-muted block text-[10px] uppercase tracking-wider">
                Primary Pillar
              </span>
              <span className="font-semibold text-ink">
                {creatorOverview.primaryPillar || "General"}
              </span>
            </div>
            <div className="rounded-xl border border-[#e6e0d6] bg-[#faf7f2] px-3 py-2 text-xs">
              <span className="text-muted block text-[10px] uppercase tracking-wider">
                Analyzed Videos
              </span>
              <span className="font-semibold text-ink">
                {creatorOverview.totalPostsAnalyzed} Uploads
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Peer Scrape Progress & Skeleton State (~5–15s) */}
      {isRefreshingPeers && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-2xl border border-brand/30 bg-[#fdf8f3] p-4 sm:p-5 space-y-3.5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-brand text-white shadow-xs">
                <Icon name="youtube" className="size-4 animate-pulse" />
              </span>
              <div>
                <p className="text-xs font-bold text-ink">
                  Live YouTube Peer Discovery &amp; Growth Plan Synthesis in Progress
                </p>
                <p className="text-xs text-[#665e53]">
                  {DISCOVERY_STAGES[stageIndex]}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-medium text-brand shrink-0">
              Step {stageIndex + 1} of {DISCOVERY_STAGES.length} · ~5–15s
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#efe5d8]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand to-amber-500 transition-all duration-700"
              style={{
                width: `${Math.min(92, ((stageIndex + 1) / DISCOVERY_STAGES.length) * 90)}%`,
              }}
            />
          </div>

          {/* Skeleton preview placeholders */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 animate-pulse">
            <div className="h-14 rounded-xl bg-white/80 border border-[#efe5d8]" />
            <div className="h-14 rounded-xl bg-white/80 border border-[#efe5d8]" />
            <div className="h-14 rounded-xl bg-white/80 border border-[#efe5d8]" />
          </div>
        </div>
      )}
    </section>
  );
}

