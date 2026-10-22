"use client";

import { Icon } from "@/components/ui/icon";
import { BENCHMARK_COHORT_DATA } from "@/lib/data/intelligence-mock-data";

export function BenchmarksView() {
  const cohort = BENCHMARK_COHORT_DATA;

  return (
    <div className="space-y-8 pb-12">
      {/* Cohort Definition Banner */}
      <div className="rounded-2xl border border-[#e6e0d6] bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand border border-brand/20">
                Vector Similarity Cohort · {cohort.cohortSize} Peer Channels
              </span>
              <span className="rounded-full bg-[#faf7f2] border border-[#e8e2d8] px-2.5 py-0.5 text-xs text-muted">
                {cohort.followerTier}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-ink">
              {cohort.cohortTitle}
            </h1>
            <p className="text-sm text-muted max-w-2xl leading-relaxed">
              {cohort.cohortDescription}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="rounded-xl border border-[#e6e0d6] bg-[#faf7f2] p-3 text-xs">
              <span className="text-muted block text-[11px]">Primary Language</span>
              <span className="font-semibold text-ink">{cohort.primaryLanguage}</span>
            </div>
            <div className="rounded-xl border border-[#e6e0d6] bg-[#faf7f2] p-3 text-xs">
              <span className="text-muted block text-[11px]">Content Format</span>
              <span className="font-semibold text-ink">{cohort.contentFormat}</span>
            </div>
          </div>
        </div>

        {/* PRD Guardrail Alert */}
        <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-line bg-cream/70 p-3.5 text-xs text-muted">
          <Icon name="shield" className="size-4 shrink-0 text-brand mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-ink font-semibold">Strict Separation Guardrail:</strong> Peer
            metrics are aggregated via vector similarity exclusively for internal cohort calibration. Lumen never exposes private competitor analytics or creates public vanity leaderboards.
          </p>
        </div>
      </div>

      {/* 4 Comparative Percentile Metrics */}
      <div className="space-y-4">
        <h2 className="font-serif text-2xl font-normal text-ink">
          Comparative Percentile Distributions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cohort.metrics.map((metric) => {
            return (
              <div
                key={metric.id}
                className="flex flex-col justify-between rounded-2xl border border-[#e6e0d6] bg-white p-6 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted">
                      {metric.name}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                        metric.deltaType === "positive"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-brand/10 text-brand border border-brand/20"
                      }`}
                    >
                      {metric.deltaLabel}
                    </span>
                  </div>

                  {/* Primary Numbers */}
                  <div className="mt-4 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-muted block">Your Baseline</span>
                      <span className="font-serif text-3xl font-normal text-ink">
                        {metric.creatorValueFormatted}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-muted block">Cohort Median</span>
                      <span className="font-serif text-2xl font-normal text-[#756c62]">
                        {metric.cohortMedianFormatted}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-muted block">Top 10% Decile</span>
                      <span className="font-serif text-2xl font-normal text-brand">
                        {metric.topDecileFormatted}
                      </span>
                    </div>
                  </div>

                  {/* Visual Percentile Bar */}
                  <div className="mt-5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span>Percentile Rank in Cohort</span>
                      <span className="font-bold text-ink font-mono">{metric.percentileRank}th Percentile</span>
                    </div>

                    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[#f2ece2]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand to-brand-strong transition-all duration-700"
                        style={{ width: `${metric.percentileRank}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Strategic Takeaway */}
                <div className="mt-5 pt-4 border-t border-[#f0ebe1] text-xs text-muted leading-relaxed">
                  <strong className="text-ink font-semibold">Strategic Takeaway:</strong> {metric.strategicTakeaway}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Peer Group Discovery List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-normal text-ink">
              Similar Peer Channels in Cluster
            </h2>
            <p className="text-xs text-muted">
              Channels matched on audience size, video production style, and content pillars.
            </p>
          </div>
          <span className="text-xs font-mono text-muted">
            18 Channels Clustered
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cohort.peers.map((peer) => {
            return (
              <div
                key={peer.id}
                className="flex flex-col justify-between rounded-2xl border border-[#e6e0d6] bg-white p-5 shadow-sm transition-all hover:border-brand/40"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">
                      {peer.similarityPct}% Vector Match
                    </span>
                    <span className="text-xs font-mono text-muted">
                      {peer.subscribersFormatted}
                    </span>
                  </div>

                  <h3 className="mt-3 font-serif text-lg font-normal text-ink">
                    {peer.displayName}
                  </h3>
                  <p className="text-xs text-muted">{peer.handle}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#f0ebe1] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-muted">
                    <span>Primary Hook:</span>
                    <span className="font-semibold text-ink">{peer.primaryHook}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted">
                    <span>Top Pillar:</span>
                    <span className="font-medium text-ink">{peer.topTopic}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted">
                    <span>Median Views:</span>
                    <span className="font-mono text-ink">{peer.medianViewsFormatted}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
