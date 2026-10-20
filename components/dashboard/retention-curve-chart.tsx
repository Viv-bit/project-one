"use client";

import { useState } from "react";
import type { RetentionFormat } from "@/lib/types/creator-intelligence";
import { RETENTION_CURVE_DATA } from "@/lib/data/intelligence-mock-data";

export function RetentionCurveChart() {
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
    // Hold percentage ranges between ~25% and 100%
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

  // Area path for gradient fill
  const areaPath = `${primaryPath} L ${primaryPoints[primaryPoints.length - 1].x} ${height - paddingY} L ${primaryPoints[0].x} ${height - paddingY} Z`;

  const thresholdX = getX(3);

  const activeHover =
    hoveredIndex !== null ? RETENTION_CURVE_DATA[hoveredIndex] : null;

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
