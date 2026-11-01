"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui";
import {
  getExperiments,
  createExperiment,
  type ApiExperiment,
} from "@/lib/experiments";
import { startYouTubeOAuth } from "@/lib/youtube";
import { useYouTubeConnection } from "@/lib/youtube-connection-context";

export function ExperimentBacklogWidget() {
  const { isConnected } = useYouTubeConnection();
  const [experiments, setExperiments] = useState<ApiExperiment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPredictedLift, setNewPredictedLift] = useState("+15% Watch Time");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setIsLoading(true);
      try {
        const data = await getExperiments();
        if (isMounted && Array.isArray(data)) {
          setExperiments(data);
        }
      } catch (err) {
        console.warn("Failed to fetch experiments for widget:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [isConnected]);

  async function handleCreateHypothesis(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      setIsSubmitting(true);
      const created = await createExperiment({
        title: newTitle.trim(),
        hypothesis: `Testing: ${newTitle.trim()} with predicted target lift ${newPredictedLift}.`,
        category: "HOOK",
        primaryMetric: "median_views",
        targetPostCount: 3,
        durationDays: 14,
      });

      if (created) {
        setExperiments((prev) => [created, ...prev]);
      }
      setNewTitle("");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to create experiment:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const showEmptyState = experiments.length === 0;

  return (
    <>
      <div className="rounded-2xl border border-[#e6e0d6] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f2ede4] pb-3.5">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-lg bg-brand/10 text-brand">
              <Icon name="flask" className="size-3.5" />
            </span>
            <h2 className="text-base font-semibold text-ink">Experiment Backlog</h2>
          </div>
          {experiments.length > 0 ? (
            <Link
              href="/dashboard/experiments"
              className="rounded-full bg-[#f6f2ea] border border-[#e8e2d8] px-2 py-0.5 text-[10px] font-semibold text-brand hover:underline"
            >
              {experiments.length} Active Tests &rarr;
            </Link>
          ) : (
            <span className="rounded-full bg-[#f6f2ea] border border-[#e8e2d8] px-2 py-0.5 text-[10px] font-semibold text-[#8a7f72]">
              0 Active Tests
            </span>
          )}
        </div>

        {/* Empty state or Hypotheses List */}
        {showEmptyState ? (
          <div className="mt-4 rounded-xl border border-dashed border-[#ded4c6] bg-[#faf8f4] p-5 text-center">
            <div className="mx-auto grid size-10 place-items-center rounded-xl bg-white border border-[#e4dacf] text-brand shadow-sm">
              <Icon name="flask" className="size-5" />
            </div>

            <h3 className="mt-2.5 font-serif text-sm font-semibold text-ink">
              No Active Experiments
            </h3>
            <p className="mt-1 text-xs text-[#70665b] leading-relaxed">
              {!isConnected
                ? "Connect your YouTube channel to generate automated title & hook hypotheses, or draft your first manual test."
                : "Create your first empirical test to validate hook retention, topic framing, or duration sweet-spots."}
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              {!isConnected ? (
                <button
                  onClick={() => startYouTubeOAuth()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#ded4c6] bg-white px-3 py-1.5 text-xs font-semibold text-[#5c5348] hover:bg-[#faf7f2] transition-colors"
                >
                  <Icon name="youtube" className="size-3.5 text-red-600" />
                  <span>Connect Channel</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-strong transition-colors"
                >
                  <Icon name="plus" className="size-3.5" />
                  <span>Draft First Experiment</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-3.5 space-y-3">
            {experiments.slice(0, 3).map((exp, idx) => {
              const currentCount = exp.posts?.length ?? exp.progress?.currentPostsCount ?? 0;
              const targetCount = exp.targetPostCount ?? 3;
              const liftText = exp.result?.deltaPercent != null
                ? `${exp.result.deltaPercent >= 0 ? "+" : ""}${exp.result.deltaPercent.toFixed(1)}%`
                : exp.liftPct != null
                ? `+${exp.liftPct}%`
                : "Awaiting Result";

              return (
                <div
                  key={exp.id}
                  className="rounded-xl border border-[#ede7dd] bg-[#faf8f4] p-3.5 transition-all hover:border-brand/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-ink">
                      Test #{idx + 1} · {exp.category}
                    </span>
                    <span className="rounded bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                      {exp.status}
                    </span>
                  </div>

                  <p className="mt-2 text-xs font-semibold text-ink leading-snug line-clamp-2">
                    {exp.title}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#7a7167] border-t border-[#ede7dd]/80 pt-2">
                    <span className="font-semibold text-emerald-700">
                      Lift: {liftText}
                    </span>
                    <span className="font-mono text-[10px] text-[#8e8479]">
                      {currentCount}/{targetCount} posts tracked
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Button: Draft New Script Hypothesis */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-2.5 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(224,124,58,0.28)] transition-all hover:bg-brand-strong active:scale-[0.99]"
        >
          <Icon name="plus" className="size-3.5" />
          <span>Draft New Script Hypothesis</span>
        </button>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="text-sm font-bold text-ink">Draft New Script Hypothesis</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-muted hover:bg-black/5"
              >
                <Icon name="x" className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateHypothesis} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Hypothesis Script Hook Formulation
                </label>
                <textarea
                  autoFocus
                  required
                  rows={3}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Open with high-stakes paradox question before revealing title setup..."
                  className="w-full rounded-xl border border-line bg-cream/40 p-2.5 text-xs text-ink placeholder:text-muted/60 focus:border-brand focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Target Retention Lift
                </label>
                <select
                  value={newPredictedLift}
                  onChange={(e) => setNewPredictedLift(e.target.value)}
                  className="w-full rounded-xl border border-line bg-cream/40 p-2.5 text-xs text-ink focus:border-brand focus:outline-none"
                >
                  <option value="+10-18% 0-3s Hold">+10-18% 0-3s Hold</option>
                  <option value="+15% Watch Time">+15% Watch Time</option>
                  <option value="+2.4x End-card CTR">+2.4x End-card CTR</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-line px-3.5 py-2 text-xs font-semibold text-muted hover:bg-cream"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white shadow hover:bg-brand-strong disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Creating...</span>
                  ) : (
                    <>
                      <Icon name="check" className="size-3.5" />
                      <span>Save Hypothesis</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
