const messages: Record<string, string> = {
  google: "Google sign-in could not be completed. Try again.",
  youtube:
    "YouTube connection could not be completed. The authorization was cancelled or failed. Please try again.",
};

export function AuthError({ error }: { error?: string }) {
  const message = error ? messages[error] : undefined;

  if (!message) {
    return null;
  }

  return (
    <p
      role="alert"
      className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
    >
      {message}
    </p>
  );
}
