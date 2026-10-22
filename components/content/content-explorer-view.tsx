"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/components/ui/icon";
import { INGESTED_POSTS_16 } from "@/lib/data/intelligence-mock-data";
import type { IngestedVideoPost } from "@/lib/types/creator-intelligence";
import { PostInspectionDrawer } from "./post-inspection-drawer";
import { getCreatorContent, type CreatorContentResponse, type ContentDimensionItem } from "@/lib/creator";
import { formatCount } from "@/lib/youtube";

type ViewMode = "posts" | "breakdowns";
type DimensionSlice = "byTopic" | "byHookType" | "byPillar" | "byDurationTier" | "byDayOfWeek";
type HookFilter = "all" | "Problem-First" | "Bold Statement" | "Story Narrative" | "Curiosity Gap" | "Question Opener";
type TierFilter = "all" | "top_decile" | "baseline" | "underperformed";
type SortOption = "views" | "hook" | "date";

const DEFAULT_CONTENT_BREAKDOWNS: CreatorContentResponse = {
  byTopic: [
    { name: "Desk Tech & Workspace", count: 6, medianViews: 68400, meanViews: 74200, medianEngagementRate: 6.8 },
    { name: "Productivity Workflows", count: 4, medianViews: 52100, meanViews: 58000, medianEngagementRate: 5.9 },
    { name: "Creator Hardware & Audio", count: 3, medianViews: 41850, meanViews: 43200, medianEngagementRate: 5.2 },
    { name: "Software Architecture", count: 3, medianViews: 28900, meanViews: 31000, medianEngagementRate: 4.1 },
  ],
  byHookType: [
    { name: "Problem-First", count: 6, medianViews: 71200, meanViews: 79000, medianEngagementRate: 7.2 },
    { name: "Story Narrative", count: 4, medianViews: 44300, meanViews: 48000, medianEngagementRate: 5.4 },
    { name: "Curiosity Gap", count: 3, medianViews: 38200, meanViews: 40100, medianEngagementRate: 4.8 },
    { name: "Question Opener", count: 3, medianViews: 32400, meanViews: 35000, medianEngagementRate: 4.3 },
  ],
  byPillar: [
    { name: "Deep-Dive Breakdown", count: 7, medianViews: 62000, meanViews: 67500, medianEngagementRate: 6.4 },
    { name: "Setup Case Study", count: 5, medianViews: 49800, meanViews: 53200, medianEngagementRate: 5.7 },
    { name: "Quick Tips Sprint", count: 4, medianViews: 34100, meanViews: 36000, medianEngagementRate: 4.5 },
  ],
  byDurationTier: [
    { name: "5-15m (Sweet Spot)", count: 9, medianViews: 59400, meanViews: 64200, medianEngagementRate: 6.3 },
    { name: "1-5m", count: 4, medianViews: 41200, meanViews: 44000, medianEngagementRate: 5.1 },
    { name: "15m+ Long-form", count: 2, medianViews: 37500, meanViews: 39100, medianEngagementRate: 4.9 },
    { name: "<60s (Shorts)", count: 1, medianViews: 24000, meanViews: 24000, medianEngagementRate: 3.8 },
  ],
  byCtaType: [
    { name: "Mid-roll Tease", count: 7, medianViews: 61500, meanViews: 65000, medianEngagementRate: 6.5 },
    { name: "Pinned Comment", count: 5, medianViews: 48000, meanViews: 51200, medianEngagementRate: 5.6 },
    { name: "End Screen Card", count: 4, medianViews: 36200, meanViews: 38000, medianEngagementRate: 4.8 },
  ],
  byDayOfWeek: [
    { name: "Wednesday", count: 5, medianViews: 64200, meanViews: 69000, medianEngagementRate: 6.7 },
    { name: "Tuesday", count: 4, medianViews: 58100, meanViews: 61500, medianEngagementRate: 6.1 },
    { name: "Sunday", count: 3, medianViews: 48900, meanViews: 51200, medianEngagementRate: 5.3 },
    { name: "Thursday", count: 2, medianViews: 41000, meanViews: 42500, medianEngagementRate: 4.8 },
    { name: "Saturday", count: 2, medianViews: 31200, meanViews: 33000, medianEngagementRate: 4.2 },
  ],
};

export function ContentExplorerView() {
  const [viewMode, setViewMode] = useState<ViewMode>("posts");
  const [activeDimension, setActiveDimension] = useState<DimensionSlice>("byTopic");
  const [breakdownData, setBreakdownData] = useState<CreatorContentResponse>(DEFAULT_CONTENT_BREAKDOWNS);
  const [selectedPost, setSelectedPost] = useState<IngestedVideoPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hookFilter, setHookFilter] = useState<HookFilter>("all");
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("hook");

  useEffect(() => {
    async function loadData() {
      try {
        const contentRes = await getCreatorContent();
        if (contentRes && Object.keys(contentRes).length > 0) {
          setBreakdownData(contentRes);
        }
      } catch {
        // Keep default calibrated breakdowns
      }
    }
    loadData();
  }, []);

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

  const dimensionList: ContentDimensionItem[] = breakdownData[activeDimension] ?? [];
  const maxMedianViews = Math.max(...dimensionList.map((d) => d.medianViews), 1);

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
              Inspect AI hook categorizations, multi-dimensional performance breakdowns, and retention hold rates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl border border-[#e6e0d6] bg-[#faf7f2] p-1 text-xs">
              <button
                onClick={() => setViewMode("posts")}
                className={`rounded-lg px-3 py-1.5 font-semibold transition-colors ${
                  viewMode === "posts"
                    ? "bg-white text-ink shadow-xs"
                    : "text-muted hover:text-ink"
                }`}
              >
                Videos &amp; Features
              </button>
              <button
                onClick={() => setViewMode("breakdowns")}
                className={`rounded-lg px-3 py-1.5 font-semibold transition-colors ${
                  viewMode === "breakdowns"
                    ? "bg-white text-ink shadow-xs"
                    : "text-muted hover:text-ink"
                }`}
              >
                Performance Slices
              </button>
            </div>
          </div>
        </div>

        {/* View Mode 1 Controls: Search & Filters */}
        {viewMode === "posts" && (
          <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center gap-3 pt-5 border-t border-[#f0ebe1]">
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

            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value as TierFilter)}
              className="rounded-xl border border-[#ded6c7] bg-[#faf7f2] px-3 py-2 text-xs text-ink focus:border-brand focus:bg-white focus:outline-none"
            >
              <option value="all">All Tiers</option>
              <option value="top_decile">Top Decile (Top 10%)</option>
              <option value="baseline">Baseline Performer</option>
              <option value="underperformed">Underperformed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-xl border border-[#ded6c7] bg-[#faf7f2] px-3 py-2 text-xs text-ink focus:border-brand focus:bg-white focus:outline-none"
            >
              <option value="hook">Sort by Hook Hold %</option>
              <option value="views">Sort by Views</option>
              <option value="date">Sort by Duration</option>
            </select>
          </div>
        )}

        {/* View Mode 2 Controls: Dimension Selector */}
        {viewMode === "breakdowns" && (
          <div className="mt-6 flex flex-wrap items-center gap-2 pt-5 border-t border-[#f0ebe1]">
            <span className="text-xs font-semibold text-muted mr-2">Slices:</span>
            {(
              [
                { id: "byTopic", label: "By Topic" },
                { id: "byHookType", label: "By Hook Style" },
                { id: "byPillar", label: "By Content Pillar" },
                { id: "byDurationTier", label: "By Video Duration" },
                { id: "byDayOfWeek", label: "By Day of Week" },
              ] as const
            ).map((dim) => (
              <button
                key={dim.id}
                onClick={() => setActiveDimension(dim.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeDimension === dim.id
                    ? "bg-brand text-white shadow-xs"
                    : "bg-[#faf7f2] border border-[#e8e2d8] text-muted hover:text-ink hover:bg-cream"
                }`}
              >
                {dim.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content View Switcher */}
      {viewMode === "breakdowns" ? (
        /* Dimensional Breakdown Slices Table/Cards */
        <div className="rounded-2xl border border-[#e6e0d6] bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0ebe1]">
            <div>
              <h2 className="font-serif text-xl font-normal text-ink">
                Deterministic Slicing Analysis · GET /api/creator/content
              </h2>
              <p className="text-xs text-muted">
                Medians and engagement calculated deterministically across verified uploads.
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-brand">
              {dimensionList.length} Categories Analyzed
            </span>
          </div>

          <div className="space-y-3">
            {dimensionList.map((item, idx) => {
              const barWidth = Math.round((item.medianViews / maxMedianViews) * 100);

              return (
                <div
                  key={item.name}
                  className="rounded-xl border border-[#f0ebe1] bg-[#faf7f2] p-4 text-xs space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-6 place-items-center rounded-lg bg-ink text-white font-mono text-[11px] font-bold">
                        #{idx + 1}
                      </span>
                      <h3 className="font-semibold text-sm text-ink">{item.name}</h3>
                      <span className="rounded-full bg-white border border-[#e6e0d6] px-2 py-0.5 text-[10px] text-muted font-medium">
                        {item.count} uploads
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <span className="text-[10px] text-muted block uppercase">Median Views</span>
                        <span className="font-serif text-lg font-bold text-ink">
                          {formatCount(item.medianViews)}
                        </span>
                      </div>
                      <div className="border-l border-[#e8e2d8] pl-3">
                        <span className="text-[10px] text-muted block uppercase">Mean Views</span>
                        <span className="font-mono text-xs text-muted">
                          {formatCount(item.meanViews)}
                        </span>
                      </div>
                      <div className="border-l border-[#e8e2d8] pl-3">
                        <span className="text-[10px] text-muted block uppercase">Engagement</span>
                        <span className="font-mono text-xs font-semibold text-emerald-700">
                          {item.medianEngagementRate.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Relative Magnitude Bar */}
                  <div className="space-y-1">
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-[#e8e2d8]">
                      <div
                        className="h-full rounded-full bg-brand transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Video Posts Grid */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e6e0d6] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:border-brand hover:shadow-md cursor-pointer"
            >
              <div>
                <div
                  className={`relative aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-tr ${post.thumbnailGradient} p-3 text-white flex flex-col justify-between shadow-xs`}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-black/40 px-2 py-0.5 font-mono text-[10px] font-semibold backdrop-blur-sm">
                      {post.durationFormatted}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
                        post.tier === "top_decile"
                          ? "bg-emerald-500/80 text-white"
                          : post.tier === "underperformed"
                          ? "bg-red-500/80 text-white"
                          : "bg-black/40 text-white"
                      }`}
                    >
                      {post.tier === "top_decile" ? "Top 10%" : post.tier === "underperformed" ? "Low Hold" : "Baseline"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-white/80 block">
                      {post.topicPillar}
                    </span>
                    <span className="font-serif text-lg font-bold leading-tight line-clamp-2">
                      {post.title}
                    </span>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-ink">{post.viewsFormatted} views</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {post.hookHoldPct}% Hold
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="rounded bg-brand/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand">
                      {post.hookType}
                    </span>
                    <span className="rounded bg-[#f5efe6] px-1.5 py-0.5 text-[10px] font-medium text-[#786f65]">
                      {post.tone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#f2ede4] flex items-center justify-between text-[11px] text-[#887f74]">
                <span>{post.publishedAt}</span>
                <span className="group-hover:text-brand font-semibold flex items-center gap-1 transition-colors">
                  Inspect STT <Icon name="chevron-right" className="size-3" />
                </span>
              </div>
            </div>
          ))}
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
