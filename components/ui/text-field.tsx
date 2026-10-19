"use client";

import { useId, useState } from "react";
import { Field } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

export type TextFieldProps = Omit<React.ComponentProps<"input">, "size"> & {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  revealable?: boolean;
  controlClassName?: string;
  inputClassName?: string;
};

export function TextField({
  id,
  label,
  hint,
  description,
  error,
  leading,
  trailing,
  revealable = false,
  controlClassName,
  inputClassName,
  className,
  type = "text",
  disabled,
  ref,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [visible, setVisible] = useState(false);
  const inputType = revealable ? (visible ? "text" : "password") : type;
  const errorId = error ? `${inputId}-error` : undefined;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const describedBy =
    [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <Field
      className={className}
      label={label}
      hint={hint}
      htmlFor={inputId}
      description={description}
      descriptionId={descriptionId}
      error={error}
      errorId={errorId}
    >
      <div
        data-slot="text-field-control"
        className={cn(
          "flex h-11 items-center gap-2 rounded-xl border bg-white px-3 transition-[border-color,box-shadow]",
          error
            ? "border-red-400 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100"
            : "border-line focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20",
          disabled && "cursor-not-allowed bg-[#faf8f5] opacity-70",
          controlClassName,
        )}
      >
        {leading ? <span className="text-[#a39b93]">{leading}</span> : null}
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          data-slot="text-field"
          className={cn(
            "h-full min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-[#b7afa6] disabled:cursor-not-allowed",
            inputClassName,
          )}
          {...props}
        />
        {trailing}
        {revealable ? (
          <button
            type="button"
            className="text-[#a39b93] transition-colors hover:text-ink"
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            onClick={() => setVisible((current) => !current)}
          >
            <Icon name={visible ? "eye-off" : "eye"} />
          </button>
        ) : null}
      </div>
    </Field>
  );
}
