import { cn } from "@/lib/cn";

export type FieldProps = {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  htmlFor?: string;
  description?: React.ReactNode;
  descriptionId?: string;
  error?: React.ReactNode;
  errorId?: string;
  children: React.ReactNode;
  className?: string;
};

export function Field({
  label,
  hint,
  htmlFor,
  description,
  descriptionId,
  error,
  errorId,
  children,
  className,
}: FieldProps) {
  return (
    <div data-slot="field" className={cn("flex flex-col gap-1.5", className)}>
      {label || hint ? (
        <div className="flex items-baseline justify-between gap-3">
          {label ? (
            <label htmlFor={htmlFor} className="text-[13px] font-medium text-ink">
              {label}
            </label>
          ) : (
            <span />
          )}
          {hint ? <div className="shrink-0 text-xs text-[#9a928a]">{hint}</div> : null}
        </div>
      ) : null}
      {children}
      {description ? (
        <p id={descriptionId} className="text-xs leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
