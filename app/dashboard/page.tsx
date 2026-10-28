import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export const metadata: Metadata = {
  title: "Creator Intelligence Dashboard",
  description:
    "Analyze retention hook drop-offs, benchmark your past 50 uploads, and unlock automated title experiments on Lumen.",
};

export default function DashboardPage() {
  return <DashboardView />;
}
