import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { googleAuthUrl } from "@/lib/api";

type GoogleAuthButtonProps = {
  children: React.ReactNode;
};

export function GoogleAuthButton({ children }: GoogleAuthButtonProps) {
  return (
    <Button
      href={googleAuthUrl}
      variant="secondary"
      fullWidth
      leadingIcon={<Icon name="google" />}
    >
      {children}
    </Button>
  );
}
