import Link from "next/link";
import { cn } from "@/lib/cn";

type TextLinkProps = React.ComponentProps<typeof Link>;

export function TextLink({ className, ...props }: TextLinkProps) {
  return (
    <Link
      data-slot="text-link"
      className={cn(
        "font-semibold text-brand underline-offset-2 hover:underline",
        className,
      )}
      {...props}
    />
  );
}
