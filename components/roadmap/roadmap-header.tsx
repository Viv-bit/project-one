"use client";

import { useState } from "react";
import { Icon } from "@/components/ui";

type RoadmapHeaderProps = {
  onOpenSubmitRequest: () => void;
  onOpenChangelog: () => void;
};

export function RoadmapHeader({
  onOpenSubmitRequest,
  onOpenChangelog,
}: RoadmapHeaderProps) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div>
        {/* Top Live Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#e6dfd5] bg-white/80 px-3 py-1 text-xs font-medium text-[#6e655a] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>v0.9.4 Beta Live</span>
          <span className="text-[#c7bfb4]">·</span>
          <span className="font-semibold text-ink">
            Next Major Release: Multi-Platform Sync in Q3
          </span>
          <Icon name="arrow-right" className="size-3 text-brand -rotate-45" />
        </div>

        {/* Category Kicker */}
        <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
          ENGINEERING DIRECTION / PUBLIC MASTER PIPELINE
        </p>

        {/* Main Title */}
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-normal tracking-tight text-ink">
          Product Roadmap &amp; Engineering Vision
        </h1>

        {/* Description */}
        <p className="mt-2 max-w-3xl text-sm sm:text-[15px] leading-relaxed text-[#756c62]">
          Built transparently with our creator community. Track upcoming intelligence engines,
          audit feature drops, and vote directly on what our research team builds next.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex shrink-0 flex-wrap items-center gap-3 pt-1">
        <button
          onClick={onOpenChangelog}
          className="inline-flex items-center gap-2 rounded-xl border border-[#e4ddd4] bg-white px-3.5 py-2 text-xs font-semibold text-ink shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all hover:bg-[#faf7f3]"
        >
          <Icon name="refresh" className="size-3.5 text-[#887f74]" />
          <span>Changelog Archive</span>
        </button>

        <button
          onClick={onOpenSubmitRequest}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(224,124,58,0.28)] transition-all hover:bg-brand-strong"
        >
          <Icon name="spark" className="size-3.5" />
          <span>Submit Feature Request</span>
        </button>
      </div>
    </div>
  );
}
