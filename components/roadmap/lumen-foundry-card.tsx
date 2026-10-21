"use client";

import { Icon } from "@/components/ui";

export function LumenFoundryCard() {
  return (
    <div className="rounded-2xl border border-[#e6e0d6] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sm:p-6 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-[#f2ede4] pb-3">
          <span className="grid size-6 place-items-center rounded-lg bg-brand/10 text-brand">
            <Icon name="users" className="size-3.5" />
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-ink">Lumen Foundry</span>
            <span className="text-[10px] text-[#8a8176]">
              Creator Co-Design Collective
            </span>
          </div>
        </div>

        {/* Narrative */}
        <p className="mt-3 text-xs sm:text-[13px] leading-relaxed text-[#665e55]">
          Every feature on our roadmap stems from weekly office hours with creators producing
          50k+ views monthly. We never build speculative fluff.
        </p>

        {/* 3 Metric Pills */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between rounded-xl border border-[#ede7dd] bg-[#faf8f4] px-3 py-2 text-xs">
            <span className="text-[#786f65]">Community Votes This Cycle</span>
            <span className="font-mono font-bold text-ink">4,120</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-[#ede7dd] bg-[#faf8f4] px-3 py-2 text-xs">
            <span className="text-[#786f65]">Engineers In Discord</span>
            <span className="font-mono font-bold text-ink">6 Full-time</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-[#ede7dd] bg-[#faf8f4] px-3 py-2 text-xs">
            <span className="text-[#786f65]">Median Time: Idea &rarr; Beta</span>
            <span className="font-mono font-bold text-brand">18 Days</span>
          </div>
        </div>
      </div>

      {/* Discord CTA & Live notes */}
      <div className="mt-5 pt-3">
        <a
          href="https://discord.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-2.5 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(224,124,58,0.28)] transition-all hover:bg-brand-strong"
        >
          <Icon name="message-square" className="size-4" />
          <span>Join Creator Discord (1,240 Members)</span>
        </a>
        <p className="mt-2 text-center text-[11px] text-[#8e857b]">
          Weekly live builds &amp; open RFC feedback on Mondays.
        </p>
      </div>
    </div>
  );
}
