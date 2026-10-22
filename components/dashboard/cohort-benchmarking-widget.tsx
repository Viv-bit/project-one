import Link from "next/link";
import { Icon } from "@/components/ui";
import { COHORT_BENCHMARKS } from "@/lib/data/intelligence-mock-data";

export function CohortBenchmarkingWidget() {
  return (
    <div className="rounded-2xl border border-[#e6e0d6] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#f2ede4] pb-3.5">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-lg bg-brand/10 text-brand">
            <Icon name="users" className="size-3.5" />
          </span>
          <h2 className="text-base font-semibold text-ink">Cohort Benchmarking</h2>
        </div>
        <Link
          href="/dashboard/benchmarks"
          className="rounded-full bg-[#f6f2ea] border border-[#e8e2d8] px-2 py-0.5 text-[10px] font-semibold text-brand hover:underline"
        >
          18 Peers &rarr;
        </Link>
      </div>

      <p className="mt-2.5 text-xs text-[#786f65] leading-relaxed">
        Compared directly against 18 active verified creators in your 250k–500k subscriber tier.
      </p>

      {/* Benchmark Rows */}
      <div className="mt-4 space-y-4">
        {COHORT_BENCHMARKS.map((bench) => (
          <div key={bench.id} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-ink">{bench.metricName}</span>
              <span className="font-semibold text-brand text-[11px]">
                {bench.percentileLabel}
              </span>
            </div>

            {/* Visual Comparative Progress Bar */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#ede7dd]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand to-amber-500"
                style={{ width: `${bench.progressPct}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#887f74]">
              <span>{bench.note}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
