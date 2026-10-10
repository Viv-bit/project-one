import { cn } from "@/lib/cn";

export const iconNames = [
  "spark",
  "arrow-right",
  "eye",
  "eye-off",
  "lock",
  "at",
  "check",
  "star",
  "shield",
  "google",
  "youtube",
  "ban",
  "zap",
  "activity",
] as const;

export type IconName = (typeof iconNames)[number];

type IconProps = {
  name: IconName;
  className?: string;
  title?: string;
};

const stroke = {
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const icons: Record<IconName, React.ReactNode> = {
  spark: (
    <path
      fill="currentColor"
      d="M12 2.2 13.35 8.7 19.9 10.05 13.35 11.4 12 17.9 10.65 11.4 4.1 10.05 10.65 8.7 12 2.2Zm0 4.15 1.05 4.15 4.15 1.05-4.15 1.05L12 16.75l-1.05-4.15-4.15-1.05 4.15-1.05L12 6.35Z"
    />
  ),
  "arrow-right": <path {...stroke} d="M5 12h14M13 6l6 6-6 6" />,
  eye: (
    <>
      <path
        {...stroke}
        d="M2.5 12S6 6.75 12 6.75 21.5 12 21.5 12 18 17.25 12 17.25 2.5 12 2.5 12Z"
      />
      <circle {...stroke} cx="12" cy="12" r="2.4" />
    </>
  ),
  "eye-off": (
    <>
      <path {...stroke} d="M4 4.5 20 19.5" />
      <path
        {...stroke}
        d="M9.9 6.9A9.8 9.8 0 0 1 12 6.75c6 0 9.5 5.25 9.5 5.25a17 17 0 0 1-3.15 3.55M6.2 8.3C4 9.9 2.5 12 2.5 12S6 17.25 12 17.25c1.15 0 2.22-.2 3.2-.55"
      />
      <path {...stroke} d="M10.2 10.4a2.4 2.4 0 0 0 3.3 3.3" />
    </>
  ),
  lock: (
    <>
      <rect {...stroke} x="5" y="10.5" width="14" height="9" rx="2" />
      <path {...stroke} d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </>
  ),
  at: (
    <>
      <circle {...stroke} cx="12" cy="12" r="3.1" />
      <path
        {...stroke}
        d="M15.1 12.2v1.2a2.15 2.15 0 0 0 4.3 0V12a7.4 7.4 0 1 0-2.85 5.85"
      />
    </>
  ),
  check: (
    <path
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 12.5 9.2 17 19 7"
    />
  ),
  star: (
    <path
      fill="currentColor"
      d="m12 3.1 2.05 4.55 4.95.6-3.7 3.4.95 4.95L12 14.3l-4.25 2.3.95-4.95-3.7-3.4 4.95-.6L12 3.1Z"
    />
  ),
  shield: (
    <>
      <path
        {...stroke}
        d="M12 3.4 19 6.1v5.4c0 4.15-2.75 7.1-7 8.85-4.25-1.75-7-4.7-7-8.85V6.1L12 3.4Z"
      />
      <path {...stroke} d="m8.8 12.1 2.15 2.15 4.25-4.4" />
    </>
  ),
  google: (
    <>
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.74-.07-1.45-.19-2.13H12v4.03h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.32 2.98-7.43Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.62-2.34l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.06v2.59A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.41 13.99A6 6 0 0 1 6.1 12c0-.69.12-1.36.31-1.99V7.42H3.06A10 10 0 0 0 2 12c0 1.61.39 3.14 1.06 4.58l3.35-2.59Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.89c1.47 0 2.79.5 3.83 1.5l2.87-2.87C16.95 2.89 14.7 2 12 2A10 10 0 0 0 3.06 7.42l3.35 2.59C7.2 7.65 9.4 5.89 12 5.89Z"
      />
    </>
  ),
  youtube: (
    <>
      <path
        fill="#FF0033"
        d="M22.2 12.2s0-3.05-.39-4.4c-.21-.86-.86-1.54-1.72-1.75C18.74 5.66 12 5.66 12 5.66s-6.74 0-8.09.39c-.86.21-1.51.89-1.72 1.75C1.8 9.15 1.8 12.2 1.8 12.2s0 3.05.39 4.4c.21.86.86 1.54 1.72 1.75 1.35.39 8.09.39 8.09.39s6.74 0 8.09-.39c.86-.21 1.51-.89 1.72-1.75.39-1.35.39-4.4.39-4.4Z"
      />
      <path fill="#fff" d="M10.2 15.15V9.25l5.15 2.95-5.15 2.95Z" />
    </>
  ),
  ban: (
    <>
      <circle {...stroke} cx="12" cy="12" r="8" />
      <path {...stroke} d="m7.6 7.6 8.8 8.8" />
    </>
  ),
  zap: <path {...stroke} d="M13 3 5.8 13.2H12L11 21l7.2-10.2H12L13 3Z" />,
  activity: (
    <path {...stroke} d="M3 12h4l2.2-5.2L12.8 17 15 12h6" />
  ),
};

export function Icon({ name, className, title }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      className={cn("size-4 shrink-0", className)}
      fill="none"
    >
      {title ? <title>{title}</title> : null}
      {icons[name]}
    </svg>
  );
}
