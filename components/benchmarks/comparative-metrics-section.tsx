"use client";

import { Icon } from "@/components/ui/icon";
import type {
  BenchmarkComparisonResult,
  ComparativeMetric,
  DistributionComparisonItem,
  PeerInsight,
} from "@/lib/benchmarks";

type ComparativeMetricsSectionProps = {
  comparativeMetrics?: BenchmarkComparisonResult["comparativeMetrics"];
  hookDistributionComparison?: DistributionComparisonItem[];
  pillarDistributionComparison?: DistributionComparisonItem[];
  peerInsights?: PeerInsight[];
};

const STATUS_META: Record<
  ComparativeMetric["status"],
  { label: string; badgeClass: string; barClass: string }
> = {
  ABOVE_BENCHMARK: {
    label: "Above Benchmark",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
    barClass: "bg-emerald-500",
  },
  ON_PAR: {
    label: "On Par",
    badgeClass: "bg-stone-100 text-stone-700 border-stone-200",
    barClass: "bg-stone-500",
  },
  BELOW_BENCHMARK: {
    label: "Below Benchmark",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    barClass: "bg-brand",
  },
};

function formatDurationHelper(val: number, unit: string): string | null {
  const u = (unit || "").toLowerCase();
  if (
    (u === "s" || u === "sec" || u === "secs" || u === "seconds") &&
    val >= 60
  ) {
    const mins = Math.floor(val / 60);
    const secs = Math.round(val % 60);
    return `${mins}m ${secs}s`;
  }
  return null;
}

function formatMetricNumber(val: number): string {
  if (typeof val !== "number" || Number.isNaN(val)) return "0";
  if (Number.isInteger(val)) return val.toLocaleString();
  return val.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function normalizeDistribution(
  items: DistributionComparisonItem[],
): DistributionComparisonItem[] {
  if (!items || items.length === 0) return [];
  const maxVal = Math.max(
    ...items.flatMap((i) => [
      Math.abs(i.creatorShare ?? 0),
      Math.abs(i.benchmarkShare ?? 0),
    ]),
  );
  const sumBenchmark = items.reduce(
    (acc, i) => acc + (i.benchmarkShare ?? 0),
    0,
  );
  const sumCreator = items.reduce((acc, i) => acc + (i.creatorShare ?? 0), 0);

  const isFractional =
    maxVal > 0 &&
    maxVal <= 1 &&
    sumBenchmark <= 1.05 &&
    sumCreator <= 1.05;

  if (!isFractional) {
    return items.map((item) => ({
      ...item,
      creatorShare: Math.round((item.creatorShare ?? 0) * 10) / 10,
      benchmarkShare: Math.round((item.benchmarkShare ?? 0) * 10) / 10,
      deltaShare: Math.round((item.deltaShare ?? 0) * 10) / 10,
    }));
  }

  return items.map((item) => ({
    ...item,
    creatorShare: Math.round((item.creatorShare ?? 0) * 1000) / 10,
    benchmarkShare: Math.round((item.benchmarkShare ?? 0) * 1000) / 10,
    deltaShare: Math.round((item.deltaShare ?? 0) * 1000) / 10,
  }));
}

function DistributionComparisonCard({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: DistributionComparisonItem[];
}) {
  const normalized = normalizeDistribution(items);

  return (
    <div className="rounded-2xl border border-[#e6e0d6] bg-white p-6 shadow-sm space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#f0ebe1] pb-4">
        <div>
          <h3 className="font-serif text-xl font-medium text-ink">{title}</h3>
          <p className="text-xs text-muted mt-0.5">{subtitle}</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-medium text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-brand" />
            <span>You</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#9a9084]" />
            <span>Peers</span>
          </span>
        </div>
      </div>

      {normalized.length === 0 ? (
        <p className="text-xs text-muted py-4 text-center">
          Analyze more videos to populate comparative content distributions.
        </p>
      ) : (
        <div className="space-y-4">
          {normalized.map((item) => {
            const creatorWidth = Math.min(100, Math.max(2, item.creatorShare));
            const peerWidth = Math.min(100, Math.max(2, item.benchmarkShare));
            const delta = item.deltaShare;

            return (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-ink truncate">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                    <span className="text-brand font-semibold">
                      You {item.creatorShare}%
                    </span>
                    <span className="text-muted">vs</span>
                    <span className="text-[#5c5348] font-medium">
                      Peers {item.benchmarkShare}%
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                        delta > 5
                          ? "bg-emerald-50 text-emerald-700"
                          : delta < -5
                            ? "bg-amber-50 text-amber-800"
                            : "bg-[#f5f0e8] text-[#756c62]"
                      }`}
                    >
                      {delta >= 0 ? `+${delta}%` : `${delta}%`}
                    </span>
                  </div>
                </div>

                {/* Dual Horizontal Bars */}
                <div className="space-y-1">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#f4efe6]">
                    <div
                      className="h-full rounded-full bg-brand transition-all duration-500"
                      style={{ width: `${creatorWidth}%` }}
                    />
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#f4efe6]">
                    <div
                      className="h-full rounded-full bg-[#9a9084] transition-all duration-500"
                      style={{ width: `${peerWidth}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ComparativeMetricsSection({
  comparativeMetrics,
  hookDistributionComparison = [],
  pillarDistributionComparison = [],
  peerInsights = [],
}: ComparativeMetricsSectionProps) {
  const metricsList: ComparativeMetric[] = [
    comparativeMetrics?.medianViews,
    comparativeMetrics?.engagementRate,
    comparativeMetrics?.monthlyPostFrequency,
    comparativeMetrics?.avgDurationSeconds,
  ].filter((m): m is ComparativeMetric => Boolean(m));

  const hasDistributions =
    hookDistributionComparison.length > 0 ||
    pillarDistributionComparison.length > 0;

  return (
    <div className="space-y-8">
      {/* 1. Comparative Metrics Grid */}
      {metricsList.length > 0 && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1">
            <div>
              <h2 className="font-serif text-2xl font-normal text-ink">
                Comparative Metric Telemetry
              </h2>
              <p className="text-xs text-muted">
                Direct baseline comparison across views, engagement, upload
                cadence, and runtime.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {metricsList.map((m, idx) => {
              const statusInfo =
                STATUS_META[m.status] ?? STATUS_META.ON_PAR;
              const maxReference = Math.max(
                m.creatorValue || 0,
                m.benchmarkValue || 0,
                1,
              );
              const creatorPct = Math.min(
                100,
                Math.max(6, ((m.creatorValue || 0) / maxReference) * 100),
              );
              const peerPct = Math.min(
                100,
                Math.max(6, ((m.benchmarkValue || 0) / maxReference) * 100),
              );
              const creatorDuration = formatDurationHelper(
                m.creatorValue,
                m.unit,
              );
              const peerDuration = formatDurationHelper(
                m.benchmarkValue,
                m.unit,
              );
              const roundedDeltaPct =
                Math.round((m.deltaPercent ?? 0) * 10) / 10;

              return (
                <div
                  key={`${m.metric}-${idx}`}
                  className="flex flex-col justify-between rounded-2xl border border-[#e6e0d6] bg-white p-6 shadow-sm"
                >
                  <div className="space-y-4">
                    {/* Top Row: Metric Title + Status & Delta Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted">
                        {m.metric}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusInfo.badgeClass}`}
                        >
                          {statusInfo.label}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-[#faf7f2] border border-[#e8e2d8] px-2 py-0.5 font-mono text-xs font-semibold text-ink">
                          {roundedDeltaPct >= 0
                            ? `+${roundedDeltaPct}%`
                            : `${roundedDeltaPct}%`}
                        </span>
                      </div>
                    </div>

                    {/* Creator vs Benchmark Values */}
                    <div className="flex items-baseline justify-between gap-4">
                      <div>
                        <span className="text-[11px] text-muted block">
                          Your Channel
                        </span>
                        <span className="font-serif text-3xl font-normal text-ink">
                          {formatMetricNumber(m.creatorValue)}{" "}
                          <span className="text-xs font-sans text-muted">
                            {m.unit}
                          </span>
                        </span>
                        {creatorDuration && (
                          <span className="block text-[11px] font-mono text-muted">
                            ({creatorDuration})
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] text-muted block">
                          Peer Benchmark
                        </span>
                        <span className="font-serif text-2xl font-normal text-[#6e655a]">
                          {formatMetricNumber(m.benchmarkValue)}{" "}
                          <span className="text-xs font-sans text-muted">
                            {m.unit}
                          </span>
                        </span>
                        {peerDuration && (
                          <span className="block text-[11px] font-mono text-muted">
                            ({peerDuration})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Relative Visual Bars */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="w-10 text-[10px] font-semibold text-muted">
                          You
                        </span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#f2ede4]">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${statusInfo.barClass}`}
                            style={{ width: `${creatorPct}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-10 text-[10px] font-semibold text-muted">
                          Peers
                        </span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#f2ede4]">
                          <div
                            className="h-full rounded-full bg-[#a1978b] transition-all duration-500"
                            style={{ width: `${peerPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interpretation */}
                  <div className="mt-5 pt-4 border-t border-[#f0ebe1] text-xs text-[#5c5348] leading-relaxed">
                    <strong className="text-ink font-semibold">
                      Interpretation:
                    </strong>{" "}
                    {m.interpretation}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 2. Hook & Pillar Distribution Comparisons */}
      {hasDistributions && (
        <section className="space-y-4">
          <div>
            <h2 className="font-serif text-2xl font-normal text-ink">
              Hook &amp; Content Pillar Distributions
            </h2>
            <p className="text-xs text-muted">
              Where your creative mix over-indexes or under-indexes relative to
              peer channels.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <DistributionComparisonCard
              title="Hook Type Distribution"
              subtitle="Share of opening hook structures across analyzed uploads"
              items={hookDistributionComparison}
            />
            <DistributionComparisonCard
              title="Content Pillar Distribution"
              subtitle="Share of strategic content formats & topic pillars"
              items={pillarDistributionComparison}
            />
          </div>
        </section>
      )}

      {/* 3. Peer Insights Cards (OPPORTUNITY, STRENGTH, GAP) */}
      {peerInsights.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="font-serif text-2xl font-normal text-ink">
              Peer Cohort Signals (Opportunities, Strengths &amp; Gaps)
            </h2>
            <p className="text-xs text-muted">
              Evidence-backed takeaways surfaced from comparing your channel
              against peer telemetry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {peerInsights.map((insight, idx) => {
              const badgeStyle =
                insight.type === "OPPORTUNITY"
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : insight.type === "STRENGTH"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-rose-50 text-rose-800 border-rose-200";

              const iconName =
                insight.type === "OPPORTUNITY"
                  ? "spark"
                  : insight.type === "STRENGTH"
                    ? "check-circle"
                    : "alert-triangle";

              return (
                <div
                  key={`${insight.title}-${idx}`}
                  className="flex flex-col justify-between rounded-2xl border border-[#e6e0d6] bg-white p-5 shadow-sm space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeStyle}`}
                      >
                        <Icon name={iconName} className="size-3" />
                        <span>{insight.type}</span>
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-ink leading-snug">
                      {insight.title}
                    </h3>
                    <p className="text-xs text-[#665e53] leading-relaxed">
                      {insight.observation}
                    </p>

                    {insight.evidence && (
                      <div className="rounded-xl bg-[#faf7f2] border border-[#eee7dc] px-3 py-2 text-[11px] text-[#5c5348]">
                        <strong className="font-semibold text-ink">
                          Evidence:
                        </strong>{" "}
                        {insight.evidence}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#f0ebe1] text-xs text-[#52493e] leading-relaxed">
                    <strong className="font-semibold text-brand">
                      Takeaway:
                    </strong>{" "}
                    {insight.actionableTakeaway}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

