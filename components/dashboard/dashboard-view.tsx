"use client";

import { useYouTubeConnection } from "@/lib/youtube-connection-context";
import { ChannelHeader } from "@/components/dashboard/channel-header";
import { KpiMetricCards } from "@/components/dashboard/kpi-metric-cards";
import { RetentionCurveChart } from "@/components/dashboard/retention-curve-chart";
import { EvidenceOpportunitiesCard } from "@/components/dashboard/evidence-opportunities-card";
import { ContentSplitCard } from "@/components/dashboard/content-split-card";
import { ExperimentBacklogWidget } from "@/components/dashboard/experiment-backlog-widget";
import { CohortBenchmarkingWidget } from "@/components/dashboard/cohort-benchmarking-widget";
import { ExperimentPendingCard } from "@/components/dashboard/experiment-pending-card";
import { DashboardConnectBanner } from "@/components/dashboard/dashboard-connect-banner";
import { Icon } from "@/components/ui";

export function DashboardView() {
  const { isLoading, isConnected, isDemoMode, toggleDemoMode } =
    useYouTubeConnection();

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12 animate-pulse">
        {/* Banner Skeleton */}
        <div className="h-28 w-full rounded-2xl bg-white/70 border border-[#e8ded0]" />

        {/* 4 KPI Cards Skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-white/70 border border-[#e8ded0]"
            />
          ))}
        </div>

        {/* Main Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 items-start">
          <div className="space-y-6 xl:col-span-8">
            <div className="h-80 rounded-2xl bg-white/70 border border-[#e8ded0]" />
            <div className="h-64 rounded-2xl bg-white/70 border border-[#e8ded0]" />
            <div className="h-72 rounded-2xl bg-white/70 border border-[#e8ded0]" />
          </div>
          <div className="space-y-6 xl:col-span-4">
            <div className="h-72 rounded-2xl bg-white/70 border border-[#e8ded0]" />
            <div className="h-64 rounded-2xl bg-white/70 border border-[#e8ded0]" />
            <div className="h-20 rounded-2xl bg-white/70 border border-[#e8ded0]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* If not connected, show prominent connect hero banner */}
      {!isConnected && (
        <DashboardConnectBanner
          onDemoToggle={toggleDemoMode}
          isDemoMode={isDemoMode}
        />
      )}

      {/* Channel Header Banner (renders empty state when !isConnected) */}
      <ChannelHeader />

      {/* 4 KPI Metric Cards (renders empty state when !isConnected) */}
      <KpiMetricCards />

      {/* Main Intelligence Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 items-start">
        {/* Left Column (8 cols): Retention Curve, Opportunities, Content Split */}
        <div className="space-y-6 xl:col-span-8">
          {/* Retention & Hook Velocity Curve */}
          <RetentionCurveChart />

          {/* Top 3 Evidence-Backed Opportunities */}
          <EvidenceOpportunitiesCard />

          {/* Top vs Underperforming Content Split */}
          <ContentSplitCard />
        </div>

        {/* Right Column (4 cols): Experiment Backlog, Cohort Benchmarking, Pending Tests */}
        <div className="space-y-6 xl:col-span-4">
          {/* Active Experiment Backlog */}
          <ExperimentBacklogWidget />

          {/* Cohort Benchmarking */}
          <CohortBenchmarkingWidget />

          {/* Pending Experiment Backlog link */}
          <ExperimentPendingCard />
        </div>
      </div>

      {/* Connected mode footer preview toggle */}
      {isConnected && (
        <div className="flex items-center justify-end pt-2">
          <button
            type="button"
            onClick={toggleDemoMode}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/80 px-3 py-1 text-[11px] font-medium text-muted hover:text-ink hover:bg-white transition-colors"
          >
            <Icon name="refresh-cw" className="size-3" />
            <span>Switch to Empty State Preview</span>
          </button>
        </div>
      )}
    </div>
  );
}
