"use client";

import { Icon } from "@/components/ui";
import { useCreatorOverviewQuery } from "@/lib/queries";
import { formatCount, startYouTubeOAuth } from "@/lib/youtube";
import { useYouTubeConnection } from "@/lib/youtube-connection-context";

export function KpiMetricCards() {
  const { isConnected, isAutoSyncing, autoSyncStage, triggerAutoSync } =
    useYouTubeConnection();
  const { data: overview, isLoading } = useCreatorOverviewQuery({
    enabled: isConnected,
  });

  const hasVideos = Boolean(overview?.totals?.totalVideos && overview.totals.totalVideos > 0);
  const isPreparingMetrics = isConnected && (isAutoSyncing || isLoading);

  // Empty state for users without a connected channel OR without ingested videos
  if (!isConnected || !hasVideos) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* 1. Median View Velocity Empty State */}
        <div className="group relative flex flex-col justify-between rounded-2xl border border-dashed border-[#ded4c6] bg-white/70 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:bg-white hover:border-brand/40">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#887f74]">
              Median 72h View Velocity
            </span>
            <div className="grid size-7 place-items-center rounded-lg bg-[#faf7f2] border border-[#e8e2d8] text-[#a59b8f]">
              <Icon name="trending-up" className="size-3.5" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#c2b6a8]">
              —
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#f4ede3] text-[#7d7367] px-2 py-0.5 text-[11px] font-medium">
              {isPreparingMetrics ? (
                <>
                  <Icon name="refresh" className="size-2.5 animate-spin text-brand" />
                  <span>
                    {autoSyncStage === "analyzing" ? "Analyzing..." : "Syncing..."}
                  </span>
                </>
              ) : !isConnected ? (
                "Awaiting Channel"
              ) : (
                "No Uploads Found"
              )}
            </span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#f2ede4] flex items-center justify-between text-xs text-[#9c9185]">
            <span>
              {isPreparingMetrics
                ? "Calculating medians & AI analysis..."
                : !isConnected
                  ? "Requires YouTube link"
                  : "0 public videos detected"}
            </span>
            {isPreparingMetrics ? (
              <span className="font-medium text-brand inline-flex items-center gap-1 text-[11px]">
                <Icon name="refresh" className="size-3 animate-spin" /> Auto-syncing
              </span>
            ) : !isConnected ? (
              <button
                onClick={() => startYouTubeOAuth()}
                className="font-medium text-brand hover:underline"
              >
                Connect
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void triggerAutoSync({ force: true })}
                className="font-medium text-brand hover:underline cursor-pointer"
              >
                Re-check
              </button>
            )}
          </div>
        </div>

        {/* 2. Median Engagement Rate Empty State */}
        <div className="group relative flex flex-col justify-between rounded-2xl border border-dashed border-[#ded4c6] bg-white/70 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:bg-white hover:border-brand/40">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#887f74]">
              Median Engagement Rate
            </span>
            <div className="grid size-7 place-items-center rounded-lg bg-[#faf7f2] border border-[#e8e2d8] text-[#a59b8f]">
              <Icon name="clock" className="size-3.5" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#c2b6a8]">
              —
            </span>
            <span className="inline-flex items-center rounded-full bg-[#f4ede3] text-[#7d7367] px-2 py-0.5 text-[11px] font-medium">
              Uncalibrated
            </span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#f2ede4] text-xs text-[#9c9185]">
            <span>Top 10% Threshold: </span>
            <span className="font-medium text-[#7d7367]">Locked</span>
          </div>
        </div>

        {/* 3. Views / Subscriber Ratio Empty State */}
        <div className="group relative flex flex-col justify-between rounded-2xl border border-dashed border-[#ded4c6] bg-white/70 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:bg-white hover:border-brand/40">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#887f74]">
              Views / Subscriber Ratio
            </span>
            <div className="grid size-7 place-items-center rounded-lg bg-[#faf7f2] border border-[#e8e2d8] text-[#a59b8f]">
              <Icon name="activity" className="size-3.5" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#c2b6a8]">
              —
            </span>
            <span className="inline-flex items-center rounded-full bg-[#f4ede3] text-[#7d7367] px-2 py-0.5 text-[11px] font-medium">
              Awaiting Ingestion
            </span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#f2ede4] text-xs text-[#9c9185]">
            <span>Cohort Standing: </span>
            <span className="font-medium text-[#7d7367]">Locked</span>
          </div>
        </div>

        {/* 4. Upload Cadence Empty State */}
        <div className="group relative flex flex-col justify-between rounded-2xl border border-dashed border-[#ded4c6] bg-white/70 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:bg-white hover:border-brand/40">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#887f74]">
              Upload Cadence &amp; Gap
            </span>
            <div className="grid size-7 place-items-center rounded-lg bg-[#faf7f2] border border-[#e8e2d8] text-[#a59b8f]">
              <Icon name="shield" className="size-3.5" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#c2b6a8]">
              —
            </span>
            <span className="inline-flex items-center rounded-full bg-[#f4ede3] text-[#7d7367] px-2 py-0.5 text-[11px] font-medium">
              Pending Sync
            </span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#f2ede4] flex items-center gap-1.5 text-xs text-[#9c9185]">
            <span className="size-1.5 rounded-full bg-[#c2b6a8]" />
            <span>Deterministic Analytics Offline</span>
          </div>
        </div>
      </div>
    );
  }

  // Connected state computation from real overview
  const medianViews = overview?.medians?.views != null ? formatCount(overview.medians.views) : "—";
  const meanViews = overview?.medians?.meanViews != null ? formatCount(overview.medians.meanViews) : "—";
  const engagementRate = overview?.medians?.engagementRate != null ? `${overview.medians.engagementRate.toFixed(1)}%` : "—";
  const viewsSubRatio = overview?.medians?.viewsPerSubscriberRatio != null
    ? `${(overview.medians.viewsPerSubscriberRatio * 100).toFixed(2)}%`
    : "—";
  const top10Threshold = overview?.percentiles?.top10ThresholdViews != null
    ? formatCount(overview.percentiles.top10ThresholdViews)
    : "—";
  const postsPerWeek = overview?.cadence?.postsPerWeek != null
    ? `${overview.cadence.postsPerWeek.toFixed(1)}/wk`
    : "—";
  const daysGap = overview?.cadence?.medianDaysBetweenUploads != null
    ? `${overview.cadence.medianDaysBetweenUploads}d`
    : "—";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* 1. Median View Velocity */}
      <div className="group relative flex flex-col justify-between rounded-2xl border border-[#e6e0d6] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:border-brand/40 hover:shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#887f74]">
            Median View Velocity
          </span>
          <div className="grid size-7 place-items-center rounded-lg bg-[#faf7f2] border border-[#e8e2d8] text-[#7a7167] group-hover:text-brand">
            <Icon name="trending-up" className="size-3.5" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-ink">
            {medianViews}
          </span>
          <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[11px] font-semibold">
            {overview?.totals?.totalVideos ?? 0} Videos
          </span>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#f2ede4] flex items-center justify-between text-xs text-[#887f74]">
          <span>Mean Views: <strong className="text-ink font-semibold">{meanViews}</strong></span>
          <span className="text-emerald-700 font-medium">Verified Telemetry</span>
        </div>
      </div>

      {/* 2. Median Engagement Rate */}
      <div className="group relative flex flex-col justify-between rounded-2xl border border-[#e6e0d6] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:border-brand/40 hover:shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#887f74]">
            Median Engagement Rate
          </span>
          <div className="grid size-7 place-items-center rounded-lg bg-[#faf7f2] border border-[#e8e2d8] text-[#7a7167] group-hover:text-brand">
            <Icon name="clock" className="size-3.5" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-ink">
            {engagementRate}
          </span>
          <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[11px] font-semibold">
            Empirical
          </span>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#f2ede4] text-xs text-[#887f74]">
          <span>Top 10% Threshold: </span>
          <span className="font-semibold text-ink">{top10Threshold} views</span>
        </div>
      </div>

      {/* 3. Views / Subscriber Ratio */}
      <div className="group relative flex flex-col justify-between rounded-2xl border border-[#e6e0d6] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:border-brand/40 hover:shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#887f74]">
            Views / Subscriber Ratio
          </span>
          <div className="grid size-7 place-items-center rounded-lg bg-[#faf7f2] border border-[#e8e2d8] text-[#7a7167] group-hover:text-brand">
            <Icon name="activity" className="size-3.5" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-ink">
            {viewsSubRatio}
          </span>
          <span className="inline-flex items-center rounded-full bg-brand/10 text-brand border border-brand/20 px-2 py-0.5 text-[11px] font-semibold">
            Active Ratio
          </span>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#f2ede4]">
          <div className="flex items-center justify-between text-[11px] text-[#887f74] mb-1">
            <span>Audience Leverage</span>
            <span className="font-semibold text-brand">Calculated</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f0ebd2]/60">
            <div className="h-full rounded-full bg-brand" style={{ width: "65%" }} />
          </div>
        </div>
      </div>

      {/* 4. Upload Cadence & Confidence */}
      <div className="group relative flex flex-col justify-between rounded-2xl border border-[#e6e0d6] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:border-brand/40 hover:shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#887f74]">
            Upload Cadence &amp; Gap
          </span>
          <div className="grid size-7 place-items-center rounded-lg bg-[#faf7f2] border border-[#e8e2d8] text-[#7a7167] group-hover:text-brand">
            <Icon name="shield" className="size-3.5" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-ink">
            {postsPerWeek}
          </span>
          <span className="inline-flex items-center rounded-full bg-[#f5efe6] text-[#786f65] px-2 py-0.5 text-[11px] font-semibold">
            {daysGap} gap
          </span>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#f2ede4] flex items-center gap-1.5 text-xs text-[#887f74]">
          <Icon name="check-circle" className="size-3.5 text-brand" />
          <span>Real Channel Analytics</span>
        </div>
      </div>
    </div>
  );
}
