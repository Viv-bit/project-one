"use client";

import { Icon } from "@/components/ui/icon";
import { formatCount } from "@/lib/youtube";
import type {
  BenchmarkGoalId,
  BenchmarkGoalOption,
  BenchmarkGoalsResponse,
  BenchmarkComparisonResult,
} from "@/lib/benchmarks";

type GoalSelectorBannerProps = {
  goalsData?: BenchmarkGoalsResponse;
  comparison?: BenchmarkComparisonResult;
  activeGoalId: BenchmarkGoalId;
  isLoadingGoals: boolean;
  isSwitchingGoal: boolean;
  switchingToGoalId: BenchmarkGoalId | null;
  onSelectGoal: (goalId: BenchmarkGoalId) => void;
};

function getDefaultGoals(
  activeGoalId: BenchmarkGoalId,
  milestone: number,
  currentRangeLabel: string,
  targetRangeLabel: string,
): BenchmarkGoalOption[] {
  return [
    {
      id: "GROW_SUBSCRIBERS",
      title: "Grow Subscriber Count",
      shortLabel: "Grow Subscribers",
      primaryMetric: "subscriberCount",
      peerSelectionStrategy: "GOAL_SUBSCRIBER_RANGE",
      description:
        "Benchmark against channels already operating in your next subscriber milestone tier to reverse-engineer how they broke through.",
      isSelected: activeGoalId === "GROW_SUBSCRIBERS",
      targetCohortCriteria: {
        minSubscribers: 0,
        maxSubscribers: milestone,
        rangeLabel: targetRangeLabel || `Up to ${formatCount(milestone)} Subs`,
        targetSubscriberMilestone: milestone,
        minMedianViewsAbove: null,
        summary: `Peers in your goal subscriber range (${targetRangeLabel || formatCount(milestone)}) to help reach ${milestone.toLocaleString()} subscribers.`,
      },
    },
    {
      id: "IMPROVE_VIEWERSHIP",
      title: "Increase Video Views",
      shortLabel: "Increase Views",
      primaryMetric: "medianViews",
      peerSelectionStrategy: "CURRENT_RANGE_HIGHER_VIEWS",
      description:
        "Benchmark against channels in your current subscriber tier who consistently earn higher median views per upload.",
      isSelected: activeGoalId === "IMPROVE_VIEWERSHIP",
      targetCohortCriteria: {
        minSubscribers: 0,
        maxSubscribers: 0,
        rangeLabel: currentRangeLabel || "Current Subscriber Tier",
        targetSubscriberMilestone: null,
        minMedianViewsAbove: null,
        summary: `Peers in your current subscriber range (${currentRangeLabel || "same tier"}) achieving higher median views per video.`,
      },
    },
  ];
}

export function GoalSelectorBanner({
  goalsData,
  comparison,
  activeGoalId,
  isLoadingGoals,
  isSwitchingGoal,
  switchingToGoalId,
  onSelectGoal,
}: GoalSelectorBannerProps) {
  const snapshot = goalsData?.creatorSnapshot;

  const subscriberCount =
    snapshot?.subscriberCount ??
    comparison?.creatorOverview?.subscriberCount ??
    0;
  const medianViews =
    snapshot?.medianViews ??
    comparison?.comparativeMetrics?.medianViews?.creatorValue ??
    0;
  const currentRangeLabel =
    snapshot?.currentSubscriberRange?.label ??
    comparison?.selectedGoal?.currentSubscriberRange?.label ??
    (subscriberCount < 500
      ? "< 500 Subscribers"
      : subscriberCount < 10_000
        ? "1K – 10K Subscribers"
        : "10K – 50K Subscribers");
  const immediateMilestone =
    snapshot?.immediateSubscriberMilestone ??
    comparison?.selectedGoal?.immediateSubscriberMilestone ??
    (subscriberCount < 1_000
      ? 1_000
      : subscriberCount < 10_000
        ? 10_000
        : 50_000);
  const channelTitle =
    snapshot?.channelTitle ??
    comparison?.creatorOverview?.channelTitle ??
    "Your Channel";

  const targetRangeLabel =
    snapshot?.goalSubscriberRange?.label ??
    comparison?.selectedGoal?.targetPeerRange?.label ??
    "Next Milestone Cohort";

  const goals: BenchmarkGoalOption[] =
    goalsData?.goals && goalsData.goals.length > 0
      ? goalsData.goals
      : getDefaultGoals(
          activeGoalId,
          immediateMilestone,
          currentRangeLabel,
          targetRangeLabel,
        );

  const milestoneProgressPct =
    immediateMilestone > 0
      ? Math.min(100, Math.max(4, (subscriberCount / immediateMilestone) * 100))
      : 0;

  return (
    <section
      aria-label="Benchmarking Goal Selector"
      className="rounded-2xl border border-[#e6e0d6] bg-white p-5 sm:p-7 shadow-sm space-y-6"
    >
      {/* Top Row: Title + Creator Snapshot */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 pb-5 border-b border-[#f0ebe1]">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 border border-brand/20 px-2.5 py-0.5 text-[11px] font-semibold text-brand">
            <Icon name="trophy" className="size-3.5" />
            <span>Goal-Driven Peer Benchmarking</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-ink">
            Choose Your Primary Growth Objective
          </h2>
          <p className="text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
            Your peer cohort and AI growth plan dynamically adapt to benchmark{" "}
            <strong className="font-semibold text-ink">{channelTitle}</strong>{" "}
            against creators succeeding at the exact outcome you want next.
          </p>
        </div>

        {/* Creator Current Snapshot Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
          <div className="rounded-xl border border-[#e8e2d8] bg-[#faf7f2] px-3.5 py-2.5">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted">
              Subscribers
            </span>
            <span className="mt-0.5 block font-serif text-xl font-medium text-ink">
              {formatCount(subscriberCount)}
            </span>
            <span className="block text-[10px] font-mono text-muted">
              {subscriberCount.toLocaleString()} total
            </span>
          </div>

          <div className="rounded-xl border border-[#e8e2d8] bg-[#faf7f2] px-3.5 py-2.5">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted">
              Median Views
            </span>
            <span className="mt-0.5 block font-serif text-xl font-medium text-ink">
              {formatCount(Math.round(medianViews))}
            </span>
            <span className="block text-[10px] font-mono text-muted">
              per video
            </span>
          </div>

          <div className="rounded-xl border border-[#e8e2d8] bg-[#faf7f2] px-3.5 py-2.5">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted">
              Current Tier
            </span>
            <span className="mt-0.5 block text-xs font-bold text-ink leading-snug">
              {currentRangeLabel}
            </span>
            <span className="mt-0.5 block text-[10px] text-muted">
              Active scale bracket
            </span>
          </div>

          <div className="rounded-xl border border-brand/25 bg-[#fdf8f3] px-3.5 py-2.5">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-brand">
                Next Milestone
              </span>
              <span className="text-[10px] font-mono font-semibold text-brand">
                {Math.round(milestoneProgressPct)}%
              </span>
            </div>
            <span className="mt-0.5 block font-serif text-xl font-medium text-ink">
              {immediateMilestone.toLocaleString()}
            </span>
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[#efe5d8]">
              <div
                className="h-full rounded-full bg-brand transition-all duration-500"
                style={{ width: `${milestoneProgressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Selectable Goal Cards */}
      {isLoadingGoals && !goalsData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          <div className="h-36 rounded-2xl bg-[#faf7f2] border border-[#e8e2d8]" />
          <div className="h-36 rounded-2xl bg-[#faf7f2] border border-[#e8e2d8]" />
        </div>
      ) : (
        <div
          role="tablist"
          aria-label="Benchmarking Goals"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {goals.map((goal) => {
            const isSelected = activeGoalId === goal.id;
            const isTargetSwitching =
              isSwitchingGoal && switchingToGoalId === goal.id;
            const isGrowSubs = goal.id === "GROW_SUBSCRIBERS";

            return (
              <button
                key={goal.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                disabled={isSwitchingGoal}
                onClick={() => {
                  if (!isSelected && !isSwitchingGoal) {
                    onSelectGoal(goal.id);
                  }
                }}
                className={`group relative flex flex-col justify-between rounded-2xl border p-5 text-left transition-all cursor-pointer disabled:cursor-wait ${
                  isSelected
                    ? "border-brand bg-[#fdf8f3] shadow-[0_2px_10px_rgba(224,124,58,0.10)] ring-1 ring-brand/30"
                    : "border-[#e6e0d6] bg-white hover:border-brand/40 hover:bg-[#faf8f4]"
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`grid size-9 place-items-center rounded-xl border transition-colors ${
                          isSelected
                            ? "border-brand/30 bg-brand text-white"
                            : "border-[#e8e2d8] bg-[#faf7f2] text-[#756c62] group-hover:text-brand"
                        }`}
                      >
                        <Icon
                          name={isGrowSubs ? "users" : "trending-up"}
                          className="size-4"
                        />
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-serif text-lg sm:text-xl font-medium text-ink">
                            {goal.title ||
                              (isGrowSubs
                                ? "Grow Subscriber Count"
                                : "Increase Video Views")}
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-muted">
                          {isGrowSubs
                            ? `Milestone Target: ${formatCount(goal.targetCohortCriteria.targetSubscriberMilestone ?? immediateMilestone)} Subscribers`
                            : goal.targetCohortCriteria.minMedianViewsAbove
                              ? `Peers averaging >${formatCount(goal.targetCohortCriteria.minMedianViewsAbove)} median views`
                              : "Outperforming peers in your current subscriber tier"}
                        </span>
                      </div>
                    </div>

                    {/* Selection Radio / Active Pill */}
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                        isTargetSwitching
                          ? "bg-brand text-white"
                          : isSelected
                            ? "bg-brand/15 text-brand border border-brand/30"
                            : "bg-[#f5f0e8] text-[#857b70]"
                      }`}
                    >
                      {isTargetSwitching ? (
                        <>
                          <Icon
                            name="refresh-cw"
                            className="size-2.5 animate-spin"
                          />
                          <span>Switching...</span>
                        </>
                      ) : isSelected ? (
                        <>
                          <Icon name="check" className="size-2.5" />
                          <span>Active Goal</span>
                        </>
                      ) : (
                        <span>Select Goal</span>
                      )}
                    </span>
                  </div>

                  <p className="text-xs text-[#665e53] leading-relaxed">
                    {goal.description}
                  </p>
                </div>

                {/* Target Cohort Criteria Summary Box */}
                <div
                  className={`mt-4 rounded-xl border px-3.5 py-2.5 text-xs ${
                    isSelected
                      ? "border-brand/20 bg-white/90"
                      : "border-[#efe9df] bg-[#faf7f2]"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
                      {isGrowSubs
                        ? "Goal Subscriber Range Cohort"
                        : "Current Tier · Higher Views Cohort"}
                    </span>
                    {goal.targetCohortCriteria.rangeLabel && (
                      <span className="font-mono text-[11px] font-semibold text-ink">
                        {goal.targetCohortCriteria.rangeLabel}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-[#5c5349] leading-relaxed">
                    {goal.targetCohortCriteria.summary}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Goal Switching Loading Banner */}
      {isSwitchingGoal && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-3 rounded-xl border border-brand/30 bg-[#fdf6ee] px-4 py-3 text-xs text-ink shadow-xs"
        >
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-brand text-white">
            <Icon name="refresh-cw" className="size-3.5 animate-spin" />
          </span>
          <div>
            <p className="font-semibold text-ink">
              Finding &amp; analyzing comparable YouTube peers for your goal...
            </p>
            <p className="text-[11px] text-muted">
              Recalibrating peer cohort metrics, content distributions, and your
              actionable growth plan.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

