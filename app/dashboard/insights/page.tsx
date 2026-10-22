import type { Metadata } from "next";
import { InsightsDeepDiveView } from "@/components/insights/insights-deep-dive-view";

export const metadata: Metadata = {
  title: "Evidence-Backed Insights & Recommendations",
  description:
    "Rigorous 4-field creator intelligence. Understand observation data, empirical evidence, semantic interpretation, and actionable experiments.",
};

export default function InsightsPage() {
  return <InsightsDeepDiveView />;
}
