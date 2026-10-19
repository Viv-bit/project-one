"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Modal } from "@/components/ui/modal";
import { googleAuthUrl } from "@/lib/api";

type YouTubeSignInButtonProps = {
  label?: string;
};

export function YouTubeSignInButton({
  label = "YouTube Verified",
}: YouTubeSignInButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        fullWidth
        leadingIcon={<Icon name="youtube" />}
        onClick={() => setIsOpen(true)}
      >
        {label}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <Icon name="youtube" className="size-5" />
            </span>
            <span>Connect YouTube Channel</span>
          </div>
        }
        description="Lumen pairs your YouTube channel directly with your creator session."
        size="md"
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-line bg-white/80 p-4 text-xs text-muted space-y-2">
            <p className="text-sm font-semibold text-ink">
              How YouTube connection works on Lumen:
            </p>
            <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed">
              <li>
                <strong className="text-ink">Step 1:</strong> Sign in with Google SSO or your creator credentials so your session is secured.
              </li>
              <li>
                <strong className="text-ink">Step 2:</strong> In your creator dashboard, click <em>Connect YouTube Channel</em> to authorize read-only analytics.
              </li>
              <li>
                <strong className="text-ink">Step 3:</strong> Lumen instantly starts indexing your video retention curves and hook diagnostics.
              </li>
            </ol>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <Button
              href={googleAuthUrl}
              fullWidth
              leadingIcon={<Icon name="google" />}
              className="bg-brand text-white hover:bg-brand-strong"
            >
              Sign In with Google to Connect
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setIsOpen(false)}
            >
              Continue with Email Form
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
