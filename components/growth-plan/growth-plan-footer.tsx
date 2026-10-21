import { Icon } from "@/components/ui";

export function GrowthPlanFooter() {
  return (
    <footer className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between text-[11px] text-[#8e857b] border-t border-[#e8e2d8] pb-6">
      <div className="flex items-center gap-1.5">
        <Icon name="info" className="size-3.5 text-[#9a9185]" />
        <span>
          Lumen Creator Engine Model: <strong className="font-mono text-ink">LC-404-B</strong> • Confidence Interval: 95% across 2.4M creator hours
        </span>
      </div>
      <div>
        <span>
          Last analyzed run: Today at 09:14 AM PST • Account ID: <strong className="font-mono text-ink">CR-89410</strong>
        </span>
      </div>
    </footer>
  );
}
