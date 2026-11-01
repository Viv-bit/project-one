"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import {
  getCreatorBenchmark,
  getBenchmarkGroups,
  selectBenchmarkGroup,
  type BenchmarkComparisonResult,
  type BenchmarkGroup,
} from "@/lib/benchmarks";
import { formatCount, startYouTubeOAuth } from "@/lib/youtube";
import { useYouTubeConnection } from "@/lib/youtube-connection-context";

export function BenchmarksView() {
  const { isConnected } = useYouTubeConnection();
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkComparisonResult | null>(null);
  const [availableGroups, setAvailableGroups] = useState<BenchmarkGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingCohort, setIsChangingCohort] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setIsLoading(true);
      try {
        const [benchmarkRes, groupsRes] = await Promise.allSettled([
          getCreatorBenchmark(),
          getBenchmarkGroups(),
        ]);

        if (!isMounted) return;

        if (benchmarkRes.status === "fulfilled" && benchmarkRes.value) {
          setBenchmarkData(benchmarkRes.value);
        }
        if (groupsRes.status === "fulfilled" && groupsRes.value?.groups) {
          setAvailableGroups(groupsRes.value.groups);
        }
      } catch (err) {
        console.warn("Failed to load benchmark data:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [isConnected]);

  async function handleSwitchCohort(groupId: string) {
    try {
      setIsChangingCohort(true);
      await selectBenchmarkGroup(groupId);
      setFeedback("Cohort updated successfully!");
      const updated = await getCreatorBenchmark();
      setBenchmarkData(updated);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback(err?.message ?? "Failed to update cohort");
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setIsChangingCohort(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 rounded-2xl border border-[#e6e0d6] bg-white p-12 text-center shadow-sm">
        <div className="grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand">
          <Icon name="users" className="size-6 animate-pulse" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-medium text-ink">
            Calibrating Peer Benchmark Cohort...
          </h2>
          <p className="mt-1 text-xs text-muted">
            Aggregating comparative telemetry across matched public creator profiles.
          </p>
        </div>
      </div>
    );
  }

  // Empty state: Not connected OR no video data ingested
  if (!isConnected || !benchmarkData || !benchmarkData.hasData) {
    return (
      <div className="space-y-8 pb-12">
        {/* Banner Alert */}
        <div className="rounded-2xl border border-dashed border-[#ded4c6] bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-4">
            <div className="grid size-14 place-items-center rounded-2xl bg-[#faf7f2] border border-[#e8e2d8] text-brand shadow-sm">
              <Icon name="users" className="size-7" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
                <Icon name="shield" className="size-3 text-amber-600" />
                <span>Cohort Calibration Inactive</span>
              </div>
              <h1 className="mt-3 font-serif text-2xl sm:text-3xl font-medium tracking-tight text-ink">
                {!isConnected
                  ? "Connect Your Channel to Unlock Peer Benchmarks"
                  : "Upload History Required for Benchmark Calibration"}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
                {!isConnected
                  ? "Peer comparisons match your channel against verified creators of similar subscriber scale and content pillars. Connect your YouTube account to unlock deterministic percentile rankings."
                  : "To calculate statistical percentile distributions, hook retention comparisons, and peer cohort alignments, Lumen requires at least one video upload to be ingested and analyzed with Gemini AI."}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {!isConnected ? (
                <button
                  onClick={() => startYouTubeOAuth()}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#e62117] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#cc1810] transition-colors"
                >
                  <Icon name="youtube" className="size-4" />
                  <span>Connect YouTube Channel</span>
                </button>
              ) : (
                <Link
                  href="/dashboard/youtube"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-strong transition-colors"
                >
                  <Icon name="refresh-cw" className="size-3.5" />
                  <span>Sync Videos in Integrations</span>
                </Link>
              )}
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 rounded-xl border border-[#ded4c6] bg-[#faf7f2] px-4 py-2.5 text-xs font-semibold text-ink hover:bg-white transition-colors"
              >
                <span>View Ingestion Pipeline</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Available Cohorts in Platform */}
        {availableGroups.length > 0 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-ink">
                Available Platform Cohorts
              </h2>
              <p className="text-xs text-muted">
                Pre-calibrated peer groups tailored for specific creator niches and scale tiers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableGroups.map((group) => (
                <div
                  key={group.id}
                  className="flex flex-col justify-between rounded-2xl border border-[#e6e0d6] bg-white p-5 shadow-sm space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">
                        {group.niche}
                      </span>
                      <span className="text-xs font-mono text-muted">
                        {formatCount(group.minFollowers)}–{formatCount(group.maxFollowers)} Subs
                      </span>
                    </div>
                    <h3 className="mt-2.5 font-serif text-lg font-medium text-ink">
                      {group.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted leading-relaxed">
                      {group.description || "Benchmark cohort for creators producing focused topic videos."}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#f0ebe1] flex items-center justify-between text-xs text-muted">
                    <span>{group.sampleCreatorCount} Verified Channels</span>
                    <span className="text-[11px] font-medium text-brand">Public Telemetry</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Active populated benchmark state
  const { benchmarkGroup, creatorOverview, comparativeMetrics, hookDistributionComparison, pillarDistributionComparison, peerInsights, peerCreators, disclaimer } = benchmarkData;

  const metricsList = [
    comparativeMetrics?.medianViews,
    comparativeMetrics?.engagementRate,
    comparativeMetrics?.monthlyPostFrequency,
    comparativeMetrics?.avgDurationSeconds,
  ].filter(Boolean);

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Feedback */}
      {feedback && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs font-medium text-emerald-800 animate-in fade-in">
          <Icon name="check-circle" className="size-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Cohort Definition Banner */}
      <div className="rounded-2xl border border-[#e6e0d6] bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand border border-brand/20">
                Peer Cohort · {benchmarkGroup?.sampleCreatorCount ?? peerCreators.length} Verified Channels
              </span>
              <span className="rounded-full bg-[#faf7f2] border border-[#e8e2d8] px-2.5 py-0.5 text-xs text-muted">
                {benchmarkGroup?.niche ?? creatorOverview.inferredNiche}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-ink">
              {benchmarkGroup?.name ?? "Cohort Benchmarks"}
            </h1>
            <p className="text-sm text-muted max-w-2xl leading-relaxed">
              {benchmarkGroup?.description ?? "Comparing your channel telemetry against verified peer creators in your audience tier."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="rounded-xl border border-[#e6e0d6] bg-[#faf7f2] p-3 text-xs">
              <span className="text-muted block text-[11px]">Your Channel</span>
              <span className="font-semibold text-ink">{creatorOverview.channelTitle ?? "Connected Channel"}</span>
            </div>
            <div className="rounded-xl border border-[#e6e0d6] bg-[#faf7f2] p-3 text-xs">
              <span className="text-muted block text-[11px]">Analyzed Uploads</span>
              <span className="font-semibold text-ink">{creatorOverview.totalPostsAnalyzed} Videos</span>
            </div>
          </div>
        </div>

        {/* PRD Guardrail Alert */}
        <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-line bg-cream/70 p-3.5 text-xs text-muted">
          <Icon name="shield" className="size-4 shrink-0 text-brand mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-ink font-semibold">Strict Separation Guardrail:</strong> {disclaimer}
          </p>
        </div>
      </div>

      {/* Comparative Metrics Grid */}
      {metricsList.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-normal text-ink">
            Comparative Metric Distributions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {metricsList.map((m, idx) => {
              const isPositive = m.status === "ABOVE_BENCHMARK";
              const isNeutral = m.status === "ON_PAR";
              return (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-2xl border border-[#e6e0d6] bg-white p-6 shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted">
                        {m.metric}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                          isPositive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : isNeutral
                            ? "bg-stone-50 text-stone-700 border border-stone-200"
                            : "bg-brand/10 text-brand border border-brand/20"
                        }`}
                      >
                        {m.deltaPercent >= 0 ? `+${m.deltaPercent}%` : `${m.deltaPercent}%`} vs Cohort
                      </span>
                    </div>

                    <div className="mt-4 flex items-baseline justify-between">
                      <div>
                        <span className="text-xs text-muted block">Your Baseline</span>
                        <span className="font-serif text-3xl font-normal text-ink">
                          {typeof m.creatorValue === "number" ? m.creatorValue.toLocaleString() : m.creatorValue}{" "}
                          <span className="text-xs font-sans text-muted">{m.unit}</span>
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-muted block">Cohort Baseline</span>
                        <span className="font-serif text-2xl font-normal text-[#756c62]">
                          {typeof m.benchmarkValue === "number" ? m.benchmarkValue.toLocaleString() : m.benchmarkValue}{" "}
                          <span className="text-xs font-sans text-muted">{m.unit}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#f0ebe1] text-xs text-muted leading-relaxed">
                    <strong className="text-ink font-semibold">Analysis:</strong> {m.interpretation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Peer Insights & Strategic Opportunities */}
      {peerInsights && peerInsights.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-normal text-ink">
            Strategic Cohort Insights &amp; Opportunities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {peerInsights.map((insight, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-[#e6e0d6] bg-white p-5 shadow-sm space-y-3"
              >
                <div>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      insight.type === "OPPORTUNITY"
                        ? "bg-amber-50 text-amber-800 border border-amber-200"
                        : insight.type === "STRENGTH"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-brand/10 text-brand border border-brand/20"
                    }`}
                  >
                    {insight.type}
                  </span>
                  <h3 className="mt-2 text-sm font-bold text-ink">
                    {insight.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#665e53] leading-relaxed">
                    {insight.observation}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#f0ebe1] text-xs text-[#52493e]">
                  <strong className="font-semibold text-brand">Action:</strong> {insight.actionableTakeaway}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar Peer Channels */}
      {peerCreators && peerCreators.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-normal text-ink">
                Verified Peer Channels in Cohort
              </h2>
              <p className="text-xs text-muted">
                Aggregated public data from creators in your content cluster.
              </p>
            </div>
            <span className="text-xs font-mono text-muted">
              {peerCreators.length} Channels Clustered
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {peerCreators.map((peer) => (
              <div
                key={peer.id}
                className="flex flex-col justify-between rounded-2xl border border-[#e6e0d6] bg-white p-5 shadow-sm transition-all hover:border-brand/40"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">
                      Public Baseline
                    </span>
                    <span className="text-xs font-mono text-muted">
                      {formatCount(peer.subscriberCount)} Subs
                    </span>
                  </div>

                  <h3 className="mt-3 font-serif text-lg font-normal text-ink truncate">
                    {peer.channelTitle}
                  </h3>
                  <p className="text-xs text-muted truncate">{peer.channelHandle || "YouTube Creator"}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#f0ebe1] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-muted">
                    <span>Top Hook:</span>
                    <span className="font-semibold text-ink">{peer.topHookType || "Problem-First"}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted">
                    <span>Top Pillar:</span>
                    <span className="font-medium text-ink">{peer.topPillar || "Tutorial / How-To"}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted">
                    <span>Median Views:</span>
                    <span className="font-mono text-ink">{formatCount(peer.medianViews)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
