"use client";

import { useState } from "react";
import { Icon } from "@/components/ui";
import { GROWTH_SPRINTS } from "@/lib/data/growth-plan-mock-data";

export function SequencedSprintsSection() {
  // Manage interactive checklist state for Sprint 1
  const [sprint1Checks, setSprint1Checks] = useState<Record<string, boolean>>({
    "c1-1": true,
    "c1-2": true,
    "c1-3": false,
  });

  const sprint1Total = 4; // Matching the Stitch design "2 of 4 Applied"
  const sprint1AppliedCount = Object.values(sprint1Checks).filter(Boolean).length;

  function toggleCheck(id: string) {
    setSprint1Checks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  return (
    <section aria-labelledby="sequenced-sprints-heading" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="h-4 w-1 rounded-full bg-brand" />
          <h2
            id="sequenced-sprints-heading"
            className="text-base font-bold tracking-tight text-ink"
          >
            Sequenced 90-Day Sprints
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-brand px-2.5 py-0.5 font-bold text-white shadow-sm">
            Phase 1 Active
          </span>
          <span className="text-[#887f74]">Phase 2–4 Locked into Pipeline</span>
        </div>
      </div>

      {/* Sprints List */}
      <div className="space-y-4">
        {GROWTH_SPRINTS.map((sprint) => {
          const isActive = sprint.status === "active";

          return (
            <div
              key={sprint.id}
              className={`rounded-2xl border p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all sm:p-6 ${
                isActive
                  ? "border-[#e6e0d6] bg-white ring-1 ring-brand/20"
                  : "border-[#e6e0d6] bg-white"
              }`}
            >
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
                {/* Left Column (5 cols): Sprint details & Target Success Metric */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Sprint Badge + Weeks */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          isActive
                            ? "bg-brand text-white shadow-sm"
                            : "bg-[#f2ece3] text-[#6b6257]"
                        }`}
                      >
                        {isActive && <span className="size-1.5 rounded-full bg-white" />}
                        {sprint.statusBadge}
                      </span>
                      <span className="text-xs font-semibold text-[#8a8176]">
                        {sprint.weeksLabel}
                      </span>
                    </div>

                    {/* Sprint Title & Description */}
                    <h3 className="mt-2.5 text-base font-bold text-ink leading-snug">
                      {sprint.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-[#6e655b] leading-relaxed">
                      {sprint.description}
                    </p>
                  </div>

                  {/* Target Success Metric Box */}
                  <div className="rounded-xl border border-[#ede6dc] bg-[#faf8f4] p-3.5">
                    <p className="text-[10px] font-bold tracking-wider uppercase text-[#887f74]">
                      TARGET SUCCESS METRIC
                    </p>
                    <div className="mt-1 flex items-baseline justify-between text-xs">
                      <span className="font-medium text-[#70665c]">
                        {sprint.targetMetric.label}
                      </span>
                      <span className="font-bold text-brand">
                        {sprint.targetMetric.valueFormatted}
                      </span>
                    </div>

                    {sprint.targetMetric.progressPct !== undefined && (
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#eee8de]">
                        <div
                          className="h-full rounded-full bg-brand transition-all duration-500"
                          style={{ width: `${sprint.targetMetric.progressPct}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column (7 cols): Prescribed Production Action Checklist */}
                <div className="lg:col-span-7 flex flex-col justify-between rounded-xl border border-[#ede7dd] bg-[#faf8f4] p-4 sm:p-5">
                  {/* Checklist Header */}
                  <div className="flex items-center justify-between border-b border-[#ece5da] pb-3 text-xs">
                    <span className="font-bold text-ink">
                      Prescribed Production Action Checklist
                    </span>
                    <span className="font-semibold text-[#80766c]">
                      {sprint.sprintNumber === 1
                        ? `${sprint1AppliedCount} of ${sprint1Total} Applied`
                        : sprint.checklistMeta}
                    </span>
                  </div>

                  {/* Checklist Items */}
                  {sprint.checklist && sprint.checklist.length > 0 ? (
                    <div className="mt-3.5 space-y-3">
                      {sprint.checklist.map((item) => {
                        const isChecked =
                          sprint.sprintNumber === 1
                            ? sprint1Checks[item.id] ?? false
                            : item.completed;

                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              if (sprint.sprintNumber === 1) {
                                toggleCheck(item.id);
                              }
                            }}
                            className={`flex items-start gap-3 rounded-xl border p-3 transition-all ${
                              sprint.sprintNumber === 1
                                ? "cursor-pointer hover:border-brand/40 bg-white"
                                : "bg-white/70"
                            } ${
                              isChecked
                                ? "border-brand/30 bg-brand/[0.02]"
                                : "border-[#ede7dd]"
                            }`}
                          >
                            {/* Icon Indicator */}
                            <div className="mt-0.5 shrink-0">
                              {sprint.sprintNumber === 1 ? (
                                <button
                                  type="button"
                                  className={`grid size-4 place-items-center rounded ${
                                    isChecked
                                      ? "bg-brand text-white shadow-sm"
                                      : "border border-[#c7beb3] bg-white"
                                  }`}
                                  aria-label="Toggle checklist item"
                                >
                                  {isChecked && (
                                    <Icon name="check" className="size-3 text-white" />
                                  )}
                                </button>
                              ) : item.statusIcon === "clock" ? (
                                <div className="grid size-4 place-items-center text-[#968d83]">
                                  <Icon name="clock" className="size-3.5" />
                                </div>
                              ) : (
                                <div className="grid size-4 place-items-center text-[#968d83]">
                                  <Icon name="lock" className="size-3.5" />
                                </div>
                              )}
                            </div>

                            {/* Item Text */}
                            <div className="min-w-0 flex-1">
                              <h4
                                className={`text-xs font-bold ${
                                  isChecked ? "text-ink" : "text-[#4d453c]"
                                }`}
                              >
                                {item.title}
                              </h4>
                              <p className="mt-1 text-xs text-[#736a60] leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Locked state for Sprint 4 */
                    <div className="my-6 flex flex-col items-center justify-center text-center px-4">
                      <div className="grid size-10 place-items-center rounded-xl bg-black/5 text-[#887f74]">
                        <Icon name="layers" className="size-5" />
                      </div>
                      <h4 className="mt-3 text-xs font-bold text-ink">
                        {sprint.checklistMeta}
                      </h4>
                      <p className="mt-1 max-w-sm text-xs text-[#7a7167] leading-relaxed">
                        {sprint.unlockMessage}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
