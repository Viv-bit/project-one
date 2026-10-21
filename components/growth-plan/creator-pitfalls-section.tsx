"use client";

import { useState } from "react";
import { Icon } from "@/components/ui";
import { CREATOR_PITFALLS, STRATEGIST_REVIEW } from "@/lib/data/growth-plan-mock-data";

export function CreatorPitfallsSection() {
  const [reviewBooked, setReviewBooked] = useState(false);
  const [recalibrated, setRecalibrated] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
      {/* Left Column (8 cols): Creator Pitfalls to Eliminate */}
      <div className="lg:col-span-8 flex flex-col justify-between rounded-2xl border border-[#e6e0d6] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sm:p-6">
        <div>
          {/* Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#f2ede4] pb-4">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1 rounded-full bg-brand" />
              <h2 className="text-base font-bold tracking-tight text-ink">
                Creator Pitfalls to Eliminate
              </h2>
            </div>
            <span className="rounded-full bg-rose-50 border border-rose-200/80 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700">
              Based on Nate&apos;s Bottom 5 Decile Uploads
            </span>
          </div>

          {/* 3 Pitfalls List */}
          <div className="mt-4 space-y-3.5">
            {CREATOR_PITFALLS.map((pitfall) => (
              <div
                key={pitfall.id}
                className="flex items-start gap-3.5 rounded-xl border border-[#f3ece2] bg-[#fbf9f6] p-3.5 transition-all hover:border-rose-200"
              >
                {/* Red Icon Box */}
                <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-rose-100/70 text-rose-700">
                  <Icon name={pitfall.iconName} className="size-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <h3 className="text-xs font-bold text-ink">
                      {pitfall.title}
                    </h3>
                    <span className="text-[11px] font-bold text-rose-700 shrink-0">
                      {pitfall.metricPenalty}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#70665b] leading-relaxed">
                    {pitfall.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column (4 cols): Strategic Accountability */}
      <div className="lg:col-span-4 flex flex-col justify-between rounded-2xl border border-[#e6e0d6] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sm:p-6">
        <div>
          {/* Header */}
          <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-brand">
            <Icon name="trophy" className="size-3.5 text-brand" />
            <span>{STRATEGIST_REVIEW.badge}</span>
          </div>

          <h3 className="mt-2 text-base font-bold text-ink">
            {STRATEGIST_REVIEW.title}
          </h3>

          <p className="mt-2 text-xs text-[#6e655b] leading-relaxed">
            {STRATEGIST_REVIEW.description}
          </p>

          {/* Strategist Profile Card */}
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#ece5da] bg-[#faf8f4] p-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-full bg-amber-100 text-xs font-bold text-amber-900 border border-amber-200">
              {STRATEGIST_REVIEW.strategistInitials}
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-ink">
                {STRATEGIST_REVIEW.strategistName}
              </h4>
              <p className="text-[11px] text-[#887f74] truncate">
                {STRATEGIST_REVIEW.strategistRole}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-5 space-y-2.5 pt-2">
          <button
            onClick={() => setReviewBooked(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#e2dcd2] bg-white py-2.5 text-xs font-semibold text-ink shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all hover:bg-[#faf7f3] hover:border-brand/40"
          >
            <Icon name="calendar" className="size-3.5 text-[#7a7167]" />
            <span>
              {reviewBooked ? "Review Requested (Invite Sent)" : "Book 25-Min Cut Review"}
            </span>
          </button>

          <button
            onClick={() => setRecalibrated(true)}
            className="block w-full text-center text-xs font-semibold text-brand hover:underline"
          >
            {recalibrated
              ? "✓ Model scheduled to re-calibrate post-upload"
              : "Re-calibrate Model After Next Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
