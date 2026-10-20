"use client";

import { Icon } from "@/components/ui";
import { KPI_METRIC_CARDS } from "@/lib/data/intelligence-mock-data";

export function KpiMetricCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {KPI_METRIC_CARDS.map((card) => {
        return (
          <div
            key={card.id}
            className="group relative flex flex-col justify-between rounded-2xl border border-[#e6e0d6] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:border-brand/40 hover:shadow-sm"
          >
            {/* Card Header: Title + Icon */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#887f74]">
                {card.title}
              </span>
              <div className="grid size-7 place-items-center rounded-lg bg-[#faf7f2] border border-[#e8e2d8] text-[#7a7167] group-hover:text-brand">
                <Icon name={card.iconName} className="size-3.5" />
              </div>
            </div>

            {/* Metric Value & Badges */}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-ink">
                {card.value}
              </span>
              {card.badgeText ? (
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    card.badgeVariant === "green"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : card.badgeVariant === "brand"
                      ? "bg-brand/10 text-brand border border-brand/20"
                      : "bg-[#f5efe6] text-[#786f65]"
                  }`}
                >
                  {card.badgeText}
                </span>
              ) : null}
            </div>

            {/* Bottom context / benchmarks */}
            <div className="mt-3 pt-2.5 border-t border-[#f2ede4]">
              {card.id === "velocity" && (
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="inline-flex items-center text-xs font-semibold text-emerald-700">
                    <Icon name="trending-up" className="size-3 mr-0.5 inline" />
                    +28.4%
                  </span>
                  <span className="text-[#887f74]">vs Niche Baseline: 32,240</span>
                </div>
              )}

              {card.id === "hook_hold" && (
                <div className="text-xs text-[#887f74]">
                  <span>Benchmark: </span>
                  <span className="font-semibold text-ink">81.8%</span>
                  <span> · Problem-First leads</span>
                </div>
              )}

              {card.id === "ratio" && (
                <div>
                  <div className="flex items-center justify-between text-[11px] text-[#887f74] mb-1">
                    <span>Cohort Standing</span>
                    <span className="font-semibold text-brand">High Tier</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f0ebd2]/60">
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{ width: `${card.progressPct ?? 84}%` }}
                    />
                  </div>
                </div>
              )}

              {card.id === "confidence" && (
                <div className="flex items-center gap-1.5 text-xs text-[#887f74]">
                  <Icon name="check-circle" className="size-3.5 text-brand" />
                  <span>52 Verified Historical Uploads</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
