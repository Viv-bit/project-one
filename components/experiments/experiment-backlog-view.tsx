"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/components/ui/icon";
import type { ExperimentRecord } from "@/lib/types/creator-intelligence";
import { CreateExperimentModal } from "@/components/dashboard/create-experiment-modal";
import {
  getExperiments,
  evaluateExperimentResults,
  updateExperiment,
  linkPostToExperiment,
  type ApiExperiment,
  type ExperimentStatus,
} from "@/lib/experiments";
import { getYouTubeVideos, type YouTubeVideoItem, formatCount } from "@/lib/youtube";

export function ExperimentBacklogView() {
  const [experiments, setExperiments] = useState<ExperimentRecord[]>([]);
  const [userVideos, setUserVideos] = useState<YouTubeVideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "validated" | "inconclusive">("all");
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  const [linkingExperimentId, setLinkingExperimentId] = useState<string | null>(null);
  const [selectedPostToLink, setSelectedPostToLink] = useState<string>("");
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setIsLoading(true);
      try {
        const [data, videos] = await Promise.all([
          getExperiments().catch(() => []),
          getYouTubeVideos().catch(() => []),
        ]);

        if (!isMounted) return;

        if (Array.isArray(videos)) {
          setUserVideos(videos);
        }

        if (Array.isArray(data)) {
          const mapped: ExperimentRecord[] = data.map((exp: ApiExperiment, idx: number) => {
            const currentCount = exp.posts?.length ?? exp.progress?.currentPostsCount ?? 0;
            const targetCount = exp.targetPostCount ?? 3;
            const isSuff = currentCount >= targetCount;
            const liftVal = exp.result?.deltaPercent ?? exp.liftPct ?? 0;
            const isPos = liftVal > 0;

            let status: ExperimentRecord["status"] = "active";
            if (exp.result) {
              status = exp.result.conclusion === "POSITIVE" ? "validated" : "inconclusive";
            } else if (exp.status === "COMPLETED") {
              status = isPos ? "validated" : "inconclusive";
            }

            return {
              id: exp.id,
              experimentNumber: idx + 1,
              title: exp.title,
              hypothesis: exp.hypothesis,
              status,
              primaryMetric: exp.primaryMetric === "median_views" ? "Median Views" : "Engagement Rate",
              baselineValueFormatted: exp.baselineMetricValue
                ? exp.primaryMetric === "engagement_rate"
                  ? `${exp.baselineMetricValue.toFixed(1)}%`
                  : `${Math.round(exp.baselineMetricValue).toLocaleString()} views`
                : "Baseline Calibrated",
              currentValueFormatted: exp.result?.experimentValue
                ? exp.primaryMetric === "engagement_rate"
                  ? `${exp.result.experimentValue.toFixed(1)}%`
                  : `${Math.round(exp.result.experimentValue).toLocaleString()} views`
                : currentCount === 0
                ? "Pending 1st Upload"
                : `${currentCount} Uploads Tracked`,
              liftPctFormatted: exp.result
                ? `${exp.result.deltaPercent >= 0 ? "+" : ""}${exp.result.deltaPercent.toFixed(1)}%`
                : currentCount >= targetCount
                ? "Ready for Evaluation"
                : "0.0%",
              targetPostCount: targetCount,
              currentPostCount: currentCount,
              durationDays: exp.durationDays ?? 14,
              daysElapsed: exp.progress?.daysElapsed ?? 1,
              startDate: exp.startDate ? exp.startDate.slice(0, 10) : "Today",
              linkedPostIds: exp.posts?.map((p) => p.postId) ?? [],
              notes: exp.result?.summary ?? (
                isSuff
                  ? "Data Sufficiency Rule met! Ready to evaluate empirical outcome."
                  : `Awaiting ${targetCount - currentCount} more upload(s) to satisfy Data Sufficiency Rule (N>=${targetCount}).`
              ),
            };
          });

          setExperiments(mapped);
        }
      } catch (err) {
        console.warn("Failed to load experiments:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  async function handleEvaluate(expId: string) {
    try {
      setEvaluatingId(expId);
      setActionFeedback("Evaluating experiment results against channel baseline...");
      const result = await evaluateExperimentResults(expId);

      setActionFeedback(
        `Evaluation complete: ${result.conclusion} (${result.deltaPercent >= 0 ? "+" : ""}${result.deltaPercent.toFixed(1)}% lift)!`
      );

      // Update in local state
      setExperiments((prev) =>
        prev.map((e) => {
          if (e.id === expId) {
            return {
              ...e,
              status: result.conclusion === "POSITIVE" ? "validated" : "inconclusive",
              liftPctFormatted: `${result.deltaPercent >= 0 ? "+" : ""}${result.deltaPercent.toFixed(1)}%`,
              currentValueFormatted: `${Math.round(result.experimentValue).toLocaleString()} views`,
              notes: result.summary,
            };
          }
          return e;
        })
      );

      setTimeout(() => setActionFeedback(null), 4500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Evaluation failed";
      setActionFeedback(`Error: ${msg}`);
      setTimeout(() => setActionFeedback(null), 4000);
    } finally {
      setEvaluatingId(null);
    }
  }

  async function handleStatusChange(expId: string, newStatus: ExperimentStatus) {
    try {
      await updateExperiment(expId, { status: newStatus });
      setExperiments((prev) =>
        prev.map((e) => {
          if (e.id === expId) {
            return {
              ...e,
              status: newStatus === "COMPLETED" ? "validated" : "active",
            };
          }
          return e;
        })
      );
    } catch (err) {
      console.warn("Update status error:", err);
    }
  }

  async function handleLinkPost() {
    if (!linkingExperimentId || !selectedPostToLink) return;

    try {
      setActionFeedback("Attaching video to experiment cohort...");
      await linkPostToExperiment(linkingExperimentId, selectedPostToLink);

      setExperiments((prev) =>
        prev.map((e) => {
          if (e.id === linkingExperimentId) {
            const nextCount = e.currentPostCount + 1;
            const isSuff = nextCount >= e.targetPostCount;
            return {
              ...e,
              currentPostCount: nextCount,
              linkedPostIds: [...e.linkedPostIds, selectedPostToLink],
              notes: isSuff
                ? "Data Sufficiency Rule met! Ready to evaluate empirical outcome."
                : `Awaiting ${e.targetPostCount - nextCount} more upload(s) to satisfy Data Sufficiency Rule.`,
            };
          }
          return e;
        })
      );

      setActionFeedback("Video linked successfully!");
      setLinkingExperimentId(null);
      setSelectedPostToLink("");
      setTimeout(() => setActionFeedback(null), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to link video";
      setActionFeedback(`Error: ${msg}`);
      setTimeout(() => setActionFeedback(null), 4000);
    }
  }

  function handleExperimentCreated(newExp: {
    id?: string;
    title: string;
    hypothesis: string;
    primaryMetric: string;
    targetPostCount: number;
    durationDays: number;
  }) {
    const newRecord: ExperimentRecord = {
      id: newExp.id || `exp-local-${Date.now()}`,
      experimentNumber: experiments.length + 1,
      title: newExp.title,
      hypothesis: newExp.hypothesis,
      status: "active",
      primaryMetric: newExp.primaryMetric === "median_views" ? "Median Views" : "Engagement Rate",
      baselineValueFormatted: "Baseline Calibrated",
      currentValueFormatted: "Pending 1st Upload",
      liftPctFormatted: "0.0%",
      targetPostCount: newExp.targetPostCount,
      currentPostCount: 0,
      durationDays: newExp.durationDays,
      daysElapsed: 1,
      startDate: new Date().toISOString().slice(0, 10),
      linkedPostIds: [],
      notes: `Awaiting ${newExp.targetPostCount} upload(s) to satisfy Data Sufficiency Rule.`,
    };

    setExperiments((prev) => [newRecord, ...prev]);
    setActionFeedback("New experiment cohort created successfully!");
    setTimeout(() => setActionFeedback(null), 3500);
  }

  const filteredExperiments = experiments.filter((e) => {
    if (filterStatus === "all") return true;
    return e.status === filterStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Feedback */}
      {actionFeedback && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs font-medium text-emerald-900 animate-in fade-in">
          <Icon name="check-circle" className="size-4 text-emerald-600 shrink-0" />
          <p>{actionFeedback}</p>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#e6e0d6] bg-white p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand border border-brand/20">
              Deterministic Science Engine
            </span>
            <span className="text-xs text-muted">
              {experiments.length} Total Cohorts Tracked
            </span>
          </div>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-normal tracking-tight text-ink">
            Hypothesis &amp; Experiment Backlog
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
            Run empirical tests on video hooks, thumbnails, and topics to measure retention lifts against your historical baseline.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-strong transition-colors cursor-pointer"
        >
          <Icon name="plus" className="size-4" />
          <span>New Experiment Cohort</span>
        </button>
      </div>

      {/* Guardrail Rules Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[#e6e0d6] bg-[#faf7f2] p-4 text-xs text-muted flex items-start gap-3">
          <Icon name="shield" className="size-4 shrink-0 text-brand mt-0.5" />
          <div>
            <strong className="text-ink font-semibold">Data Sufficiency Rule:</strong> No
            experiment outcome is declared statistically valid until a minimum of 3 consecutive video uploads (N&ge;3) have been tracked.
          </div>
        </div>

        <div className="rounded-xl border border-[#e6e0d6] bg-[#faf7f2] p-4 text-xs text-muted flex items-start gap-3">
          <Icon name="activity" className="size-4 shrink-0 text-brand mt-0.5" />
          <div>
            <strong className="text-ink font-semibold">Statistical Isolation:</strong> Test
            only one variable per cohort (Hook Type OR Thumbnail OR Topic) to avoid cross-variable confounding.
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-[#e6e0d6] pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(
            [
              { id: "all", label: `All Experiments (${experiments.length})` },
              { id: "active", label: `Active (${experiments.filter((e) => e.status === "active").length})` },
              { id: "validated", label: `Validated Lift (${experiments.filter((e) => e.status === "validated").length})` },
              { id: "inconclusive", label: `Inconclusive (${experiments.filter((e) => e.status === "inconclusive").length})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                filterStatus === tab.id
                  ? "bg-brand text-white shadow-xs"
                  : "text-muted hover:bg-cream hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredExperiments.length === 0 && !isLoading && (
        <div className="rounded-2xl border border-dashed border-[#ded4c6] bg-white p-12 text-center shadow-sm">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#faf7f2] border border-[#e8e2d8] text-brand shadow-sm">
            <Icon name="flask" className="size-6" />
          </div>

          <h3 className="mt-3 font-serif text-xl font-medium text-ink">
            {filterStatus === "all"
              ? "No Experiments Running Yet"
              : `No ${filterStatus} Experiments Found`}
          </h3>

          <p className="mt-1.5 text-xs text-muted max-w-md mx-auto leading-relaxed">
            {filterStatus === "all"
              ? "Hypothesis testing enables you to validate title hooks, pacing styles, or duration sweet spots with empirical data."
              : `You do not have any experiments currently marked as ${filterStatus}.`}
          </p>

          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white shadow hover:bg-brand-strong cursor-pointer"
          >
            <Icon name="plus" className="size-3.5" />
            <span>Create First Experiment Cohort</span>
          </button>
        </div>
      )}

      {/* Experiment Cards List */}
      <div className="space-y-4">
        {filteredExperiments.map((exp) => {
          const isSuff = exp.currentPostCount >= exp.targetPostCount;
          const isEvaluating = evaluatingId === exp.id;
          const linkedPosts = userVideos.filter((v) => exp.linkedPostIds.includes(v.id) || exp.linkedPostIds.includes(v.externalId));

          return (
            <div
              key={exp.id}
              className="rounded-2xl border border-[#e6e0d6] bg-white p-6 shadow-sm space-y-4 transition-all hover:border-brand/40"
            >
              {/* Top Row: Experiment Code, Status & Primary Metric */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-muted">
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

              {/* Data Sufficiency Indicator & Progress */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <Icon name="shield" className="size-3.5 text-brand" />
                    <strong>Data Sufficiency Progress:</strong> {exp.currentPostCount} of {exp.targetPostCount} Target Uploads Evaluated
                  </span>
                  <span className="font-mono font-bold text-ink">
                    {Math.min(100, Math.round((exp.currentPostCount / exp.targetPostCount) * 100))}%
                  </span>
                </div>

                <div className="relative h-2 w-full overflow-hidden rounded-full bg-[#f2ece2]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isSuff ? "bg-emerald-600" : "bg-brand"
                    }`}
                    style={{
                      width: `${Math.min(100, (exp.currentPostCount / exp.targetPostCount) * 100)}%`,
                    }}
                  />
                </div>

                <p className="text-[11px] text-muted italic">{exp.notes}</p>
              </div>

              {/* Action Controls: Evaluate Outcome & Link Upload */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#f0ebe1]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEvaluate(exp.id)}
                    disabled={isEvaluating}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                      isSuff
                        ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                        : "bg-ink text-white hover:bg-ink/80"
                    }`}
                  >
                    <Icon name="zap" className={`size-3.5 ${isEvaluating ? "animate-spin" : ""}`} />
                    <span>{isEvaluating ? "Evaluating..." : "Evaluate Outcome"}</span>
                  </button>

                  <button
                    onClick={() => {
                      setLinkingExperimentId(exp.id);
                      setSelectedPostToLink("");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#ded4c6] bg-[#faf7f2] px-3.5 py-1.5 text-xs font-semibold text-ink hover:bg-white transition-colors cursor-pointer"
                  >
                    <Icon name="link" className="size-3.5" />
                    <span>Link Ingested Upload</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-muted">Status:</span>
                  <button
                    onClick={() =>
                      handleStatusChange(
                        exp.id,
                        exp.status === "active" ? "COMPLETED" : "ACTIVE"
                      )
                    }
                    className="font-medium text-brand hover:underline cursor-pointer"
                  >
                    {exp.status === "active" ? "Mark Completed" : "Reactivate"}
                  </button>
                </div>
              </div>

              {/* Linked Uploads Sub-Panel */}
              {linkedPosts.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#f2ede4] space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted block">
                    Linked Uploads in this Experiment Cohort ({linkedPosts.length})
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
                            {post.publishedAt.slice(0, 10)} · {post.features?.hookType || "Classified"}
                          </span>
                        </div>
                        <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200 shrink-0 font-mono">
                          {formatCount(post.views ?? post.metrics?.[0]?.views ?? 0)} views
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

      {/* Link Video Modal */}
      {linkingExperimentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-xl bg-brand/10 text-brand">
                  <Icon name="link" className="size-4" />
                </span>
                <h3 className="font-serif text-lg font-normal text-ink">
                  Link Video to Experiment
                </h3>
              </div>
              <button
                onClick={() => setLinkingExperimentId(null)}
                className="text-muted hover:text-ink text-xs font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-muted">
              Select one of your synced YouTube uploads to attach to this experiment cohort.
            </p>

            {userVideos.length === 0 ? (
              <div className="rounded-xl bg-[#faf7f2] border border-[#e6e0d6] p-4 text-center text-xs text-muted">
                <p>No synced videos found in database.</p>
                <p className="mt-1 text-[11px]">Sync your YouTube channel from the Integrations tab first.</p>
              </div>
            ) : (
              <select
                value={selectedPostToLink}
                onChange={(e) => setSelectedPostToLink(e.target.value)}
                className="w-full rounded-xl border border-line bg-cream/50 p-2.5 text-xs text-ink focus:border-brand focus:outline-none"
              >
                <option value="">-- Choose Ingested Video --</option>
                {userVideos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({formatCount(p.views ?? p.metrics?.[0]?.views ?? 0)} views)
                  </option>
                ))}
              </select>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
              <button
                onClick={() => setLinkingExperimentId(null)}
                className="rounded-xl border border-line px-3 py-1.5 text-xs font-semibold text-muted hover:text-ink cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLinkPost}
                disabled={!selectedPostToLink}
                className="rounded-xl bg-brand px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-strong disabled:opacity-50 cursor-pointer"
              >
                Link Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <CreateExperimentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onExperimentCreated={handleExperimentCreated}
      />
    </div>
  );
}
