"use client";

import { useState } from "react";
import { Icon } from "@/components/ui";
import type { RoadmapHorizonFilter } from "@/lib/types/creator-intelligence";

type RoadmapFiltersProps = {
  activeHorizon: RoadmapHorizonFilter;
  onSelectHorizon: (h: RoadmapHorizonFilter) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
};

const HORIZON_TABS: { id: RoadmapHorizonFilter; label: string; count?: number }[] = [
  { id: "all", label: "All Horizons", count: 11 },
  { id: "mvp", label: "Live in MVP", count: 3 },
  { id: "in_dev", label: "In Development", count: 3 },
  { id: "q4_planned", label: "Q4 Planned", count: 3 },
  { id: "future", label: "Future" },
];

export function RoadmapFilters({
  activeHorizon,
  onSelectHorizon,
  searchQuery,
  onSearchChange,
}: RoadmapFiltersProps) {
  const [framework, setFramework] = useState("Deterministic Framework");
  const [frameworkOpen, setFrameworkOpen] = useState(false);

  const frameworks = [
    "Deterministic Framework",
    "Bayesian Hypothesis Engine",
    "Neural Video Representation",
  ];

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-[#e6e0d6] pb-4">
      {/* Left Horizon Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {HORIZON_TABS.map((tab) => {
          const isActive = activeHorizon === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectHorizon(tab.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                isActive
                  ? "bg-ink text-white shadow-sm"
                  : "bg-white/80 border border-[#e4ddd4] text-[#6b6257] hover:bg-white hover:text-ink"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`rounded-full px-1.5 text-[10px] ${
                    isActive ? "bg-white/20 text-white" : "bg-[#f2ece3] text-[#786f65]"
                  }`}
                >
                  ({tab.count})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Right Search & Framework Selector */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search input */}
        <div className="relative min-w-[240px]">
          <Icon
            name="search"
            className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#91877c]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search road map initiatives..."
            className="w-full rounded-xl border border-[#e4ddd4] bg-white py-1.5 pl-9 pr-3 text-xs text-ink placeholder:text-[#9c9388] focus:border-brand focus:outline-none"
          />
        </div>

        {/* Framework Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setFrameworkOpen(!frameworkOpen)}
            className="inline-flex items-center gap-2 rounded-xl border border-[#e4ddd4] bg-white px-3 py-1.5 text-xs font-medium text-ink shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:bg-[#faf7f3]"
          >
            <span className="size-2 rounded-full bg-brand" />
            <span className="font-semibold">{framework}</span>
            <Icon name="chevron-down" className="size-3 text-muted" />
          </button>

          {frameworkOpen && (
            <div className="absolute right-0 top-10 z-30 w-56 rounded-xl border border-line bg-white p-1.5 shadow-xl animate-in fade-in">
              {frameworks.map((fw) => (
                <button
                  key={fw}
                  onClick={() => {
                    setFramework(fw);
                    setFrameworkOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    framework === fw
                      ? "bg-brand/10 font-semibold text-brand"
                      : "text-muted hover:bg-cream hover:text-ink"
                  }`}
                >
                  <span>{fw}</span>
                  {framework === fw && (
                    <Icon name="check" className="size-3 text-brand" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
