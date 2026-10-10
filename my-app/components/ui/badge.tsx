import { cn } from "@/lib/cn";

export const badgeVariants = ["neutral", "brand"] as const;
export type BadgeVariant = (typeof badgeVariants)[number];

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const variants: Record<BadgeVariant, string> = {
  neutral: "border border-[#e4ddd4] bg-white/80 text-[#8a837b]",
  brand: "bg-brand/10 text-brand",
};

export function Badge({ children, variant = "neutral", className }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      data-variant={variant}
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
