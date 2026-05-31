import React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  duration?: string;
}

export function Marquee({
  children,
  direction = "left",
  pauseOnHover = true,
  duration = "30s",
  className,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      style={{ "--duration": duration } as React.CSSProperties}
      className={cn(
        "group flex w-full flex-row overflow-hidden [gap:var(--gap)]",
        className
      )}
    >
      <div
        className={cn(
          "animate-marquee flex min-w-full shrink-0 flex-row justify-around [gap:var(--gap)]",
          direction === "right" && "[animation-direction:reverse]",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
      >
        {children}
      </div>
      
      <div
        aria-hidden="true"
        className={cn(
          "animate-marquee flex min-w-full shrink-0 flex-row justify-around [gap:var(--gap)]",
          direction === "right" && "[animation-direction:reverse]",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
      >
        {children}
      </div>
    </div>
  );
}