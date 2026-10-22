"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import {
  CHANNEL_PROFILE,
  INGESTED_POSTS_16,
  INGESTION_STAGES,
} from "@/lib/data/intelligence-mock-data";

export function IngestionPipelineView() {
  const [activeStageIndex, setActiveStageIndex] = useState(5);
  const [isSimulating, setIsSimulating] = useState(false);

  function handleReRunSimulation() {
    setIsSimulating(true);
    setActiveStageIndex(0);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current >= INGESTION_STAGES.length) {
        clearInterval(interval);
        setActiveStageIndex(INGESTION_STAGES.length - 1);
        setIsSimulating(false);
      } else {
        setActiveStageIndex(current);
      }
    }, 700);
  }

  const activeStage = INGESTION_STAGES[activeStageIndex];

  return (
    <div className="space-y-8">
      {/* Channel Header Summary */}
      <div className="rounded-2xl border border-[#e6e0d6] bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative size-12 overflow-hidden rounded-2xl border border-[#d8d0c4] bg-[#ebdccb] shadow-sm">
              <div className="grid h-full w-full place-items-center font-serif text-lg font-bold text-[#5c4a37]">
                NC
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-2xl font-normal text-ink">
                  {CHANNEL_PROFILE.name}
                </h2>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                  Batch 1 Calibrated
                </span>
              </div>
              <p className="text-xs text-muted">
                {CHANNEL_PROFILE.handle} · {CHANNEL_PROFILE.subscribers} · Niche: {CHANNEL_PROFILE.niche}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleReRunSimulation}
              disabled={isSimulating}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#ded6c7] bg-[#faf7f2] px-3.5 py-2 text-xs font-semibold text-ink hover:bg-cream transition-colors disabled:opacity-50"
            >
              <Icon
                name="refresh-cw"
                className={`size-3.5 text-brand ${isSimulating ? "animate-spin" : ""}`}
              />
              <span>{isSimulating ? "Running Pipeline..." : "Re-simulate Pipeline"}</span>
            </button>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-strong transition-colors"
            >
              <span>Explore Dashboard</span>
              <Icon name="arrow-right" className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 6 Pipeline Stage Steps */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
            Intelligence Pipeline Execution (10–20 Uploads Batch)
          </h3>
          <span className="text-xs text-brand font-semibold">
            {activeStageIndex + 1} of {INGESTION_STAGES.length} Stages Complete
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {INGESTION_STAGES.map((stage, idx) => {
            const isCompleted = idx <= activeStageIndex;
            const isCurrent = idx === activeStageIndex;

            return (
              <button
                key={stage.id}
                onClick={() => setActiveStageIndex(idx)}
                className={`relative flex flex-col justify-between rounded-xl p-3 text-left transition-all border ${
                  isCurrent
                    ? "border-brand bg-white shadow-md ring-2 ring-brand/20"
                    : isCompleted
                    ? "border-emerald-200 bg-emerald-50/50 hover:bg-white"
                    : "border-[#e8e2d8] bg-[#faf7f2] opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-muted">
                    0{stage.stepNumber}
                  </span>
                  <div
                    className={`grid size-5 place-items-center rounded-full text-[10px] ${
                      isCompleted
                        ? "bg-emerald-600 text-white"
                        : "bg-[#e8e2d8] text-muted"
                    }`}
                  >
                    {isCompleted ? (
                      <Icon name="check" className="size-3" />
                    ) : (
                      stage.stepNumber
                    )}
                  </div>
                </div>

                <div className="mt-2">
                  <h4 className="text-xs font-semibold text-ink line-clamp-1">
                    {stage.title}
                  </h4>
                  <p className="text-[10px] text-muted mt-0.5">
                    {stage.itemsProcessed}/{stage.totalItems} items
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Deep Dive */}
      <div className="rounded-2xl border border-brand/20 bg-brand/[0.02] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex size-6 items-center justify-center rounded-lg bg-brand text-white text-xs font-bold">
                {activeStage.stepNumber}
              </span>
              <h4 className="font-serif text-xl font-normal text-ink">
                Stage {activeStage.stepNumber}: {activeStage.title}
              </h4>
            </div>
            <p className="mt-1 text-xs text-muted max-w-2xl leading-relaxed">
              {activeStage.description}
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            Verified &amp; Calibrated
          </span>
        </div>

        {activeStage.details && (
          <div className="mt-3.5 rounded-xl border border-[#e6e0d6] bg-white p-3 text-xs text-[#5c544c]">
            <strong className="text-ink font-semibold">Stage Result:</strong> {activeStage.details}
          </div>
        )}
      </div>

      {/* Ingested Uploads Stream (16 items) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-normal text-ink">
              Batch 1 Ingested Content ({INGESTED_POSTS_16.length} Uploads)
            </h3>
            <p className="text-xs text-muted">
              Normalized video metadata, Whisper STT transcripts, and hook hold rates.
            </p>
          </div>

          <span className="text-xs font-mono text-muted">
            10–20 Video Sampling Window
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {INGESTED_POSTS_16.map((post) => {
            return (
              <div
                key={post.id}
                className="group flex flex-col justify-between rounded-2xl border border-[#e6e0d6] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:border-brand/40 hover:shadow-sm"
              >
                {/* Thumbnail Simulation */}
                <div>
                  <div
                    className={`relative aspect-video w-full rounded-xl bg-gradient-to-br ${post.thumbnailGradient} p-3 text-white shadow-inner flex flex-col justify-between`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-mono backdrop-blur-sm">
                        {post.durationFormatted}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold backdrop-blur-sm ${
                          post.tier === "top_decile"
                            ? "bg-emerald-500/90 text-white"
                            : post.tier === "underperformed"
                            ? "bg-red-500/90 text-white"
                            : "bg-black/60 text-white"
                        }`}
                      >
                        {post.hookHoldPct}% Hold
                      </span>
                    </div>

                    <p className="line-clamp-2 text-xs font-medium leading-snug drop-shadow-sm">
                      {post.title}
                    </p>
                  </div>

                  <h4 className="mt-3 text-xs font-semibold text-ink line-clamp-1 group-hover:text-brand transition-colors">
                    {post.title}
                  </h4>
                  <p className="mt-0.5 text-[11px] text-muted">
                    {post.viewsFormatted} views · {post.publishedAt}
                  </p>
                </div>

                {/* Pipeline Extracted Tags */}
                <div className="mt-3 pt-3 border-t border-[#f0ebe1] space-y-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded bg-[#faf7f2] border border-[#e8e2d8] px-1.5 py-0.5 text-[10px] font-medium text-ink">
                      {post.hookType}
                    </span>
                    <span className="rounded bg-[#faf7f2] border border-[#e8e2d8] px-1.5 py-0.5 text-[10px] font-medium text-muted">
                      {post.topicPillar}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-muted font-mono">
                    <span className="flex items-center gap-1 text-emerald-700">
                      <Icon name="check" className="size-3" />
                      STT Cached
                    </span>
                    <span>{post.likes.toLocaleString()} likes</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
