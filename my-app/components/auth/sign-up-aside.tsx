import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { MediaFrame } from "@/components/ui/media-frame";

export function SignUpAside() {
  return (
    <div className="flex flex-col gap-4">
      <MediaFrame
        src="/images/signup-studio.jpg"
        alt="Creator workspace with a laptop, monitor, and plants"
        priority
        className="h-[250px]"
      >
        <div className="flex flex-wrap gap-2">
          <Chip variant="glass" icon={<Icon name="activity" className="size-3.5" />}>
            Processing 500M+ retention data points
          </Chip>
          <Chip variant="light" icon={<Icon name="check" className="size-3.5 text-brand" />}>
            Verified Insights
          </Chip>
        </div>
      </MediaFrame>

      <Card className="px-5 py-4">
        <h2 className="font-serif text-[1.35rem] tracking-tight text-ink">
          The 50-Post Ingestion Promise
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip variant="outline" icon={<Icon name="shield" className="size-3.5 text-brand" />}>
            100% Read-Only
          </Chip>
          <Chip variant="outline" icon={<Icon name="ban" className="size-3.5 text-brand" />}>
            Zero Auto-Post
          </Chip>
          <Chip variant="outline" icon={<Icon name="zap" className="size-3.5 text-brand" />}>
            3s Hook Engine
          </Chip>
        </div>
      </Card>

      <Card className="px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-0.5 text-brand" aria-label="Rated 5 stars">
            {Array.from({ length: 5 }, (_, index) => (
              <Icon key={index} name="star" className="size-3.5" />
            ))}
          </div>
          <span className="text-xs text-muted">32 Days Ago</span>
        </div>
        <p className="mt-3 font-serif text-[17px] leading-snug text-ink italic">
          “Lumen helped me double my average retention in 30 days without guessing.”
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#f3eee7] text-xs font-semibold text-ink">
              NC
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1 text-sm font-semibold text-ink">
                Nate Chen
                <span className="grid size-3.5 place-items-center rounded-full bg-brand text-white">
                  <Icon name="check" className="size-2.5" />
                </span>
              </span>
              <span className="block truncate text-xs text-muted">
                420K Tech Creator · Studio Lead
              </span>
            </span>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-sm font-semibold text-emerald-600">+114%</p>
            <p className="text-[10px] font-medium tracking-wide text-muted uppercase">
              Avg Watch Time
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
