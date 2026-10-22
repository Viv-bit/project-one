import type { Metadata } from "next";
import { ExperimentBacklogView } from "@/components/experiments/experiment-backlog-view";

export const metadata: Metadata = {
  title: "Experiment Backlog & Outcome Tracker",
  description:
    "Track active creator experiments, baseline vs experiment performance deltas, and data-sufficiency validation rules on Lumen.",
};

export default function ExperimentsPage() {
  return <ExperimentBacklogView />;
}
