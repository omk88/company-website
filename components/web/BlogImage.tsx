"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ImageDialog } from "./ImageDialog";

interface BlogImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | Blob;
  alt?: string;
}

export function BlogImage({ src, alt, ...props }: BlogImageProps) {
  if (!src || typeof src !== "string") return null;

  const storageMatch = src.match(/\/api\/storage\/(.+)/);
  const storageId = storageMatch ? (storageMatch[1] as Id<"_storage">) : null;

  const resolvedUrl = useQuery(
    api.files.getImageUrl,
    storageId ? { storageId } : "skip"
  );

  const finalSrc = storageId ? resolvedUrl : src;

  if (storageId && !resolvedUrl) {
    return (
      <span className="block w-full h-64 bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded-lg my-4" />
    );
  }

  if (!finalSrc) return null;

  return <ImageDialog src={finalSrc} alt={alt || ""} {...props} />;
}