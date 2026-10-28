"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { YouTubeConnectionProvider } from "@/lib/youtube-connection-context";

type DashboardLayoutShellProps = {
  children: React.ReactNode;
};

export function DashboardLayoutShell({ children }: DashboardLayoutShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <YouTubeConnectionProvider>
      <div className="flex h-screen w-full overflow-hidden bg-[#faf7f2] text-ink antialiased">
        {/* Desktop Persistent Sidebar */}
        <div className="hidden lg:flex lg:shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative flex w-64 max-w-xs flex-1 flex-col shadow-2xl">
              <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          {/* Top Navigation Bar */}
          <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

          {/* Scrollable Work Area with Stitch Dot Grid */}
          <main
            className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8"
            style={{
              backgroundImage:
                "radial-gradient(circle, #ded6c7 1.1px, transparent 1.1px)",
              backgroundSize: "24px 24px",
            }}
          >
            <div className="mx-auto max-w-[1400px]">{children}</div>
          </main>
        </div>
      </div>
    </YouTubeConnectionProvider>
  );
}
