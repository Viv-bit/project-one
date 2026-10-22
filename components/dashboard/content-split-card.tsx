import Link from "next/link";
import { Icon } from "@/components/ui";
import { CONTENT_SPLIT_ITEMS } from "@/lib/data/intelligence-mock-data";

export function ContentSplitCard() {
  return (
    <div className="rounded-2xl border border-[#e6e0d6] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-[#f2ede4] pb-4">
        <div>
          <h2 className="text-base font-semibold text-ink">
            Top vs Underperforming Content Split
          </h2>
          <p className="text-xs text-[#82786e]">
            Direct comparative taxonomy analysis of recent 16 uploads
          </p>
        </div>
        <Link
          href="/dashboard/content"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand transition-colors hover:text-brand-strong"
        >
          <span>View all 16 posts</span>
          <Icon name="arrow-right" className="size-3" />
        </Link>
      </div>

      {/* Side-by-side Video Cards Grid */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CONTENT_SPLIT_ITEMS.map((item) => {
          const isTop = item.type === "top_decile";
          return (
            <div
              key={item.id}
              className={`flex flex-col justify-between rounded-xl border p-4 transition-all ${
                isTop
                  ? "border-emerald-200/80 bg-emerald-50/20 hover:border-emerald-300"
                  : "border-rose-200/80 bg-rose-50/20 hover:border-rose-300"
              }`}
            >
              <div>
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      isTop
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {item.badgeLabel}
                  </span>
                  <span className="text-[11px] font-mono text-[#8c8277]">
                    {item.videoDuration}
                  </span>
                </div>

                {/* Simulated Thumbnail */}
                <div
                  className={`mt-3 flex h-28 w-full flex-col justify-between rounded-lg bg-gradient-to-br ${item.thumbnailGradient} p-3 text-white shadow-inner relative overflow-hidden`}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-mono backdrop-blur-sm">
                      HD 4K
                    </span>
                    <div className="grid size-6 place-items-center rounded-full bg-white/20 backdrop-blur-sm">
                      <Icon name="play" className="size-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-white drop-shadow">
                      {item.title}
                    </p>
                  </div>
                </div>

                {/* Video Title & Metrics */}
                <h3 className="mt-3 text-xs font-bold text-ink truncate">
                  {item.title}
                </h3>
                <p className="mt-0.5 text-xs font-medium text-[#736a60]">
                  {item.viewsFormatted} ·{" "}
                  <span
                    className={`font-semibold ${
                      isTop ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {item.hookHoldRate}
                  </span>
                </p>

                {/* Hook Classification Tags */}
                <div className="mt-3 pt-3 border-t border-[#e8e2d8]/60">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#948b81]">
                    HOOK CLASSIFICATION
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {item.hookTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-[#e2dcce] bg-white px-2 py-0.5 text-[11px] font-medium text-[#5c544c]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
