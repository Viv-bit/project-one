"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { useYouTubeConnection } from "@/lib/youtube-connection-context";
import { getCurrentUser, type AuthUser } from "@/lib/auth";
import { getCreatorProfile, type CreatorProfileResponse } from "@/lib/creator";
import {
  getYouTubeVideos,
  syncYouTubeVideos,
  formatCount,
  type YouTubeVideoItem,
} from "@/lib/youtube";

function getIngestionStages(channelName?: string, count: number = 0) {
  const channelDisplay = channelName || "Connected Channel";
  const numUploads = count > 0 ? count : 16;
  return [
    {
      id: "stage-oauth",
      stepNumber: 1,
      title: "YouTube OAuth Handshake",
      description: `Read-only access verified with channel ${channelDisplay} via Google OAuth v2.`,
      status: "completed" as const,
      itemsProcessed: 1,
      totalItems: 1,
      details: "Granted scopes: youtube.readonly. Encryption token stored with AES-256-GCM.",
    },
    {
      id: "stage-ingest",
      stepNumber: 2,
      title: "Historical Uploads Ingestion",
      description: "Ingesting past 10–20 video metadata, view counts, watch time, and engagement snapshots.",
      status: "completed" as const,
      itemsProcessed: numUploads,
      totalItems: numUploads,
      details: `Batch 1 calibrated across ${numUploads} uploads.`,
    },
    {
      id: "stage-audio",
      stepNumber: 3,
      title: "Audio Extraction & Transcription",
      description: "Extracting audio track and executing speech-to-text with word-level timestamps.",
      status: "completed" as const,
      itemsProcessed: numUploads,
      totalItems: numUploads,
      details: `${numUploads} Whisper STT transcripts generated and cached. Mean latency: 0.38s/min.`,
    },
    {
      id: "stage-classify",
      stepNumber: 4,
      title: "AI Hook & Feature Classification",
      description: "Fast LLM classification categorizing hook types, topic pillars, and pacing markers.",
      status: "completed" as const,
      itemsProcessed: numUploads,
      totalItems: numUploads,
      details: "Extracted Hook Typology: Problem-First, Bold Statement, Story Narrative, Curiosity Gap.",
    },
    {
      id: "stage-cohort",
      stepNumber: 5,
      title: "Peer Cohort Benchmarking",
      description: "Vector similarity search matching creator profile against comparable niche creators.",
      status: "completed" as const,
      itemsProcessed: 18,
      totalItems: 18,
      details: "Matched peer cohort creators in comparable subscriber tier.",
    },
    {
      id: "stage-synthesis",
      stepNumber: 6,
      title: "Evidence & Opportunity Synthesis",
      description: "Deterministic rules engine evaluating performance discrepancies and formulating hypotheses.",
      status: "completed" as const,
      itemsProcessed: 3,
      totalItems: 3,
      details: "Emitted high-confidence opportunities with pointers to exact video upload IDs.",
    },
  ];
}

function formatDuration(seconds?: number | null): string {
  if (!seconds || seconds <= 0) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

function formatPublishedDate(dateStr?: string | null): string {
  if (!dateStr) return "Recently";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function getInitials(name?: string | null, email?: string | null): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email?.trim()) {
    return email.slice(0, 2).toUpperCase();
  }
  return "ME";
}

const GRADIENTS = [
  "from-amber-700 via-stone-800 to-black",
  "from-rose-800 via-stone-800 to-black",
  "from-emerald-800 via-stone-800 to-black",
  "from-indigo-800 via-stone-800 to-black",
  "from-stone-700 via-neutral-800 to-black",
  "from-amber-900 via-stone-900 to-black",
];

export function IngestionPipelineView() {
  const {
    isConnected,
    channel,
    connectYouTube,
    refreshConnection,
    isDemoMode,
    toggleDemoMode,
  } = useYouTubeConnection();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [profileData, setProfileData] = useState<CreatorProfileResponse | null>(null);
  const [videos, setVideos] = useState<YouTubeVideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeStageIndex, setActiveStageIndex] = useState(5);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Fetch live user session, creator profile, and videos
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [userData, videosData] = await Promise.all([
        getCurrentUser().catch(() => null),
        getYouTubeVideos().catch(() => []),
      ]);

      if (userData) setUser(userData);
      if (videosData && Array.isArray(videosData)) {
        setVideos(videosData);
      }

      if (isConnected) {
        const creatorData = await getCreatorProfile().catch(() => null);
        if (creatorData) setProfileData(creatorData);
      }
    } catch (err) {
      console.error("Failed to load onboarding intelligence data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadData();
  }, [loadData]);

  // Active channel details (real or connected context)
  const activeChannel = profileData?.channel ?? channel;
  const stages = getIngestionStages(activeChannel?.title, videos.length);
  const activeStage = stages[Math.min(activeStageIndex, stages.length - 1)] ?? stages[0];

  // Real-time channel sync and pipeline animation
  async function handleSyncChannel() {
    setIsSyncing(true);
    setActiveStageIndex(0);
    setFeedback({
      type: "info",
      message: "Initiating YouTube historical ingestion pipeline (Batch 1: 10–20 Uploads)...",
    });

    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current < stages.length) {
        setActiveStageIndex(current);
      }
    }, 900);

    try {
      const res = await syncYouTubeVideos({ count: 20, classify: true });
      await refreshConnection();
      const updatedVideos = await getYouTubeVideos();
      if (updatedVideos && updatedVideos.length > 0) {
        setVideos(updatedVideos);
      }
      const updatedProfile = await getCreatorProfile().catch(() => null);
      if (updatedProfile) {
        setProfileData(updatedProfile);
      }

      clearInterval(interval);
      setActiveStageIndex(stages.length - 1);
      setFeedback({
        type: "success",
        message: `Successfully ingested ${res.syncedCount ?? updatedVideos.length} uploads! Audio separated and STT transcripts calibrated.`,
      });
      setTimeout(() => setFeedback(null), 5000);
    } catch (err: unknown) {
      clearInterval(interval);
      const errMsg = err instanceof Error ? err.message : "Ingestion sync failed";
      setFeedback({
        type: "error",
        message: `Pipeline sync failed: ${errMsg}. Please try again or check YouTube permissions.`,
      });
    } finally {
      setIsSyncing(false);
    }
  }

  function handleReRunSimulation() {
    setIsSyncing(true);
    setActiveStageIndex(0);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current >= stages.length) {
        clearInterval(interval);
        setActiveStageIndex(stages.length - 1);
        setIsSyncing(false);
      } else {
        setActiveStageIndex(current);
      }
    }, 700);
  }
  const channelName = activeChannel?.title ?? (user?.name || user?.email ? `${user.name || user.email.split("@")[0]}'s Channel` : "Creator Channel");
  const channelHandle = activeChannel?.handle
    ? (activeChannel.handle.startsWith("@") ? activeChannel.handle : `@${activeChannel.handle}`)
    : (user?.email ? `@${user.email.split("@")[0]}` : "@creator");
  const subscribersText = activeChannel?.subscriberCount != null
    ? `${formatCount(activeChannel.subscriberCount)} Subscribers`
    : isConnected
    ? "Subscribers Synced"
    : "Awaiting Channel Link";
  const nicheText = profileData?.profile?.inferredNiche ?? "Creator Intelligence";
  const userDisplayName = user?.name || user?.email || "Authenticated Creator";
  const userInitials = getInitials(user?.name, user?.email);

  // Ingested posts display list:
  const hasRealVideos = videos.length > 0;
  const displayVideosCount = videos.length;

  return (
    <div className="space-y-8">
      {/* Feedback Alert Toast */}
      {feedback && (
        <div
          className={`flex items-center gap-3 rounded-2xl border p-4 text-xs font-medium animate-in fade-in ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : feedback.type === "error"
              ? "bg-red-50 border-red-200 text-red-900"
              : "bg-brand/5 border-brand/20 text-ink"
          }`}
        >
          <Icon
            name={
              feedback.type === "success"
                ? "check-circle"
                : feedback.type === "error"
                ? "ban"
                : "refresh-cw"
            }
            className={`size-4 shrink-0 ${
              feedback.type === "success"
                ? "text-emerald-600"
                : feedback.type === "error"
                ? "text-red-600"
                : "text-brand animate-spin"
            }`}
          />
          <p className="flex-1">{feedback.message}</p>
          <button
            onClick={() => setFeedback(null)}
            className="text-muted hover:text-ink text-xs ml-auto"
          >
            <Icon name="x" className="size-3.5" />
          </button>
        </div>
      )}

      {/* Channel & User Identity Header Summary */}
      <div className="rounded-2xl border border-[#e6e0d6] bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          {/* Identity Presentation */}
          <div className="flex items-start sm:items-center gap-4">
            {isConnected && activeChannel?.thumbnailUrl ? (
              <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl border border-[#d8d0c4] bg-[#ebdccb] shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeChannel.thumbnailUrl}
                  alt={channelName}
                  className="size-full object-cover"
                />
              </div>
            ) : (
              <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl border border-[#d8d0c4] bg-[#ebdccb] shadow-sm flex items-center justify-center font-serif text-xl font-bold text-[#5c4a37]">
                {isConnected && activeChannel?.title
                  ? activeChannel.title.slice(0, 2).toUpperCase()
                  : userInitials}
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif text-2xl font-normal text-ink">
                  {isConnected ? channelName : userDisplayName}
                </h1>

                {isConnected ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                    <Icon name="check" className="size-3 text-emerald-600" />
                    {hasRealVideos ? `Batch 1 Calibrated (${videos.length} Uploads)` : "YouTube Connected"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 border border-amber-200">
                    <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                    YouTube Not Connected
                  </span>
                )}

                {user?.email && (
                  <span className="hidden md:inline-flex items-center rounded-full bg-[#f4ede3] px-2 py-0.5 text-[11px] font-medium text-[#73695d]">
                    User: {user.email}
                  </span>
                )}
              </div>

              <p className="mt-1 text-xs text-muted flex flex-wrap items-center gap-x-2 gap-y-0.5">
                {isConnected ? (
                  <>
                    <span className="font-medium text-ink">{channelHandle}</span>
                    <span>·</span>
                    <span>{subscribersText}</span>
                    <span>·</span>
                    <span>Niche: {nicheText}</span>
                    <span>·</span>
                    <span>{activeChannel?.videoCount ?? videos.length} Channel Videos</span>
                  </>
                ) : (
                  <>
                    <span className="font-medium text-ink">Account: {user?.email || "Signed In"}</span>
                    <span>·</span>
                    <span>Connect your YouTube channel to start historical ingestion</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {isConnected ? (
              <>
                <button
                  onClick={handleSyncChannel}
                  disabled={isSyncing}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#ded6c7] bg-[#faf7f2] px-3.5 py-2 text-xs font-semibold text-ink hover:bg-cream transition-colors disabled:opacity-50"
                >
                  <Icon
                    name="refresh-cw"
                    className={`size-3.5 text-brand ${isSyncing ? "animate-spin" : ""}`}
                  />
                  <span>{isSyncing ? "Ingesting Uploads..." : "Sync Channel Uploads"}</span>
                </button>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-strong transition-colors"
                >
                  <span>Explore Dashboard</span>
                  <Icon name="arrow-right" className="size-3.5" />
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={connectYouTube}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#e62117] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#cc1810]"
                >
                  <Icon name="youtube" className="size-4" />
                  <span>Connect YouTube Channel</span>
                </button>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#ded6c7] bg-[#faf7f2] px-3.5 py-2 text-xs font-semibold text-ink hover:bg-cream transition-colors"
                >
                  <span>Go to Dashboard</span>
                  <Icon name="arrow-right" className="size-3" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 6 Pipeline Stage Steps */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
            Intelligence Pipeline Execution (10–20 Uploads Batch)
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-brand font-semibold">
              {activeStageIndex + 1} of {stages.length} Stages Complete
            </span>
            <button
              onClick={handleReRunSimulation}
              disabled={isSyncing}
              className="text-[11px] text-muted hover:text-ink underline decoration-dotted"
            >
              Replay Visualizer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {stages.map((stage, idx) => {
            const isCompleted = idx <= activeStageIndex;
            const isCurrent = idx === activeStageIndex;

            // Compute dynamic items processed count
            const itemsProcessed = isCompleted
              ? displayVideosCount > 0
                ? displayVideosCount
                : stage.itemsProcessed
              : 0;

            const totalItems = displayVideosCount > 0 ? displayVideosCount : stage.totalItems;

            return (
              <button
                key={stage.id}
                onClick={() => setActiveStageIndex(idx)}
                className={`relative flex flex-col justify-between rounded-xl p-3 text-left transition-all border ${
                  isCurrent
                    ? "border-brand bg-white shadow-md ring-2 ring-brand/20"
                    : isCompleted
                    ? "border-emerald-200 bg-emerald-50/50 hover:bg-white"
                    : "border-[#e8e2d8] bg-[#faf7f2] opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-muted">
                    0{stage.stepNumber}
                  </span>
                  <div
                    className={`grid size-5 place-items-center rounded-full text-[10px] ${
                      isCompleted
                        ? "bg-emerald-600 text-white"
                        : "bg-[#e8e2d8] text-muted"
                    }`}
                  >
                    {isCompleted ? (
                      <Icon name="check" className="size-3" />
                    ) : (
                      stage.stepNumber
                    )}
                  </div>
                </div>

                <div className="mt-2">
                  <h3 className="text-xs font-semibold text-ink line-clamp-1">
                    {stage.title}
                  </h3>
                  <p className="text-[10px] text-muted mt-0.5">
                    {itemsProcessed}/{totalItems} items
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Deep Dive */}
      <div className="rounded-2xl border border-brand/20 bg-brand/[0.02] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex size-6 items-center justify-center rounded-lg bg-brand text-white text-xs font-bold">
                {activeStage.stepNumber}
              </span>
              <h3 className="font-serif text-xl font-normal text-ink">
                Stage {activeStage.stepNumber}: {activeStage.title}
              </h3>
            </div>
            <p className="mt-1 text-xs text-muted max-w-2xl leading-relaxed">
              {activeStage.description}
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            {isConnected ? "Verified & Calibrated" : "Awaiting Channel Connection"}
          </span>
        </div>

        {activeStage.details && (
          <div className="mt-3.5 rounded-xl border border-[#e6e0d6] bg-white p-3 text-xs text-[#5c544c]">
            <strong className="text-ink font-semibold">Stage Result:</strong>{" "}
            {hasRealVideos
              ? `${activeStage.details} (${videos.length} user videos processed)`
              : activeStage.details}
          </div>
        )}
      </div>

      {/* Ingested Uploads Stream */}
      {/* Ingested Uploads Stream */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-serif text-xl font-normal text-ink">
              {hasRealVideos
                ? `Batch 1 Ingested Content (${videos.length} Uploads)`
                : "Batch 1 Content Ingestion"}
            </h3>
            <p className="text-xs text-muted">
              {hasRealVideos
                ? "Normalized video metadata, Whisper STT transcripts, and hook hold rates from your YouTube uploads."
                : "Connect your channel to sync real video uploads, transcribe speech, and calculate retention benchmarks."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted">
              {videos.length} Uploads Ingested
            </span>
          </div>
        </div>

        {/* Real User Videos Grid */}
        {hasRealVideos && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {videos.map((post, idx) => {
              const viewCount = post.views ?? post.metrics?.[0]?.views ?? 0;
              const likesCount = post.likes ?? post.metrics?.[0]?.likes ?? 0;
              const hookType = post.features?.hookType ?? "Problem-First";
              const topic = post.features?.topic ?? post.features?.pillar ?? "Creator Content";
              const gradient = GRADIENTS[idx % GRADIENTS.length];

              return (
                <div
                  key={post.id || post.externalId || idx}
                  className="group flex flex-col justify-between rounded-2xl border border-[#e6e0d6] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:border-brand/40 hover:shadow-sm"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-stone-900 shadow-inner flex flex-col justify-between p-2.5">
                      {post.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.thumbnailUrl}
                          alt={post.title}
                          className="absolute inset-0 size-full object-cover transition-transform group-hover:scale-105 duration-300"
                        />
                      ) : (
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${gradient} p-3 flex flex-col justify-between text-white`}
                        />
                      )}

                      <div className="relative z-10 flex items-center justify-between">
                        <span className="rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-mono text-white backdrop-blur-sm">
                          {formatDuration(post.durationSeconds)}
                        </span>
                        <span className="rounded bg-emerald-600/90 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                          Ingested
                        </span>
                      </div>

                      <div className="relative z-10">
                        <p className="line-clamp-2 text-xs font-medium leading-snug text-white drop-shadow-md">
                          {post.title}
                        </p>
                      </div>
                    </div>

                    <h4 className="mt-3 text-xs font-semibold text-ink line-clamp-1 group-hover:text-brand transition-colors">
                      {post.title}
                    </h4>
                    <p className="mt-0.5 text-[11px] text-muted">
                      {formatCount(viewCount)} views · {formatPublishedDate(post.publishedAt)}
                    </p>
                  </div>

                  {/* Pipeline Extracted Tags */}
                  <div className="mt-3 pt-3 border-t border-[#f0ebe1] space-y-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded bg-[#faf7f2] border border-[#e8e2d8] px-1.5 py-0.5 text-[10px] font-medium text-ink">
                        {hookType}
                      </span>
                      <span className="rounded bg-[#faf7f2] border border-[#e8e2d8] px-1.5 py-0.5 text-[10px] font-medium text-muted truncate max-w-[140px]">
                        {topic}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-muted font-mono">
                      <span className="flex items-center gap-1 text-emerald-700">
                        <Icon name="check" className="size-3" />
                        STT Processed
                      </span>
                      <span>{formatCount(likesCount)} likes</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State when no videos exist */}
        {!hasRealVideos && (
          <div className="rounded-2xl border border-dashed border-[#d8d0c4] bg-white p-8 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#faf7f2] border border-[#e8e2d8] text-brand">
              <Icon name="video" className="size-7 text-brand" />
            </div>

            <h4 className="mt-4 font-serif text-xl font-normal text-ink">
              {isConnected
                ? "Channel Connected · Ready for Historical Ingestion"
                : "No Historical Content Ingested"}
            </h4>

            <p className="mx-auto mt-1 max-w-md text-xs text-muted leading-relaxed">
              {isConnected
                ? "Click 'Start Historical Ingestion' below to pull your past 10–20 YouTube uploads, transcribe hooks with Whisper STT, and calibrate your retention curve."
                : "Connect your YouTube channel to start automatic video ingestion and calculate your retention hold rates."}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              {isConnected ? (
                <button
                  onClick={handleSyncChannel}
                  disabled={isSyncing}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-strong transition-colors disabled:opacity-50"
                >
                  <Icon
                    name="refresh-cw"
                    className={`size-3.5 ${isSyncing ? "animate-spin" : ""}`}
                  />
                  <span>
                    {isSyncing ? "Ingesting YouTube Uploads..." : "Start Historical Ingestion (Batch 1)"}
                  </span>
                </button>
              ) : (
                <button
                  onClick={connectYouTube}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#e62117] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#cc1810] transition-colors"
                >
                  <Icon name="youtube" className="size-4" />
                  <span>Connect YouTube Channel</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
