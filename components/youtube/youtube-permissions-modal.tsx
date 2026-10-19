"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { startYouTubeOAuth } from "@/lib/youtube";

type YouTubePermissionsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function YouTubePermissionsModal({
  isOpen,
  onClose,
}: YouTubePermissionsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-red-100 text-red-600">
            <Icon name="youtube" className="size-5" />
          </span>
          <span>YouTube Read-Only Permissions</span>
        </div>
      }
      description="Lumen connects to the official YouTube Data API with strictly read-only scopes."
      size="lg"
    >
      <div className="space-y-4">
        {/* Permission items */}
        <div className="rounded-xl border border-line bg-white/70 p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Icon name="check" className="size-3" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">
                What Lumen CAN access:
              </p>
              <ul className="mt-1 list-disc pl-4 text-xs text-muted space-y-1">
                <li>Your public channel profile name, handle, and avatar</li>
                <li>Public subscriber counts and published video counts</li>
                <li>Public video titles, durations, and retention diagnostics</li>
              </ul>
            </div>
          </div>

          <div className="h-px bg-line" />

          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700">
              <Icon name="ban" className="size-3" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">
                What Lumen will NEVER do:
              </p>
              <ul className="mt-1 list-disc pl-4 text-xs text-muted space-y-1">
                <li>Never upload, delete, edit, or unlist videos</li>
                <li>Never post comments, manage community posts, or reply</li>
                <li>Never change your channel settings, monetization, or passwords</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security badge note */}
        <div className="flex items-center gap-2 rounded-lg bg-[#f0ecf6] px-3.5 py-2.5 text-xs text-muted">
          <Icon name="shield" className="size-4 shrink-0 text-brand" />
          <span>
            Tokens are encrypted with 256-bit AES at rest. You can revoke Lumen&apos;s access at any time from your Google Account settings or directly from your Lumen dashboard.
          </span>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => startYouTubeOAuth()}
            leadingIcon={<Icon name="youtube" />}
            className="bg-[#e62117] text-white hover:bg-[#cc1810]"
          >
            Continue to Google Consent
          </Button>
        </div>
      </div>
    </Modal>
  );
}
