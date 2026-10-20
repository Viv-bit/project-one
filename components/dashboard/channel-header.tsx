"use client";

import { useState } from "react";
import { Icon } from "@/components/ui";
import { CHANNEL_PROFILE } from "@/lib/data/intelligence-mock-data";

export function ChannelHeader() {
  const [baselineOption, setBaselineOption] = useState("Past 50 Posts Baseline");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  const baselineOptions = [
    "Past 50 Posts Baseline",
    "Past 30 Days Ingestion",
    "Top 20 Long-form Only",
    "Shorts & Verticals Only",
  ];

  function handleExport(format: "PDF" | "CSV") {
    setExportFeedback(`Exporting ${format} audit report...`);
    setTimeout(() => {
      setExportFeedback(`${format} report generated successfully!`);
      setTimeout(() => setExportFeedback(null), 3500);
    }, 900);
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#e6e0d6] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Creator Channel Identity */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-gradient-to-br from-amber-700 via-stone-800 to-ink shadow-md">
            <div className="grid h-full w-full place-items-center text-white">
              <Icon name="video" className="size-6 text-amber-200" />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-ink">
                {CHANNEL_PROFILE.name}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                <Icon name="check" className="size-3 text-emerald-600" />
                Partner
              </span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#786f65]">
              <span className="font-medium text-ink">{CHANNEL_PROFILE.handle}</span>
              <span>·</span>
              <span>{CHANNEL_PROFILE.subscribers}</span>
              <span>·</span>
              <span>{CHANNEL_PROFILE.lastIngested}</span>
              <span>·</span>
              <span className="rounded bg-[#f5efe6] px-1.5 py-0.5 text-[11px] font-medium text-[#736a60]">
                Niche: {CHANNEL_PROFILE.niche}
              </span>
            </div>
          </div>
        </div>

        {/* Right Status & Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Live Ingestion Indicator */}
          <div className="flex items-center gap-2 rounded-xl bg-[#faf7f2] border border-[#e8e2d8] px-3 py-1.5 text-xs font-medium text-[#6b6257]">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span>{CHANNEL_PROFILE.status}</span>
          </div>

          {/* Baseline Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="inline-flex items-center gap-2 rounded-xl border border-[#e4ddd4] bg-white px-3.5 py-1.5 text-xs font-medium text-ink shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-[#faf7f3]"
            >
              <span>{baselineOption}</span>
              <Icon name="chevron-down" className="size-3.5 text-[#887f74]" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-10 z-20 w-56 rounded-xl border border-line bg-white p-1.5 shadow-xl animate-in fade-in">
                {baselineOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setBaselineOption(opt);
                      setDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                      baselineOption === opt
                        ? "bg-brand/10 font-semibold text-brand"
                        : "text-muted hover:bg-cream hover:text-ink"
                    }`}
                  >
                    <span>{opt}</span>
                    {baselineOption === opt && (
                      <Icon name="check" className="size-3 text-brand" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export PDF / CSV Button */}
          <div className="relative">
            <button
              onClick={() => handleExport("PDF")}
              className="inline-flex items-center gap-2 rounded-xl border border-[#e4ddd4] bg-white px-3.5 py-1.5 text-xs font-semibold text-ink shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all hover:border-brand/40 hover:bg-[#faf7f3]"
            >
              <Icon name="download" className="size-3.5 text-[#887f74]" />
              <span>Export PDF / CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Export notification toast */}
      {exportFeedback && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-medium text-emerald-800 animate-in fade-in">
          <Icon name="check-circle" className="size-4 text-emerald-600" />
          <span>{exportFeedback}</span>
        </div>
      )}
    </div>
  );
}
