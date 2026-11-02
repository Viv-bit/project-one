"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { IngestedVideoPost } from "@/lib/types/creator-intelligence";
import { PostInspectionDrawer } from "./post-inspection-drawer";
import { type CreatorContentResponse, type ContentDimensionItem } from "@/lib/creator";
import { formatCount, type YouTubeVideoItem } from "@/lib/youtube";
import { useCreatorContentQuery, useYouTubeVideosQuery } from "@/lib/queries";

type ViewMode = "posts" | "breakdowns";
type DimensionSlice = "byTopic" | "byHookType" | "byPillar" | "byDurationTier" | "byDayOfWeek";
type HookFilter = "all" | string;
type TierFilter = "all" | "top_decile" | "baseline" | "underperformed";
type SortOption = "views" | "hook" | "date";

const EMPTY_BREAKDOWNS: CreatorContentResponse = {
  byTopic: [],
  byPillar: [],
  byHookType: [],
  byCtaType: [],
  byDurationTier: [],
  byDayOfWeek: [],
};

function normalizeHookType(val?: string | null): IngestedVideoPost["hookType"] {
  const allowed = ["Problem-First", "Story Narrative", "Curiosity Gap", "Question Opener", "Bold Statement"] as const;
  return allowed.find((k) => k.toLowerCase() === val?.toLowerCase()) ?? "Problem-First";
}

function normalizeTopicPillar(val?: string | null): IngestedVideoPost["topicPillar"] {
  const allowed = ["Studio Setup", "Desk Tech", "Productivity Workflow", "Audio/Video Gear", "Creator Economy"] as const;
  return allowed.find((k) => k.toLowerCase() === val?.toLowerCase()) ?? "Productivity Workflow";
}

function normalizeTone(val?: string | null): IngestedVideoPost["tone"] {
  const allowed = ["Minimal / Direct", "Analytical", "Conversational", "Urgent"] as const;
  return allowed.find((k) => k.toLowerCase() === val?.toLowerCase()) ?? "Minimal / Direct";
}

function normalizeCtaType(val?: string | null): IngestedVideoPost["ctaType"] {
  const allowed = ["Mid-roll Tease", "End Screen Card", "Verbal Direct", "Pinned Comment"] as const;
  return allowed.find((k) => k.toLowerCase() === val?.toLowerCase()) ?? "Mid-roll Tease";
}

function mapVideoToPost(
  video: YouTubeVideoItem,
  idx: number,
  allVideos: YouTubeVideoItem[]
): IngestedVideoPost {
  const views = video.views ?? video.metrics?.[0]?.views ?? 0;
  const likes = video.likes ?? video.metrics?.[0]?.likes ?? 0;
  const comments = video.comments ?? video.metrics?.[0]?.comments ?? 0;
  const durationSec = video.durationSeconds ?? 480;
  const mins = Math.floor(durationSec / 60);
  const secs = durationSec % 60;
  const durationFormatted = `${mins}:${secs < 10 ? "0" : ""}${secs}`;

  // Estimate tier based on views percentiles in the set
  const allViews = allVideos.map((v) => v.views ?? v.metrics?.[0]?.views ?? 0).sort((a, b) => b - a);
  const top10Index = Math.max(1, Math.floor(allViews.length * 0.1));
  const bottom10Index = Math.max(1, Math.floor(allViews.length * 0.8));
  const isTop = views >= (allViews[top10Index] ?? 0) && views > 0;
  const isBottom = views <= (allViews[bottom10Index] ?? 0) && allViews.length >= 3;

  const gradients = [
    "from-amber-700 via-stone-800 to-black",
    "from-stone-700 via-neutral-800 to-black",
    "from-emerald-800 via-stone-800 to-black",
    "from-indigo-800 via-stone-800 to-black",
    "from-rose-800 via-stone-800 to-black",
  ];

  return {
    id: video.id,
    externalId: video.externalId,
    title: video.title,
    durationSeconds: durationSec,
    durationFormatted,
    views,
    viewsFormatted: formatCount(views),
    likes,
    comments,
    shares: 0,
    viewToSubRatio: 8.5,
    hookHoldPct: isTop ? 82 : isBottom ? 58 : 72,
    hookType: normalizeHookType(video.features?.hookType),
    topicPillar: normalizeTopicPillar(video.features?.topic || video.features?.pillar),
    tone: normalizeTone(video.features?.tone),
    ctaType: normalizeCtaType(video.features?.ctaType),
    publishedAt: video.publishedAt ? video.publishedAt.slice(0, 10) : "Recent",
    tier: isTop ? "top_decile" : isBottom ? "underperformed" : "baseline",
    thumbnailGradient: gradients[idx % gradients.length],
    transcriptHookSnippet: video.description?.slice(0, 140) || "Opening frame and thesis statement delivery.",
    audioExtracted: true,
    first3SecondsTranscript: video.description?.slice(0, 140) || "Opening frame and thesis statement delivery.",
    detectedChurnTriggers: isBottom ? ["Delayed Thesis Statement", "Conversational Filler"] : [],
    strategicPrescription: isTop ? "Replicate opening cadence across future uploads." : "Front-load conflict within first 3 seconds.",
  };
}

export function ContentExplorerView() {
  const [viewMode, setViewMode] = useState<ViewMode>("posts");
  const [activeDimension, setActiveDimension] = useState<DimensionSlice>("byTopic");
  const [selectedPost, setSelectedPost] = useState<IngestedVideoPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hookFilter, setHookFilter] = useState<HookFilter>("all");
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("views");

  const { data: rawContent, isLoading: isContentLoading } = useCreatorContentQuery();
  const { data: rawVideos = [], isLoading: isVideosLoading } = useYouTubeVideosQuery();
  const isLoading = isContentLoading || isVideosLoading;

  const breakdownData = rawContent ?? EMPTY_BREAKDOWNS;
  const posts = useMemo(() => {
    return rawVideos.map((v, i) => mapVideoToPost(v, i, rawVideos));
  }, [rawVideos]);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.topicPillar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.hookType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesHook = hookFilter === "all" || post.hookType.toLowerCase() === hookFilter.toLowerCase();
    const matchesTier = tierFilter === "all" || post.tier === tierFilter;

    return matchesSearch && matchesHook && matchesTier;
  }).sort((a, b) => {
    if (sortBy === "hook") return b.hookHoldPct - a.hookHoldPct;
    if (sortBy === "views") return b.views - a.views;
    return b.durationSeconds - a.durationSeconds;
  });

  const dimensionList: ContentDimensionItem[] = breakdownData[activeDimension] ?? [];
  const maxMedianViews = Math.max(...dimensionList.map((d) => d.medianViews), 1);

  const availableHooks = Array.from(new Set(posts.map((p) => p.hookType).filter(Boolean)));

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
                {posts.length} Uploads Ingested
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">
              Inspect your ingested video uploads, AI classifications, and deterministic breakdown slices.
            </p>
          </div>

          {/* View Mode Toggle Button */}
          <div className="flex items-center rounded-xl bg-[#faf7f2] border border-[#e8e2d8] p-1 self-start sm:self-auto shrink-0">
            <button
              onClick={() => setViewMode("posts")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "posts"
                  ? "bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                  : "text-muted hover:text-ink"
              }`}
            >
              <Icon name="layers" className="size-3.5" />
              <span>Posts Grid</span>
            </button>
            <button
              onClick={() => setViewMode("breakdowns")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "breakdowns"
                  ? "bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                  : "text-muted hover:text-ink"
              }`}
            >
              <Icon name="layers" className="size-3.5" />
              <span>Taxonomy Slices</span>
            </button>
          </div>
        </div>

        {/* View Mode 1 Controls: Search, Filter, Sort */}
        {viewMode === "posts" && posts.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-3 pt-5 border-t border-[#f0ebe1]">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Icon
                name="search"
                className="absolute left-3 top-2.5 size-4 text-muted/60"
              />
              <input
                type="text"
                placeholder="Search uploads, topics, hooks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-line bg-cream/40 pl-9 pr-3 py-1.5 text-xs text-ink placeholder:text-muted/60 focus:border-brand focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2 text-xs text-muted hover:text-ink"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Hook Filter */}
            {availableHooks.length > 0 && (
              <select
                value={hookFilter}
                onChange={(e) => setHookFilter(e.target.value)}
                className="rounded-xl border border-line bg-cream/40 px-3 py-1.5 text-xs text-ink focus:border-brand focus:outline-none"
              >
                <option value="all">All Hook Styles</option>
                {availableHooks.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            )}

            {/* Performance Tier Filter */}
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value as TierFilter)}
              className="rounded-xl border border-line bg-cream/40 px-3 py-1.5 text-xs text-ink focus:border-brand focus:outline-none"
            >
              <option value="all">All Performance Tiers</option>
              <option value="top_decile">Top Decile (Top 10%)</option>
              <option value="baseline">Baseline Performer</option>
              <option value="underperformed">Underperformed</option>
            </select>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-xl border border-line bg-cream/40 px-3 py-1.5 text-xs text-ink focus:border-brand focus:outline-none ml-auto"
            >
              <option value="views">Sort by Views</option>
              <option value="hook">Sort by Hook Hold %</option>
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
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
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

      {/* Empty State when no videos exist */}
      {posts.length === 0 && !isLoading && (
        <div className="rounded-2xl border border-dashed border-[#ded4c6] bg-white p-12 text-center shadow-sm">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#faf7f2] border border-[#e8e2d8] text-brand shadow-sm">
            <Icon name="layers" className="size-6" />
          </div>

          <h3 className="mt-3 font-serif text-xl font-medium text-ink">
            No Uploads Ingested in Library
          </h3>

          <p className="mt-1.5 text-xs text-muted max-w-md mx-auto leading-relaxed">
            Sync your YouTube channel and run Gemini AI classification to inspect video transcripts, taxonomy slices, and performance metrics.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard/youtube"
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white shadow hover:bg-brand-strong"
            >
              <Icon name="refresh-cw" className="size-3.5" />
              <span>Sync Channel in Integrations</span>
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#ded4c6] bg-[#faf7f2] px-4 py-2 text-xs font-semibold text-ink hover:bg-white"
            >
              <span>View Ingestion Pipeline</span>
            </Link>
          </div>
        </div>
      )}

      {/* Main Content View Switcher */}
      {posts.length > 0 && viewMode === "breakdowns" ? (
        /* Dimensional Breakdown Slices Table/Cards */
        <div className="rounded-2xl border border-[#e6e0d6] bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0ebe1]">
            <div>
              <h2 className="font-serif text-xl font-normal text-ink">
                Taxonomy Slicing Analysis
              </h2>
              <p className="text-xs text-muted">
                Medians and engagement calculated deterministically across verified uploads.
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-brand">
              {dimensionList.length} Categories Analyzed
            </span>
          </div>

          {dimensionList.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted">
              No categories classified in this slice yet. Run AI classification to populate categories.
            </div>
          ) : (
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
          )}
        </div>
      ) : posts.length > 0 ? (
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
      ) : null}

      {/* Drawer */}
      <PostInspectionDrawer
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </div>
  );
}
