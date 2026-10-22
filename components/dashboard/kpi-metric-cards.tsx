"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/components/ui";
import { KPI_METRIC_CARDS } from "@/lib/data/intelligence-mock-data";
import { getCreatorOverview, type CreatorOverviewResponse } from "@/lib/creator";
import { formatCount } from "@/lib/youtube";

export function KpiMetricCards() {
  const [overview, setOverview] = useState<CreatorOverviewResponse | null>(null);

  useEffect(() => {
    async function fetchOverview() {
      try {
        const data = await getCreatorOverview();
        if (data && data.medians) {
          setOverview(data);
        }
      } catch {
        // Fall back to sample KPI cards
      }
    }
    fetchOverview();
  }, []);

  // Compute cards using live overview if present
  const medianViews = overview?.medians?.views != null
    ? formatCount(overview.medians.views)
    : KPI_METRIC_CARDS[0].value;
  const meanViews = overview?.medians?.meanViews != null
    ? formatCount(overview.medians.meanViews)
    : "48,200";
  const engagementRate = overview?.medians?.engagementRate != null
    ? `${overview.medians.engagementRate.toFixed(1)}%`
    : KPI_METRIC_CARDS[1].value;
  const viewsSubRatio = overview?.medians?.viewsPerSubscriberRatio != null
    ? `${(overview.medians.viewsPerSubscriberRatio * 100).toFixed(2)}%`
    : KPI_METRIC_CARDS[2].value;
  const top10Threshold = overview?.percentiles?.top10ThresholdViews != null
    ? formatCount(overview.percentiles.top10ThresholdViews)
    : "112,000";
  const postsPerWeek = overview?.cadence?.postsPerWeek != null
    ? `${overview.cadence.postsPerWeek.toFixed(1)}/wk`
    : "1.2/wk";
  const daysGap = overview?.cadence?.medianDaysBetweenUploads != null
    ? `${overview.cadence.medianDaysBetweenUploads}d`
    : "6d";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* 1. Median View Velocity (Prioritizes Medians over Averages) */}
      <div className="group relative flex flex-col justify-between rounded-2xl border border-[#e6e0d6] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:border-brand/40 hover:shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#887f74]">
            Median 72h View Velocity
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
            Median
          </span>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#f2ede4] flex items-center justify-between text-xs text-[#887f74]">
          <span>Mean Views: <strong className="text-ink font-semibold">{meanViews}</strong></span>
          <span className="text-emerald-700 font-medium">Robust Outlier Fit</span>
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
            +13.4%
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
            High Tier
          </span>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#f2ede4]">
          <div className="flex items-center justify-between text-[11px] text-[#887f74] mb-1">
            <span>Cohort Standing</span>
            <span className="font-semibold text-brand">Top 15% Niche</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f0ebd2]/60">
            <div className="h-full rounded-full bg-brand" style={{ width: "84%" }} />
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
          <span>Deterministic Analytics Calibrated</span>
        </div>
      </div>
    </div>
  );
}
