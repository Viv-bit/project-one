"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { formatCount } from "@/lib/youtube";
import type { PeerCreator, PeerSampleVideo } from "@/lib/benchmarks";

type PeerCreatorsSectionProps = {
  peerCreators: PeerCreator[];
};

function getPeerChannelUrl(peer: PeerCreator): string | null {
  if (peer.channelHandle && peer.channelHandle.trim()) {
    const raw = peer.channelHandle.trim();
    const handle = raw.startsWith("@") ? raw : `@${raw}`;
    return `https://www.youtube.com/${handle}`;
  }
  if (peer.channelId && peer.channelId.trim()) {
    return `https://www.youtube.com/channel/${peer.channelId.trim()}`;
  }
  return null;
}

function formatHandleLabel(peer: PeerCreator): string {
  if (peer.channelHandle && peer.channelHandle.trim()) {
    const raw = peer.channelHandle.trim();
    return raw.startsWith("@") ? raw : `@${raw}`;
  }
  if (peer.channelId) {
    return "View YouTube Channel";
  }
  return "YouTube Creator";
}

function formatVideoDuration(seconds: number | null | undefined): string {
  if (seconds == null || seconds <= 0) return "—";
  const totalSecs = Math.round(seconds);
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function PeerAvatar({
  thumbnailUrl,
  title,
}: {
  thumbnailUrl?: string | null;
  title: string;
}) {
  const [imgError, setImgError] = useState(false);

  if (thumbnailUrl && !imgError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={thumbnailUrl}
        alt={title}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className="size-12 shrink-0 rounded-xl border border-[#e6e0d6] object-cover bg-[#faf7f2]"
      />
    );
  }

  return (
    <div className="grid size-12 shrink-0 place-items-center rounded-xl border border-[#e6e0d6] bg-gradient-to-tr from-brand/90 to-brand-strong text-white font-serif text-lg font-bold">
      {(title || "Y").slice(0, 1).toUpperCase()}
    </div>
  );
}

function SampleVideoCard({ video }: { video: PeerSampleVideo }) {
  const [thumbErr, setThumbErr] = useState(false);
  const watchUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(video.videoId)}`;

  return (
    <div className="flex flex-col justify-between rounded-xl border border-[#e8e1d5] bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3">
      <div className="space-y-2.5">
        {/* Video Thumbnail + Runtime Overlay */}
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block aspect-video w-full overflow-hidden rounded-lg bg-stone-900"
        >
          {video.thumbnailUrl && !thumbErr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              referrerPolicy="no-referrer"
              onError={() => setThumbErr(true)}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-[#26221e] text-white/70">
              <Icon name="youtube" className="size-7" />
            </div>
          )}

          {video.durationSeconds != null && video.durationSeconds > 0 && (
            <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white">
              {formatVideoDuration(video.durationSeconds)}
            </span>
          )}
        </a>

        {/* Badges: Hook Type & Pillar */}
        <div className="flex flex-wrap items-center gap-1.5">
          {video.hookType && (
            <span className="rounded-md bg-brand/10 border border-brand/20 px-2 py-0.5 text-[10px] font-semibold text-brand">
              Hook: {video.hookType}
            </span>
          )}
          {video.pillar && (
            <span className="rounded-md bg-[#faf7f2] border border-[#e8e2d8] px-2 py-0.5 text-[10px] font-medium text-[#5c5348]">
              {video.pillar}
            </span>
          )}
        </div>

        {/* Title */}
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-xs font-bold text-ink leading-snug hover:text-brand transition-colors line-clamp-2"
        >
          {video.title}
        </a>

        {/* Spoken Hook */}
        {video.spokenHook && (
          <blockquote className="rounded-lg border-l-2 border-brand bg-[#fdf9f4] px-2.5 py-2 text-[11px] italic text-[#5c5348] leading-relaxed">
            &ldquo;{video.spokenHook}&rdquo;
          </blockquote>
        )}
      </div>

      {/* Video Telemetry + External Watch Link */}
      <div className="pt-2.5 border-t border-[#f2ece2] flex items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-2.5 font-mono text-muted">
          <span>
            <strong className="text-ink">{formatCount(video.views)}</strong>{" "}
            views
          </span>
          {video.durationSeconds != null && (
            <span>{formatVideoDuration(video.durationSeconds)}</span>
          )}
        </div>

        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-brand hover:underline"
        >
          <span>Watch</span>
          <Icon name="external-link" className="size-3" />
        </a>
      </div>
    </div>
  );
}

export function PeerCreatorsSection({ peerCreators }: PeerCreatorsSectionProps) {
  const [expandedPeerIds, setExpandedPeerIds] = useState<Record<string, boolean>>(
    {},
  );

  if (!peerCreators || peerCreators.length === 0) {
    return null;
  }

  function togglePeer(id: string) {
    setExpandedPeerIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <section
      aria-labelledby="peer-creators-heading"
      className="space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h2
            id="peer-creators-heading"
            className="font-serif text-2xl font-normal text-ink"
          >
            Analyzed Peer Channels &amp; Sample Videos
          </h2>
          <p className="text-xs text-muted">
            Public channel telemetry, dominant hook patterns, and sample videos
            from comparable creators in your cohort.
          </p>
        </div>
        <span className="text-xs font-mono text-muted">
          {peerCreators.length} Comparable Channels
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {peerCreators.map((peer) => {
          const isExpanded = Boolean(expandedPeerIds[peer.id]);
          const channelUrl = getPeerChannelUrl(peer);
          const sampleVideos = peer.sampleVideos ?? [];
          const hasSampleVideos = sampleVideos.length > 0;
          const engagementFormatted =
            typeof peer.engagementRate === "number"
              ? `${peer.engagementRate.toFixed(1)}%`
              : "—";
          const monthlyCadenceFormatted =
            typeof peer.monthlyPostFrequency === "number"
              ? `${Number.isInteger(peer.monthlyPostFrequency) ? peer.monthlyPostFrequency : peer.monthlyPostFrequency.toFixed(1)}/mo`
              : "—";

          return (
            <div
              key={peer.id}
              className={`flex flex-col justify-between rounded-2xl border bg-white p-5 sm:p-6 shadow-sm transition-all ${
                isExpanded
                  ? "lg:col-span-2 border-brand/50 ring-1 ring-brand/20"
                  : "border-[#e6e0d6] hover:border-brand/40"
              }`}
            >
              <div className="space-y-4">
                {/* Top Header: Avatar, Title, Handle Link & Public Data Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <PeerAvatar
                      thumbnailUrl={peer.thumbnailUrl}
                      title={peer.channelTitle}
                    />
                    <div className="min-w-0">
                      <h3 className="font-serif text-xl font-medium text-ink truncate">
                        {peer.channelTitle}
                      </h3>
                      {channelUrl ? (
                        <a
                          href={channelUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline truncate max-w-full"
                        >
                          <span className="truncate">
                            {formatHandleLabel(peer)}
                          </span>
                          <Icon
                            name="external-link"
                            className="size-3 shrink-0"
                          />
                        </a>
                      ) : (
                        <span className="text-xs text-muted truncate block">
                          {formatHandleLabel(peer)}
                        </span>
                      )}
                    </div>
                  </div>

                  {peer.isPublicData !== false && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#faf7f2] border border-[#e6dfd3] px-2.5 py-0.5 text-[10px] font-semibold text-[#665e53] shrink-0">
                      <Icon name="shield" className="size-3 text-brand" />
                      <span>Public Data</span>
                    </span>
                  )}
                </div>

                {/* 4 Key Telemetry Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="rounded-xl bg-[#faf7f2] border border-[#ede6da] px-3 py-2">
                    <span className="block text-[10px] uppercase tracking-wider text-muted">
                      Subscribers
                    </span>
                    <span className="font-mono text-sm font-semibold text-ink">
                      {formatCount(peer.subscriberCount)}
                    </span>
                  </div>

                  <div className="rounded-xl bg-[#faf7f2] border border-[#ede6da] px-3 py-2">
                    <span className="block text-[10px] uppercase tracking-wider text-muted">
                      Median Views
                    </span>
                    <span className="font-mono text-sm font-semibold text-ink">
                      {formatCount(peer.medianViews)}
                    </span>
                  </div>

                  <div className="rounded-xl bg-[#faf7f2] border border-[#ede6da] px-3 py-2">
                    <span className="block text-[10px] uppercase tracking-wider text-muted">
                      Engagement
                    </span>
                    <span className="font-mono text-sm font-semibold text-ink">
                      {engagementFormatted}
                    </span>
                  </div>

                  <div className="rounded-xl bg-[#faf7f2] border border-[#ede6da] px-3 py-2">
                    <span className="block text-[10px] uppercase tracking-wider text-muted">
                      Cadence
                    </span>
                    <span className="font-mono text-sm font-semibold text-ink">
                      {monthlyCadenceFormatted}
                    </span>
                  </div>
                </div>

                {/* Top Hook & Top Pillar */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#fdf7ef] border border-[#f2e2ce] px-2.5 py-1 text-[11px] text-ink">
                    <span className="text-muted">Top Hook:</span>
                    <strong className="font-semibold text-brand">
                      {peer.topHookType || "Direct Value"}
                    </strong>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#faf7f2] border border-[#eae3d7] px-2.5 py-1 text-[11px] text-ink">
                    <span className="text-muted">Top Pillar:</span>
                    <strong className="font-semibold text-ink">
                      {peer.topPillar || "Core Topic"}
                    </strong>
                  </span>
                  {peer.topTopic && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#faf7f2] border border-[#eae3d7] px-2.5 py-1 text-[11px] text-ink">
                      <span className="text-muted">Topic:</span>
                      <span className="font-medium text-ink">
                        {peer.topTopic}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {/* Sample Videos Expand Toggle */}
              <div className="mt-4 pt-3.5 border-t border-[#f0ebe1]">
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => togglePeer(peer.id)}
                    disabled={!hasSampleVideos}
                    aria-expanded={isExpanded}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                      hasSampleVideos
                        ? "text-brand hover:text-brand-strong cursor-pointer"
                        : "text-muted cursor-default"
                    }`}
                  >
                    <Icon name="video" className="size-3.5" />
                    <span>
                      {hasSampleVideos
                        ? isExpanded
                          ? `Hide Sample Videos (${sampleVideos.length})`
                          : `Inspect Sample Videos (${sampleVideos.length})`
                        : "Sample videos available on live refresh"}
                    </span>
                    {hasSampleVideos && (
                      <Icon
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        className="size-3.5"
                      />
                    )}
                  </button>

                  {channelUrl && (
                    <a
                      href={channelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-muted hover:text-ink transition-colors"
                    >
                      <Icon name="youtube" className="size-3.5" />
                      <span>Open Channel</span>
                    </a>
                  )}
                </div>

                {/* Expanded Sample Videos Drawer / Panel */}
                {isExpanded && hasSampleVideos && (
                  <div className="mt-4 rounded-xl border border-[#ece4d7] bg-[#faf7f2] p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
                        Sample Public Uploads from {peer.channelTitle}
                      </h4>
                      <span className="text-[11px] text-muted">
                        {sampleVideos.length} analyzed video
                        {sampleVideos.length === 1 ? "" : "s"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {sampleVideos.map((video) => (
                        <SampleVideoCard key={video.videoId} video={video} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

