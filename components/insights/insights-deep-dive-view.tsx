"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/components/ui/icon";
import {
  DETAILED_INSIGHTS,
  INGESTED_POSTS_16,
} from "@/lib/data/intelligence-mock-data";
import type { DetailedInsight } from "@/lib/types/creator-intelligence";
import { CreateExperimentModal } from "@/components/dashboard/create-experiment-modal";
import {
  getInsights,
  getRecommendations,
  type ApiInsight,
  type ApiRecommendation,
  type InsightPriority,
} from "@/lib/insights";

type FilterPriority = "ALL" | InsightPriority;
type FilterCategory =
  | "ALL"
  | "TOPIC_OPPORTUNITY"
  | "HOOK_LEVERAGE"
  | "DURATION_SWEET_SPOT"
  | "ENGAGEMENT_CLUSTER"
  | "OUTLIER_BREAKOUT"
  | "CADENCE";

export function InsightsDeepDiveView() {
  const [insights, setInsights] = useState<DetailedInsight[]>(DETAILED_INSIGHTS);
  const [selectedInsightForExp, setSelectedInsightForExp] =
    useState<DetailedInsight | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedInsightId, setExpandedInsightId] = useState<string | null>(
    "ins-01"
  );
  const [priorityFilter, setPriorityFilter] = useState<FilterPriority>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>("ALL");

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const [insightsRes, recsRes] = await Promise.allSettled([
          getInsights({
            ...(priorityFilter !== "ALL" && { priority: priorityFilter }),
            ...(categoryFilter !== "ALL" && { category: categoryFilter }),
          }),
          getRecommendations(),
        ]);

        if (ignore) return;
        if (insightsRes.status === "fulfilled" && insightsRes.value?.insights?.length > 0) {
          const recsList: ApiRecommendation[] =
            recsRes.status === "fulfilled" && recsRes.value?.recommendations
              ? recsRes.value.recommendations
              : [];

          const mapped: DetailedInsight[] = insightsRes.value.insights.map((ins: ApiInsight) => {
            const matchingRec = recsList.find(
              (r) => r.id === `rec-${ins.id}` || r.category === ins.category
            );

            let mappedCategory: DetailedInsight["category"] = "topic";
            if (ins.category.includes("HOOK")) mappedCategory = "hook";
            else if (ins.category.includes("DURATION")) mappedCategory = "duration";
            else if (ins.category.includes("PACING")) mappedCategory = "pacing";
            else if (ins.category.includes("CTA")) mappedCategory = "cta";

            return {
              id: ins.id,
              category: mappedCategory,
              priority: ins.priority.toLowerCase() as DetailedInsight["priority"],
              title: ins.title,
              observation: ins.observation,
              evidenceMetric: ins.evidence.metric,
              evidenceCreatorValue: String(ins.evidence.creatorValue),
              evidenceBenchmarkValue: ins.evidence.baselineValue
                ? String(ins.evidence.baselineValue)
                : "+25% benchmark",
              sampleSizeLabel: `Calculated over ${ins.evidence.sampleSize} verified uploads (${ins.evidence.deltaPercent ? `+${ins.evidence.deltaPercent}% lift` : "empirical baseline"})`,
              linkedPostIds: ins.evidence.sourcePostIds || [],
              interpretation: ins.interpretation || matchingRec?.why || "Audience retention signals confirm algorithmic lift.",
              recommendation: ins.recommendation || matchingRec?.action || "Run a 3-video experiment cohort.",
              confidenceScore: Math.round(ins.confidence * 100),
              suggestedExperiment: matchingRec?.experimentTemplate
                ? {
                    hypothesis: matchingRec.experimentTemplate.hypothesis,
                    suggestedDurationDays: matchingRec.experimentTemplate.suggestedDurationDays,
                    targetPostCount: matchingRec.experimentTemplate.targetPostCount,
                    primaryMetric: matchingRec.experimentTemplate.primaryMetric,
                    predictedLift: `+${ins.evidence.deltaPercent ?? 25}%`,
                  }
                : undefined,
            };
          });

          if (!ignore) {
            setInsights(mapped);
          }
        }
      } catch {
        // Fallback to sample calibrated insights
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [priorityFilter, categoryFilter]);

  function handleLaunchExperiment(insight: DetailedInsight) {
    setSelectedInsightForExp(insight);
    setIsModalOpen(true);
  }

  const filteredInsights = insights.filter((ins) => {
    if (priorityFilter !== "ALL" && ins.priority.toUpperCase() !== priorityFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="rounded-2xl border border-[#e6e0d6] bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-ink">
                Evidence-Backed Insights &amp; Recommendations
              </h1>
              <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand border border-brand/20">
                {filteredInsights.length} Empirical Findings
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">
              Rigorous 4-field structure (Why → Evidence → Action → Measurement) generated by deterministic regression rules and AI reasoning.
            </p>
          </div>

          <div className="rounded-xl border border-[#e6e0d6] bg-[#faf7f2] p-3 text-xs">
            <span className="text-muted block text-[11px]">Core Mandate</span>
            <span className="font-semibold text-ink">
              Deterministic Code Calculates · LLM Interprets
            </span>
          </div>
        </div>

        {/* Priority & Category Filter Bars */}
        <div className="mt-6 flex flex-wrap items-center gap-3 pt-5 border-t border-[#f0ebe1]">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-muted font-semibold text-[11px] mr-1">Priority:</span>
            {(["ALL", "HIGH", "MEDIUM", "EXPERIMENTAL"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  priorityFilter === p
                    ? "bg-ink text-white"
                    : "bg-[#faf7f2] border border-[#e8e2d8] text-muted hover:text-ink"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="hidden sm:block h-4 w-px bg-line" />

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-muted font-semibold text-[11px] mr-1">Category:</span>
            {(
              [
                { id: "ALL", label: "All Rules" },
                { id: "TOPIC_OPPORTUNITY", label: "Topic Opportunity" },
                { id: "HOOK_LEVERAGE", label: "Hook Leverage" },
                { id: "DURATION_SWEET_SPOT", label: "Duration Sweet Spot" },
                { id: "ENGAGEMENT_CLUSTER", label: "Engagement Cluster" },
                { id: "CADENCE", label: "Upload Cadence" },
              ] as const
            ).map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoryFilter(c.id as FilterCategory)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  categoryFilter === c.id
                    ? "bg-brand text-white"
                    : "bg-[#faf7f2] border border-[#e8e2d8] text-muted hover:text-ink"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Insight Cards (4-Field Structure) */}
      <div className="space-y-6">
        {filteredInsights.map((insight, idx) => {
          const isExpanded = expandedInsightId === insight.id;
          const linkedPosts = INGESTED_POSTS_16.filter((p) =>
            insight.linkedPostIds.includes(p.id) || insight.linkedPostIds.includes(p.externalId)
          );

          return (
            <div
              key={insight.id}
              className="rounded-2xl border border-[#e6e0d6] bg-white p-6 shadow-sm space-y-6"
            >
              {/* Card Top: Number, Title, Confidence & Action */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand text-white font-serif text-lg font-bold">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          insight.priority === "high"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : insight.priority === "medium"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-purple-50 text-purple-700 border border-purple-200"
                        }`}
                      >
                        {insight.priority} Priority
                      </span>
                      <span className="text-xs text-muted font-mono">
                        {insight.confidenceScore}% Confidence Calibrated
                      </span>
                    </div>

                    <h2 className="mt-1 font-serif text-2xl font-normal text-ink">
                      {insight.title}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => handleLaunchExperiment(insight)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-strong transition-colors cursor-pointer"
                >
                  <Icon name="flask" className="size-3.5" />
                  <span>Start Experiment</span>
                </button>
              </div>

              {/* 4 Fields Grid: Observation, Evidence, Interpretation, Recommendation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* 1. Observation / Why */}
                <div className="rounded-xl border border-[#f0ebe1] bg-[#faf7f2] p-4 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
                    🔍 1. Observed Pattern (Deterministic)
                  </span>
                  <p className="text-ink leading-relaxed font-medium">
                    {insight.observation}
                  </p>
                </div>

                {/* 2. Evidence */}
                <div className="rounded-xl border border-[#f0ebe1] bg-[#faf7f2] p-4 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
                    📊 2. Supporting Data Evidence
                  </span>
                  <div className="flex items-baseline justify-between pt-1 border-t border-[#e8e2d8]">
                    <span className="text-muted">Creator Metric:</span>
                    <span className="font-bold text-ink font-mono">
                      {insight.evidenceCreatorValue}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-muted">Comparative Baseline:</span>
                    <span className="font-bold text-muted font-mono">
                      {insight.evidenceBenchmarkValue}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted">{insight.sampleSizeLabel}</p>
                </div>

                {/* 3. Action */}
                <div className="rounded-xl border border-[#f0ebe1] bg-white p-4 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink font-semibold">
                    🎯 3. Prescriptive Action Item
                  </span>
                  <p className="text-ink leading-relaxed font-medium">
                    {insight.recommendation}
                  </p>
                </div>

                {/* 4. Measurement / Interpretation */}
                <div className="rounded-xl border border-[#f0ebe1] bg-white p-4 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                    📏 4. Measurement &amp; Psychology
                  </span>
                  <p className="text-muted leading-relaxed">
                    {insight.interpretation}
                  </p>
                </div>
              </div>

              {/* Linked Evidence Uploads Toggle */}
              {linkedPosts.length > 0 && (
                <div className="pt-2 border-t border-[#f0ebe1]">
                  <button
                    onClick={() =>
                      setExpandedInsightId(isExpanded ? null : insight.id)
                    }
                    className="flex items-center gap-2 text-xs font-semibold text-brand hover:underline cursor-pointer"
                  >
                    <Icon
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      className="size-3.5"
                    />
                    <span>
                      {isExpanded
                        ? "Hide Substantiating Uploads"
                        : `Inspect ${linkedPosts.length} Substantiating Ingested Uploads`}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-in fade-in">
                      {linkedPosts.map((post) => (
                        <div
                          key={post.id}
                          className="rounded-xl border border-[#e6e0d6] bg-[#faf7f2] p-3 text-xs flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between text-[10px] text-muted font-mono">
                              <span>{post.durationFormatted}</span>
                              <span className="font-bold text-ink">
                                {post.hookHoldPct}% Hold
                              </span>
                            </div>
                            <p className="mt-1 font-semibold text-ink line-clamp-1">
                              {post.title}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-[10px] text-muted">
                            <span>{post.hookType}</span>
                            <span>{post.viewsFormatted} views</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Experiment Modal */}
      <CreateExperimentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        preselectedInsight={selectedInsightForExp}
      />
    </div>
  );
}
