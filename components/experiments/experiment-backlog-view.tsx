"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import {
  EXPERIMENT_RECORDS,
  INGESTED_POSTS_16,
} from "@/lib/data/intelligence-mock-data";
import type { ExperimentRecord } from "@/lib/types/creator-intelligence";
import { CreateExperimentModal } from "@/components/dashboard/create-experiment-modal";

export function ExperimentBacklogView() {
  const [experiments, setExperiments] = useState<ExperimentRecord[]>(EXPERIMENT_RECORDS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "validated" | "inconclusive">("all");

  const filteredExperiments = experiments.filter(
    (exp) => filterStatus === "all" || exp.status === filterStatus
  );

  function handleExperimentCreated(newExp: {
    title: string;
    hypothesis: string;
    primaryMetric: string;
    targetPostCount: number;
    durationDays: number;
  }) {
    const createdRecord: ExperimentRecord = {
      id: `exp-${Date.now()}`,
      experimentNumber: experiments.length + 1,
      title: newExp.title,
      hypothesis: newExp.hypothesis,
      status: "active",
      primaryMetric: newExp.primaryMetric,
      baselineValueFormatted: "74.2%",
      currentValueFormatted: "Pending 1st Upload",
      liftPctFormatted: "0.0%",
      targetPostCount: newExp.targetPostCount,
      currentPostCount: 0,
      durationDays: newExp.durationDays,
      daysElapsed: 0,
      startDate: "Today",
      linkedPostIds: [],
      notes: `Awaiting initial uploads to satisfy Data Sufficiency Rule (N>=${newExp.targetPostCount}).`,
    };

    setExperiments([createdRecord, ...experiments]);
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="rounded-2xl border border-[#e6e0d6] bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-ink">
                Experiment Backlog &amp; Outcome Tracker
              </h1>
              <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand border border-brand/20">
                {experiments.filter((e) => e.status === "active").length} Active Tests
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">
              Convert evidence-backed opportunities into testable content adjustments. Evaluate outcomes using strict sample size minimums.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-strong transition-colors"
          >
            <Icon name="plus" className="size-3.5" />
            <span>+ New Experiment</span>
          </button>
        </div>

        {/* 3 Summary Counters */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 border-t border-[#f0ebe1]">
          <div className="rounded-xl border border-[#f0ebe1] bg-[#faf7f2] p-3 text-xs">
            <span className="text-muted block text-[11px]">Active Experiments</span>
            <span className="font-serif text-2xl font-normal text-ink">
              {experiments.filter((e) => e.status === "active").length} in Progress
            </span>
          </div>

          <div className="rounded-xl border border-[#f0ebe1] bg-[#faf7f2] p-3 text-xs">
            <span className="text-muted block text-[11px]">Validated Adjustments</span>
            <span className="font-serif text-2xl font-normal text-emerald-700">
              {experiments.filter((e) => e.status === "validated").length} Verified Lifts
            </span>
          </div>

          <div className="rounded-xl border border-[#f0ebe1] bg-[#faf7f2] p-3 text-xs">
            <span className="text-muted block text-[11px]">Data Sufficiency Rule</span>
            <span className="font-serif text-2xl font-normal text-brand">
              N &ge; 3 Uploads
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e6e0d6] pb-3">
        {(["all", "active", "inconclusive", "validated"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
              filterStatus === status
                ? "bg-ink text-white"
                : "text-muted hover:bg-cream hover:text-ink"
            }`}
          >
            {status === "all" ? "All Experiments" : status}
          </button>
        ))}
      </div>

      {/* Experiments List */}
      <div className="space-y-6">
        {filteredExperiments.map((exp) => {
          const linkedPosts = INGESTED_POSTS_16.filter((p) =>
            exp.linkedPostIds.includes(p.id)
          );

          return (
            <div
              key={exp.id}
              className="rounded-2xl border border-[#e6e0d6] bg-white p-6 shadow-sm space-y-5"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-[#f0ebe1]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-muted">
                      EXP-{exp.experimentNumber}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        exp.status === "validated"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : exp.status === "inconclusive"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-brand/10 text-brand border border-brand/20"
                      }`}
                    >
                      {exp.status === "validated"
                        ? "Validated Lift"
                        : exp.status === "inconclusive"
                        ? "Data Inconclusive"
                        : "Active Tracking"}
                    </span>
                    <span className="text-xs text-muted font-mono">
                      Started {exp.startDate} · Day {exp.daysElapsed} of {exp.durationDays}
                    </span>
                  </div>

                  <h3 className="mt-1 font-serif text-2xl font-normal text-ink">
                    {exp.title}
                  </h3>
                </div>

                {/* Primary Lift Metric Box */}
                <div className="rounded-xl border border-[#e6e0d6] bg-[#faf7f2] px-4 py-2 text-right shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                    {exp.primaryMetric}
                  </span>
                  <div className="flex items-baseline justify-end gap-2 mt-0.5">
                    <span className="text-xs text-muted">
                      Baseline: {exp.baselineValueFormatted}
                    </span>
                    <span className="font-serif text-xl font-normal text-ink">
                      {exp.currentValueFormatted}
                    </span>
                    <span
                      className={`text-xs font-bold font-mono ${
                        exp.status === "validated" || exp.liftPctFormatted.startsWith("+")
                          ? "text-emerald-700"
                          : "text-muted"
                      }`}
                    >
                      {exp.liftPctFormatted}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hypothesis Description */}
              <div className="rounded-xl border border-[#f0ebe1] bg-[#faf7f2] p-4 text-xs text-[#5c544c] leading-relaxed">
                <strong className="text-ink font-semibold">Test Hypothesis:</strong> {exp.hypothesis}
              </div>

              {/* Data Sufficiency Indicator */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <Icon name="shield" className="size-3.5 text-brand" />
                    <strong>Data Sufficiency Progress:</strong> {exp.currentPostCount} of {exp.targetPostCount} Target Uploads Evaluated
                  </span>
                  <span className="font-mono font-bold text-ink">
                    {Math.round((exp.currentPostCount / exp.targetPostCount) * 100)}%
                  </span>
                </div>

                <div className="relative h-2 w-full overflow-hidden rounded-full bg-[#f2ece2]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      exp.currentPostCount >= exp.targetPostCount
                        ? "bg-emerald-600"
                        : "bg-brand"
                    }`}
                    style={{
                      width: `${Math.min(100, (exp.currentPostCount / exp.targetPostCount) * 100)}%`,
                    }}
                  />
                </div>

                <p className="text-[11px] text-muted italic">{exp.notes}</p>
              </div>

              {/* Linked Evaluated Posts */}
              {linkedPosts.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#f0ebe1]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted block">
                    Linked Uploads in this Experiment ({linkedPosts.length})
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {linkedPosts.map((post) => (
                      <div
                        key={post.id}
                        className="rounded-xl border border-[#e6e0d6] bg-white p-3 text-xs flex items-center justify-between"
                      >
                        <div className="truncate pr-3">
                          <p className="font-semibold text-ink truncate">{post.title}</p>
                          <span className="text-[11px] text-muted font-mono">
                            {post.publishedAt} · {post.durationFormatted}
                          </span>
                        </div>
                        <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200 shrink-0 font-mono">
                          {post.hookHoldPct}% Hold
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <CreateExperimentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onExperimentCreated={handleExperimentCreated}
      />
    </div>
  );
}
