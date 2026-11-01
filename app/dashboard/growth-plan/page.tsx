import type { Metadata } from "next";
import { GrowthPlanView } from "@/components/growth-plan/growth-plan-view";

export const metadata: Metadata = {
  title: "Growth Plan · Personalized Creator Growth Roadmap",
  description:
    "Derived from your historical baseline. Follow sequenced 90-day sprints, algorithmic levers, and prescribed video experiments to scale to your next subscriber milestone.",
};

export default function GrowthPlanPage() {
  return <GrowthPlanView />;
}
