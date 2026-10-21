"use client";

import { useState } from "react";
import { Icon } from "@/components/ui";
import { ROADMAP_ITEMS } from "@/lib/data/intelligence-mock-data";
import type {
  RoadmapCardItem,
  RoadmapColumnKey,
  RoadmapHorizonFilter,
} from "@/lib/types/creator-intelligence";

type RoadmapKanbanBoardProps = {
  activeHorizon: RoadmapHorizonFilter;
  searchQuery: string;
  onOpenProposeFeature: () => void;
};

type ColumnConfig = {
  key: RoadmapColumnKey;
  title: string;
  badgeLabel: string;
  badgeVariant?: "neutral" | "orange";
  subtitle: string;
};

const COLUMNS: ColumnConfig[] = [
  {
    key: "shipping",
    title: "Now Shipping",
    badgeLabel: "Phase 2 -> 4",
    subtitle: "Deterministic statistical baseline & YouTube data rails.",
  },
  {
    key: "up_next",
    title: "Up Next · Q3",
    badgeLabel: "Active Sprint",
    badgeVariant: "orange",
    subtitle: "Multi-channel telemetry and experiment orchestration.",
  },
  {
    key: "planned",
    title: "Planned · Q4",
    badgeLabel: "Upcoming",
    subtitle: "Vision models, pacing diagnostics, and multi-format unification.",
  },
  {
    key: "future",
    title: "Future Horizons",
    badgeLabel: "Community",
    subtitle: "Open candidate pool prioritized exclusively by creator votes.",
  },
];

export function RoadmapKanbanBoard({
  activeHorizon,
  searchQuery,
  onOpenProposeFeature,
}: RoadmapKanbanBoardProps) {
  const [items, setItems] = useState<RoadmapCardItem[]>(ROADMAP_ITEMS);
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({});

  function handleVote(id: string) {
    const isVoted = votedMap[id];
    setVotedMap((prev) => ({ ...prev, [id]: !isVoted }));
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const currentVotes = item.votes ?? 0;
          return {
            ...item,
            votes: isVoted ? currentVotes - 1 : currentVotes + 1,
          };
        }
        return item;
      }),
    );
  }

  // Filter items based on active horizon and search query
  const filteredItems = items.filter((item) => {
    if (activeHorizon !== "all" && item.horizon !== activeHorizon) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.footerTag && item.footerTag.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {COLUMNS.map((col) => {
        const colItems = filteredItems.filter((i) => i.column === col.key);

        return (
          <div key={col.key} className="flex flex-col">
            {/* Column Header */}
            <div className="mb-3.5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-ink">{col.title}</h2>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    col.badgeVariant === "orange"
                      ? "bg-brand/15 text-brand border border-brand/20"
                      : "bg-[#ece5da] text-[#70675c]"
                  }`}
                >
                  {col.badgeLabel}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-[#786f65] leading-snug">
                {col.subtitle}
              </p>
            </div>

            {/* Column Cards */}
            <div className="space-y-3.5 flex-1">
              {colItems.map((card) => {
                const hasVoted = votedMap[card.id];

                return (
                  <div
                    key={card.id}
                    className="group rounded-2xl border border-[#e6e0d6] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:border-brand/40 hover:shadow-md"
                  >
                    {/* Top Row: Status badge & Vote button */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
                          card.statusBadgeVariant === "brand"
                            ? "bg-brand/10 text-brand"
                            : card.statusBadgeVariant === "purple"
                            ? "bg-purple-100 text-purple-700"
                            : card.statusBadgeVariant === "amber"
                            ? "bg-amber-100 text-amber-800"
                            : card.statusBadgeVariant === "green"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-[#f2ece3] text-[#7a7167]"
                        }`}
                      >
                        {card.statusBadge}
                      </span>

                      {/* Upvote Button */}
                      {card.votes !== undefined && (
                        <button
                          onClick={() => handleVote(card.id)}
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold transition-all ${
                            hasVoted
                              ? "bg-brand text-white shadow-sm scale-105"
                              : "bg-[#faf7f2] border border-[#e8e2d8] text-[#7a7167] hover:border-brand/50 hover:text-ink"
                          }`}
                        >
                          <Icon
                            name="arrow-up"
                            className={`size-3 ${
                              hasVoted ? "text-white" : "text-brand"
                            }`}
                          />
                          <span>{card.votes}</span>
                        </button>
                      )}
                    </div>

                    {/* Card Title & Description */}
                    <h3 className="mt-2.5 text-xs font-bold text-ink leading-snug group-hover:text-brand transition-colors">
                      {card.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-[#70675c] leading-relaxed line-clamp-4">
                      {card.description}
                    </p>

                    {/* Progress Bar (if applicable) */}
                    {card.progressPct !== undefined && (
                      <div className="mt-3">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#eee7dd]">
                          <div
                            className="h-full rounded-full bg-brand"
                            style={{ width: `${card.progressPct}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Card Footer / Metadata */}
                    <div className="mt-3 flex items-center justify-between text-[11px] text-[#857b71] border-t border-[#f2ede4] pt-2">
                      <span className="font-medium truncate max-w-[170px]">
                        {card.footerTag ?? card.progressLabel}
                      </span>
                      {card.sprintMeta ? (
                        <span className="font-mono text-[10px] text-[#9c9388]">
                          {card.sprintMeta}
                        </span>
                      ) : null}
                    </div>

                    {/* Sub-note */}
                    {card.subNote && (
                      <p className="mt-1 text-[10px] text-[#9c9388] italic">
                        {card.subNote}
                      </p>
                    )}
                  </div>
                );
              })}

              {/* Edge Case Callout Card in Future Horizons */}
              {col.key === "future" && (
                <div className="rounded-2xl border-2 border-dashed border-[#dcd4c7] bg-[#fbf9f6] p-4 text-center">
                  <h3 className="text-xs font-bold text-ink">
                    Have an edge case?
                  </h3>
                  <p className="mt-1 text-[11px] text-[#736a60] leading-relaxed">
                    Submit a raw hypothesis. Lumen engineering evaluates weekly for creator impact.
                  </p>
                  <button
                    onClick={onOpenProposeFeature}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                  >
                    <span>Propose Feature</span>
                    <Icon name="arrow-right" className="size-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
