"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Brand } from "@/components/auth/brand";
import { Icon } from "@/components/ui/icon";
import { useYouTubeConnection } from "@/lib/youtube-connection-context";
import { getCurrentUser, logoutUser, type AuthUser } from "@/lib/auth";

export function OnboardingHeader() {
  const { isConnected, channel } = useYouTubeConnection();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const u = await getCurrentUser();
        setUser(u);
      } catch {
        // Keep fallback
      }
    }
    loadUser();
  }, []);

  const displayName =
    user?.name ||
    user?.email ||
    (isConnected && channel?.title ? channel.title : "Creator");

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((s) => s[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : isConnected && channel?.title
    ? channel.title.slice(0, 2).toUpperCase()
    : "ME";

  return (
    <header className="border-b border-[#e6e0d6] bg-white/80 px-4 py-3 sm:px-8 backdrop-blur-md sticky top-0 z-30">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-4">
          <Brand />
          <span className="hidden sm:inline-block h-4 w-px bg-[#e6e0d6]" />
          <span className="hidden sm:inline-block text-xs font-semibold text-muted">
            {isConnected && channel?.title
              ? `${channel.title} · Historical Ingestion Pipeline`
              : "Historical Ingestion Pipeline"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/youtube"
            className="text-xs text-muted hover:text-ink transition-colors flex items-center gap-1.5"
          >
            <Icon name="youtube" className="size-3.5 text-red-600" />
            <span className="hidden sm:inline">Channel Settings</span>
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-black transition-colors"
          >
            <span>Dashboard</span>
            <Icon name="arrow-right" className="size-3" />
          </Link>

          {/* User Profile Pill & Interactive Menu */}
          <div className="relative pl-1 border-l border-[#e6e0d6]">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 rounded-full p-1 hover:bg-[#faf7f2] transition-colors focus:outline-none"
              aria-label="User account"
            >
              <div className="relative size-7 overflow-hidden rounded-full border border-[#d8d0c4] bg-[#ebdccb] shadow-xs">
                {channel?.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={channel.thumbnailUrl}
                    alt={displayName}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-[10px] font-bold text-[#5c4a37]">
                    {initials}
                  </div>
                )}
                <span
                  className={`absolute bottom-0 right-0 size-2 rounded-full ring-1 ring-white ${
                    isConnected ? "bg-emerald-500" : "bg-amber-400"
                  }`}
                />
              </div>
              <span className="hidden md:inline-block text-xs font-medium text-ink max-w-[120px] truncate">
                {displayName}
              </span>
              <Icon name="chevron-down" className="size-3 text-muted" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-10 z-40 w-60 rounded-xl border border-line bg-white p-3 shadow-xl animate-in fade-in">
                <div className="border-b border-[#f0ebe1] pb-2">
                  <p className="text-xs font-bold text-ink truncate">
                    {user?.name || (isConnected ? channel?.title : "Creator Account")}
                  </p>
                  <p className="text-[11px] text-muted truncate">
                    {user?.email || (isConnected && channel?.handle ? `@${channel.handle}` : "No email")}
                  </p>
                  <div className="mt-1.5">
                    {isConnected ? (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        YouTube Connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-800 border border-amber-200">
                        <span className="size-1.5 rounded-full bg-amber-500" />
                        YouTube Not Connected
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-2 space-y-1 text-xs">
                  <Link
                    href="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-ink hover:bg-cream transition-colors"
                  >
                    <Icon name="layers" className="size-3.5 text-muted" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/dashboard/youtube"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-ink hover:bg-cream transition-colors"
                  >
                    <Icon name="youtube" className="size-3.5 text-red-600" />
                    <span>Channel Settings</span>
                  </Link>
                </div>

                <div className="mt-2 border-t border-[#f0ebe1] pt-2">
                  <button
                    type="button"
                    onClick={async () => {
                      setUserMenuOpen(false);
                      await logoutUser();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <Icon name="ban" className="size-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
