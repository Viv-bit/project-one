"use client";

import Link from "next/link";
import { Icon } from "@/components/ui";
import { COHORT_BENCHMARKS } from "@/lib/data/intelligence-mock-data";
import { startYouTubeOAuth } from "@/lib/youtube";
import { useYouTubeConnection } from "@/lib/youtube-connection-context";

export function CohortBenchmarkingWidget() {
  const { isConnected } = useYouTubeConnection();

  // Empty state when YouTube is not connected
  if (!isConnected) {
    return (
      <div className="rounded-2xl border border-dashed border-[#ded4c6] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f2ede4] pb-3.5">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-lg bg-[#faf7f2] border border-[#e8e2d8] text-[#998f84]">
              <Icon name="users" className="size-3.5" />
            </span>
            <h2 className="text-base font-semibold text-ink">Cohort Benchmarking</h2>
          </div>
          <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
            Tier Locked
          </span>
        </div>

        <p className="mt-2.5 text-xs text-[#786f65] leading-relaxed">
          Peer comparisons against verified creator cohorts unlock once your subscriber scale is verified.
        </p>

        {/* Locked Cohort Preview Rows */}
        <div className="mt-4 space-y-3.5">
          {[
            { metric: "0–3s Hook Retention", note: "Benchmark: ~74% median in tech cohort" },
            { metric: "72h View Velocity", note: "Tier percentile calculation locked" },
            { metric: "End-Card Click-Through", note: "Awaiting video catalog sync" },
          ].map((item) => (
            <div key={item.metric} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#7d7367]">{item.metric}</span>
                <span className="text-[10px] font-medium text-[#9c9185] bg-[#f5efe6] px-1.5 py-0.5 rounded">
                  Locked
                </span>
              </div>

              {/* Ghost progress bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#ede7dd]">
                <div className="h-full rounded-full bg-[#d0c6b8]" style={{ width: "20%" }} />
              </div>

              <div className="text-[10px] text-[#998f84]">
                <span>{item.note}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => startYouTubeOAuth()}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#ded4c6] bg-[#faf7f2] py-2 text-xs font-semibold text-[#5c5348] hover:bg-white hover:border-brand/40 transition-colors"
        >
          <Icon name="youtube" className="size-3.5 text-red-600" />
          <span>Connect Channel to Unlock Cohorts</span>
        </button>
      </div>
    );
  }

  // Connected state
  return (
    <div className="rounded-2xl border border-[#e6e0d6] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#f2ede4] pb-3.5">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-lg bg-brand/10 text-brand">
            <Icon name="users" className="size-3.5" />
          </span>
          <h2 className="text-base font-semibold text-ink">Cohort Benchmarking</h2>
        </div>
        <Link
          href="/dashboard/benchmarks"
          className="rounded-full bg-[#f6f2ea] border border-[#e8e2d8] px-2 py-0.5 text-[10px] font-semibold text-brand hover:underline"
        >
          18 Peers &rarr;
        </Link>
      </div>

      <p className="mt-2.5 text-xs text-[#786f65] leading-relaxed">
        Compared directly against 18 active verified creators in your 250k–500k subscriber tier.
      </p>

      {/* Benchmark Rows */}
      <div className="mt-4 space-y-4">
        {COHORT_BENCHMARKS.map((bench) => (
          <div key={bench.id} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-ink">{bench.metricName}</span>
              <span className="font-semibold text-brand text-[11px]">
                {bench.percentileLabel}
              </span>
            </div>

            {/* Visual Comparative Progress Bar */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#ede7dd]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand to-amber-500"
                style={{ width: `${bench.progressPct}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#887f74]">
              <span>{bench.note}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
