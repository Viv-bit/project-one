import { useId } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

export type CheckboxProps = Omit<React.ComponentProps<"input">, "type"> & {
  label: React.ReactNode;
  description?: React.ReactNode;
};

export function Checkbox({
  label,
  description,
  className,
  id,
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = description ? `${inputId}-description` : undefined;

  return (
    <div data-slot="checkbox" className={cn("flex flex-col gap-1", className)}>
      <label htmlFor={inputId} className="flex cursor-pointer items-start gap-2.5">
        <span className="relative mt-0.5 size-4 shrink-0">
          <input
            id={inputId}
            type="checkbox"
            aria-describedby={descriptionId}
            className="peer absolute inset-0 z-10 size-full cursor-pointer opacity-0"
            {...props}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 grid place-items-center rounded-[5px] border border-[#cfc6bb] bg-white text-transparent peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand/30 peer-disabled:opacity-50"
          >
            <Icon name="check" className="size-3" />
          </span>
        </span>
        <span className="text-[13px] leading-snug text-muted">{label}</span>
      </label>
      {description ? (
        <p id={descriptionId} className="pl-6 text-xs leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
    </div>
  );
}
