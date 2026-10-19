"use client";

import { useState } from "react";
import { type YouTubeChannel } from "@/lib/api";
import { formatCount } from "@/lib/youtube";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { YouTubeDisconnectModal } from "./youtube-disconnect-modal";

type YouTubeConnectedCardProps = {
  channel: YouTubeChannel;
  onRefresh: () => Promise<void>;
  onDisconnected: () => void;
};

export function YouTubeConnectedCard({
  channel,
  onRefresh,
  onDisconnected,
}: YouTubeConnectedCardProps) {
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleCopyId = () => {
    if (channel.id) {
      navigator.clipboard.writeText(channel.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const channelUrl = channel.handle
    ? `https://youtube.com/${channel.handle.startsWith("@") ? channel.handle : `@${channel.handle}`}`
    : `https://youtube.com/channel/${channel.id}`;

  return (
    <>
      <div className="relative overflow-hidden rounded-[24px] border border-line bg-gradient-to-br from-white via-cream to-[#fbf8f3] p-6 shadow-sm sm:p-8">
        {/* Accent background glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-brand/10 blur-3xl" />

        <div className="relative z-10">
          {/* Top banner: Status & Sync Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/80 pb-5">
            <div className="flex items-center gap-2">
              <span className="flex size-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold tracking-wide uppercase text-emerald-700">
                Connected & Active
              </span>
              <span className="text-xs text-muted">· Read-only sync</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                leadingIcon={
                  <Icon
                    name="refresh"
                    className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                }
                className="text-xs text-muted hover:text-ink h-8 px-2.5"
              >
                {isRefreshing ? "Syncing..." : "Sync Channel"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDisconnectModal(true)}
                leadingIcon={<Icon name="trash" className="size-3.5 text-red-500" />}
                className="text-xs text-red-600 hover:bg-red-50 hover:text-red-700 h-8 px-2.5"
              >
                Disconnect
              </Button>
            </div>
          </div>

          {/* Channel Main Info */}
          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {/* Channel Avatar with YouTube Badge */}
              <div className="relative shrink-0">
                <div className="size-16 sm:size-20 overflow-hidden rounded-2xl border-2 border-white shadow-md bg-white">
                  {channel.thumbnailUrl && !imgError ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={channel.thumbnailUrl}
                      alt={channel.title}
                      onError={() => setImgError(true)}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-gradient-to-tr from-brand to-brand-strong text-white font-serif text-2xl font-bold">
                      {channel.title.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-red-600 text-white shadow ring-2 ring-cream">
                  <Icon name="youtube" className="size-3.5" />
                </span>
              </div>

              {/* Channel Title & Handle */}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-ink">
                    {channel.title}
                  </h3>
                  <Badge variant="brand">Verified</Badge>
                </div>

                <div className="mt-1 flex items-center gap-3 text-xs text-muted flex-wrap">
                  {channel.handle && (
                    <a
                      href={channelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-brand hover:underline"
                    >
                      {channel.handle.startsWith("@") ? channel.handle : `@${channel.handle}`}
                      <Icon name="external-link" className="size-3" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={handleCopyId}
                    title="Click to copy channel ID"
                    className="inline-flex items-center gap-1 font-mono rounded bg-black/5 px-2 py-0.5 text-[11px] text-muted hover:text-ink transition-colors cursor-pointer"
                  >
                    <span>ID: {channel.id.slice(0, 10)}...</span>
                    <Icon
                      name={copiedId ? "check" : "copy"}
                      className={`size-3 ${copiedId ? "text-emerald-600" : ""}`}
                    />
                  </button>
                  {copiedId && (
                    <span className="text-[11px] font-medium text-emerald-600 animate-in fade-in">
                      Copied!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Visit Channel Button */}
            <div className="sm:self-center">
              <Button
                variant="secondary"
                size="sm"
                href={channelUrl}
                trailingIcon={<Icon name="external-link" className="size-3.5" />}
                className="text-xs"
              >
                View on YouTube
              </Button>
            </div>
          </div>

          {/* Channel Stats Row */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {/* Subscribers */}
            <div className="rounded-2xl border border-line bg-white/80 p-4 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between text-muted">
                <span className="text-xs font-medium">Subscribers</span>
                <span className="flex size-6 items-center justify-center rounded-lg bg-red-100 text-red-600">
                  <Icon name="users" className="size-3.5" />
                </span>
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
                {formatCount(channel.subscriberCount)}
              </p>
              <p className="mt-0.5 text-[11px] text-muted">
                {channel.subscriberCount !== null && channel.subscriberCount !== undefined
                  ? `${channel.subscriberCount.toLocaleString()} total`
                  : "Hidden by creator"}
              </p>
            </div>

            {/* Videos */}
            <div className="rounded-2xl border border-line bg-white/80 p-4 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between text-muted">
                <span className="text-xs font-medium">Published Videos</span>
                <span className="flex size-6 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Icon name="video" className="size-3.5" />
                </span>
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
                {formatCount(channel.videoCount)}
              </p>
              <p className="mt-0.5 text-[11px] text-muted">
                {channel.videoCount !== null && channel.videoCount !== undefined
                  ? `${channel.videoCount.toLocaleString()} uploads indexed`
                  : "Syncing..."}
              </p>
            </div>

            {/* Lumen Diagnostics Status */}
            <div className="col-span-2 sm:col-span-1 rounded-2xl border border-line bg-white/80 p-4 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between text-muted">
                <span className="text-xs font-medium">Lumen Intelligence</span>
                <span className="flex size-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <Icon name="zap" className="size-3.5" />
                </span>
              </div>
              <p className="mt-2 text-base sm:text-lg font-semibold tracking-tight text-emerald-700">
                Ready for Analysis
              </p>
              <p className="mt-0.5 text-[11px] text-muted">
                Hook drop-offs & retention active
              </p>
            </div>
          </div>
        </div>
      </div>

      <YouTubeDisconnectModal
        isOpen={showDisconnectModal}
        onClose={() => setShowDisconnectModal(false)}
        channelTitle={channel.title}
        channelHandle={channel.handle}
        onSuccess={onDisconnected}
      />
    </>
  );
}
