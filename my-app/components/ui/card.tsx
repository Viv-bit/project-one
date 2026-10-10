import { cn } from "@/lib/cn";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-2xl border border-white bg-white p-4 shadow-[0_12px_32px_rgba(70,48,24,0.06)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
