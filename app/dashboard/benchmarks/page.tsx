import type { Metadata } from "next";
import { BenchmarksView } from "@/components/benchmarks/benchmarks-view";

export const metadata: Metadata = {
  title: "Peer Benchmarks & Growth Plan",
  description:
    "Goal-driven peer benchmarking against comparable YouTube creators, comparative content distributions, and actionable peer growth plans.",
};

export default function BenchmarksPage() {
  return <BenchmarksView />;
}
