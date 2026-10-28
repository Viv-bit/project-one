"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui";
import { startYouTubeOAuth } from "@/lib/youtube";
import { YouTubePermissionsModal } from "@/components/youtube/youtube-permissions-modal";

type DashboardConnectBannerProps = {
  onDemoToggle?: () => void;
  isDemoMode?: boolean;
};

export function DashboardConnectBanner({
  onDemoToggle,
  isDemoMode,
}: DashboardConnectBannerProps) {
  const [showPermissions, setShowPermissions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative overflow-hidden rounded-2xl border border-[#eedfce] bg-gradient-to-br from-white via-[#fffaf5] to-[#fbf4eb] p-6 shadow-[0_4px_20px_rgba(224,124,58,0.06)] transition-all sm:p-7"
      >
        {/* Ambient Gradient Glows */}
        <div className="pointer-events-none absolute -top-20 -right-20 size-72 rounded-full bg-red-500/10 blur-3xl transition-opacity duration-700" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 size-72 rounded-full bg-brand/10 blur-3xl transition-opacity duration-700" />

        <div className="relative z-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Left Copy & Value Props */}
            <div className="max-w-3xl space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-xl bg-[#e62117] text-white shadow-[0_4px_12px_rgba(230,33,23,0.3)]">
                  <Icon name="youtube" className="size-5" />
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                  <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                  YouTube Account Required
                </span>
                <span className="rounded-full bg-[#f4ece1] px-2.5 py-0.5 text-[11px] font-medium text-[#7d7367]">
                  First Time Setup
                </span>
              </div>

              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-ink">
                  Connect Your YouTube Channel to Unlock Creator Intelligence
                </h2>
                <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-[#6d6357]">
                  Your dashboard is currently in an empty state. Link your YouTube channel with official Google OAuth to ingest your uploads, calculate second-by-second retention drop-offs, and unlock automated title &amp; hook experiments.
                </p>
              </div>

              {/* 3 Value Pillars */}
              <div className="grid grid-cols-1 gap-2.5 pt-2 sm:grid-cols-3">
                <div className="flex items-center gap-2 rounded-xl bg-white/80 border border-[#e8ded0] px-3 py-2 text-xs text-[#5c5348] backdrop-blur-sm">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Icon name="shield" className="size-3" />
                  </span>
                  <span className="font-medium">100% Read-Only Access</span>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white/80 border border-[#e8ded0] px-3 py-2 text-xs text-[#5c5348] backdrop-blur-sm">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-brand/10 text-brand border border-brand/20">
                    <Icon name="activity" className="size-3" />
                  </span>
                  <span className="font-medium">0–3s Hook Drop-Off Curves</span>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white/80 border border-[#e8ded0] px-3 py-2 text-xs text-[#5c5348] backdrop-blur-sm">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                    <Icon name="users" className="size-3" />
                  </span>
                  <span className="font-medium">Peer Cohort Benchmarking</span>
                </div>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
              <button
                onClick={() => startYouTubeOAuth()}
                className="group relative inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#e62117] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(230,33,23,0.32)] transition-all hover:bg-[#cc1810] hover:shadow-[0_8px_24px_rgba(230,33,23,0.4)] active:scale-[0.98]"
              >
                <Icon name="youtube" className="size-5 transition-transform group-hover:scale-110" />
                <span>Connect YouTube Channel</span>
                <Icon
                  name="arrow-right"
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                />
              </button>

              <button
                type="button"
                onClick={() => setShowPermissions(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#ded4c6] bg-white px-4 py-2 text-xs font-semibold text-[#5c5348] shadow-sm transition-colors hover:bg-[#faf7f2] hover:text-ink"
              >
                <Icon name="info" className="size-3.5 text-[#887f74]" />
                <span>Permissions &amp; Security</span>
              </button>

              {onDemoToggle && (
                <button
                  type="button"
                  onClick={onDemoToggle}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#d8cdbd] px-3 py-1.5 text-[11px] font-medium text-[#7a7165] hover:border-brand/40 hover:text-brand transition-colors"
                  title="Toggle sample populated dashboard preview"
                >
                  <Icon name="refresh-cw" className="size-3" />
                  <span>{isDemoMode ? "Show Empty State" : "Preview Populated Dashboard"}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <YouTubePermissionsModal
        isOpen={showPermissions}
        onClose={() => setShowPermissions(false)}
      />
    </>
  );
}
