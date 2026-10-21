import type { Metadata } from "next";
import { DashboardLayoutShell } from "@/components/dashboard/dashboard-layout-shell";

export const metadata: Metadata = {
  title: {
    default: "Creator Intelligence Dashboard · Lumen",
    template: "%s · Lumen Creator Intelligence",
  },
  description:
    "Creator intelligence for retention, hook diagnostics, and public product roadmap on Lumen.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutShell>{children}</DashboardLayoutShell>;
}
