import { cn } from "@/lib/cn";

type AuthShellProps = {
  children: React.ReactNode;
  aside?: React.ReactNode;
  asideLayout?: "center" | "fill";
  className?: string;
};

export function AuthShell({
  children,
  aside,
  asideLayout = "center",
  className,
}: AuthShellProps) {
  return (
    <div className="min-h-screen bg-[#f3f0f8] px-3 py-3 text-ink sm:px-5 sm:py-5">
      <div
        className={cn(
          "mx-auto grid w-full max-w-[1120px] overflow-hidden rounded-[28px] border border-frame bg-cream lg:min-h-[calc(100vh-2.5rem)] lg:grid-cols-2",
          className,
        )}
      >
        <section className="flex items-center px-6 py-8 sm:px-10 lg:px-12 lg:py-10">
          <div className="mx-auto w-full max-w-[420px]">{children}</div>
        </section>
        {aside ? (
          asideLayout === "fill" ? (
            <aside className="relative hidden lg:block">
              <div className="absolute inset-4 lg:inset-5">{aside}</div>
            </aside>
          ) : (
            <aside className="hidden items-center p-4 lg:flex lg:p-5">
              <div className="w-full">{aside}</div>
            </aside>
          )
        ) : null}
      </div>
    </div>
  );
}
