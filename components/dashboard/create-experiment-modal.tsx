"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { DETAILED_INSIGHTS } from "@/lib/data/intelligence-mock-data";
import type { DetailedInsight } from "@/lib/types/creator-intelligence";

type CreateExperimentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  preselectedInsight?: DetailedInsight | null;
  onExperimentCreated?: (newExp: {
    title: string;
    hypothesis: string;
    primaryMetric: string;
    targetPostCount: number;
    durationDays: number;
  }) => void;
};

export function CreateExperimentModal({
  isOpen,
  onClose,
  preselectedInsight,
  onExperimentCreated,
}: CreateExperimentModalProps) {
  const [title, setTitle] = useState(
    preselectedInsight
      ? `Test: ${preselectedInsight.suggestedExperiment?.hypothesis.slice(0, 50)}...`
      : "Problem-First Cold Open vs Conversational Greeting"
  );
  const [hypothesis, setHypothesis] = useState(
    preselectedInsight?.suggestedExperiment?.hypothesis ??
      "Opening with the exact dollar amount wasted or failure point in the first 2s will lift 0-3s retention above 80%."
  );
  const [primaryMetric, setPrimaryMetric] = useState(
    preselectedInsight?.suggestedExperiment?.primaryMetric ?? "0-3s Hook Hold Rate"
  );
  const [targetPostCount, setTargetPostCount] = useState(
    preselectedInsight?.suggestedExperiment?.targetPostCount ?? 3
  );
  const [durationDays, setDurationDays] = useState(
    preselectedInsight?.suggestedExperiment?.suggestedDurationDays ?? 21
  );
  const [selectedInsightId, setSelectedInsightId] = useState<string>(
    preselectedInsight?.id ?? "ins-01"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  function handleInsightChange(insightId: string) {
    setSelectedInsightId(insightId);
    const found = DETAILED_INSIGHTS.find((i) => i.id === insightId);
    if (found?.suggestedExperiment) {
      setTitle(`Test: ${found.title.slice(0, 55)}...`);
      setHypothesis(found.suggestedExperiment.hypothesis);
      setPrimaryMetric(found.suggestedExperiment.primaryMetric);
      setTargetPostCount(found.suggestedExperiment.targetPostCount);
      setDurationDays(found.suggestedExperiment.suggestedDurationDays);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      if (onExperimentCreated) {
        onExperimentCreated({
          title,
          hypothesis,
          primaryMetric,
          targetPostCount,
          durationDays,
        });
      }
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1200);
    }, 600);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-[#e6e0d6] bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#f0ebe1]">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-brand/10 border border-brand/20 text-brand">
              <Icon name="flask" className="size-4" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-normal text-ink">
                Initialize Content Experiment
              </h3>
              <p className="text-xs text-muted">
                Calibrated for your 10–20 video upload baseline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-black/5 hover:text-ink transition-colors"
          >
            <Icon name="x" className="size-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="inline-grid size-12 place-items-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Icon name="check" className="size-6" />
            </div>
            <h4 className="font-serif text-xl text-ink">Experiment Scheduled</h4>
            <p className="text-xs text-muted max-w-sm mx-auto">
              Your next {targetPostCount} uploads will be evaluated against your 16-post baseline.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Link to Evidence Insight */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Ground in Calibrated Opportunity
              </label>
              <select
                value={selectedInsightId}
                onChange={(e) => handleInsightChange(e.target.value)}
                className="w-full rounded-xl border border-[#ded6c7] bg-[#faf7f2] px-3.5 py-2 text-xs text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                {DETAILED_INSIGHTS.map((insight) => (
                  <option key={insight.id} value={insight.id}>
                    {insight.title} ({insight.confidenceScore}% confidence)
                  </option>
                ))}
              </select>
            </div>

            {/* Experiment Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Experiment Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-[#ded6c7] bg-white px-3.5 py-2 text-xs text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                placeholder="e.g. Problem-First Cold Open vs Conversational Greeting"
              />
            </div>

            {/* Hypothesis */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Test Hypothesis
              </label>
              <textarea
                required
                rows={3}
                value={hypothesis}
                onChange={(e) => setHypothesis(e.target.value)}
                className="w-full rounded-xl border border-[#ded6c7] bg-white p-3 text-xs text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                placeholder="What specific adjustment will you test and why?"
              />
            </div>

            {/* Grid: Primary Metric, Target Posts, Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">
                  Primary Metric
                </label>
                <select
                  value={primaryMetric}
                  onChange={(e) => setPrimaryMetric(e.target.value)}
                  className="w-full rounded-lg border border-[#ded6c7] bg-[#faf7f2] px-2.5 py-1.5 text-xs text-ink focus:border-brand focus:outline-none"
                >
                  <option value="0-3s Hook Hold Rate">0-3s Hook Hold Rate</option>
                  <option value="Median 72h View Velocity">Median 72h Views</option>
                  <option value="0:45s Survival Rate">0:45s Survival Rate</option>
                  <option value="Average Percentage Viewed">Average % Viewed</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">
                  Target Posts (N)
                </label>
                <select
                  value={targetPostCount}
                  onChange={(e) => setTargetPostCount(Number(e.target.value))}
                  className="w-full rounded-lg border border-[#ded6c7] bg-[#faf7f2] px-2.5 py-1.5 text-xs text-ink focus:border-brand focus:outline-none"
                >
                  <option value={3}>3 uploads (N=3 standard)</option>
                  <option value={4}>4 uploads</option>
                  <option value={5}>5 uploads</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">
                  Time Window
                </label>
                <select
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full rounded-lg border border-[#ded6c7] bg-[#faf7f2] px-2.5 py-1.5 text-xs text-ink focus:border-brand focus:outline-none"
                >
                  <option value={14}>14 Days (Fast cycle)</option>
                  <option value={21}>21 Days (Recommended)</option>
                  <option value={30}>30 Days (Standard month)</option>
                </select>
              </div>
            </div>

            {/* Data Sufficiency Rule Callout */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-[11px] text-amber-900 flex items-start gap-2">
              <Icon name="info" className="size-4 shrink-0 mt-0.5 text-amber-700" />
              <div>
                <strong className="font-semibold text-amber-950">Data Sufficiency Rule:</strong>
                <p className="mt-0.5 text-amber-800 leading-relaxed">
                  The engine will mark this experiment as <em>Inconclusive</em> until all {targetPostCount} target uploads are completed. Results are calculated against your calibrated baseline.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#f0ebe1]">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-[#ded6c7] px-4 py-2 text-xs font-semibold text-muted hover:bg-black/5 hover:text-ink transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-strong transition-colors disabled:opacity-50"
              >
                <Icon name="flask" className="size-3.5" />
                {isSubmitting ? "Scheduling..." : "Launch Experiment"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
