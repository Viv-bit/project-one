"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import {
  useCreatorBenchmarkQuery,
  useBenchmarkGoalsQuery,
  useSelectBenchmarkGoalMutation,
  useDiscoverBenchmarkPeersMutation,
  useCreateExperimentMutation,
  useExperimentsQuery,
} from "@/lib/queries";
import type {
  BenchmarkGoalId,
  PeerGrowthPlanStep,
} from "@/lib/benchmarks";
import type { CreateExperimentPayload } from "@/lib/experiments";
import { startYouTubeOAuth } from "@/lib/youtube";
import { useYouTubeConnection } from "@/lib/youtube-connection-context";
import { GoalSelectorBanner } from "./goal-selector-banner";
import { CohortHeaderCard } from "./cohort-header-card";
import { PeerGrowthPlanSection } from "./peer-growth-plan-section";
import { ComparativeMetricsSection } from "./comparative-metrics-section";
import { PeerCreatorsSection } from "./peer-creators-section";

type FeedbackBanner = {
  tone: "success" | "error";
  message: string;
  actionHref?: string;
  actionLabel?: string;
};

export function BenchmarksView() {
  const { isConnected } = useYouTubeConnection();

  const {
    data: goalsData,
    isLoading: isGoalsLoading,
  } = useBenchmarkGoalsQuery();

  const {
    data: benchmarkData,
    isLoading: isBenchmarkLoading,
  } = useCreatorBenchmarkQuery();

  const { data: existingExperiments = [] } = useExperimentsQuery();

  const selectGoalMutation = useSelectBenchmarkGoalMutation();
  const discoverPeersMutation = useDiscoverBenchmarkPeersMutation();
  const createExperimentMutation = useCreateExperimentMutation();

  const [switchingToGoalId, setSwitchingToGoalId] =
    useState<BenchmarkGoalId | null>(null);
  const [feedback, setFeedback] = useState<FeedbackBanner | null>(null);

  const activeGoalId: BenchmarkGoalId =
    switchingToGoalId ??
    benchmarkData?.selectedGoal?.id ??
    goalsData?.selectedGoalId ??
    "GROW_SUBSCRIBERS";

  const isSwitchingGoal = selectGoalMutation.isPending;
  const isRefreshingPeers = discoverPeersMutation.isPending;

  function showToast(next: FeedbackBanner, durationMs = 4500) {
    setFeedback(next);
    setTimeout(() => {
      setFeedback((curr) => (curr === next ? null : curr));
    }, durationMs);
  }

  async function handleSelectGoal(goalId: BenchmarkGoalId) {
    setSwitchingToGoalId(goalId);
    try {
      await selectGoalMutation.mutateAsync({ goalId });
      showToast({
        tone: "success",
        message:
          goalId === "GROW_SUBSCRIBERS"
            ? "Switched to Grow Subscriber Count cohort & updated growth plan."
            : "Switched to Increase Video Views cohort & updated growth plan.",
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to switch benchmarking goal.";
      showToast({ tone: "error", message: msg }, 5500);
    } finally {
      setSwitchingToGoalId(null);
    }
  }

  async function handleRefreshPeers() {
    const targetGoalId = benchmarkData?.selectedGoal?.id ?? activeGoalId;
    try {
      await discoverPeersMutation.mutateAsync({ goalId: targetGoalId });
      showToast({
        tone: "success",
        message:
          "Live YouTube peer cohort & growth plan refreshed successfully!",
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to refresh live YouTube peers.";
      showToast({ tone: "error", message: msg }, 5500);
    }
  }

  async function handleCreateExperiment(
    payload: CreateExperimentPayload,
    step: PeerGrowthPlanStep,
  ) {
    try {
      const created = await createExperimentMutation.mutateAsync(payload);
      showToast(
        {
          tone: "success",
          message: `Started experiment: "${step.title}"`,
          actionHref: "/dashboard/experiments",
          actionLabel: "Open Backlog",
        },
        6000,
      );
      return created;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to create experiment.";
      showToast({ tone: "error", message: msg }, 5500);
      throw err;
    }
  }

  // Initial page loading state when no benchmark data is available yet
  if (isBenchmarkLoading && !benchmarkData) {
    return (
      <div className="space-y-6 pb-12">
        <div className="flex min-h-[380px] flex-col items-center justify-center space-y-4 rounded-2xl border border-[#e6e0d6] bg-white p-12 text-center shadow-sm">
          <div className="grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand">
            <Icon name="users" className="size-6 animate-pulse" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-medium text-ink">
              Calibrating Goal-Driven Peer Benchmarks...
            </h2>
            <p className="mt-1 text-xs text-muted">
              Loading your milestone snapshot, comparable YouTube peer cohort,
              and growth plan.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state: No benchmark data available yet
  if (!benchmarkData || !benchmarkData.hasData) {
    return (
      <div className="space-y-8 pb-12">
        {feedback && (
          <div
            className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-xs font-medium ${
              feedback.tone === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-rose-200 bg-rose-50 text-rose-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon
                name={
                  feedback.tone === "success"
                    ? "check-circle"
                    : "alert-triangle"
                }
                className="size-4 shrink-0"
              />
              <span>{feedback.message}</span>
            </div>
          </div>
        )}

        {/* Render Goal Selector if goals endpoint returned data */}
        {goalsData && (
          <GoalSelectorBanner
            goalsData={goalsData}
            activeGoalId={activeGoalId}
            isLoadingGoals={isGoalsLoading}
            isSwitchingGoal={isSwitchingGoal}
            switchingToGoalId={switchingToGoalId}
            onSelectGoal={(goalId) => void handleSelectGoal(goalId)}
          />
        )}

        {/* Connect / Sync Prompt */}
        <div className="rounded-2xl border border-dashed border-[#ded4c6] bg-white p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-4">
            <div className="grid size-14 place-items-center rounded-2xl bg-[#faf7f2] border border-[#e8e2d8] text-brand shadow-sm">
              <Icon name="users" className="size-7" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
                <Icon name="shield" className="size-3 text-amber-600" />
                <span>
                  Baseline Cohort (Connect/Sync YouTube for Live Peers)
                </span>
              </div>
              <h1 className="mt-3 font-serif text-2xl sm:text-3xl font-medium tracking-tight text-ink">
                {!isConnected
                  ? "Connect Your Channel to Unlock Goal-Driven Peer Benchmarks"
                  : "Sync Your Videos to Generate a Live Peer Growth Plan"}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
                {!isConnected
                  ? "Connect your YouTube channel so we can benchmark your videos against real comparable creators in your subscriber milestone or viewership tier."
                  : "Ingest and analyze your recent uploads so we can match you with live YouTube peers, compare hook & pillar distributions, and synthesize an actionable growth plan."}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {!isConnected ? (
                <button
                  type="button"
                  onClick={() => startYouTubeOAuth()}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#e62117] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#cc1810] transition-colors cursor-pointer"
                >
                  <Icon name="youtube" className="size-4" />
                  <span>Connect YouTube Channel</span>
                </button>
              ) : (
                <>
                  <Link
                    href="/dashboard/youtube"
                    className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-strong transition-colors"
                  >
                    <Icon name="refresh-cw" className="size-3.5" />
                    <span>Sync Videos in Integrations</span>
                  </Link>
                  <button
                    type="button"
                    disabled={isRefreshingPeers}
                    onClick={() => void handleRefreshPeers()}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#ded4c6] bg-[#faf7f2] px-4 py-2.5 text-xs font-semibold text-ink hover:bg-white transition-colors disabled:opacity-60 cursor-pointer"
                  >
                    <Icon
                      name="refresh-cw"
                      className={`size-3.5 ${isRefreshingPeers ? "animate-spin" : ""}`}
                    />
                    <span>
                      {isRefreshingPeers
                        ? "Discovering Live Peers..."
                        : "Refresh Peers"}
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {benchmarkData?.disclaimer && (
          <footer className="flex items-start gap-2.5 rounded-2xl border border-line bg-cream/70 p-4 text-xs text-muted">
            <Icon name="shield" className="size-4 shrink-0 text-brand mt-0.5" />
            <p className="leading-relaxed">{benchmarkData.disclaimer}</p>
          </footer>
        )}
      </div>
    );
  }

  const {
    selectedGoal,
    benchmarkGroup,
    creatorOverview,
    comparativeMetrics,
    hookDistributionComparison,
    pillarDistributionComparison,
    peerInsights,
    growthPlan,
    peerCreators,
    disclaimer,
  } = benchmarkData;

  return (
    <div className="space-y-8 pb-12">
      {/* Feedback Toast Banner */}
      {feedback && (
        <div
          role="status"
          className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-xs font-medium shadow-xs ${
            feedback.tone === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <Icon
              name={
                feedback.tone === "success" ? "check-circle" : "alert-triangle"
              }
              className="size-4 shrink-0"
            />
            <span>{feedback.message}</span>
          </div>

          {feedback.actionHref && feedback.actionLabel && (
            <Link
              href={feedback.actionHref}
              className="inline-flex items-center gap-1 font-bold underline hover:opacity-80"
            >
              <span>{feedback.actionLabel}</span>
              <Icon name="arrow-right" className="size-3.5" />
            </Link>
          )}
        </div>
      )}

      {/* 1. Goal Selection Banner / Selector */}
      <GoalSelectorBanner
        goalsData={goalsData}
        comparison={benchmarkData}
        activeGoalId={activeGoalId}
        isLoadingGoals={isGoalsLoading}
        isSwitchingGoal={isSwitchingGoal}
        switchingToGoalId={switchingToGoalId}
        onSelectGoal={(goalId) => void handleSelectGoal(goalId)}
      />

      {/* Main Comparison Body (subtly dimmed while switching goals) */}
      <div
        className={`space-y-8 transition-opacity duration-300 ${
          isSwitchingGoal ? "opacity-60 pointer-events-none" : "opacity-100"
        }`}
      >
        {/* 2. Cohort Header & Live Peer Refresh Action */}
        <CohortHeaderCard
          benchmarkGroup={benchmarkGroup}
          selectedGoal={selectedGoal}
          creatorOverview={creatorOverview}
          peerCount={peerCreators?.length ?? 0}
          isRefreshingPeers={isRefreshingPeers}
          isSwitchingGoal={isSwitchingGoal}
          onRefreshPeers={() => void handleRefreshPeers()}
        />

        {/* 3. Peer Growth Plan Section */}
        <PeerGrowthPlanSection
          growthPlan={growthPlan}
          medianViewsMetric={comparativeMetrics?.medianViews}
          existingExperiments={existingExperiments}
          isRefreshing={isRefreshingPeers || isSwitchingGoal}
          onCreateExperiment={handleCreateExperiment}
          onRefreshPeers={() => void handleRefreshPeers()}
        />

        {/* 4. Comparative Metrics, Distributions & Peer Insights */}
        <ComparativeMetricsSection
          comparativeMetrics={comparativeMetrics}
          hookDistributionComparison={hookDistributionComparison}
          pillarDistributionComparison={pillarDistributionComparison}
          peerInsights={peerInsights}
        />

        {/* 5. Analyzed Peer Channels & Sample Videos */}
        <PeerCreatorsSection peerCreators={peerCreators ?? []} />

        {/* 6. Visible Disclaimer at Bottom of Page */}
        {disclaimer && (
          <footer className="flex items-start gap-3 rounded-2xl border border-line bg-cream/80 p-4 sm:p-5 text-xs text-muted">
            <Icon
              name="shield"
              className="size-4 shrink-0 text-brand mt-0.5"
            />
            <p className="leading-relaxed">
              <strong className="font-semibold text-ink">
                Public Benchmark Telemetry Notice:
              </strong>{" "}
              {disclaimer}
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}
