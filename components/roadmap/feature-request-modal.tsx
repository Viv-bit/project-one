"use client";

import { useState } from "react";
import { Icon } from "@/components/ui";

type FeatureRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  defaultTitle?: string;
};

export function FeatureRequestModal({
  isOpen,
  onClose,
  defaultTitle = "",
}: FeatureRequestModalProps) {
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Retention Diagnostics");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTitle("");
      setDescription("");
      onClose();
    }, 1500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-line bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-lg bg-brand/10 text-brand">
              <Icon name="spark" className="size-3.5" />
            </span>
            <h3 className="text-sm font-bold text-ink">Submit Creator Feature Request</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-muted hover:bg-black/5">
            <Icon name="x" className="size-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center animate-in fade-in">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-100 text-emerald-700">
              <Icon name="check" className="size-6" />
            </div>
            <h4 className="mt-3 text-sm font-bold text-ink">Initiative Submitted!</h4>
            <p className="mt-1 text-xs text-muted">
              Added to Future Horizons candidate pool for community voting.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Initiative Title
              </label>
              <input
                autoFocus
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. YouTube Community Post Clickthrough Correlation"
                className="w-full rounded-xl border border-line bg-cream/40 p-2.5 text-xs text-ink placeholder:text-muted/60 focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Engineering Discipline / Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-line bg-cream/40 p-2.5 text-xs text-ink focus:border-brand focus:outline-none"
              >
                <option value="Retention Diagnostics">Retention Diagnostics (Audio/NLP)</option>
                <option value="Computer Vision">Computer Vision (Thumbnails/Motion)</option>
                <option value="Statistical Testing">Statistical Testing (Bayesian Prior)</option>
                <option value="Multi-platform Sync">Multi-platform Sync (TikTok/IG)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Hypothesis &amp; Creator Impact
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe how this feature will increase retention, watch-time, or packaging CTR for creators..."
                className="w-full rounded-xl border border-line bg-cream/40 p-2.5 text-xs text-ink placeholder:text-muted/60 focus:border-brand focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-muted hover:bg-black/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white shadow hover:bg-brand-strong"
              >
                Submit to Foundry
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
