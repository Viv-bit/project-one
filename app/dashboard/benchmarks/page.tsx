import type { Metadata } from "next";
import { BenchmarksView } from "@/components/benchmarks/benchmarks-view";

export const metadata: Metadata = {
  title: "Peer Benchmarks · Tech & Studio Craft Cohort",
  description:
    "Intelligent peer comparison against 18 comparable creators. Percentile distributions for 0-3s hook hold, view velocity, and sustained retention.",
};

export default function BenchmarksPage() {
  return <BenchmarksView />;
}
