"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/icon";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  showCloseButton?: boolean;
};

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  size = "md",
  showCloseButton = true,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        ref={overlayRef}
        onClick={(e) => {
          if (e.target === overlayRef.current) {
            onClose();
          }
        }}
        aria-hidden="true"
        className="fixed inset-0 bg-ink/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Dialog card */}
      <div
        className={cn(
          "relative z-10 w-full overflow-hidden rounded-2xl border border-line bg-cream p-6 shadow-2xl transition-all sm:p-7",
          "animate-in zoom-in-95 fade-in duration-200",
          sizeClasses[size],
          className,
        )}
      >
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 inline-flex size-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-black/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            aria-label="Close dialog"
          >
            <Icon name="x" className="size-4" />
          </button>
        )}

        {title && (
          <div className="mb-4 pr-6">
            <h3 className="font-serif text-2xl font-normal tracking-tight text-ink">
              {title}
            </h3>
            {description && (
              <p className="mt-1.5 text-sm text-muted leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        <div>{children}</div>
      </div>
    </div>
  );
}
