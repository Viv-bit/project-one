import { cn } from "@/lib/cn";

type DividerProps = {
  children?: React.ReactNode;
  className?: string;
};

export function Divider({ children, className }: DividerProps) {
  return (
    <div
      data-slot="divider"
      role="separator"
      className={cn("flex items-center gap-3", className)}
    >
      <span className="h-px flex-1 bg-line" />
      {children ? (
        <span className="text-[10px] font-medium tracking-[0.14em] text-[#a39b93] uppercase">
          {children}
        </span>
      ) : null}
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
