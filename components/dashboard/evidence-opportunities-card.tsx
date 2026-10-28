"use client";

import { useState } from "react";
import { Icon } from "@/components/ui";
import { EVIDENCE_OPPORTUNITIES } from "@/lib/data/intelligence-mock-data";
import type { EvidenceOpportunity } from "@/lib/types/creator-intelligence";
import { startYouTubeOAuth } from "@/lib/youtube";
import { useYouTubeConnection } from "@/lib/youtube-connection-context";
import Link from "next/link";
import { CreateExperimentModal } from "@/components/dashboard/create-experiment-modal";

export function EvidenceOpportunitiesCard() {
  const { isConnected } = useYouTubeConnection();
  const [activeModalItem, setActiveModalItem] = useState<EvidenceOpportunity | null>(null);
  const [isExperimentModalOpen, setIsExperimentModalOpen] = useState(false);

  // Empty state when YouTube is not connected
  if (!isConnected) {
    return (
      <div className="rounded-2xl border border-dashed border-[#ded4c6] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f2ede4] pb-4">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-lg bg-[#faf7f2] border border-[#e8e2d8] text-[#998f84]">
              <Icon name="spark" className="size-3.5" />
            </span>
            <h2 className="text-base font-semibold text-ink">
              Top 3 Evidence-Backed Opportunities
            </h2>
          </div>
          <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
            Awaiting Ingestion
          </span>
        </div>

        {/* Empty state body */}
        <div className="mt-5 rounded-xl bg-[#faf8f4] border border-[#ede6dc] p-5 text-center">
          <div className="mx-auto grid size-11 place-items-center rounded-2xl bg-white border border-[#e4dacf] text-brand shadow-sm">
            <Icon name="spark" className="size-5" />
          </div>

          <h3 className="mt-3 font-serif text-base sm:text-lg font-medium text-ink">
            No Opportunities Generated Yet
          </h3>
          <p className="mt-1.5 max-w-md mx-auto text-xs text-[#70665b] leading-relaxed">
            Link your YouTube channel to allow Gemini AI and our regression engine to scan your video library, identify audience churn bottlenecks, and prescribe evidence-backed fixes.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => startYouTubeOAuth()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#e62117] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#cc1810]"
            >
              <Icon name="youtube" className="size-4" />
              <span>Connect YouTube Account</span>
            </button>
            <Link
              href="/dashboard/insights"
              className="rounded-xl border border-[#ded4c6] bg-white px-3.5 py-2 text-xs font-semibold text-[#665e54] hover:bg-[#faf7f2]"
            >
              Explore Intelligence Framework
            </Link>
          </div>
        </div>

        {/* 3 Ghost Opportunity Row Placeholders */}
        <div className="mt-4 space-y-2.5">
          {[
            {
              num: "#1",
              title: "0–3s Hook Drop-Off Anomaly",
              desc: "Detects rapid viewer churn in thesis statement delivery vs. your niche cohort.",
            },
            {
              num: "#2",
              title: "Problem-First Cold Open Opportunity",
              desc: "Calculates the retention lift of immediate conflict hooks over narrative lead-ins.",
            },
            {
              num: "#3",
              title: "Pacing & B-Roll Transition Bottleneck",
              desc: "Pinpoints verbal dead-zones and recommends kinetic cut cadence adjustments.",
            },
          ].map((item) => (
            <div
              key={item.num}
              className="flex items-center justify-between rounded-xl border border-[#ede7dd] bg-[#faf8f5]/50 px-3.5 py-2.5 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="grid size-5 place-items-center rounded-md bg-[#ede6dc] text-[10px] font-bold text-[#8a7f72]">
                  {item.num}
                </span>
                <div>
                  <p className="font-semibold text-[#80766a]">{item.title}</p>
                  <p className="text-[11px] text-[#9c9285]">{item.desc}</p>
                </div>
              </div>
              <span className="rounded bg-[#f4ede3] px-2 py-0.5 text-[10px] font-medium text-[#8a7f72] shrink-0">
                Locked
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Connected state
  return (
    <>
      <div className="rounded-2xl border border-[#e6e0d6] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f2ede4] pb-4">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-lg bg-brand/10 text-brand">
              <Icon name="spark" className="size-3.5" />
            </span>
            <h2 className="text-base font-semibold text-ink">
              Top 3 Evidence-Backed Opportunities
            </h2>
          </div>
          <Link
            href="/dashboard/insights"
            className="rounded-full bg-[#f6f2ea] border border-[#e8e2d8] px-2.5 py-1 text-[11px] font-semibold text-brand hover:underline"
          >
            View All Evidence &rarr;
          </Link>
        </div>

        {/* 3 Opportunities List */}
        <div className="mt-4 divide-y divide-[#f2ede4]">
          {EVIDENCE_OPPORTUNITIES.map((opp) => (
            <div key={opp.id} className="py-4 first:pt-1 last:pb-1">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="grid size-6 shrink-0 place-items-center rounded-md bg-[#faf7f2] border border-[#e8e2d8] text-xs font-bold text-ink">
                    {opp.numberBadge}
                  </span>
                  <h3 className="text-sm font-semibold text-ink">
                    {opp.title}
                  </h3>
                  {opp.badgeLabel && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        opp.badgeColor === "red"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-[#f5efe6] text-[#786f65]"
                      }`}
                    >
                      {opp.badgeLabel}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setActiveModalItem(opp)}
                  className="group inline-flex items-center gap-1 text-xs font-semibold text-brand transition-colors hover:text-brand-strong"
                >
                  <span>{opp.actionLabel}</span>
                  <Icon
                    name="arrow-right"
                    className="size-3 transition-transform group-hover:translate-x-0.5"
                  />
                </button>
              </div>

              <p className="mt-2 text-xs text-[#6b6257] leading-relaxed">
                {opp.description}
              </p>

              {/* Prescription Callout Box */}
              <div className="mt-2.5 rounded-xl border border-[#efe9dc] bg-[#fbf9f5] px-3.5 py-2 text-xs text-[#5c544b]">
                <strong className="font-semibold text-brand">Prescription:</strong>{" "}
                <span>{opp.prescription.replace("Prescription: ", "")}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Detail Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setActiveModalItem(null)}
          />
          <div className="relative w-full max-w-lg rounded-2xl border border-line bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-brand/10 px-2 py-0.5 text-xs font-bold text-brand">
                  {activeModalItem.numberBadge}
                </span>
                <h3 className="text-sm font-bold text-ink">{activeModalItem.title}</h3>
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="rounded-lg p-1 text-muted hover:bg-black/5"
              >
                <Icon name="x" className="size-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-[#6b6257]">
              <p>{activeModalItem.description}</p>
              <div className="rounded-xl border border-brand/20 bg-brand/5 p-3.5 text-ink">
                <p className="font-semibold text-brand">Prescription Engine Recommendation</p>
                <p className="mt-1 text-xs leading-relaxed text-[#5c544b]">
                  {activeModalItem.prescription}
                </p>
              </div>
              <div className="rounded-xl border border-line bg-cream/60 p-3 text-[11px] text-muted">
                Confidence Score: <strong>94.2%</strong> · Calibrated against historical uploads in Tech &amp; Studio Craft cohort.
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setActiveModalItem(null)}
                className="rounded-xl border border-[#ded6c7] px-3.5 py-2 text-xs font-semibold text-muted hover:bg-cream"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setActiveModalItem(null);
                  setIsExperimentModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white shadow hover:bg-brand-strong"
              >
                <Icon name="flask" className="size-3.5" />
                <span>Turn into Experiment</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Experiment Modal */}
      <CreateExperimentModal
        isOpen={isExperimentModalOpen}
        onClose={() => setIsExperimentModalOpen(false)}
      />
    </>
  );
}
