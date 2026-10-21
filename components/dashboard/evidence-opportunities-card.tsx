"use client";

import { useState } from "react";
import { Icon } from "@/components/ui";
import { EVIDENCE_OPPORTUNITIES } from "@/lib/data/intelligence-mock-data";
import type { EvidenceOpportunity } from "@/lib/types/creator-intelligence";

export function EvidenceOpportunitiesCard() {
  const [activeModalItem, setActiveModalItem] = useState<EvidenceOpportunity | null>(null);

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
          <span className="rounded-full bg-[#f6f2ea] border border-[#e8e2d8] px-2.5 py-1 text-[11px] font-semibold text-[#6e655a]">
            FRD Deterministic Engine
          </span>
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
                Confidence Score: <strong>94.2%</strong> · Tested against 50 historical uploads in Tech &amp; Studio Craft cohort.
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveModalItem(null)}
                className="rounded-xl bg-ink px-4 py-2 text-xs font-semibold text-white shadow hover:bg-ink/90"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
