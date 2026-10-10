import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

type BrandProps = {
  badge?: React.ReactNode;
  className?: string;
};

export function Brand({ badge, className }: BrandProps) {
  return (
    <div data-slot="brand" className={cn("flex items-center gap-2.5", className)}>
      <span className="grid size-9 place-items-center rounded-[11px] bg-brand text-white shadow-[0_6px_14px_rgba(224,124,58,0.3)]">
        <Icon name="spark" className="size-[18px]" />
      </span>
      <span className="text-[17px] font-semibold tracking-tight text-ink">Lumen</span>
      {badge ?? null}
    </div>
  );
}

export function CreatorBadge({ className }: { className?: string }) {
  return (
    <Badge className={cn("uppercase tracking-[0.16em]", className)}>Creator Beta</Badge>
  );
}
