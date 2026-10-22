"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import {
  syncYouTubeVideos,
  analyzeYouTubeVideos,
  getYouTubeVideos,
  formatCount,
  type YouTubeVideoItem,
} from "@/lib/youtube";
import { INGESTED_POSTS_16 } from "@/lib/data/intelligence-mock-data";

function getSampleVideos(): YouTubeVideoItem[] {
  return INGESTED_POSTS_16.map((p) => ({
    id: p.id,
    externalId: p.externalId,
    title: p.title,
    publishedAt: p.publishedAt,
    durationSeconds: p.durationSeconds,
    views: p.views,
    metrics: [
      {
        views: p.views,
        likes: p.likes,
        comments: p.comments,
      },
    ],
    features: {
      topic: p.topicPillar,
      pillar: "Tutorial / Breakdown",
      hookType: p.hookType,
      ctaType: p.ctaType,
      tone: p.tone,
      classifiedAt: new Date().toISOString(),
    },
  }));
}

export function YouTubeVideoIngestPanel() {
  const [videos, setVideos] = useState<YouTubeVideoItem[]>(getSampleVideos);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [syncCount, setSyncCount] = useState<number>(20);
  const [autoClassify, setAutoClassify] = useState<boolean>(true);
  const [forceReclassify, setForceReclassify] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const data = await getYouTubeVideos();
        if (isMounted && data && data.length > 0) {
          setVideos(data);
        }
      } catch {
        // Keep sample calibrated posts
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  async function refreshVideos() {
    try {
      const data = await getYouTubeVideos();
      if (data && data.length > 0) {
        setVideos(data);
      }
    } catch {
      // Keep existing
    }
  }

  async function handleSync() {
    try {
      setIsSyncing(true);
      setNotification({
        type: "info",
        message: `Syncing last ${syncCount} YouTube videos${autoClassify ? " with Gemini AI analysis" : ""}...`,
      });

      const res = await syncYouTubeVideos({
        count: syncCount,
        classify: autoClassify,
      });

      setNotification({
        type: "success",
        message: `Successfully synced ${res.syncedCount ?? syncCount} videos${res.classifiedCount ? ` and classified ${res.classifiedCount} with Gemini AI` : ""}!`,
      });

      await refreshVideos();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sync failed";
      setNotification({
        type: "error",
        message: msg === "UNAUTHORIZED" ? "Please sign in to sync YouTube videos." : msg,
      });
    } finally {
      setIsSyncing(false);
    }
  }

  async function handleAnalyze(postIds?: string[]) {
    try {
      setIsAnalyzing(true);
      setNotification({
        type: "info",
        message: "Running Gemini 2.5 Flash classification pipeline...",
      });

      const res = await analyzeYouTubeVideos({
        force: forceReclassify,
        ...(postIds && { postIds }),
      });

      setNotification({
        type: "success",
        message: `Gemini classified ${res.analyzedCount ?? (postIds ? postIds.length : videos.length)} videos! Features updated.`,
      });

      await refreshVideos();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Analysis failed";
      setNotification({
        type: "error",
        message: msg === "UNAUTHORIZED" ? "Please sign in to analyze videos." : msg,
      });
    } finally {
      setIsAnalyzing(false);
    }
  }

  const classifiedCount = videos.filter((v) => v.features?.topic || v.features?.hookType).length;

  return (
    <div className="rounded-2xl border border-line bg-white p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-normal text-ink">
              YouTube Video Ingestion &amp; Gemini AI
            </h2>
            <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold">
              {classifiedCount} / {videos.length} Classified
            </span>
          </div>
          <p className="mt-1 text-xs text-muted">
            Import recent uploads via YouTube Data API and categorize hooks, topics, pillars, and tones using Gemini AI.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sync Count Selector */}
          <div className="flex items-center gap-1.5 rounded-xl border border-line bg-cream/70 px-2.5 py-1.5 text-xs">
            <span className="text-muted text-[11px]">Count:</span>
            <select
              value={syncCount}
              onChange={(e) => setSyncCount(Number(e.target.value))}
              className="bg-transparent font-semibold text-ink focus:outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>

          {/* Auto-classify Checkbox */}
          <label className="flex items-center gap-1.5 rounded-xl border border-line bg-cream/70 px-2.5 py-1.5 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoClassify}
              onChange={(e) => setAutoClassify(e.target.checked)}
              className="rounded accent-brand size-3.5"
            />
            <span className="text-[11px] font-medium text-ink">Auto-Classify</span>
          </label>

          {/* Sync Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={handleSync}
            disabled={isSyncing}
            leadingIcon={
              <Icon
                name="refresh"
                className={`size-3.5 ${isSyncing ? "animate-spin" : ""}`}
              />
            }
            className="text-xs font-semibold h-9"
          >
            {isSyncing ? "Syncing..." : "Sync Videos"}
          </Button>

          {/* Analyze with Gemini Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleAnalyze()}
            disabled={isAnalyzing || videos.length === 0}
            leadingIcon={
              <Icon
                name="zap"
                className={`size-3.5 text-brand ${isAnalyzing ? "animate-bounce" : ""}`}
              />
            }
            className="text-xs font-semibold h-9"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze with Gemini"}
          </Button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`flex items-center justify-between rounded-xl px-4 py-3 text-xs animate-in fade-in ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : notification.type === "error"
              ? "bg-red-50 text-red-800 border border-red-200"
              : "bg-brand/10 text-brand-strong border border-brand/20"
          }`}
        >
          <div className="flex items-center gap-2">
            <Icon
              name={
                notification.type === "success"
                  ? "check"
                  : notification.type === "error"
                  ? "alert-triangle"
                  : "info"
              }
              className="size-4 shrink-0"
            />
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-muted hover:text-ink font-semibold ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Force re-classify toggle */}
      <div className="flex items-center justify-between text-xs text-muted pt-1">
        <div className="flex items-center gap-2">
          <Icon name="shield" className="size-3.5 text-brand" />
          <span>
            API Endpoints: <code className="font-mono text-[11px] bg-black/5 px-1.5 py-0.5 rounded">POST /api/youtube/sync</code> · <code className="font-mono text-[11px] bg-black/5 px-1.5 py-0.5 rounded">POST /api/youtube/analyze</code> · <code className="font-mono text-[11px] bg-black/5 px-1.5 py-0.5 rounded">GET /api/youtube/videos</code>
          </span>
        </div>

        <label className="flex items-center gap-1.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={forceReclassify}
            onChange={(e) => setForceReclassify(e.target.checked)}
            className="rounded accent-brand size-3"
          />
          <span className="text-[11px]">Force Re-Analyze Existing Posts</span>
        </label>
      </div>

      {/* Videos List / Table */}
      {isSyncing ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted text-xs space-y-2">
          <Icon name="refresh" className="size-6 animate-spin text-brand" />
          <span>Syncing and processing YouTube uploads...</span>
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-dashed border-line bg-cream/30 p-8 space-y-3">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand">
            <Icon name="video" className="size-6" />
          </div>
          <h3 className="font-serif text-lg font-normal text-ink">
            No Videos Ingested Yet
          </h3>
          <p className="text-xs text-muted max-w-md mx-auto">
            Click &quot;Sync Videos&quot; above to pull your most recent 10 to 20 uploads from YouTube and classify their hooks and topics.
          </p>
          <Button variant="primary" size="sm" onClick={handleSync}>
            Sync Recent Videos
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted font-medium pb-1 border-b border-line">
            <span>Video Title &amp; Metadata</span>
            <span className="hidden sm:inline">Gemini AI Features</span>
          </div>

          <div className="divide-y divide-line/60">
            {videos.map((video) => {
              const viewsCount =
                video.views ?? video.metrics?.[0]?.views ?? 0;
              const hasFeatures = Boolean(
                video.features?.topic || video.features?.hookType
              );

              return (
                <div
                  key={video.id || video.externalId}
                  className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-cream/40 rounded-xl px-2 transition-colors"
                >
                  {/* Left: Title, date, views */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-red-100 text-red-600 font-bold text-xs">
                      <Icon name="video" className="size-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-xs text-ink truncate hover:text-clip">
                        {video.title}
                      </h4>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted">
                        <span className="font-mono font-medium text-ink">
                          {formatCount(viewsCount)} views
                        </span>
                        <span>·</span>
                        <span>{video.publishedAt?.slice(0, 10)}</span>
                        {video.durationSeconds && (
                          <>
                            <span>·</span>
                            <span>{Math.round(video.durationSeconds / 60)}m</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: AI Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 md:justify-end shrink-0">
                    {hasFeatures ? (
                      <>
                        {video.features?.hookType && (
                          <span className="rounded-full bg-brand/10 text-brand border border-brand/20 px-2 py-0.5 text-[10px] font-semibold">
                            {video.features.hookType}
                          </span>
                        )}
                        {video.features?.topic && (
                          <span className="rounded-full bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 text-[10px] font-medium">
                            {video.features.topic}
                          </span>
                        )}
                        {video.features?.pillar && (
                          <span className="rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 text-[10px] font-medium hidden sm:inline">
                            {video.features.pillar}
                          </span>
                        )}
                        {video.features?.tone && (
                          <span className="rounded-full bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 text-[10px] font-medium hidden lg:inline">
                            {video.features.tone}
                          </span>
                        )}
                        <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold">
                          ✓ Classified
                        </span>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 text-[10px] font-medium">
                          Pending AI Analysis
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAnalyze([video.id])}
                          className="text-[11px] h-7 px-2 text-brand hover:text-brand-strong"
                        >
                          Classify
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
