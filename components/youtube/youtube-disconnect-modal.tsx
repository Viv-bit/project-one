"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { disconnectYouTubeConnection } from "@/lib/youtube";

type YouTubeDisconnectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  channelTitle?: string;
  channelHandle?: string | null;
  onSuccess: () => void;
};

export function YouTubeDisconnectModal({
  isOpen,
  onClose,
  channelTitle = "YouTube Channel",
  channelHandle,
  onSuccess,
}: YouTubeDisconnectModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDisconnect = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      await disconnectYouTubeConnection();
      setIsDeleting(false);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setIsDeleting(false);
      if (err instanceof Error && err.message === "UNAUTHORIZED") {
        setError("Your session has expired. Please sign in again.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while disconnecting.");
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isDeleting) {
          setError(null);
          onClose();
        }
      }}
      title={
        <div className="flex items-center gap-2.5 text-red-600">
          <span className="flex size-8 items-center justify-center rounded-lg bg-red-100 text-red-600">
            <Icon name="alert-triangle" className="size-5" />
          </span>
          <span>Disconnect YouTube Account?</span>
        </div>
      }
      description="This will remove the connection between Lumen and your YouTube channel."
      size="md"
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-red-200 bg-red-50/60 p-4 text-sm text-ink">
          <p className="font-medium">
            Are you sure you want to disconnect{" "}
            <span className="font-semibold text-red-700">
              {channelTitle}
              {channelHandle ? ` (${channelHandle})` : ""}
            </span>
            ?
          </p>
          <ul className="mt-2 list-disc pl-4 text-xs text-muted space-y-1">
            <li>Lumen will immediately stop syncing retention and performance metrics.</li>
            <li>Stored API tokens will be revoked with Google.</li>
            <li>You can reconnect this channel or a different one at any time.</li>
          </ul>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs font-medium text-red-700"
          >
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDisconnect}
            disabled={isDeleting}
            leadingIcon={
              isDeleting ? (
                <Icon name="refresh" className="size-4 animate-spin" />
              ) : (
                <Icon name="trash" className="size-4" />
              )
            }
            className="bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-400"
          >
            {isDeleting ? "Disconnecting..." : "Disconnect Channel"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
