"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui";
import { useYouTubeConnection } from "@/lib/youtube-connection-context";
import { getCreatorProfile, type CreatorProfileResponse } from "@/lib/creator";
import { getYouTubeVideos, type YouTubeVideoItem } from "@/lib/youtube";
import { getRecommendations, type ApiRecommendation } from "@/lib/insights";
import { GrowthPlanHeader } from "./growth-plan-header";
import { HorizonObjectiveCard } from "./horizon-objective-card";
import { AlgorithmicLeversSection } from "./algorithmic-levers-section";
import { SequencedSprintsSection } from "./sequenced-sprints-section";
import { PrescribedExperimentsSection } from "./prescribed-experiments-section";
import { CreatorPitfallsSection } from "./creator-pitfalls-section";
import { GrowthPlanFooter } from "./growth-plan-footer";

function calculateMilestone(subs: number) {
  let target = 10000;
  let launchBaseline = 0;
  if (subs < 1000) {
    target = 5000;
    launchBaseline = 0;
  } else if (subs < 10000) {
    target = 25000;
    launchBaseline = 1000;
  } else if (subs < 50000) {
    target = 100000;
    launchBaseline = 10000;
  } else if (subs < 250000) {
    target = 500000;
    launchBaseline = 50000;
  } else if (subs < 500000) {
    target = 750000;
    launchBaseline = 250000;
  } else if (subs < 1000000) {
    target = 1500000;
    launchBaseline = 500000;
  } else {
    target = Math.ceil((subs + 1) / 500000) * 500000;
    launchBaseline = target - 500000;
  }

  const progressPercent = Math.min(
    100,
    Math.max(5, ((subs - launchBaseline) / Math.max(1, target - launchBaseline)) * 100)
  );
  const requiredNet =
    target > subs
      ? `Required Net: +${(target - subs).toLocaleString()}`
      : "Milestone Achieved";

  return {
    target,
    launchBaseline,
    progressPercent,
    requiredNet,
    title: `Breakthrough to ${target.toLocaleString()} Verified Subscribers`,
  };
}

export function GrowthPlanView() {
  const { isConnected, channel, connectYouTube } = useYouTubeConnection();
  const [profile, setProfile] = useState<CreatorProfileResponse | null>(null);
  const [videos, setVideos] = useState<YouTubeVideoItem[]>([]);
  const [recommendations, setRecommendations] = useState<ApiRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!isConnected) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const [profileRes, videosRes, recsRes] = await Promise.allSettled([
          getCreatorProfile(),
          getYouTubeVideos(),
          getRecommendations(),
        ]);

        if (isMounted) {
          if (profileRes.status === "fulfilled" && profileRes.value) {
            setProfile(profileRes.value);
          }
          if (videosRes.status === "fulfilled" && Array.isArray(videosRes.value)) {
            setVideos(videosRes.value);
          }
          if (recsRes.status === "fulfilled" && recsRes.value) {
            setRecommendations(recsRes.value.recommendations ?? []);
          }
        }
      } catch (err) {
        console.error("Failed to load growth plan dependencies:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadData();

    return () => {
      isMounted = false;
    };
  }, [isConnected]);

  // Loading state skeleton
  if (isLoading) {
    return (
      <div className="space-y-8 pb-12 animate-pulse">
        <div className="h-28 rounded-2xl bg-stone-100/80" />
        <div className="h-36 rounded-2xl bg-stone-100/80" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-44 rounded-2xl bg-stone-100/80" />
          <div className="h-44 rounded-2xl bg-stone-100/80" />
          <div className="h-44 rounded-2xl bg-stone-100/80" />
        </div>
      </div>
    );
  }

  const activeChannel = profile?.channel ?? channel;
  const channelTitle = activeChannel?.title;
  const channelHandle = activeChannel?.handle ?? undefined;
  const subscribersCount =
    typeof activeChannel?.subscriberCount === "number"
      ? activeChannel.subscriberCount
      : profile?.channel?.subscriberCount ?? 0;

  const hasVideos = videos.length > 0;

  // Empty state when disconnected or 0 videos synced
  if (!isConnected || !hasVideos) {
    return (
      <div className="space-y-8 pb-12">
        {/* Breadcrumb row */}
        <div className="flex items-center gap-1.5 text-xs text-[#7a7167]">
          <span>Analytics Engine</span>
          <span className="text-[#c4bbb0]">/</span>
          <span className="font-semibold text-brand">Growth Strategy &amp; Roadmap</span>
          <span className="text-[#c4bbb0]">/</span>
          <span className="text-ink font-medium">Awaiting Ingestion</span>
        </div>

        {/* Empty State Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-dashed border-[#d8d0c4] bg-white p-8 sm:p-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#faf5ed] border border-[#eee2d0] text-brand shadow-sm">
            <Icon name="shield" className="size-8 text-brand" />
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
            <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
            <span>{!isConnected ? "YouTube Connection Required" : "Upload Ingestion Required"}</span>
          </div>

          <h1 className="mt-4 font-serif text-3xl sm:text-4xl font-normal tracking-tight text-ink max-w-xl mx-auto">
            Calibrate Your 90-Day{" "}
            <span className="text-brand font-medium">Growth Roadmap</span>
          </h1>

          <p className="mt-3 text-sm text-[#70665a] max-w-lg mx-auto leading-relaxed">
            {!isConnected
              ? "Connect your YouTube channel to analyze your historical upload baseline, discover high-impact algorithmic levers, and unlock sequenced 90-day growth sprints."
              : "Your channel is connected! Ingest your past 10–20 video uploads so our analytics engine can calibrate hook retention, 72-hour view velocity, and pacing levers."}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {!isConnected ? (
              <button
                onClick={connectYouTube}
                className="inline-flex items-center gap-2 rounded-xl bg-[#e62117] px-5 py-3 text-xs font-semibold text-white shadow-md hover:bg-[#cc1810] transition-colors"
              >
                <Icon name="youtube" className="size-4" />
                <span>Connect YouTube Channel</span>
              </button>
            ) : (
              <Link
                href="/dashboard/onboarding"
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-xs font-semibold text-white shadow-md hover:bg-brand-strong transition-colors"
              >
                <Icon name="refresh" className="size-4" />
                <span>Ingest Historical Uploads (Batch 1)</span>
              </Link>
            )}

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-[#dcd4c8] bg-white px-4 py-3 text-xs font-semibold text-ink hover:bg-[#faf7f3] transition-colors"
            >
              <Icon name="arrow-right" className="size-3.5 rotate-180 text-muted" />
              <span>Back to Overview</span>
            </Link>
          </div>
        </div>

        {/* Locked Preview Cards Matrix */}
        <div className="space-y-4 opacity-60 pointer-events-none select-none">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
              Roadmap Components Unlocked Upon Calibration
            </h2>
            <span className="text-xs text-muted flex items-center gap-1 font-mono">
              <Icon name="lock" className="size-3" />
              Locked
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-dashed border-[#e6e0d6] bg-[#faf8f4] p-5">
              <span className="text-[11px] font-bold text-muted uppercase">Phase 1</span>
              <h3 className="mt-1 text-sm font-bold text-ink">Hook Retention Architecture</h3>
              <p className="mt-1 text-xs text-muted">
                First 15s drop-off elimination and tactile stinger cuts.
              </p>
            </div>
            <div className="rounded-2xl border border-dashed border-[#e6e0d6] bg-[#faf8f4] p-5">
              <span className="text-[11px] font-bold text-muted uppercase">Phase 2</span>
              <h3 className="mt-1 text-sm font-bold text-ink">Mid-Video Pacing Bridges</h3>
              <p className="mt-1 text-xs text-muted">
                Systematic removal of 0:42s crater drop-offs across catalog.
              </p>
            </div>
            <div className="rounded-2xl border border-dashed border-[#e6e0d6] bg-[#faf8f4] p-5">
              <span className="text-[11px] font-bold text-muted uppercase">Phase 3</span>
              <h3 className="mt-1 text-sm font-bold text-ink">Algorithmic Velocity Levers</h3>
              <p className="mt-1 text-xs text-muted">
                Pacing, runtime cadence, and high-stakes topic packaging.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Connected state with real videos calibrated
  const milestone = calculateMilestone(subscribersCount);

  return (
    <div className="space-y-8 pb-12">
      {/* Dynamic Header */}
      <GrowthPlanHeader
        channelTitle={channelTitle}
        channelHandle={channelHandle}
        videosCount={videos.length}
        subscribersCount={subscribersCount}
      />

      {/* Dynamic Horizon Objective Card */}
      <HorizonObjectiveCard
        currentSubscribers={subscribersCount}
        targetSubscribers={milestone.target}
        progressPercent={milestone.progressPercent}
        requiredNet={milestone.requiredNet}
        title={milestone.title}
        channelLaunchBaseline={`Current Baseline: ${subscribersCount.toLocaleString()} subs`}
      />

      {/* Primary Algorithmic Levers (3 Levers) */}
      <AlgorithmicLeversSection />

      {/* Sequenced 90-Day Sprints (Sprints 1 to 4) */}
      <SequencedSprintsSection />

      {/* Prescribed Video Experiments */}
      <PrescribedExperimentsSection />

      {/* Creator Pitfalls & Strategic Review */}
      <CreatorPitfallsSection channelTitle={channelTitle} />

      {/* Engine & Run Metadata Footer */}
      <GrowthPlanFooter />
    </div>
  );
}
