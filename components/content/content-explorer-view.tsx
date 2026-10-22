"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { INGESTED_POSTS_16 } from "@/lib/data/intelligence-mock-data";
import type { IngestedVideoPost } from "@/lib/types/creator-intelligence";
import { PostInspectionDrawer } from "./post-inspection-drawer";

type HookFilter = "all" | "Problem-First" | "Bold Statement" | "Story Narrative" | "Curiosity Gap" | "Question Opener";
type TierFilter = "all" | "top_decile" | "baseline" | "underperformed";
type SortOption = "views" | "hook" | "date";

export function ContentExplorerView() {
  const [selectedPost, setSelectedPost] = useState<IngestedVideoPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hookFilter, setHookFilter] = useState<HookFilter>("all");
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("hook");

  const filteredPosts = INGESTED_POSTS_16.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.topicPillar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.hookType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesHook = hookFilter === "all" || post.hookType === hookFilter;
    const matchesTier = tierFilter === "all" || post.tier === tierFilter;

    return matchesSearch && matchesHook && matchesTier;
  }).sort((a, b) => {
    if (sortBy === "hook") return b.hookHoldPct - a.hookHoldPct;
    if (sortBy === "views") return b.views - a.views;
    return b.durationSeconds - a.durationSeconds;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-[#e6e0d6] bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-ink">
                Content &amp; Taxonomy Explorer
              </h1>
              <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand border border-brand/20">
                16 Uploads Ingested
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">
              Inspect AI hook categorizations, Whisper speech-to-text quotes, and retention hold rates across your initial 10–20 video batch.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-muted">
            <span className="inline-block size-2 rounded-full bg-emerald-500" />
            <span>Deterministic Math Engine Calibrated</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center gap-3 pt-5 border-t border-[#f0ebe1]">
          {/* Search Box */}
          <div className="relative flex-1">
            <Icon
              name="search"
              className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, topic pillar, or hook type..."
              className="w-full rounded-xl border border-[#ded6c7] bg-[#faf7f2] py-2 pl-9 pr-4 text-xs text-ink placeholder:text-muted focus:border-brand focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Hook Type Filter */}
          <select
            value={hookFilter}
            onChange={(e) => setHookFilter(e.target.value as HookFilter)}
            className="rounded-xl border border-[#ded6c7] bg-[#faf7f2] px-3 py-2 text-xs text-ink focus:border-brand focus:bg-white focus:outline-none"
          >
            <option value="all">All Hook Types</option>
            <option value="Problem-First">Problem-First</option>
            <option value="Bold Statement">Bold Statement</option>
            <option value="Story Narrative">Story Narrative</option>
            <option value="Curiosity Gap">Curiosity Gap</option>
            <option value="Question Opener">Question Opener</option>
          </select>

          {/* Performance Tier Filter */}
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value as TierFilter)}
            className="rounded-xl border border-[#ded6c7] bg-[#faf7f2] px-3 py-2 text-xs text-ink focus:border-brand focus:bg-white focus:outline-none"
          >
            <option value="all">All Performance Tiers</option>
            <option value="top_decile">Top Decile (&gt;95%)</option>
            <option value="baseline">Baseline Cohort</option>
            <option value="underperformed">Underperformed (&lt;15%)</option>
          </select>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-xl border border-[#ded6c7] bg-[#faf7f2] px-3 py-2 text-xs text-ink focus:border-brand focus:bg-white focus:outline-none font-semibold text-brand"
          >
            <option value="hook">Sort: Highest 0-3s Hold</option>
            <option value="views">Sort: Highest Views</option>
            <option value="date">Sort: Video Duration</option>
          </select>
        </div>
      </div>

      {/* Uploads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredPosts.map((post) => {
          return (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="group cursor-pointer rounded-2xl border border-[#e6e0d6] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:border-brand hover:shadow-md flex flex-col justify-between"
            >
              <div>
                {/* Visual Thumbnail Frame */}
                <div
                  className={`relative aspect-video w-full rounded-xl bg-gradient-to-br ${post.thumbnailGradient} p-3.5 text-white shadow-inner flex flex-col justify-between overflow-hidden`}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-black/60 px-2 py-0.5 text-[10px] font-mono backdrop-blur-sm">
                      {post.durationFormatted}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[11px] font-bold backdrop-blur-sm shadow-sm ${
                        post.tier === "top_decile"
                          ? "bg-emerald-600 text-white"
                          : post.tier === "underperformed"
                          ? "bg-red-600 text-white"
                          : "bg-black/60 text-white"
                      }`}
                    >
                      {post.hookHoldPct}% Hold
                    </span>
                  </div>

                  <p className="line-clamp-2 text-xs font-semibold leading-snug drop-shadow-md">
                    {post.title}
                  </p>
                </div>

                {/* Title & Metadata */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>{post.publishedAt}</span>
                    <span className="font-semibold text-ink font-mono">{post.viewsFormatted} views</span>
                  </div>

                  <h3 className="mt-1 font-serif text-lg font-normal text-ink group-hover:text-brand transition-colors line-clamp-1">
                    {post.title}
                  </h3>
                </div>

                {/* AI Extracted Taxonomy Badges */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-md bg-brand/10 border border-brand/20 px-2 py-0.5 text-[10px] font-semibold text-brand">
                    <Icon name="zap" className="size-2.5" />
                    {post.hookType}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#faf7f2] border border-[#e8e2d8] px-2 py-0.5 text-[10px] font-medium text-[#736a61]">
                    <Icon name="layers" className="size-2.5" />
                    {post.topicPillar}
                  </span>
                  <span className="rounded-md bg-[#faf7f2] border border-[#e8e2d8] px-2 py-0.5 text-[10px] text-muted">
                    {post.ctaType}
                  </span>
                </div>

                {/* Whisper Hook Excerpt */}
                <div className="mt-3 rounded-lg bg-[#faf7f2] p-2.5 text-[11px] text-muted italic line-clamp-2 border border-[#f0ebe1]">
                  &ldquo;{post.transcriptHookSnippet}&rdquo;
                </div>
              </div>

              {/* Bottom Quick Action */}
              <div className="mt-4 pt-3 border-t border-[#f0ebe1] flex items-center justify-between text-xs">
                <span className="text-[11px] text-muted font-mono">
                  {post.likes.toLocaleString()} likes · {post.comments} comments
                </span>
                <span className="text-brand font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Inspect &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPosts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#ded6c7] bg-white p-12 text-center">
          <Icon name="search" className="size-8 mx-auto text-muted mb-3" />
          <h3 className="font-serif text-xl text-ink">No Uploads Match Your Filter</h3>
          <p className="text-xs text-muted mt-1 max-w-sm mx-auto">
            Try adjusting your search query, hook typology, or performance tier selection.
          </p>
        </div>
      )}

      {/* Drawer */}
      <PostInspectionDrawer
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </div>
  );
}
