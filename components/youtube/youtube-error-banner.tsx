"use client";

import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { startYouTubeOAuth } from "@/lib/youtube";

type YouTubeErrorBannerProps = {
  message?: string;
  onDismiss?: () => void;
};

export function YouTubeErrorBanner({
  message = "Failed to connect YouTube account. Google authorization was cancelled or your session expired.",
  onDismiss,
}: YouTubeErrorBannerProps) {
  return (
    <div
      role="alert"
      className="relative mb-6 overflow-hidden rounded-2xl border border-red-200 bg-red-50/90 p-4 shadow-sm sm:p-5"
    >
      <div className="flex items-start gap-3.5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
          <Icon name="alert-triangle" className="size-5" />
        </div>
        <div className="flex-1 pr-6">
          <h4 className="text-sm font-semibold text-red-900">
            YouTube Connection Failed
          </h4>
          <p className="mt-1 text-xs sm:text-sm text-red-700 leading-relaxed">
            {message}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <Button
              size="sm"
              onClick={() => startYouTubeOAuth()}
              leadingIcon={<Icon name="youtube" />}
              className="bg-red-600 text-white hover:bg-red-700 text-xs h-8"
            >
              Try Again
            </Button>
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="text-xs font-medium text-red-700 hover:text-red-900 hover:underline cursor-pointer"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss error banner"
            className="absolute top-4 right-4 inline-flex size-7 items-center justify-center rounded-lg text-red-500 hover:bg-red-100/80 hover:text-red-800 transition-colors"
          >
            <Icon name="x" className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
