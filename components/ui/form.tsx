"use client";

export function Form({
  className,
  onSubmit,
  action,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form
      data-slot="form"
      className={className}
      action={action}
      {...props}
      onSubmit={(event) => {
        onSubmit?.(event);
        if (!event.defaultPrevented && !action) {
          event.preventDefault();
        }
      }}
    />
  );
}
