"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import {
  YOUTUBE_RECONNECT_REQUIRED_CODE,
  startYouTubeOAuth,
} from "@/lib/youtube";
import { useAnalyticsStore } from "@/lib/store/analytics-store";

export function YouTubeReconnectHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useAnalyticsStore((s) => s.youtubeReconnectToast);
  const dismissToast = useAnalyticsStore((s) => s.dismissYouTubeReconnectToast);
  const lastHandledIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!toast) {
      return;
    }

    if (lastHandledIdRef.current !== toast.id) {
      lastHandledIdRef.current = toast.id;

      if (pathname !== "/dashboard/youtube") {
        const params = new URLSearchParams({
          error: YOUTUBE_RECONNECT_REQUIRED_CODE,
          message: toast.message,
        });
        router.push(`/dashboard/youtube?${params.toString()}`);
      }
    }

    const timer = setTimeout(() => {
      dismissToast();
    }, 6000);

    return () => {
      clearTimeout(timer);
    };
  }, [toast, pathname, router, dismissToast]);

  if (!toast) {
    return null;
  }

  return (
    <div
      role="alert"
      className="fixed bottom-6 right-6 z-50 w-[calc(100vw-2rem)] max-w-md rounded-2xl border border-red-200 bg-white p-4 shadow-2xl animate-in slide-in-from-bottom-3 duration-200"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
          <Icon name="alert-triangle" className="size-4" />
        </span>
        <div className="min-w-0 flex-1 pr-5">
          <p className="text-xs font-semibold text-red-900">
            YouTube Reconnection Required
          </p>
          <p className="mt-1 text-xs text-red-700 leading-relaxed">
            {toast.message}
          </p>
          <div className="mt-2.5 flex items-center gap-2.5">
            <Button
              size="sm"
              onClick={() => startYouTubeOAuth()}
              leadingIcon={<Icon name="youtube" className="size-3.5" />}
              className="h-7 bg-red-600 px-2.5 text-[11px] text-white hover:bg-red-700"
            >
              Reconnect Account
            </Button>
            <button
              type="button"
              onClick={dismissToast}
              className="text-[11px] font-medium text-muted hover:text-ink cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={dismissToast}
          aria-label="Dismiss notification"
          className="absolute top-3 right-3 inline-flex size-6 items-center justify-center rounded-lg text-muted hover:bg-black/5 hover:text-ink transition-colors cursor-pointer"
        >
          <Icon name="x" className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

