import { cn } from "@/lib/cn";

const messages: Record<string, string> = {
  google: "Google authentication failed or was cancelled",
  youtube:
    "YouTube connection could not be completed. The authorization was cancelled or failed. Please try again.",
};

type AuthErrorProps = {
  error?: string;
  message?: string;
  className?: string;
};

export function AuthError({ error, message, className }: AuthErrorProps) {
  const displayMessage =
    message ?? (error ? messages[error] ?? error : undefined);

  if (!displayMessage) {
    return null;
  }

  return (
    <p
      role="alert"
      className={cn(
        "mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 leading-snug",
        className,
      )}
    >
      {displayMessage}
    </p>
  );
}
