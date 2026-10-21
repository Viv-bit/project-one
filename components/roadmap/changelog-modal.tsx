"use client";

import { Icon } from "@/components/ui";
import { SHIPPING_COMMITS } from "@/lib/data/intelligence-mock-data";

type ChangelogModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ChangelogModal({ isOpen, onClose }: ChangelogModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-2xl border border-line bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-lg bg-brand/10 text-brand">
              <Icon name="refresh" className="size-3.5" />
            </span>
            <h3 className="text-sm font-bold text-ink">Changelog Archive</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-muted hover:bg-black/5">
            <Icon name="x" className="size-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4 max-h-96 overflow-y-auto pr-1">
          {SHIPPING_COMMITS.map((com) => (
            <div key={com.id} className="rounded-xl border border-line bg-cream/40 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink">{com.version}</span>
                <span className="font-mono text-[10px] text-muted">{com.commitHash}</span>
              </div>
              <p className="mt-2 text-xs text-muted leading-relaxed">
                {com.description}
              </p>
              <div className="mt-2 pt-2 border-t border-line/60">
                <span className="text-[11px] font-semibold text-brand">
                  {com.highlightTag}
                </span>
              </div>
            </div>
          ))}

          {/* Past milestone archive */}
          <div className="rounded-xl border border-line bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink">v0.8.0 · 3 weeks ago</span>
              <span className="font-mono text-[10px] text-muted">#44fa1</span>
            </div>
            <p className="mt-2 text-xs text-muted leading-relaxed">
              Initial release of 50-post ingestion engine and read-only YouTube OAuth telemetry rails.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-ink px-4 py-2 text-xs font-semibold text-white shadow hover:bg-ink/90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
