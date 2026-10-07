"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Slider as SliderPrimitive } from "radix-ui";

export interface SliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  marks?: number[];
  showTooltip?: boolean;
  showTooltipArrow?: boolean;
  getTooltipContent?: (value: number) => React.ReactNode;
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  marks,
  showTooltip = false,
  showTooltipArrow = false,
  getTooltipContent,
  ...props
}: SliderProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  const [hoverValue, setHoverValue] = React.useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = React.useState<number>(0);
  const [displayHoverValue, setDisplayHoverValue] = React.useState<number>(0);

  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showTooltip || !rootRef.current || max <= min) return;

    const rect = rootRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const clampedX = Math.max(0, Math.min(offsetX, rect.width));
    const percentage = clampedX / rect.width;
    const calculatedVal = min + percentage * (max - min);

    setHoverPosition(percentage * 100);
    setHoverValue(calculatedVal);
    setDisplayHoverValue(calculatedVal);
  };

  const handleMouseLeave = () => {
    if (showTooltip) {
      setHoverValue(null);
    }
  };

  return (
    <SliderPrimitive.Root
      ref={rootRef}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative flex w-full touch-none items-center select-none py-1.5 data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col",
        className
      )}
      {...props}
    >
      {showTooltip && hoverValue !== null && max > min && (
        <div
          className="pointer-events-none absolute bottom-full mb-1 -translate-x-1/2 rounded-md bg-zinc-900 px-2.5 py-1 text-center shadow-md dark:bg-zinc-100 z-50 whitespace-nowrap"
          style={{ left: `${hoverPosition}%` }}
        >
          <div className="flex flex-col items-center gap-0.5 text-xs text-zinc-50 dark:text-zinc-900 font-medium">
            {getTooltipContent
              ? getTooltipContent(displayHoverValue)
              : displayHoverValue.toFixed(0)}
          </div>
          {showTooltipArrow && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900 dark:border-t-zinc-100" />
          )}
        </div>
      )}

      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative grow overflow-hidden rounded-full bg-muted data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute bg-primary select-none data-horizontal:h-full data-vertical:w-full"
        />
      </SliderPrimitive.Track>

      {marks &&
        max > min &&
        marks.map((markValue, index) => {
          if (markValue <= min || markValue >= max) return null;
          const percentage = ((markValue - min) / (max - min)) * 100;

          return (
            <div
              key={index}
              className="absolute top-1/2 -translate-y-1/2 h-2.5 w-0.5 bg-white dark:bg-zinc-950 pointer-events-none rounded-full"
              style={{ left: `${percentage}%` }}
            />
          );
        })}

      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="relative block size-3 shrink-0 rounded-full border border-ring bg-white ring-ring/50 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };