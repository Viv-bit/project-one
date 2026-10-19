"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { startYouTubeOAuth } from "@/lib/youtube";
import { YouTubePermissionsModal } from "./youtube-permissions-modal";

export function YouTubeConnectCard() {
  const [showPermissions, setShowPermissions] = useState(false);

  return (
    <>
      <div className="relative overflow-hidden rounded-[24px] border border-line bg-gradient-to-br from-white via-cream to-[#fdf9f4] p-6 shadow-sm transition-all sm:p-8">
        {/* Glow accent */}
        <div className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-red-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-brand/10 blur-3xl" />

        <div className="relative z-10">
          {/* Header row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-red-500 text-white shadow-[0_8px_20px_rgba(239,68,68,0.28)]">
                <Icon name="youtube" className="size-6" />
              </span>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-ink">
                  YouTube Channel Connection
                </h3>
                <p className="text-xs text-muted">
                  Official Google OAuth 2.0 Integration
                </p>
              </div>
            </div>
            <Badge variant="neutral">Not Connected</Badge>
          </div>

          {/* Description */}
          <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-muted max-w-2xl">
            Connect your YouTube channel to empower Lumen with your video analytics.
            We calculate second-by-second audience retention drop-offs, benchmark your
            first 30-second retention hooks, and suggest data-backed video title experiments.
          </p>

          {/* Value props */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-start gap-2.5 rounded-xl border border-line bg-white/80 p-3.5 backdrop-blur-sm">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <Icon name="shield" className="size-3.5" />
              </span>
              <div>
                <h4 className="text-xs font-semibold text-ink">100% Read-Only</h4>
                <p className="mt-0.5 text-[11px] text-muted leading-snug">
                  Zero write or delete access. Strictly viewing permissions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-line bg-white/80 p-3.5 backdrop-blur-sm">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-brand">
                <Icon name="activity" className="size-3.5" />
              </span>
              <div>
                <h4 className="text-xs font-semibold text-ink">Hook Retention Curves</h4>
                <p className="mt-0.5 text-[11px] text-muted leading-snug">
                  Deep analysis of your past 50 uploads and drop-off dips.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-line bg-white/80 p-3.5 backdrop-blur-sm">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <Icon name="spark" className="size-3.5" />
              </span>
              <div>
                <h4 className="text-xs font-semibold text-ink">Smart Experiments</h4>
                <p className="mt-0.5 text-[11px] text-muted leading-snug">
                  Automated title and hook recommendations tailored to you.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              onClick={() => startYouTubeOAuth()}
              leadingIcon={<Icon name="youtube" className="size-5" />}
              className="bg-[#e62117] text-white hover:bg-[#cc1810] shadow-[0_8px_20px_rgba(230,33,23,0.25)]"
            >
              Connect YouTube Channel
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setShowPermissions(true)}
              leadingIcon={<Icon name="info" className="size-4" />}
            >
              Permissions & Security
            </Button>
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
