"use client";

import { useState } from "react";
import { Icon } from "@/components/ui";
import { CREATOR_VOICE_VOTES } from "@/lib/data/intelligence-mock-data";
import type { CreatorVoiceVoteItem } from "@/lib/types/creator-intelligence";

export function CreatorVoiceSpotlight() {
  const [items, setItems] = useState<CreatorVoiceVoteItem[]>(CREATOR_VOICE_VOTES);
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({});

  function handleVote(id: string) {
    const isVoted = votedMap[id];
    setVotedMap((prev) => ({ ...prev, [id]: !isVoted }));
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            votesCount: isVoted ? item.votesCount - 1 : item.votesCount + 1,
          };
        }
        return item;
      }),
    );
  }

  return (
    <div className="rounded-2xl border border-[#e6e0d6] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sm:p-6 flex flex-col justify-between">
      <div>
        {/* Header & Round Countdown */}
        <div className="flex items-center justify-between border-b border-[#f2ede4] pb-3">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-lg bg-brand/10 text-brand">
              <Icon name="spark" className="size-3.5" />
            </span>
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#8a8176]">
              CREATOR VOICE SPOTLIGHT
            </span>
          </div>
          <span className="rounded-full bg-[#faf7f2] border border-[#e8e2d8] px-2.5 py-0.5 text-[11px] font-medium text-[#7a7167]">
            Round closes in 6d
          </span>
        </div>

        {/* Title */}
        <h2 className="mt-3 text-base sm:text-lg font-bold text-ink">
          What should our data scientists prioritize next?
        </h2>

        {/* Voting items */}
        <div className="mt-4 space-y-3">
          {items.map((item) => {
            const hasVoted = votedMap[item.id];
            return (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-[#ede7dd] bg-[#faf8f4] p-3.5 transition-all hover:border-brand/40"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xs font-bold text-ink">{item.title}</h3>
                    <span className="rounded bg-black/5 px-1.5 py-0.5 text-[9px] font-medium text-muted uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#70675c] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <button
                  onClick={() => handleVote(item.id)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                    hasVoted
                      ? "bg-brand text-white shadow-sm scale-105"
                      : "bg-white border border-[#e2dcd2] text-ink hover:border-brand/50 hover:bg-cream"
                  }`}
                >
                  <Icon
                    name="thumbs-up"
                    className={`size-3.5 ${hasVoted ? "text-white" : "text-brand"}`}
                  />
                  <span>{item.votesCount}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
