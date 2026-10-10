import Link from "next/link";
import { cn } from "@/lib/cn";

export const buttonVariants = ["primary", "secondary", "ghost", "link"] as const;
export const buttonSizes = ["sm", "md", "lg"] as const;

export type ButtonVariant = (typeof buttonVariants)[number];
export type ButtonSize = (typeof buttonSizes)[number];

type ButtonProps = React.ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  href?: string;
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 rounded-lg px-3 text-sm",
  md: "h-11 rounded-xl px-4 text-sm",
  lg: "h-12 rounded-xl px-5 text-[15px]",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  leadingIcon,
  trailingIcon,
  href,
  className,
  children,
  type = "button",
  ref,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex cursor-pointer items-center justify-center gap-2 font-semibold whitespace-nowrap transition-colors outline-none",
    "focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
    "disabled:pointer-events-none disabled:opacity-50",
    "data-[variant=primary]:bg-brand data-[variant=primary]:text-white data-[variant=primary]:shadow-[0_8px_18px_rgba(224,124,58,0.28)] data-[variant=primary]:hover:bg-brand-strong",
    "data-[variant=secondary]:border data-[variant=secondary]:border-line data-[variant=secondary]:bg-white data-[variant=secondary]:text-ink data-[variant=secondary]:shadow-[0_1px_2px_rgba(28,25,23,0.04)] data-[variant=secondary]:hover:bg-[#faf7f3]",
    "data-[variant=ghost]:bg-transparent data-[variant=ghost]:text-ink data-[variant=ghost]:hover:bg-black/5",
    "data-[variant=link]:h-auto data-[variant=link]:rounded-none data-[variant=link]:bg-transparent data-[variant=link]:p-0 data-[variant=link]:text-brand data-[variant=link]:shadow-none data-[variant=link]:hover:underline",
    variant === "link" ? "h-auto px-0" : sizeClasses[size],
    fullWidth && "w-full",
    className,
  );

  const content = (
    <>
      {leadingIcon}
      {children}
      {trailingIcon}
    </>
  );

  if (href) {
    return (
      <Link href={href} data-slot="button" data-variant={variant} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={classes}
      {...props}
    >
      {content}
    </button>
  );
}
