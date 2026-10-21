"use client";

import { useState } from "react";
import { Icon } from "@/components/ui";
import { EXPERIMENT_HYPOTHESES } from "@/lib/data/intelligence-mock-data";
import type { ExperimentHypothesis } from "@/lib/types/creator-intelligence";

export function ExperimentBacklogWidget() {
  const [hypotheses, setHypotheses] = useState<ExperimentHypothesis[]>(EXPERIMENT_HYPOTHESES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPredictedLift, setNewPredictedLift] = useState("+15% Watch Time");

  function handleCreateHypothesis(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newHyp: ExperimentHypothesis = {
      id: `hyp-${Date.now()}`,
      hypothesisNumber: hypotheses.length + 1,
      title: newTitle.trim(),
      confidencePct: 85,
      predictedLift: `Predicted Lift: ${newPredictedLift}`,
      sampleSizeNote: "N=1 planned upload",
      status: "active",
    };

    setHypotheses([newHyp, ...hypotheses]);
    setNewTitle("");
    setIsModalOpen(false);
  }

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
          <span className="rounded-full bg-[#f6f2ea] border border-[#e8e2d8] px-2 py-0.5 text-[10px] font-semibold text-[#6e655a]">
            {hypotheses.length} Active Tests
          </span>
        </div>

        {/* Hypotheses List */}
        <div className="mt-3.5 space-y-3">
          {hypotheses.map((hyp) => (
            <div
              key={hyp.id}
              className="rounded-xl border border-[#ede7dd] bg-[#faf8f4] p-3.5 transition-all hover:border-brand/40"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-ink">
                  Hypothesis #{hyp.hypothesisNumber}
                </span>
                <span className="rounded bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                  {hyp.confidencePct}% Confidence
                </span>
              </div>

              <p className="mt-2 text-xs font-semibold text-ink leading-snug">
                {hyp.title}
              </p>

              <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#7a7167] border-t border-[#ede7dd]/80 pt-2">
                <span className="font-semibold text-emerald-700">
                  {hyp.predictedLift}
                </span>
                <span className="font-mono text-[10px] text-[#8e8479]">
                  {hyp.sampleSizeNote}
                </span>
              </div>
            </div>
          ))}
        </div>

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

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-muted hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white shadow hover:bg-brand-strong"
                >
                  Add to Active Tests
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
