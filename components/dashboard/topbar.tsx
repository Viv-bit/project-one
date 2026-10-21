"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui";
import { CommandPalette } from "@/components/dashboard/command-palette";

type TopbarProps = {
  onOpenMobileMenu: () => void;
};

export function Topbar({ onOpenMobileMenu }: TopbarProps) {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#e6e0d6] bg-[#faf7f2]/90 px-4 sm:px-6 backdrop-blur-md">
        {/* Left Side: Mobile Menu Trigger + Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden rounded-lg p-1.5 text-muted hover:bg-black/5 hover:text-ink"
            aria-label="Open sidebar"
          >
            <Icon name="layers" className="size-5" />
          </button>

          {/* Quick Search Box Button */}
          <button
            onClick={() => setIsCommandOpen(true)}
            className="group flex w-full max-w-md items-center justify-between rounded-xl border border-[#e4ddd4] bg-white/80 px-3.5 py-1.5 text-xs text-muted shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all hover:border-brand/40 hover:bg-white"
          >
            <div className="flex items-center gap-2">
              <Icon
                name="search"
                className="size-3.5 text-[#91877c] transition-colors group-hover:text-brand"
              />
              <span className="truncate text-[#80766c] text-[12px]">
                Quick search models, tags, metrics...
              </span>
            </div>
            <kbd className="hidden sm:inline-flex rounded border border-[#e4ddd4] bg-[#f5f1ea] px-1.5 py-0.5 text-[10px] font-mono font-medium text-[#7d7469]">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Side: Guide + Notifications + User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Guide Button */}
          <div className="relative">
            <button
              onClick={() => setIsGuideOpen(!isGuideOpen)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#e4ddd4] bg-white/70 px-2.5 py-1.5 text-xs font-medium text-[#5c544c] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors hover:bg-white hover:text-ink"
            >
              <Icon name="help-circle" className="size-3.5 text-[#8f857a]" />
              <span className="hidden sm:inline">Guide</span>
            </button>

            {isGuideOpen && (
              <div className="absolute right-0 top-11 z-40 w-72 rounded-xl border border-line bg-white p-3.5 shadow-xl animate-in fade-in">
                <div className="flex items-center justify-between border-b border-line pb-2">
                  <h4 className="text-xs font-semibold text-ink">Lumen Creator Intelligence</h4>
                  <button onClick={() => setIsGuideOpen(false)} className="text-muted hover:text-ink">
                    <Icon name="x" className="size-3.5" />
                  </button>
                </div>
                <div className="mt-2.5 space-y-2 text-[11px] text-muted">
                  <p>
                    <strong className="text-ink">0-3s Hook Hold Rate:</strong> Measures audience retention during critical thesis delivery.
                  </p>
                  <p>
                    <strong className="text-ink">Deterministic Framework:</strong> Rigorous regression testing on your past 50 video uploads.
                  </p>
                  <Link
                    href="/dashboard/growth-plan"
                    onClick={() => setIsGuideOpen(false)}
                    className="inline-flex items-center gap-1 text-brand font-semibold hover:underline"
                  >
                    View Growth Plan &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative rounded-lg p-2 text-[#70675e] transition-colors hover:bg-black/5 hover:text-ink"
              aria-label="Notifications"
            >
              <Icon name="bell" className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-brand ring-2 ring-[#faf7f2]" />
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 top-11 z-40 w-80 rounded-xl border border-line bg-white p-3 shadow-xl animate-in fade-in">
                <div className="flex items-center justify-between border-b border-line pb-2">
                  <h4 className="text-xs font-semibold text-ink">Recent Intelligence Alerts</h4>
                  <button onClick={() => setIsNotificationsOpen(false)} className="text-muted hover:text-ink">
                    <Icon name="x" className="size-3.5" />
                  </button>
                </div>
                <div className="mt-2 space-y-2.5">
                  <div className="rounded-lg bg-cream/70 p-2 text-[11px]">
                    <div className="flex items-center justify-between font-semibold text-ink">
                      <span>YouTube Ingestion Complete</span>
                      <span className="text-[10px] text-muted font-normal">12m ago</span>
                    </div>
                    <p className="mt-0.5 text-muted">
                      Uploaded &ldquo;The $2,000 Minimalist Desk&rdquo; processed with 82.4% hook hold rate.
                    </p>
                  </div>
                  <div className="rounded-lg bg-white p-2 text-[11px] border border-line">
                    <div className="flex items-center justify-between font-semibold text-ink">
                      <span>Roadmap Sprint 16 Update</span>
                      <span className="text-[10px] text-muted font-normal">Yesterday</span>
                    </div>
                    <p className="mt-0.5 text-muted">
                      TikTok Creator API &amp; Curve Analyzer reached 382 creator votes.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2 pl-1">
            <button
              className="flex items-center gap-2 rounded-full p-0.5 focus:outline-none focus:ring-2 focus:ring-brand/40"
              aria-label="User account"
            >
              <div className="relative size-8 overflow-hidden rounded-full border border-[#d8d0c4] bg-[#ebdccb] shadow-sm">
                <div className="grid h-full w-full place-items-center text-xs font-bold text-[#5c4a37]">
                  NC
                </div>
                <span className="absolute bottom-0 right-0 size-2 rounded-full bg-emerald-500 ring-1 ring-white" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />
    </>
  );
}
