"use client";

import { Icon } from "@/components/ui";
import { ALGORITHMIC_LEVERS } from "@/lib/data/growth-plan-mock-data";

export function AlgorithmicLeversSection() {
  return (
    <section aria-labelledby="algorithmic-levers-heading" className="space-y-3.5">
      {/* Section Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="h-4 w-1 rounded-full bg-brand" />
          <h2
            id="algorithmic-levers-heading"
            className="text-base font-bold tracking-tight text-ink"
          >
            Primary Algorithmic Levers
          </h2>
        </div>
        <p className="text-xs text-[#857b71]">
          Generated from multivariable regression across 50 video logs
        </p>
      </div>

      {/* 3 Levers Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {ALGORITHMIC_LEVERS.map((lever) => (
          <div
            key={lever.id}
            className="group flex flex-col justify-between rounded-2xl border border-[#e6e0d6] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:border-brand/40 hover:shadow-sm"
          >
            <div>
              {/* Header: Lever pill + Confidence */}
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#f2ece3] px-2.5 py-0.5 text-[11px] font-bold text-[#635a50]">
                  {lever.leverNumber}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand">
                  <Icon name="check-circle" className="size-3 text-brand" />
                  {lever.confidence}% Confidence
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="mt-3 text-sm font-bold text-ink group-hover:text-brand transition-colors">
                {lever.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#686055]">
                {lever.description}
              </p>
            </div>

            {/* Bottom Lift Stat */}
            <div className="mt-4 pt-3 border-t border-[#f2ede4] flex items-baseline justify-between">
              <span className="text-[11px] font-medium text-[#7d7469]">
                {lever.metricLiftLabel}
              </span>
              <span className="font-sans text-sm sm:text-base font-bold text-brand">
                {lever.metricLiftValue}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
