"use client";

import Link from "next/link";
import { Icon } from "@/components/ui";

export function ExperimentPendingCard() {
  return (
    <Link
      href="/dashboard/growth-plan"
      className="group flex items-center justify-between rounded-2xl border border-[#e6e0d6] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:border-brand/50 hover:bg-[#faf7f3]"
    >
      <div className="flex items-center gap-3">
        <div className="grid size-9 place-items-center rounded-xl bg-brand/10 text-brand transition-transform group-hover:scale-105">
          <Icon name="flask" className="size-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-ink">
            <span>Experiment Backlog</span>
            <Icon
              name="arrow-right"
              className="size-3 text-muted transition-transform group-hover:translate-x-1 group-hover:text-brand"
            />
          </div>
          <p className="text-[11px] text-[#7d7469]">
            6 planned tests pending review
          </p>
        </div>
      </div>

      <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[11px] font-bold text-brand">
        Review &rarr;
      </span>
    </Link>
  );
}
