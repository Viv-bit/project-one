"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui";
import { getCreatorBenchmark, type BenchmarkComparisonResult } from "@/lib/benchmarks";
import { startYouTubeOAuth } from "@/lib/youtube";
import { useYouTubeConnection } from "@/lib/youtube-connection-context";

export function CohortBenchmarkingWidget() {
  const { isConnected } = useYouTubeConnection();
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkComparisonResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchBenchmark() {
      if (!isConnected) return;
      setIsLoading(true);
      try {
        const data = await getCreatorBenchmark();
        if (isMounted && data) {
          setBenchmarkData(data);
        }
      } catch (err) {
        console.warn("Failed to fetch cohort benchmark:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchBenchmark();
    return () => {
      isMounted = false;
    };
  }, [isConnected]);

  // Empty state when YouTube is not connected OR when no upload history exists
  if (!isConnected || !benchmarkData || !benchmarkData.hasData) {
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
            {!isConnected ? "Connection Required" : "Awaiting Videos"}
          </span>
        </div>

        <p className="mt-2.5 text-xs text-[#786f65] leading-relaxed">
          {!isConnected
            ? "Peer comparisons against verified creator cohorts unlock once your YouTube channel is connected."
            : "Calibrating against peer cohorts requires ingested video uploads to calculate comparative metrics."}
        </p>

        {/* Locked Cohort Preview Rows */}
        <div className="mt-4 space-y-3.5">
          {[
            { metric: "Median 72h View Velocity", note: "Cohort percentile calculation pending" },
            { metric: "Audience Engagement Rate", note: "Awaiting video upload baseline" },
            { metric: "Monthly Upload Cadence", note: "Sync channel to calculate publishing frequency" },
          ].map((item) => (
            <div key={item.metric} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#7d7367]">{item.metric}</span>
                <span className="text-[10px] font-medium text-[#9c9185] bg-[#f5efe6] px-1.5 py-0.5 rounded">
                  Pending
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
        {!isConnected ? (
          <button
            onClick={() => startYouTubeOAuth()}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#ded4c6] bg-[#faf7f2] py-2 text-xs font-semibold text-[#5c5348] hover:bg-white hover:border-brand/40 transition-colors"
          >
            <Icon name="youtube" className="size-3.5 text-red-600" />
            <span>Connect Channel to Unlock Cohorts</span>
          </button>
        ) : (
          <Link
            href="/dashboard/youtube"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-brand/30 bg-brand/5 py-2 text-xs font-semibold text-brand hover:bg-brand/10 transition-colors"
          >
            <Icon name="refresh-cw" className="size-3.5 text-brand" />
            <span>Sync Videos in Integrations</span>
          </Link>
        )}
      </div>
    );
  }

  // Connected state with real benchmark comparison
  const { benchmarkGroup, comparativeMetrics } = benchmarkData;
  const metrics = [
    comparativeMetrics?.medianViews,
    comparativeMetrics?.engagementRate,
    comparativeMetrics?.monthlyPostFrequency,
  ].filter(Boolean);

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
          {benchmarkGroup?.sampleCreatorCount ?? 18} Peers &rarr;
        </Link>
      </div>

      <p className="mt-2.5 text-xs text-[#786f65] leading-relaxed">
        Compared against verified creators in the <strong>{benchmarkGroup?.name ?? "peer cohort"}</strong>.
      </p>

      {/* Benchmark Rows */}
      <div className="mt-4 space-y-4">
        {metrics.map((m, idx) => {
          const isAbove = m.status === "ABOVE_BENCHMARK";
          const isNeutral = m.status === "ON_PAR";
          const progressPct = isAbove
            ? Math.min(95, 50 + Math.abs(m.deltaPercent) / 2)
            : isNeutral
            ? 50
            : Math.max(15, 50 - Math.abs(m.deltaPercent) / 2);

          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-ink">{m.metric}</span>
                <span
                  className={`font-semibold text-[11px] ${
                    isAbove ? "text-emerald-700" : isNeutral ? "text-[#7a7167]" : "text-brand"
                  }`}
                >
                  {m.deltaPercent >= 0 ? `+${m.deltaPercent}%` : `${m.deltaPercent}%`} vs Cohort
                </span>
              </div>

              {/* Visual Comparative Progress Bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#ede7dd]">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isAbove
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                      : "bg-gradient-to-r from-brand to-amber-500"
                  }`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#887f74]">
                <span>
                  You: <strong>{typeof m.creatorValue === "number" ? m.creatorValue.toLocaleString() : m.creatorValue} {m.unit}</strong>
                </span>
                <span>
                  Peer Median: <strong>{typeof m.benchmarkValue === "number" ? m.benchmarkValue.toLocaleString() : m.benchmarkValue} {m.unit}</strong>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
