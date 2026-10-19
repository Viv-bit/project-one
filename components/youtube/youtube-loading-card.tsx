export function YouTubeLoadingCard() {
  return (
    <div
      aria-label="Loading YouTube connection details"
      className="relative overflow-hidden rounded-[24px] border border-line bg-white/70 p-6 shadow-sm sm:p-8 animate-pulse"
    >
      <div className="flex items-center justify-between border-b border-line pb-5">
        <div className="flex items-center gap-2">
          <div className="size-2.5 rounded-full bg-muted/40" />
          <div className="h-3 w-32 rounded bg-muted/30" />
        </div>
        <div className="h-6 w-20 rounded-full bg-muted/20" />
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="size-16 sm:size-20 rounded-2xl bg-muted/30 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-6 w-48 rounded bg-muted/30" />
          <div className="h-3.5 w-32 rounded bg-muted/20" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-line/60 bg-white/60 p-4 space-y-2">
          <div className="h-3 w-20 rounded bg-muted/30" />
          <div className="h-7 w-24 rounded bg-muted/40" />
          <div className="h-2.5 w-16 rounded bg-muted/20" />
        </div>
        <div className="rounded-2xl border border-line/60 bg-white/60 p-4 space-y-2">
          <div className="h-3 w-20 rounded bg-muted/30" />
          <div className="h-7 w-24 rounded bg-muted/40" />
          <div className="h-2.5 w-16 rounded bg-muted/20" />
        </div>
        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-line/60 bg-white/60 p-4 space-y-2">
          <div className="h-3 w-20 rounded bg-muted/30" />
          <div className="h-7 w-24 rounded bg-muted/40" />
          <div className="h-2.5 w-16 rounded bg-muted/20" />
        </div>
      </div>
    </div>
  );
}
