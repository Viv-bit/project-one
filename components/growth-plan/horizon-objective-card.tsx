"use client";

import { Icon } from "@/components/ui";
import { HORIZON_OBJECTIVE } from "@/lib/data/growth-plan-mock-data";

export function HorizonObjectiveCard() {
  return (
    <div className="rounded-2xl border border-[#e6e0d6] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Trophy + Goal Title */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#faf4ec] border border-[#f0e4d4] text-brand shadow-sm">
            <Icon name="trophy" className="size-7 text-brand" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#887f74]">
                PRIMARY HORIZON OBJECTIVE
              </span>
              <span className="rounded-full bg-brand/10 border border-brand/20 px-2 py-0.5 text-[10px] font-bold text-brand">
                {HORIZON_OBJECTIVE.targetBadge}
              </span>
            </div>

            <h2 className="mt-1 text-lg sm:text-xl font-bold tracking-tight text-ink">
              {HORIZON_OBJECTIVE.title}
            </h2>

            <p className="mt-0.5 text-xs text-[#786f65]">
              {HORIZON_OBJECTIVE.pacingRunRate}
            </p>
          </div>
        </div>

        {/* Right: Progress Meter & Net Required */}
        <div className="w-full lg:max-w-md">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-[#80766c]">Progress Baseline</span>
            <span className="font-mono text-ink">
              {HORIZON_OBJECTIVE.currentSubscribers.toLocaleString()} /{" "}
              {HORIZON_OBJECTIVE.targetSubscribers.toLocaleString()} (
              {HORIZON_OBJECTIVE.progressPercent.toFixed(1)}%)
            </span>
          </div>

          {/* Progress Bar Track */}
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#ece5da]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand to-amber-500 transition-all duration-700"
              style={{ width: `${HORIZON_OBJECTIVE.progressPercent}%` }}
            />
          </div>

          {/* Bottom Metas */}
          <div className="mt-2 flex items-center justify-between text-[11px] text-[#8e857b]">
            <span>{HORIZON_OBJECTIVE.channelLaunchBaseline}</span>
            <span className="font-medium text-[#70665b]">
              {HORIZON_OBJECTIVE.requiredNet}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
