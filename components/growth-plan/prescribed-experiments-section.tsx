"use client";

import Image from "next/image";
import { PRESCRIBED_EXPERIMENTS } from "@/lib/data/growth-plan-mock-data";

export function PrescribedExperimentsSection() {
  return (
    <section aria-labelledby="prescribed-experiments-heading" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="h-4 w-1 rounded-full bg-brand" />
          <h2
            id="prescribed-experiments-heading"
            className="text-base font-bold tracking-tight text-ink"
          >
            Prescribed Video Experiments (Next In Line)
          </h2>
        </div>
        <p className="text-xs text-[#82786e]">
          Calibrated to apply Sprint 1 &amp; Sprint 2 structural rules
        </p>
      </div>

      {/* 3 Video Cards Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {PRESCRIBED_EXPERIMENTS.map((exp) => (
          <div
            key={exp.id}
            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e6e0d6] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:border-brand/40 hover:shadow-md"
          >
            <div>
              {/* Thumbnail with overlay badges */}
              <div className="relative aspect-video w-full overflow-hidden bg-stone-900">
                <Image
                  src={exp.thumbnailSrc}
                  alt={exp.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Top Badge: Episode tag */}
                <div className="absolute left-2.5 top-2.5">
                  <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-bold text-ink shadow-sm backdrop-blur-sm">
                    {exp.episodeTag}
                  </span>
                </div>

                {/* Bottom Right: Estimated Velocity Badge */}
                <div className="absolute bottom-2.5 right-2.5">
                  <span className="rounded bg-black/75 px-2 py-0.5 font-mono text-[10px] font-bold text-white backdrop-blur-sm">
                    {exp.estVelocity}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5">
                {/* Category Pill Tag */}
                <span className="inline-block rounded-md bg-[#fbf2e9] border border-[#f2e1cf] px-2 py-0.5 text-[10px] font-bold text-brand">
                  {exp.hookCategoryTag}
                </span>

                {/* Video Title */}
                <h3 className="mt-2 text-sm font-bold text-ink leading-snug group-hover:text-brand transition-colors">
                  {exp.title}
                </h3>

                {/* Hypothesis */}
                <p className="mt-2 text-xs text-[#6e655a] leading-relaxed">
                  <strong className="text-ink font-semibold">Hypothesis:</strong>{" "}
                  {exp.hypothesis.replace("Hypothesis: ", "")}
                </p>
              </div>
            </div>

            {/* Bottom Meta Bar */}
            <div className="border-t border-[#f2ede4] bg-[#faf8f4] px-4 py-2.5 text-xs text-[#786f65] flex items-center justify-between">
              <span className="font-medium text-[11px]">{exp.targetDuration}</span>
              <span className="font-bold text-brand text-[11px]">{exp.shootDate}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
