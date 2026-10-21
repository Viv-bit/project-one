"use client";

import { Icon } from "@/components/ui";
import { SHIPPING_COMMITS } from "@/lib/data/intelligence-mock-data";

export function RecentCommitsFeed() {
  return (
    <div className="rounded-2xl border border-[#e6e0d6] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-[#f2ede4] pb-3.5">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-lg bg-[#faf7f2] border border-[#e8e2d8] text-[#7a7167]">
            <Icon name="git-commit" className="size-3.5" />
          </span>
          <h2 className="text-sm font-bold text-ink">
            Recent Shipping Commits &amp; Model Updates
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#8a8176]">
          <span className="size-2 rounded-full bg-emerald-500" />
          <span>Synchronized with GitHub production repo</span>
        </div>
      </div>

      {/* 3 Commits Grid */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {SHIPPING_COMMITS.map((com) => (
          <div
            key={com.id}
            className="flex flex-col justify-between rounded-xl border border-[#ede7dd] bg-[#faf8f4] p-3.5 transition-all hover:border-brand/40"
          >
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-ink">{com.version}</span>
                <span className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-[10px] text-muted">
                  {com.commitHash}
                </span>
              </div>
              <p className="mt-2 text-xs text-[#6e655b] leading-relaxed">
                {com.description}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-[#ede7dd]/80">
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                  com.tagColor === "green"
                    ? "text-emerald-700"
                    : com.tagColor === "purple"
                    ? "text-purple-700"
                    : "text-brand"
                }`}
              >
                {com.highlightTag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
