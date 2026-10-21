import type { Metadata } from "next";
import { GrowthPlanHeader } from "@/components/growth-plan/growth-plan-header";
import { HorizonObjectiveCard } from "@/components/growth-plan/horizon-objective-card";
import { AlgorithmicLeversSection } from "@/components/growth-plan/algorithmic-levers-section";
import { SequencedSprintsSection } from "@/components/growth-plan/sequenced-sprints-section";
import { PrescribedExperimentsSection } from "@/components/growth-plan/prescribed-experiments-section";
import { CreatorPitfallsSection } from "@/components/growth-plan/creator-pitfalls-section";
import { GrowthPlanFooter } from "@/components/growth-plan/growth-plan-footer";

export const metadata: Metadata = {
  title: "Growth Plan · Personalized Creator Growth Roadmap",
  description:
    "Derived from your 50-post historical baseline. Follow sequenced 90-day sprints, algorithmic levers, and prescribed video experiments to scale to 750,000 subscribers.",
};

export default function GrowthPlanPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <GrowthPlanHeader />

      {/* Horizon Objective: Breakthrough to 750,000 Verified Subscribers */}
      <HorizonObjectiveCard />

      {/* Primary Algorithmic Levers (3 Levers) */}
      <AlgorithmicLeversSection />

      {/* Sequenced 90-Day Sprints (Sprints 1 to 4) */}
      <SequencedSprintsSection />

      {/* Prescribed Video Experiments (Next In Line) */}
      <PrescribedExperimentsSection />

      {/* Creator Pitfalls to Eliminate & Strategic Accountability */}
      <CreatorPitfallsSection />

      {/* Engine & Run Metadata Footer */}
      <GrowthPlanFooter />
    </div>
  );
}
