"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type {
  PeerGrowthPlan,
  PeerGrowthPlanStep,
  PeerGrowthFocusArea,
  ComparativeMetric,
} from "@/lib/benchmarks";
import type { ApiExperiment, CreateExperimentPayload } from "@/lib/experiments";

type PeerGrowthPlanSectionProps = {
  growthPlan: PeerGrowthPlan | null | undefined;
  medianViewsMetric?: ComparativeMetric;
  existingExperiments?: ApiExperiment[];
  isRefreshing: boolean;
  onCreateExperiment: (
    payload: CreateExperimentPayload,
    step: PeerGrowthPlanStep,
  ) => Promise<ApiExperiment | void>;
  onRefreshPeers: () => void;
};

const FOCUS_AREA_STYLES: Record<
  PeerGrowthFocusArea,
  { label: string; badgeClass: string }
> = {
  HOOKS: {
    label: "HOOKS",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
  },
  TOPICS: {
    label: "TOPICS",
    badgeClass: "bg-sky-50 text-sky-800 border-sky-200",
  },
  PILLARS: {
    label: "PILLARS",
    badgeClass: "bg-purple-50 text-purple-800 border-purple-200",
  },
  PACKAGING: {
    label: "PACKAGING",
    badgeClass: "bg-rose-50 text-rose-800 border-rose-200",
  },
  CADENCE: {
    label: "CADENCE",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  DURATION: {
    label: "DURATION",
    badgeClass: "bg-stone-100 text-stone-800 border-stone-200",
  },
};

function formatGeneratedAt(iso: string | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PeerGrowthPlanSection({
  growthPlan,
  medianViewsMetric,
  existingExperiments = [],
  isRefreshing,
  onCreateExperiment,
  onRefreshPeers,
}: PeerGrowthPlanSectionProps) {
  const [startingStep, setStartingStep] = useState<number | null>(null);
  const [createdSteps, setCreatedSteps] = useState<Record<number, boolean>>({});

  async function handleStartExperiment(step: PeerGrowthPlanStep) {
    if (startingStep !== null) return;
    setStartingStep(step.stepNumber);
    try {
      const payload: CreateExperimentPayload = {
        title: step.title,
        hypothesis: step.suggestedExperiment.hypothesis,
        category: step.focusArea,
        primaryMetric: step.suggestedExperiment.primaryMetric,
        targetPostCount: step.suggestedExperiment.targetPostCount,
        durationDays: step.suggestedExperiment.suggestedDurationDays,
        baselineMetricValue: medianViewsMetric?.creatorValue ?? 0,
      };
      await onCreateExperiment(payload, step);
      setCreatedSteps((prev) => ({ ...prev, [step.stepNumber]: true }));
    } finally {
      setStartingStep(null);
    }
  }

  if (!growthPlan) {
    if (isRefreshing) {
      return (
        <section className="rounded-2xl border border-[#e6e0d6] bg-white p-6 sm:p-8 shadow-sm space-y-5 animate-pulse">
          <div className="h-6 w-48 rounded-lg bg-[#f2ede4]" />
          <div className="h-10 w-3/4 rounded-lg bg-[#f2ede4]" />
          <div className="h-24 w-full rounded-xl bg-[#faf7f2]" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-52 rounded-2xl bg-[#faf7f2]" />
            <div className="h-52 rounded-2xl bg-[#faf7f2]" />
          </div>
        </section>
      );
    }

    return (
      <section className="rounded-2xl border border-dashed border-[#ded4c6] bg-white p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand">
            <Icon name="spark" className="size-3.5" />
            <span>Peer Growth Plan</span>
          </div>
          <h2 className="font-serif text-2xl font-normal text-ink">
            Generate Your Live Peer Growth Plan
          </h2>
          <p className="text-xs text-muted max-w-xl leading-relaxed">
            Run a live peer refresh to analyze top-performing videos across
            comparable YouTube channels and unlock step-by-step growth actions.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefreshPeers}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-strong transition-colors shrink-0 cursor-pointer"
        >
          <Icon name="refresh-cw" className="size-3.5" />
          <span>Synthesize Growth Plan</span>
        </button>
      </section>
    );
  }

  const generatedDate = formatGeneratedAt(growthPlan.generatedAt);
  const isGemini = growthPlan.generatedBy === "GEMINI_AND_DETERMINISTIC_DATA";

  return (
    <section
      aria-labelledby="peer-growth-plan-heading"
      className="rounded-2xl border border-[#e6e0d6] bg-gradient-to-b from-[#fffdfa] to-white p-6 sm:p-8 shadow-sm space-y-7"
    >
      {/* Plan Header */}
      <div className="space-y-3 border-b border-[#f0ebe1] pb-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-xs">
              <Icon name="spark" className="size-3.5" />
              <span>Peer Growth Plan</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#faf7f2] border border-[#e8e2d8] px-2.5 py-0.5 text-[11px] font-medium text-[#5c5348]">
              <Icon name="brain" className="size-3 text-brand" />
              <span>
                {isGemini
                  ? "Gemini AI + Deterministic Telemetry"
                  : "Deterministic Telemetry Engine"}
              </span>
            </span>
          </div>

          {generatedDate && (
            <span className="text-[11px] font-mono text-muted">
              Updated {generatedDate}
            </span>
          )}
        </div>

        <h2
          id="peer-growth-plan-heading"
          className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-ink"
        >
          {growthPlan.headline}
        </h2>
        <p className="text-sm text-[#5c5348] max-w-3xl leading-relaxed">
          {growthPlan.goalSummary}
        </p>
      </div>

      {/* What Peers Do Differently */}
      {growthPlan.whatPeersDoDifferently &&
        growthPlan.whatPeersDoDifferently.length > 0 && (
          <div className="rounded-2xl border border-[#ebe3d6] bg-[#faf7f2] p-5 sm:p-6 space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-lg bg-brand/15 text-brand">
                <Icon name="zap" className="size-3.5" />
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-ink">
                What Outperforming Peers Do Differently
              </h3>
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {growthPlan.whatPeersDoDifferently.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 rounded-xl border border-[#ece5d9] bg-white p-3.5 text-xs text-[#4f473e] leading-relaxed shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                >
                  <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-brand/15 text-brand">
                    <Icon name="check" className="size-2.5" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      {/* Actionable Growth Steps */}
      {growthPlan.steps && growthPlan.steps.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h3 className="font-serif text-xl sm:text-2xl font-normal text-ink">
              Actionable Growth Steps
            </h3>
            <span className="text-xs text-muted">
              Turn any step into a tracked experiment in 1 click
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {growthPlan.steps.map((step) => {
              const focusMeta = FOCUS_AREA_STYLES[step.focusArea] ?? {
                label: step.focusArea,
                badgeClass: "bg-brand/10 text-brand border-brand/20",
              };

              const alreadyInBacklog =
                createdSteps[step.stepNumber] ||
                existingExperiments.some(
                  (exp) =>
                    exp.title.toLowerCase() === step.title.toLowerCase() &&
                    exp.status !== "CANCELLED",
                );
              const isStartingThis = startingStep === step.stepNumber;

              return (
                <article
                  key={step.stepNumber}
                  className="flex flex-col justify-between rounded-2xl border border-[#e6e0d6] bg-white p-5 sm:p-6 shadow-xs transition-all hover:border-brand/40"
                >
                  <div className="space-y-4">
                    {/* Step Number, Focus Area Badge & Target Metric */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center rounded-lg bg-ink px-2.5 py-1 font-mono text-[11px] font-bold text-white">
                          Step {String(step.stepNumber).padStart(2, "0")}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${focusMeta.badgeClass}`}
                        >
                          {focusMeta.label}
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1 rounded-full bg-[#faf7f2] border border-[#e8e2d8] px-2.5 py-0.5 text-[11px] font-semibold text-brand">
                        <Icon name="trending-up" className="size-3" />
                        <span>{step.targetMetric}</span>
                      </span>
                    </div>

                    {/* Step Title */}
                    <h4 className="font-serif text-xl font-medium text-ink leading-snug">
                      {step.title}
                    </h4>

                    {/* Why It Works For Peers */}
                    <div className="space-y-1">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-muted">
                        Why It Works for Peers
                      </span>
                      <p className="text-xs text-[#5c5348] leading-relaxed">
                        {step.whyItWorksForPeers}
                      </p>
                    </div>

                    {/* Concrete Action */}
                    <div className="rounded-xl border border-[#efe7da] bg-[#fdfaf5] p-3.5 space-y-1">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-brand">
                        Concrete Action
                      </span>
                      <p className="text-xs font-medium text-ink leading-relaxed">
                        {step.concreteAction}
                      </p>
                    </div>

                    {/* Real Peer Video Examples */}
                    {step.peerExamples && step.peerExamples.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-muted">
                          Real Peer Video Examples
                        </span>
                        <ul className="space-y-1.5">
                          {step.peerExamples.map((example, exIdx) => (
                            <li
                              key={exIdx}
                              className="flex items-start gap-2 rounded-lg bg-[#faf7f2] border border-[#eee7dc] px-3 py-2 text-[11px] text-[#52493e]"
                            >
                              <Icon
                                name="play"
                                className="size-3.5 shrink-0 text-brand mt-0.5"
                              />
                              <span className="leading-snug">{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Suggested Experiment Footer + CTA */}
                  <div className="mt-5 pt-4 border-t border-[#f0ebe1] space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted">
                      <span>
                        Suggested Sprint:{" "}
                        <strong className="text-ink">
                          {step.suggestedExperiment.targetPostCount} uploads
                        </strong>{" "}
                        over{" "}
                        <strong className="text-ink">
                          {step.suggestedExperiment.suggestedDurationDays} days
                        </strong>
                      </span>
                      <span className="font-mono text-[10px] uppercase rounded bg-[#f5efe6] px-2 py-0.5 text-[#6e655a]">
                        Metric:{" "}
                        {step.suggestedExperiment.primaryMetric ===
                        "engagement_rate"
                          ? "Engagement Rate"
                          : "Median Views"}
                      </span>
                    </div>

                    {alreadyInBacklog ? (
                      <div className="flex items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3.5 py-2.5 text-xs">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-800">
                          <Icon
                            name="check-circle"
                            className="size-4 text-emerald-600"
                          />
                          <span>Experiment Added to Backlog</span>
                        </span>
                        <Link
                          href="/dashboard/experiments"
                          className="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:underline"
                        >
                          <span>View Experiment</span>
                          <Icon name="arrow-right" className="size-3.5" />
                        </Link>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={startingStep !== null}
                        onClick={() => void handleStartExperiment(step)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-brand transition-colors disabled:opacity-60 disabled:cursor-wait cursor-pointer"
                      >
                        {isStartingThis ? (
                          <>
                            <Icon
                              name="refresh-cw"
                              className="size-3.5 animate-spin"
                            />
                            <span>Starting Experiment...</span>
                          </>
                        ) : (
                          <>
                            <Icon name="flask" className="size-3.5" />
                            <span>Start Experiment</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

