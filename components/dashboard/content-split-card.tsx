"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui";
import { getYouTubeVideos, formatCount, startYouTubeOAuth, type YouTubeVideoItem } from "@/lib/youtube";
import { useYouTubeConnection } from "@/lib/youtube-connection-context";

function formatDuration(seconds?: number | null): string {
  if (!seconds || seconds <= 0) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export function ContentSplitCard() {
  const { isConnected } = useYouTubeConnection();
  const [videos, setVideos] = useState<YouTubeVideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (!isConnected) return;
      setIsLoading(true);
      try {
        const data = await getYouTubeVideos();
        if (isMounted && Array.isArray(data)) {
          setVideos(data);
        }
      } catch (err) {
        console.warn("Failed to fetch videos for content split:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [isConnected]);

  // Empty state when YouTube is not connected OR fewer than 2 videos are synced
  if (!isConnected || videos.length < 2) {
    return (
      <div className="rounded-2xl border border-dashed border-[#ded4c6] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-[#f2ede4] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-ink">
                Top vs Underperforming Content Split
              </h2>
              <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                {!isConnected ? "Awaiting Connection" : "Need 2+ Ingested Videos"}
              </span>
            </div>
            <p className="text-xs text-[#82786e]">
              Direct comparative taxonomy analysis across your video catalog
            </p>
          </div>
          <span className="text-xs font-medium text-[#998f84]">
            {videos.length} videos ingested
          </span>
        </div>

        {/* Side-by-side Ghost Video Cards Grid */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Top Decile Ghost Card */}
          <div className="flex flex-col justify-between rounded-xl border border-dashed border-emerald-300/80 bg-emerald-50/15 p-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-semibold">
                  Top Decile Benchmark
                </span>
                <span className="text-[11px] font-mono text-[#8c8277]">
                  Top 10%
                </span>
              </div>

              {/* Ghost Thumbnail */}
              <div className="mt-3 flex h-28 w-full flex-col items-center justify-center rounded-lg border border-dashed border-emerald-200 bg-white/70 p-3 text-center">
                <div className="grid size-9 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                  <Icon name="play" className="size-4" />
                </div>
                <p className="mt-2 text-[11px] font-medium text-emerald-800">
                  Highest Hook Hold Uploads
                </p>
              </div>

              <h3 className="mt-3 text-xs font-bold text-ink">
                Top Performing Catalog Analysis
              </h3>
              <p className="mt-1 text-xs text-[#6e6459] leading-relaxed">
                Connect your YouTube channel and sync videos to rank your winning uploads by view velocity and hook hold.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-200/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800/80">
                AWAITING INGESTION
              </span>
            </div>
          </div>

          {/* Underperforming Ghost Card */}
          <div className="flex flex-col justify-between rounded-xl border border-dashed border-rose-300/80 bg-rose-50/15 p-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-rose-100 text-rose-800 px-2 py-0.5 text-[10px] font-semibold">
                  Underperforming Benchmark
                </span>
                <span className="text-[11px] font-mono text-[#8c8277]">
                  Bottom 10%
                </span>
              </div>

              {/* Ghost Thumbnail */}
              <div className="mt-3 flex h-28 w-full flex-col items-center justify-center rounded-lg border border-dashed border-rose-200 bg-white/70 p-3 text-center">
                <div className="grid size-9 place-items-center rounded-full bg-rose-100 text-rose-700">
                  <Icon name="alert-triangle" className="size-4" />
                </div>
                <p className="mt-2 text-[11px] font-medium text-rose-800">
                  Hook Churn &amp; Drop-off Dips
                </p>
              </div>

              <h3 className="mt-3 text-xs font-bold text-ink">
                Underperforming Taxonomy Audit
              </h3>
              <p className="mt-1 text-xs text-[#6e6459] leading-relaxed">
                Empirical comparison reveals common pacing dead-zones, low-performing hooks, and drop-off triggers.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-rose-200/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800/80">
                AWAITING INGESTION
              </span>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#f2ede4]">
          <span className="text-xs text-[#80766c]">
            {!isConnected ? "OAuth authentication required" : "Sync at least 2 videos in Integrations"}
          </span>
          {!isConnected ? (
            <button
              onClick={() => startYouTubeOAuth()}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#e62117] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#cc1810] shrink-0"
            >
              <Icon name="youtube" className="size-3.5" />
              <span>Connect Channel</span>
            </button>
          ) : (
            <Link
              href="/dashboard/youtube"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-strong shrink-0"
            >
              <Icon name="refresh-cw" className="size-3.5" />
              <span>Sync Videos</span>
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Sorted videos to compare top performer vs lowest performer
  const sorted = [...videos].sort((a, b) => {
    const viewsA = a.views ?? a.metrics?.[0]?.views ?? 0;
    const viewsB = b.views ?? b.metrics?.[0]?.views ?? 0;
    return viewsB - viewsA;
  });

  const topVideo = sorted[0];
  const bottomVideo = sorted[sorted.length - 1];
  const items = [
    { video: topVideo, type: "top_decile" as const, badgeLabel: "Top Performer" },
    { video: bottomVideo, type: "underperformed" as const, badgeLabel: "Underperforming" },
  ];

  return (
    <div className="rounded-2xl border border-[#e6e0d6] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-[#f2ede4] pb-4">
        <div>
          <h2 className="text-base font-semibold text-ink">
            Top vs Underperforming Content Split
          </h2>
          <p className="text-xs text-[#82786e]">
            Direct comparative taxonomy analysis of recent {videos.length} uploads
          </p>
        </div>
        <Link
          href="/dashboard/content"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand transition-colors hover:text-brand-strong"
        >
          <span>View all {videos.length} posts</span>
          <Icon name="arrow-right" className="size-3" />
        </Link>
      </div>

      {/* Side-by-side Video Cards Grid */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map(({ video, type, badgeLabel }) => {
          const isTop = type === "top_decile";
          const viewCount = video.views ?? video.metrics?.[0]?.views ?? 0;
          const hookTag = video.features?.hookType || (isTop ? "Problem-First" : "Narrative Lead-In");
          const topicTag = video.features?.topic || video.features?.pillar || "Content Analysis";

          return (
            <div
              key={video.id}
              className={`flex flex-col justify-between rounded-xl border p-4 transition-all ${
                isTop
                  ? "border-emerald-200/80 bg-emerald-50/20 hover:border-emerald-300"
                  : "border-rose-200/80 bg-rose-50/20 hover:border-rose-300"
              }`}
            >
              <div>
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      isTop
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {badgeLabel}
                  </span>
                  <span className="text-[11px] font-mono text-[#8c8277]">
                    {formatDuration(video.durationSeconds)}
                  </span>
                </div>

                {/* Video Thumbnail */}
                <div className="mt-3 relative h-28 w-full overflow-hidden rounded-lg bg-black/80 flex items-center justify-center text-white">
                  {video.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1 text-center p-2">
                      <Icon name="play" className="size-6 text-white/80" />
                      <span className="text-[10px] text-white/60">YouTube Upload</span>
                    </div>
                  )}
                  <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-mono backdrop-blur-xs">
                    {formatDuration(video.durationSeconds)}
                  </span>
                </div>

                {/* Video Title & Metrics */}
                <h3 className="mt-3 text-xs font-bold text-ink line-clamp-2">
                  {video.title}
                </h3>
                <p className="mt-0.5 text-xs font-medium text-[#736a60]">
                  {formatCount(viewCount)} views ·{" "}
                  <span
                    className={`font-semibold ${
                      isTop ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {isTop ? "High Velocity" : "Lower Engagement"}
                  </span>
                </p>

                {/* Hook Classification Tags */}
                <div className="mt-3 pt-3 border-t border-[#e8e2d8]/60">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#948b81]">
                    HOOK CLASSIFICATION
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <span className="rounded-md border border-[#e2dcce] bg-white px-2 py-0.5 text-[11px] font-medium text-[#5c544c]">
                      {hookTag}
                    </span>
                    <span className="rounded-md border border-[#e2dcce] bg-white px-2 py-0.5 text-[11px] font-medium text-[#5c544c]">
                      {topicTag}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
