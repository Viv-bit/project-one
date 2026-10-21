import type { Metadata } from "next";
import { ChannelHeader } from "@/components/dashboard/channel-header";
import { KpiMetricCards } from "@/components/dashboard/kpi-metric-cards";
import { RetentionCurveChart } from "@/components/dashboard/retention-curve-chart";
import { EvidenceOpportunitiesCard } from "@/components/dashboard/evidence-opportunities-card";
import { ContentSplitCard } from "@/components/dashboard/content-split-card";
import { ExperimentBacklogWidget } from "@/components/dashboard/experiment-backlog-widget";
import { CohortBenchmarkingWidget } from "@/components/dashboard/cohort-benchmarking-widget";
import { ExperimentPendingCard } from "@/components/dashboard/experiment-pending-card";

export const metadata: Metadata = {
  title: "Creator Intelligence Dashboard",
  description:
    "Analyze retention hook drop-offs, benchmark your past 50 uploads, and unlock automated title experiments on Lumen.",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-12">
      {/* Channel Header Banner */}
      <ChannelHeader />

      {/* 4 KPI Metric Cards */}
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
    </div>
  );
}
