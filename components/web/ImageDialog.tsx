"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface ZoomableImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src?: string | Blob;
  alt?: string;
  title?: string;
}

export function ImageDialog({
  src,
  alt,
  title,
  className,
  ...props
}: ZoomableImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  const imageUrl = useMemo(() => {
    if (!src) return undefined;
    if (typeof src === "string") return src;
    if (src instanceof Blob) return URL.createObjectURL(src);
    return undefined;
  }, [src]);

  if (!imageUrl) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = alt || title || "downloaded-image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const displayTitle = title || alt;

  return (
    <>
      <img
        src={imageUrl}
        alt={alt || ""}
        className={`cursor-zoom-in transition-transform hover:opacity-95 ${className || ""}`}
        onClick={() => setIsOpen(true)}
        {...props}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          variant="lightbox"
          title={displayTitle}
          onDownload={handleDownload}
        >
          {!displayTitle && (
            <DialogTitle className="sr-only">Enlarged image</DialogTitle>
          )}

          <img
            src={imageUrl}
            alt={alt || displayTitle || ""}
            className="max-h-[75vh] max-w-[90vw] w-auto h-auto object-contain rounded-none select-none shadow-2xl"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}