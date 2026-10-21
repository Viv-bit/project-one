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
  "refresh",
  "external-link",
  "copy",
  "trash",
  "info",
  "alert-triangle",
  "x",
  "users",
  "video",
  "check-circle",
  "layout-dashboard",
  "brain",
  "layers",
  "folder-tree",
  "map",
  "flask",
  "link",
  "refresh-cw",
  "settings",
  "search",
  "help-circle",
  "bell",
  "chevron-down",
  "chevron-up",
  "chevron-right",
  "chevrons-up-down",
  "thumbs-up",
  "arrow-up",
  "download",
  "clock",
  "calendar",
  "git-commit",
  "trending-up",
  "trending-down",
  "play",
  "message-square",
  "filter",
  "plus",
  "trophy",
  "megaphone",
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
  refresh: (
    <path
      {...stroke}
      d="M21 12a9 9 0 0 1-15.5 6.36L3 16m0-4a9 9 0 0 1 15.5-6.36L21 8M21 3v5h-5M3 21v-5h5"
    />
  ),
  "external-link": (
    <>
      <path {...stroke} d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path {...stroke} d="M15 3h6v6M10 14 21 3" />
    </>
  ),
  copy: (
    <>
      <rect {...stroke} x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path {...stroke} d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </>
  ),
  trash: (
    <>
      <path {...stroke} d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line {...stroke} x1="10" y1="11" x2="10" y2="17" />
      <line {...stroke} x1="14" y1="11" x2="14" y2="17" />
    </>
  ),
  info: (
    <>
      <circle {...stroke} cx="12" cy="12" r="9" />
      <line {...stroke} x1="12" y1="16" x2="12" y2="12" />
      <circle fill="currentColor" cx="12" cy="8" r="1" />
    </>
  ),
  "alert-triangle": (
    <>
      <path
        {...stroke}
        d="m10.29 3.86-8.82 15.3c-.77 1.34.19 3.02 1.73 3.02h17.6c1.54 0 2.5-1.68 1.73-3.02l-8.82-15.3a2 2 0 0 0-3.42 0z"
      />
      <line {...stroke} x1="12" y1="9" x2="12" y2="13" />
      <circle fill="currentColor" cx="12" cy="17" r="1" />
    </>
  ),
  x: <path {...stroke} d="M18 6 6 18M6 6l12 12" />,
  users: (
    <>
      <path {...stroke} d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle {...stroke} cx="9" cy="7" r="4" />
      <path {...stroke} d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  video: (
    <>
      <polygon {...stroke} points="23 7 16 12 23 17 23 7" />
      <rect {...stroke} x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </>
  ),
  "check-circle": (
    <>
      <circle {...stroke} cx="12" cy="12" r="9" />
      <path {...stroke} d="m9 12 2 2 4-4" />
    </>
  ),
  "layout-dashboard": (
    <>
      <rect {...stroke} x="3" y="3" width="7" height="9" rx="1" />
      <rect {...stroke} x="14" y="3" width="7" height="5" rx="1" />
      <rect {...stroke} x="14" y="12" width="7" height="9" rx="1" />
      <rect {...stroke} x="3" y="16" width="7" height="5" rx="1" />
    </>
  ),
  brain: (
    <>
      <path {...stroke} d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path {...stroke} d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path {...stroke} d="M12 5v14" />
    </>
  ),
  layers: (
    <>
      <path {...stroke} d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path {...stroke} d="m22 12.5-9.17 4.16a2 2 0 0 1-1.66 0L2 12.5" />
      <path {...stroke} d="m22 17.5-9.17 4.16a2 2 0 0 1-1.66 0L2 17.5" />
    </>
  ),
  "folder-tree": (
    <>
      <path {...stroke} d="M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z" />
      <path {...stroke} d="M3 13v-1a2 2 0 0 1 2-2h7" />
      <path {...stroke} d="M5 10v11a1 1 0 0 0 1 1h2" />
      <rect {...stroke} x="8" y="14" width="6" height="5" rx="1" />
      <rect {...stroke} x="16" y="14" width="6" height="5" rx="1" />
    </>
  ),
  map: (
    <>
      <path {...stroke} d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
      <path {...stroke} d="M15 5.764v15" />
      <path {...stroke} d="M9 3.236v15" />
    </>
  ),
  flask: (
    <>
      <path {...stroke} d="M10 2v7.31L4.42 19.35A2 2 0 0 0 6.16 22h11.68a2 2 0 0 0 1.74-2.65L14 9.31V2" />
      <path {...stroke} d="M8.5 2h7" />
      <path {...stroke} d="M7 16h10" />
    </>
  ),
  link: (
    <>
      <path {...stroke} d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path {...stroke} d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </>
  ),
  "refresh-cw": (
    <path
      {...stroke}
      d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M3 21v-5h5"
    />
  ),
  settings: (
    <>
      <circle {...stroke} cx="12" cy="12" r="3" />
      <path
        {...stroke}
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      />
    </>
  ),
  search: (
    <>
      <circle {...stroke} cx="11" cy="11" r="8" />
      <path {...stroke} d="m21 21-4.35-4.35" />
    </>
  ),
  "help-circle": (
    <>
      <circle {...stroke} cx="12" cy="12" r="10" />
      <path {...stroke} d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <circle fill="currentColor" cx="12" cy="17" r="1" />
    </>
  ),
  bell: (
    <>
      <path {...stroke} d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path {...stroke} d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </>
  ),
  "chevron-down": <path {...stroke} d="m6 9 6 6 6-6" />,
  "chevron-up": <path {...stroke} d="m18 15-6-6-6 6" />,
  "chevron-right": <path {...stroke} d="m9 18 6-6-6-6" />,
  "chevrons-up-down": <path {...stroke} d="m7 15 5 5 5-5M7 9l5-5 5 5" />,
  "thumbs-up": (
    <path
      {...stroke}
      d="M7 10v12M15 10.5V6.4a2.4 2.4 0 0 0-2.4-2.4l-3.2 6H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z"
    />
  ),
  "arrow-up": <path {...stroke} d="m5 12 7-7 7 7M12 19V5" />,
  download: (
    <>
      <path {...stroke} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline {...stroke} points="7 10 12 15 17 10" />
      <line {...stroke} x1="12" y1="15" x2="12" y2="3" />
    </>
  ),
  clock: (
    <>
      <circle {...stroke} cx="12" cy="12" r="10" />
      <polyline {...stroke} points="12 6 12 12 16 14" />
    </>
  ),
  calendar: (
    <>
      <rect {...stroke} x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line {...stroke} x1="16" y1="2" x2="16" y2="6" />
      <line {...stroke} x1="8" y1="2" x2="8" y2="6" />
      <line {...stroke} x1="3" y1="10" x2="21" y2="10" />
    </>
  ),
  "git-commit": (
    <>
      <circle {...stroke} cx="12" cy="12" r="3" />
      <line {...stroke} x1="3" y1="12" x2="9" y2="12" />
      <line {...stroke} x1="15" y1="12" x2="21" y2="12" />
    </>
  ),
  "trending-up": (
    <>
      <polyline {...stroke} points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline {...stroke} points="17 6 23 6 23 12" />
    </>
  ),
  "trending-down": (
    <>
      <polyline {...stroke} points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline {...stroke} points="17 18 23 18 23 12" />
    </>
  ),
  play: <polygon {...stroke} points="5 3 19 12 5 21 5 3" fill="currentColor" fillOpacity="0.1" />,
  "message-square": (
    <path
      {...stroke}
      d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
    />
  ),
  filter: <polygon {...stroke} points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />,
  plus: <path {...stroke} d="M5 12h14M12 5v14" />,
  trophy: (
    <>
      <path {...stroke} d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path {...stroke} d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path {...stroke} d="M4 22h16" />
      <path {...stroke} d="M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34" />
      <path {...stroke} d="M6 4h12v6a6 6 0 0 1-12 0V4Z" />
    </>
  ),
  megaphone: (
    <>
      <path {...stroke} d="m3 11 18-5v12L3 14v-3z" />
      <path {...stroke} d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </>
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
