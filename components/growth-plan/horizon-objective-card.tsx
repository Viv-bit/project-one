"use client";

import { Icon } from "@/components/ui";
import { HORIZON_OBJECTIVE } from "@/lib/data/growth-plan-mock-data";

export type HorizonObjectiveCardProps = {
  currentSubscribers?: number;
  targetSubscribers?: number;
  title?: string;
  targetBadge?: string;
  pacingRunRate?: string;
  channelLaunchBaseline?: string;
  requiredNet?: string;
  progressPercent?: number;
};

export function HorizonObjectiveCard({
  currentSubscribers,
  targetSubscribers,
  title,
  targetBadge,
  pacingRunRate,
  channelLaunchBaseline,
  requiredNet,
  progressPercent,
}: HorizonObjectiveCardProps) {
  const currentSubs = currentSubscribers ?? HORIZON_OBJECTIVE.currentSubscribers;
  const targetSubs = targetSubscribers ?? HORIZON_OBJECTIVE.targetSubscribers;
  const pct =
    progressPercent !== undefined
      ? progressPercent
      : Math.min(100, Math.max(5, (currentSubs / targetSubs) * 100));

  const displayTitle =
    title ??
    (targetSubs
      ? `Breakthrough to ${targetSubs.toLocaleString()} Verified Subscribers`
      : HORIZON_OBJECTIVE.title);

  const displayBadge = targetBadge ?? HORIZON_OBJECTIVE.targetBadge;
  const displayPacing = pacingRunRate ?? HORIZON_OBJECTIVE.pacingRunRate;
  const displayBaseline =
    channelLaunchBaseline ??
    (currentSubs
      ? `Current Scale: ${currentSubs.toLocaleString()} subs`
      : HORIZON_OBJECTIVE.channelLaunchBaseline);

  const displayRequired =
    requiredNet ??
    (targetSubs > currentSubs
      ? `Required Net: +${(targetSubs - currentSubs).toLocaleString()}`
      : "Milestone Achieved");

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
                {displayBadge}
              </span>
            </div>

            <h2 className="mt-1 text-lg sm:text-xl font-bold tracking-tight text-ink">
              {displayTitle}
            </h2>

            <p className="mt-0.5 text-xs text-[#786f65]">
              {displayPacing}
            </p>
          </div>
        </div>

        {/* Right: Progress Meter & Net Required */}
        <div className="w-full lg:max-w-md">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-[#80766c]">Progress Baseline</span>
            <span className="font-mono text-ink">
              {currentSubs.toLocaleString()} /{" "}
              {targetSubs.toLocaleString()} ({pct.toFixed(1)}%)
            </span>
          </div>

          {/* Progress Bar Track */}
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#ece5da]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand to-amber-500 transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(2, pct))}%` }}
            />
          </div>

          {/* Bottom Metas */}
          <div className="mt-2 flex items-center justify-between text-[11px] text-[#8e857b]">
            <span>{displayBaseline}</span>
            <span className="font-medium text-[#70665b]">
              {displayRequired}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
