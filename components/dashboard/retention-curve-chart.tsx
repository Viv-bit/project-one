"use client";

import { useState } from "react";
import type { RetentionFormat } from "@/lib/types/creator-intelligence";
import { RETENTION_CURVE_DATA } from "@/lib/data/intelligence-mock-data";
import { Icon } from "@/components/ui";
import { startYouTubeOAuth } from "@/lib/youtube";
import { useYouTubeConnection } from "@/lib/youtube-connection-context";

export function RetentionCurveChart() {
  const { isConnected } = useYouTubeConnection();
  const [selectedFormat, setSelectedFormat] = useState<RetentionFormat>("all");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG dimensions & coordinate calculations
  const width = 640;
  const height = 220;
  const paddingX = 45;
  const paddingY = 25;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Scale functions
  const maxTime = 60;
  function getX(timeSec: number) {
    return paddingX + (timeSec / maxTime) * chartWidth;
  }
  function getY(holdPct: number) {
    const minHold = 20;
    const maxHold = 100;
    const normalized = (holdPct - minHold) / (maxHold - minHold);
    return height - paddingY - normalized * chartHeight;
  }

  // Adjust values slightly based on format filter
  const formatMultiplier =
    selectedFormat === "shorts" ? 1.05 : selectedFormat === "longform" ? 0.98 : 1;

  // Generate SVG path strings using smooth bezier curves
  const primaryPoints = RETENTION_CURVE_DATA.map((d) => ({
    x: getX(d.timeSec),
    y: getY(Math.min(100, d.problemFirstHold * formatMultiplier)),
  }));

  const benchmarkPoints = RETENTION_CURVE_DATA.map((d) => ({
    x: getX(d.timeSec),
    y: getY(d.narrativeArcHold * formatMultiplier),
  }));

  function generateSmoothPath(pts: { x: number; y: number }[]) {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      d += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  }

  const primaryPath = generateSmoothPath(primaryPoints);
  const benchmarkPath = generateSmoothPath(benchmarkPoints);
  const areaPath = `${primaryPath} L ${primaryPoints[primaryPoints.length - 1].x} ${height - paddingY} L ${primaryPoints[0].x} ${height - paddingY} Z`;
  const thresholdX = getX(3);
  const activeHover = hoveredIndex !== null ? RETENTION_CURVE_DATA[hoveredIndex] : null;

  // Empty state when YouTube is not connected
  if (!isConnected) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-dashed border-[#ded4c6] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] sm:p-6">
        {/* Header & Disabled Format Toggle */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#f2ede4] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-ink">
                Retention &amp; Hook Velocity Curve
              </h2>
              <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                Awaiting Connection
              </span>
            </div>
            <p className="text-xs text-[#82786e]">
              Second-by-second drop-off curve across initial 60 seconds of video timeline
            </p>
          </div>

          <div className="flex items-center rounded-xl bg-[#faf7f2] border border-[#e8e2d8] p-1 opacity-50 cursor-not-allowed">
            <span className="rounded-lg px-3 py-1 text-xs font-semibold bg-white text-[#998f84] shadow-sm">
              All Formats
            </span>
            <span className="px-3 py-1 text-xs text-[#998f84]">Longform</span>
            <span className="px-3 py-1 text-xs text-[#998f84]">Shorts</span>
          </div>
        </div>

        {/* Ghost SVG Grid with Centered Empty State Overlay */}
        <div className="relative mt-4 w-full overflow-hidden rounded-xl bg-[#faf8f4]/60 p-4 border border-[#eee7dc]">
          {/* Faint Background SVG Grid */}
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto opacity-25 select-none"
          >
            {[100, 75, 50, 25].map((level) => (
              <line
                key={level}
                x1={paddingX}
                y1={getY(level)}
                x2={width - paddingX}
                y2={getY(level)}
                stroke="#cfb799"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            ))}
            {/* Ghost dashed curve */}
            <path
              d={benchmarkPath}
              fill="none"
              stroke="#cfb799"
              strokeWidth="2"
              strokeDasharray="6 6"
            />
            {/* Faint X-axis markers */}
            {RETENTION_CURVE_DATA.map((d) => (
              <text
                key={d.timeSec}
                x={getX(d.timeSec)}
                y={height - 6}
                textAnchor="middle"
                className="text-[10px] font-mono fill-[#968d83]"
              >
                {d.timeLabel}
              </text>
            ))}
          </svg>

          {/* Centered Empty State Card */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="grid size-12 place-items-center rounded-2xl bg-white border border-[#e2d7c9] text-brand shadow-sm">
              <Icon name="activity" className="size-6" />
            </div>

            <h3 className="mt-3 font-serif text-lg sm:text-xl font-medium text-ink">
              Retention Diagnostics Unavailable
            </h3>
            <p className="mt-1.5 max-w-md text-xs sm:text-[13px] text-[#70665b] leading-relaxed">
              Connect your YouTube channel to analyze your first 3-second hook drop-off rates, benchmark against cohort curves, and identify where viewers churn.
            </p>

            <button
              onClick={() => startYouTubeOAuth()}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#e62117] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#cc1810]"
            >
              <Icon name="youtube" className="size-4" />
              <span>Connect YouTube Channel</span>
            </button>
          </div>
        </div>

        {/* Bottom Retention Breakdown Empty Cards (3 Columns) */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 pt-4 border-t border-[#f2ede4]">
          <div className="rounded-xl border border-dashed border-[#ded4c6] bg-[#faf7f2]/70 p-3">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#c2b6a8]" />
              <span className="text-xs font-semibold text-[#7d7367]">Problem-First</span>
            </div>
            <p className="mt-1 font-serif text-lg text-[#a89d91] font-medium">
              — <span className="text-xs font-sans text-muted font-normal">at 0:03s</span>
            </p>
            <span className="mt-0.5 inline-block text-[11px] font-medium text-[#9c9185]">
              Awaiting video sync
            </span>
          </div>

          <div className="rounded-xl border border-dashed border-[#ded4c6] bg-[#faf7f2]/70 p-3">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#c2b6a8]" />
              <span className="text-xs font-semibold text-[#7d7367]">Narrative Arc</span>
            </div>
            <p className="mt-1 font-serif text-lg text-[#a89d91] font-medium">
              — <span className="text-xs font-sans text-muted font-normal">at 0:03s</span>
            </p>
            <span className="mt-0.5 inline-block text-[11px] font-medium text-[#9c9185]">
              Studio benchmark locked
            </span>
          </div>

          <div className="rounded-xl border border-dashed border-[#ded4c6] bg-[#faf7f2]/70 p-3">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#c2b6a8]" />
              <span className="text-xs font-semibold text-[#7d7367]">Curiosity Gap</span>
            </div>
            <p className="mt-1 font-serif text-lg text-[#a89d91] font-medium">
              — <span className="text-xs font-sans text-muted font-normal">at 0:03s</span>
            </p>
            <span className="mt-0.5 inline-block text-[11px] font-medium text-[#9c9185]">
              Drop-off analysis locked
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Connected state
  return (
    <div className="rounded-2xl border border-[#e6e0d6] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sm:p-6">
      {/* Header & Format Toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-ink">
            Retention &amp; Hook Velocity Curve
          </h2>
          <p className="text-xs text-[#82786e]">
            Median drop-off analysis across initial 60 seconds of video timeline
          </p>
        </div>

        {/* Format Switcher Pills */}
        <div className="flex items-center rounded-xl bg-[#faf7f2] border border-[#e8e2d8] p-1">
          {(
            [
              { id: "all", label: "All Formats" },
              { id: "longform", label: "Longform" },
              { id: "shorts", label: "Shorts" },
            ] as const
          ).map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => setSelectedFormat(fmt.id)}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                selectedFormat === fmt.id
                  ? "bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                  : "text-[#7a7167] hover:text-ink"
              }`}
            >
              {fmt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive SVG Curve Visualization */}
      <div className="relative mt-4 w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e07c3a" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#e07c3a" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[100, 75, 50, 25].map((level) => {
            const y = getY(level);
            return (
              <g key={level}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#f0ebe2"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              </g>
            );
          })}

          {/* Area fill under primary curve */}
          <path d={areaPath} fill="url(#curveGradient)" />

          {/* 0:03 Threshold vertical guide line */}
          <line
            x1={thresholdX}
            y1={paddingY}
            x2={thresholdX}
            y2={height - paddingY}
            stroke="#e07c3a"
            strokeWidth="1.25"
            strokeDasharray="3 3"
            opacity="0.6"
          />

          {/* Benchmark line (dashed) */}
          <path
            d={benchmarkPath}
            fill="none"
            stroke="#cfb799"
            strokeWidth="2"
            strokeDasharray="5 5"
          />

          {/* Primary Curve Line (Problem-First) */}
          <path
            d={primaryPath}
            fill="none"
            stroke="#e07c3a"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Data Points on curve */}
          {primaryPoints.map((pt, idx) => {
            const d = RETENTION_CURVE_DATA[idx];
            const isHovered = hoveredIndex === idx;
            return (
              <g
                key={d.timeSec}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : d.isThreshold ? 4.5 : 3.5}
                  fill={d.isThreshold ? "#e07c3a" : "#ffffff"}
                  stroke="#e07c3a"
                  strokeWidth="2.5"
                  className="transition-all"
                />
              </g>
            );
          })}

          {/* X Axis Time Labels */}
          {RETENTION_CURVE_DATA.map((d) => (
            <text
              key={d.timeSec}
              x={getX(d.timeSec)}
              y={height - 6}
              textAnchor="middle"
              className={`text-[10px] font-mono ${
                d.isThreshold ? "font-bold fill-brand" : "fill-[#968d83]"
              }`}
            >
              {d.timeLabel}
            </text>
          ))}
        </svg>

        {/* Hover inspection tooltip */}
        {activeHover && (
          <div
            className="pointer-events-none absolute top-2 z-10 -translate-x-1/2 rounded-xl border border-line bg-ink px-3 py-1.5 text-xs text-white shadow-xl"
            style={{
              left: `${(getX(activeHover.timeSec) / width) * 100}%`,
            }}
          >
            <div className="font-semibold text-brand-light">
              {activeHover.timeLabel}
            </div>
            <div className="text-[11px] text-stone-300">
              Hold: {(activeHover.problemFirstHold * formatMultiplier).toFixed(1)}%
            </div>
          </div>
        )}
      </div>

      {/* Bottom Retention Breakdown Cards (3 Columns) */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 pt-4 border-t border-[#f2ede4]">
        {/* Problem-First */}
        <div className="rounded-xl border border-[#e8e2d8] bg-[#faf7f2] p-3">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-brand" />
            <span className="text-xs font-semibold text-ink">Problem-First</span>
          </div>
          <p className="mt-1 font-serif text-lg text-ink font-medium">
            74.2% <span className="text-xs font-sans text-muted font-normal">hold at 0:03s</span>
          </p>
          <span className="mt-0.5 inline-block text-[11px] font-semibold text-emerald-700">
            +18% above median
          </span>
        </div>

        {/* Narrative Arc */}
        <div className="rounded-xl border border-[#e8e2d8] bg-[#faf7f2] p-3">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#c0aa8e]" />
            <span className="text-xs font-semibold text-ink">Narrative Arc</span>
          </div>
          <p className="mt-1 font-serif text-lg text-ink font-medium">
            63.1% <span className="text-xs font-sans text-muted font-normal">hold at 0:03s</span>
          </p>
          <span className="mt-0.5 inline-block text-[11px] font-medium text-muted">
            Studio benchmark
          </span>
        </div>

        {/* Curiosity Gap */}
        <div className="rounded-xl border border-[#e8e2d8] bg-[#faf7f2] p-3">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-rose-400" />
            <span className="text-xs font-semibold text-ink">Curiosity Gap</span>
          </div>
          <p className="mt-1 font-serif text-lg text-ink font-medium">
            49.4% <span className="text-xs font-sans text-muted font-normal">hold at 0:03s</span>
          </p>
          <span className="mt-0.5 inline-block text-[11px] font-semibold text-rose-600">
            -21% drop-off penalty
          </span>
        </div>
      </div>
    </div>
  );
}
