"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui";

type CommandItem = {
  id: string;
  title: string;
  category: "Navigation" | "Metric" | "Roadmap Feature" | "Settings";
  href?: string;
  action?: () => void;
  description?: string;
};

const COMMANDS: CommandItem[] = [
  {
    id: "nav-dashboard",
    title: "Creator Dashboard",
    category: "Navigation",
    href: "/dashboard",
    description: "View retention curves, hook diagnostics, and velocity metrics",
  },
  {
    id: "nav-roadmap",
    title: "Growth Plan (Personalized Creator Roadmap)",
    category: "Navigation",
    href: "/dashboard/growth-plan",
    description: "Sequenced 90-day sprints, algorithmic levers, and prescribed video experiments",
  },
  {
    id: "nav-youtube",
    title: "Channel Connect & Settings",
    category: "Navigation",
    href: "/dashboard/youtube",
    description: "Manage OAuth permissions and YouTube Data API sync",
  },
  {
    id: "metric-velocity",
    title: "Median 72h View Velocity (41,850)",
    category: "Metric",
    href: "/dashboard",
    description: "+28.4% above niche baseline",
  },
  {
    id: "metric-hold",
    title: "0-3s Hook Hold Rate (74.2%)",
    category: "Metric",
    href: "/dashboard",
    description: "Problem-First opener analysis",
  },
  {
    id: "feature-tiktok",
    title: "TikTok Creator API & Curve Analyzer",
    category: "Roadmap Feature",
    href: "/dashboard/roadmap",
    description: "Vertical video drop-off telemetry (Active Dev · Sprint 16)",
  },
  {
    id: "feature-heatmap",
    title: "Thumbnail Heatmap & Visual Salience",
    category: "Roadmap Feature",
    href: "/dashboard/roadmap",
    description: "Computer vision salience model planned for Q4",
  },
];

type CommandPaletteProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger handled in parent
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = COMMANDS.filter((cmd) =>
    `${cmd.title} ${cmd.category} ${cmd.description ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  function executeItem(item: CommandItem) {
    if (item.href) {
      router.push(item.href);
    } else if (item.action) {
      item.action();
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 sm:pt-28">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-white shadow-2xl">
        {/* Search Input Box */}
        <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
          <Icon name="search" className="size-5 text-muted" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Quick search models, tags, metrics... (Press Esc to close)"
            className="w-full bg-transparent text-sm font-medium text-ink placeholder:text-muted/60 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % Math.max(filtered.length, 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) =>
                  prev === 0 ? Math.max(filtered.length - 1, 0) : prev - 1,
                );
              } else if (e.key === "Enter" && filtered[selectedIndex]) {
                e.preventDefault();
                executeItem(filtered[selectedIndex]);
              }
            }}
          />
          <kbd className="hidden sm:inline-flex rounded border border-line bg-cream px-1.5 py-0.5 text-[10px] font-semibold text-muted">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted">
              No matching intelligence models, metrics, or roadmap items found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => executeItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 transition-colors ${
                    isSelected ? "bg-cream text-ink" : "text-muted hover:bg-cream/60"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-ink truncate">
                        {item.title}
                      </span>
                      <span className="rounded bg-black/5 px-1.5 py-0.5 text-[9px] font-medium text-muted uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                    {item.description ? (
                      <p className="mt-0.5 text-[11px] text-muted truncate">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                  <Icon
                    name="arrow-right"
                    className={`size-3.5 shrink-0 transition-transform ${
                      isSelected ? "text-brand translate-x-0.5" : "text-muted/40"
                    }`}
                  />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-line/80 bg-cream/40 px-4 py-2 text-[11px] text-muted">
          <span>Navigate with ↑ / ↓</span>
          <span>Select with ↵ Enter</span>
        </div>
      </div>
    </div>
  );
}
