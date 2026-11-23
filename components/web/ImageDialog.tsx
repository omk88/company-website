"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

export interface DialogImageItem {
  src: string | Blob;
  alt?: string;
  title?: string;
}

interface ImageDialogProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "title"> {
  src?: string | Blob;
  alt?: string;
  title?: string;
  items?: DialogImageItem[];
  initialIndex?: number;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

function useMediaUrl(media?: string | Blob) {
  const blobUrl = useMemo(() => {
    if (media instanceof Blob) return URL.createObjectURL(media);
    return undefined;
  }, [media]);

  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);

  if (typeof media === "string") return media;
  return blobUrl;
}

export function ImageDialog({
  src,
  alt,
  title,
  items,
  initialIndex = 0,
  isOpen: controlledOpen,
  onOpenChange,
  showTrigger = true,
  className,
  ...props
}: ImageDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [index, setIndex] = useState(initialIndex);

  const isOpen = controlledOpen ?? internalOpen;
  const setOpen = (next: boolean) => {
    setInternalOpen(next);
    onOpenChange?.(next);
  };

  const list = useMemo<DialogImageItem[]>(() => {
    if (items && items.length > 0) {
      return items.filter((item) => Boolean(item.src));
    }
    if (src) {
      return [{ src, alt, title }];
    }
    return [];
  }, [items, src, alt, title]);

  useEffect(() => {
    setIndex(Math.min(initialIndex, Math.max(0, list.length - 1)));
  }, [initialIndex, isOpen, list.length]);

  const hasMultiple = list.length > 1;
  const activeItem = list[index] ?? list[0];
  const activeUrl = useMediaUrl(activeItem?.src);
  const triggerUrl = useMediaUrl(list[0]?.src);

  const goPrev = () => {
    if (!hasMultiple) return;
    setIndex((prev) => (prev - 1 + list.length) % list.length);
  };

  const goNext = () => {
    if (!hasMultiple) return;
    setIndex((prev) => (prev + 1) % list.length);
  };

  useEffect(() => {
    if (!isOpen || !hasMultiple) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  if (!list.length) return null;

  const displayTitle = activeItem?.title || activeItem?.alt;

  const handleDownload = async () => {
    if (!activeUrl) return;
    try {
      const response = await fetch(activeUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = activeItem?.alt || activeItem?.title || "downloaded-image.png";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Failed to download image:", error);
      window.open(activeUrl, "_blank");
    }
  };

  return (
    <>
      {showTrigger && triggerUrl && (
        <img
          src={triggerUrl}
          alt={list[0]?.alt || ""}
          className={`cursor-zoom-in transition-transform hover:opacity-95 ${className || ""}`}
          onClick={() => {
            setIndex(0);
            setOpen(true);
          }}
          {...props}
        />
      )}

      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent
          variant="lightbox"
          title={displayTitle}
          onDownload={handleDownload}
        >
          {!displayTitle && (
            <DialogTitle className="sr-only">Enlarged image</DialogTitle>
          )}

          {isOpen && hasMultiple && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous image"
                className="fixed left-4 top-1/2 -translate-y-1/2 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/90 transition"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={goNext}
                aria-label="Next image"
                className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/90 transition"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <div className="flex flex-col items-center justify-center">
            {activeUrl && (
              <img
                src={activeUrl}
                alt={activeItem?.alt || displayTitle || ""}
                className="max-h-[75vh] max-w-[85vw] w-auto h-auto object-contain rounded-none select-none shadow-2xl"
              />
            )}

            {hasMultiple && (
              <div className="mt-2 text-center text-xs text-neutral-300">
                {index + 1} / {list.length}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}