import { cn } from "@/lib/cn";

type AuthIntroProps = {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function AuthIntro({ title, children, className }: AuthIntroProps) {
  return (
    <div className={cn("mt-8", className)}>
      <h1 className="font-serif text-[2.45rem] leading-[1.12] tracking-[-0.025em] text-ink sm:text-[2.65rem]">
        {title}
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">{children}</p>
    </div>
  );
}
