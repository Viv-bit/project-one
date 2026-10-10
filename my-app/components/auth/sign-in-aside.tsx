import { Card } from "@/components/ui/card";
import { MediaFrame } from "@/components/ui/media-frame";

export function SignInAside() {
  return (
    <div className="relative h-full min-h-[520px]">
      <MediaFrame
        src="/images/signin-desk.jpg"
        alt="Laptop open on a light wood desk beside a cup of coffee"
        priority
        className="h-full"
        imageClassName="object-[center_30%]"
      />
      <Card className="absolute inset-x-4 bottom-4 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-muted uppercase">
            Latest Channel Health
          </p>
          <p className="text-[11px] text-muted">Ingested: 50 Posts</p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted">Median View Velocity</p>
            <p className="mt-1 text-lg font-semibold tracking-tight text-emerald-600">
              +38.4%
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">High Retention Hook</p>
            <p className="mt-1 text-lg font-semibold tracking-tight text-ink">
              45-60s <span className="text-brand">Curve</span>
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-end justify-between gap-4">
          <p className="text-[13px] text-ink">
            <span className="mr-1.5 inline-block size-1.5 translate-y-[-1px] rounded-full bg-emerald-500" />
            Algorithmic distribution is favorable
          </p>
          <svg
            viewBox="0 0 72 12"
            aria-hidden
            className="h-3 w-16 shrink-0 text-brand"
            fill="none"
          >
            <path
              d="M2 7c8-5 14-5 20 0s12 5 20 0 14-5 28 0"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p className="mt-3 border-t border-[#f3eee8] pt-3 font-serif text-[13px] leading-relaxed text-muted italic">
          “Trusted by 3,400+ creators to turn gut-feeling into repeatable growth.”
        </p>
      </Card>
    </div>
  );
}
