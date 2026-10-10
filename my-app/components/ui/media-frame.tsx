import Image from "next/image";
import { cn } from "@/lib/cn";

type MediaFrameProps = {
  src: string;
  alt: string;
  children?: React.ReactNode;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export function MediaFrame({
  src,
  alt,
  children,
  className,
  imageClassName,
  priority = false,
}: MediaFrameProps) {
  return (
    <div
      data-slot="media-frame"
      className={cn(
        "relative overflow-hidden rounded-[22px] bg-[#e7e1d8]",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 480px, 100vw"
        className={cn("object-cover", imageClassName)}
      />
      {children ? <div className="absolute inset-x-0 bottom-0 p-3">{children}</div> : null}
    </div>
  );
}
