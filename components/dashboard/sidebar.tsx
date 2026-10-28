"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ui";
import { CHANNEL_PROFILE } from "@/lib/data/intelligence-mock-data";
import { useYouTubeConnection } from "@/lib/youtube-connection-context";
import { startYouTubeOAuth } from "@/lib/youtube";

type NavItem = {
  label: string;
  href: string;
  icon: IconName;
  badge?: string;
  unconnectedBadge?: string;
  exact?: boolean;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const NAVIGATION_GROUPS: NavGroup[] = [
  {
    title: "ANALYTICS ENGINE",
    items: [
      {
        label: "Creator Dashboard",
        href: "/dashboard",
        icon: "layout-dashboard",
        exact: true,
      },
      {
        label: "Content Explorer",
        href: "/dashboard/content",
        icon: "layers",
        badge: "16 Posts",
        unconnectedBadge: "0 Posts",
      },
      {
        label: "Peer Benchmarks",
        href: "/dashboard/benchmarks",
        icon: "users",
        badge: "18 Peers",
        unconnectedBadge: "Locked",
      },
      {
        label: "Evidence & Insights",
        href: "/dashboard/insights",
        icon: "brain",
        badge: "3 Actions",
        unconnectedBadge: "0 Actions",
      },
    ],
  },
  {
    title: "STRATEGY & EXPERIMENTS",
    items: [
      {
        label: "Growth Plan",
        href: "/dashboard/growth-plan",
        icon: "map",
      },
      {
        label: "Experiment Backlog",
        href: "/dashboard/experiments",
        icon: "flask",
        badge: "2 Active",
        unconnectedBadge: "0 Active",
      },
    ],
  },
  {
    title: "INTEGRATIONS",
    items: [
      {
        label: "YouTube Channel",
        href: "/dashboard/youtube",
        icon: "link",
      },
      {
        label: "Ingestion Pipeline",
        href: "/onboarding",
        icon: "refresh-cw",
        badge: "Live",
        unconnectedBadge: "Unlinked",
      },
    ],
  },
];

type SidebarProps = {
  onCloseMobile?: () => void;
};

export function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const { isConnected, channel } = useYouTubeConnection();

  function isItemActive(item: NavItem): boolean {
    if (item.exact) {
      return pathname === item.href;
    }
    if (item.href === "/dashboard/growth-plan") {
      return pathname === "/dashboard/growth-plan" || pathname === "/dashboard/roadmap";
    }
    return pathname.startsWith(item.href) && item.href !== "/dashboard";
  }

  const workspaceName = isConnected
    ? (channel?.title ?? CHANNEL_PROFILE.name)
    : "No Channel Connected";

  const workspaceSubtitle = isConnected
    ? (channel?.handle ?? CHANNEL_PROFILE.ownerName)
    : "Click to link YouTube";

  return (
    <aside className="flex h-full w-64 flex-col justify-between border-r border-[#e6e0d6] bg-[#fbf8f4] text-ink select-none">
      {/* Top Section */}
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-[#e6e0d6]/70 px-5 py-4">
          <Link
            href="/dashboard"
            onClick={onCloseMobile}
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <div className="grid size-8 place-items-center rounded-lg bg-brand text-white shadow-sm transition-transform group-hover:scale-105">
              <Icon name="spark" className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold leading-none tracking-tight text-ink">
                Lumen
              </span>
              <span className="mt-0.5 text-[9px] font-bold tracking-[0.16em] uppercase text-[#92887e]">
                CREATOR INTEL
              </span>
            </div>
          </Link>
          {onCloseMobile ? (
            <button
              onClick={onCloseMobile}
              className="lg:hidden rounded-lg p-1 text-muted hover:bg-black/5"
              aria-label="Close menu"
            >
              <Icon name="x" className="size-4" />
            </button>
          ) : null}
        </div>

        {/* Workspace Switcher */}
        <div className="relative px-3 py-3">
          <button
            onClick={() => setWorkspaceOpen(!workspaceOpen)}
            className="flex w-full items-center justify-between rounded-xl border border-[#e6e0d6] bg-white px-3 py-2 text-left shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:border-brand/40"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#efe9df] text-xs font-semibold text-[#665e55]">
                {isConnected ? (
                  channel?.title ? channel.title.slice(0, 2).toUpperCase() : "NC"
                ) : (
                  <Icon name="youtube" className="size-4 text-[#e62117]" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-ink truncate leading-tight">
                  {workspaceName}
                </p>
                <p className="text-[11px] text-[#857c72] truncate leading-tight mt-0.5">
                  {workspaceSubtitle}
                </p>
              </div>
            </div>
            <Icon
              name="chevrons-up-down"
              className="size-3.5 shrink-0 text-[#968d83]"
            />
          </button>

          {/* Simulated Workspace Switcher dropdown */}
          {workspaceOpen && (
            <div className="absolute left-3 right-3 top-14 z-30 rounded-xl border border-line bg-white p-1.5 shadow-lg animate-in fade-in slide-in-from-top-1">
              <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
                Channel Connection
              </div>
              {isConnected ? (
                <div className="flex items-center justify-between rounded-lg bg-cream/70 px-2 py-1.5 text-xs font-medium text-ink">
                  <span className="truncate">{workspaceName}</span>
                  <Icon name="check" className="size-3.5 text-brand shrink-0" />
                </div>
              ) : (
                <div className="rounded-lg bg-amber-50/80 border border-amber-200/60 p-2 text-xs text-amber-800">
                  <p className="font-semibold">No YouTube Account</p>
                  <p className="mt-0.5 text-[11px] text-amber-700">
                    Connect your channel to sync video telemetry.
                  </p>
                </div>
              )}
              <div className="my-1 border-t border-line" />
              <button
                onClick={() => {
                  setWorkspaceOpen(false);
                  startYouTubeOAuth();
                }}
                className="flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-[#e62117] hover:bg-red-50 transition-colors text-left"
              >
                <Icon name="youtube" className="size-3.5" />
                <span>{isConnected ? "Switch YouTube Channel" : "Connect YouTube Channel"}</span>
              </button>
              <Link
                href="/dashboard/youtube"
                onClick={() => {
                  setWorkspaceOpen(false);
                  onCloseMobile?.();
                }}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-brand hover:bg-brand/5"
              >
                <Icon name="settings" className="size-3" />
                <span>Integration Settings</span>
              </Link>
            </div>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 space-y-4 px-3 py-1 overflow-y-auto">
          {NAVIGATION_GROUPS.map((group) => (
            <div key={group.title}>
              <h2 className="px-3 text-[10px] font-bold tracking-[0.14em] text-[#9b9287] uppercase">
                {group.title}
              </h2>
              <ul className="mt-1.5 space-y-0.5">
                {group.items.map((item) => {
                  const active = isItemActive(item);
                  const badge = isConnected ? item.badge : (item.unconnectedBadge ?? item.badge);
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={onCloseMobile}
                        className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                          active
                            ? "bg-brand text-white shadow-[0_2px_8px_rgba(224,124,58,0.25)] font-semibold"
                            : "text-[#5e564d] hover:bg-[#ede7dc]/60 hover:text-ink"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            name={item.icon}
                            className={`size-4 transition-colors ${
                              active ? "text-white" : "text-[#877e74] group-hover:text-ink"
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>
                        {badge ? (
                          <span
                            className={`rounded px-1.5 py-0.2 text-[9px] font-semibold ${
                              active
                                ? "bg-white/20 text-white"
                                : "bg-black/5 text-muted"
                            }`}
                          >
                            {badge}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Section: Data Compute meter & Settings/Version */}
      <div className="border-t border-[#e6e0d6]/80 p-3.5">
        {/* Data Compute Meter */}
        <div className="rounded-xl border border-[#e6e0d6] bg-white/70 p-3 backdrop-blur-sm">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-[#7a7268]">Data Compute</span>
            <span className="font-mono font-semibold text-ink">
              {isConnected
                ? `${CHANNEL_PROFILE.computeUsed.toLocaleString()} / ${Math.round(CHANNEL_PROFILE.computeLimit / 1000)}k`
                : "0 / 10k"}
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#ece5da]">
            <div
              className="h-full rounded-full bg-brand transition-all duration-500"
              style={{
                width: isConnected
                  ? `${(CHANNEL_PROFILE.computeUsed / CHANNEL_PROFILE.computeLimit) * 100}%`
                  : "0%",
              }}
            />
          </div>
        </div>

        {/* Footer row */}
        <div className="mt-3 flex items-center justify-between px-1 text-xs text-[#8a8176]">
          <Link
            href="/dashboard/youtube"
            onClick={onCloseMobile}
            className="flex items-center gap-1.5 transition-colors hover:text-ink"
          >
            <Icon name="settings" className="size-3.5" />
            <span className="font-medium">Settings</span>
          </Link>
          <span className="font-mono text-[11px] font-medium text-[#a2998f]">
            {CHANNEL_PROFILE.version}
          </span>
        </div>
      </div>
    </aside>
  );
}
