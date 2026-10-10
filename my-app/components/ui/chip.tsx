import { cn } from "@/lib/cn";

export const chipVariants = ["light", "glass", "outline"] as const;
export type ChipVariant = (typeof chipVariants)[number];

type ChipProps = {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: ChipVariant;
  className?: string;
};

const variants: Record<ChipVariant, string> = {
  light: "bg-white text-ink shadow-[0_6px_16px_rgba(0,0,0,0.08)]",
  glass: "bg-black/55 text-white backdrop-blur-md",
  outline: "border border-[#ece6de] bg-white text-ink",
};

export function Chip({ children, icon, variant = "light", className }: ChipProps) {
  return (
    <span
      data-slot="chip"
      data-variant={variant}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
        variants[variant],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
