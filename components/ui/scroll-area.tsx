"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";

interface ScrollAreaProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  onReachBottom?: () => void;
  bottomOffset?: number;
  scrollbarInset?: number;
  rightOffset?: number;
  thumbColor?: string;
  thumbClassName?: string;
}

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(
  (
    {
      className,
      children,
      onReachBottom,
      bottomOffset = 50,
      scrollbarInset = 12,
      rightOffset = 0,
      thumbColor,
      thumbClassName,
      ...props
    },
    ref
  ) => {
    const viewportRef = React.useRef<HTMLDivElement>(null);

    const handleScroll = React.useCallback(() => {
      const viewport = viewportRef.current;
      if (!viewport || !onReachBottom) return;

      const { scrollTop, scrollHeight, clientHeight } = viewport;
      if (scrollHeight - (scrollTop + clientHeight) <= bottomOffset) {
        onReachBottom();
      }
    }, [onReachBottom, bottomOffset]);

    return (
      <ScrollAreaPrimitive.Root
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        <ScrollAreaPrimitive.Viewport
          ref={viewportRef}
          onScroll={handleScroll}
          className="h-full w-full rounded-[inherit]"
        >
          {children}
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar
          inset={scrollbarInset}
          rightOffset={rightOffset}
          thumbColor={thumbColor}
          thumbClassName={thumbClassName}
        />
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    );
  }
);
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

interface ScrollBarProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar> {
  inset?: number;
  rightOffset?: number;
  thumbColor?: string;
  thumbClassName?: string;
}

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Scrollbar>,
  ScrollBarProps
>(
  (
    {
      className,
      orientation = "vertical",
      inset = 0,
      rightOffset = 0,
      thumbColor,
      thumbClassName,
      style,
      ...props
    },
    ref
  ) => {
    const isVertical = orientation === "vertical";

    return (
      <ScrollAreaPrimitive.Scrollbar
        ref={ref}
        orientation={orientation}
        style={{
          ...(inset
            ? isVertical
              ? {
                  top: `${inset}px`,
                  bottom: `${inset}px`,
                  height: `calc(100% - ${inset * 2}px)`,
                }
              : {
                  left: `${inset}px`,
                  right: `${inset}px`,
                  width: `calc(100% - ${inset * 2}px)`,
                }
            : {}),
          ...(isVertical ? { right: `${rightOffset}px` } : {}),
          ...style,
        }}
        className={cn(
          "flex touch-none select-none transition-colors absolute z-10",
          isVertical && "w-2.5 border-l border-l-transparent p-[1px]",
          orientation === "horizontal" &&
            "h-2.5 flex-col border-t border-t-transparent p-[1px]",
          className
        )}
        {...props}
      >
        <ScrollAreaPrimitive.ScrollAreaThumb
          style={{
            ...(thumbColor ? { backgroundColor: thumbColor } : {}),
          }}
          className={cn(
            "relative flex-1 rounded-full bg-border transition-colors",
            thumbClassName
          )}
        />
      </ScrollAreaPrimitive.Scrollbar>
    );
  }
);
ScrollBar.displayName = ScrollAreaPrimitive.Scrollbar.displayName;

export { ScrollArea, ScrollBar };