"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { Images } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { DialogImageItem, ImageDialog } from "./ImageDialog";

export interface BlogImageEntry {
  src: string | Blob;
  alt?: string;
  title?: string;
}

interface BlogImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src?: string | Blob;
  images?: BlogImageEntry[];
  carouselBlock?: string;
  alt?: string;
}

const MAX_VISIBLE_PREVIEWS = 3;
const MD_IMAGE_REGEX = /!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]*)")?\)/g;

export function parseCarouselBlock(raw: string): BlogImageEntry[] {
  const inner = raw
    .replace(/^\s*:::carousel[^\n]*\r?\n?/i, "")
    .replace(/\r?\n?\s*:::\s*$/, "");

  const parsed: BlogImageEntry[] = [];
  for (const match of inner.matchAll(MD_IMAGE_REGEX)) {
    parsed.push({
      alt: match[1] ?? "",
      src: match[2],
      title: match[3],
    });
  }
  return parsed;
}

function extractStorageId(src?: string | Blob): Id<"_storage"> | null {
  if (!src || typeof src !== "string") return null;
  const relativeMatch = src.match(/\/api\/storage\/([a-zA-Z0-9_\-]+)/);
  const legacyMatch = src.match(
    /https:\/\/[^\s\)\"]+\/api\/storage\/([a-zA-Z0-9_\-]+)/
  );
  return (relativeMatch?.[1] || legacyMatch?.[1] || null) as Id<"_storage"> | null;
}

function ResolvedEntry({
  entry,
  index,
  onReady,
}: {
  entry: BlogImageEntry;
  index: number;
  onReady: (index: number, url: string | undefined) => void;
}) {
  const storageId = useMemo(() => extractStorageId(entry.src), [entry.src]);
  const convexUrl = useQuery(
    api.files.getImageUrl,
    storageId ? { storageId } : "skip"
  );

  const blobUrl = useMemo(() => {
    if (entry.src instanceof Blob) return URL.createObjectURL(entry.src);
    return undefined;
  }, [entry.src]);

  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);

  const resolvedUrl = storageId
    ? convexUrl ?? undefined
    : typeof entry.src === "string"
      ? entry.src
      : blobUrl;

  useEffect(() => {
    onReady(index, resolvedUrl);
  }, [index, resolvedUrl, onReady]);

  return null;
}

export function BlogImage({
  src,
  images,
  carouselBlock,
  alt,
  className,
  ...props
}: BlogImageProps) {
  const entries = useMemo<BlogImageEntry[]>(() => {
    if (images && images.length > 0) {
      return images.filter((item) => Boolean(item.src));
    }
    if (carouselBlock) {
      return parseCarouselBlock(carouselBlock);
    }
    if (src) {
      return [{ src, alt }];
    }
    return [];
  }, [src, images, carouselBlock, alt]);

  const [resolvedUrls, setResolvedUrls] = useState<Record<number, string>>({});
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const handleReady = useCallback((index: number, url: string | undefined) => {
    setResolvedUrls((prev) => {
      if (!url || prev[index] === url) return prev;
      return { ...prev, [index]: url };
    });
  }, []);

  if (!entries.length) return null;

  const firstEntry = entries[0];
  const firstStorageId = extractStorageId(firstEntry.src);
  const firstUrl = resolvedUrls[0];

  if (firstStorageId && !firstUrl) {
    return (
      <>
        {entries.map((entry, idx) => (
          <ResolvedEntry key={idx} entry={entry} index={idx} onReady={handleReady} />
        ))}
        <span className="block w-full h-64 bg-neutral-100 dark:bg-neutral-800 rounded-none my-4" />
      </>
    );
  }

  if (!firstUrl) return null;

  const dialogItems: DialogImageItem[] = entries
    .map((entry, idx) => ({
      src: resolvedUrls[idx] || "",
      alt: entry.alt || alt || "",
      title: entry.title,
    }))
    .filter((item) => Boolean(item.src));

  const visibleEntries = entries.slice(0, MAX_VISIBLE_PREVIEWS);
  const isGroup = entries.length > 1;

  const openAt = (idx: number) => {
    setStartIndex(idx);
    setOpen(true);
  };

  return (
    <span className="my-4 block max-w-full">
      {entries.map((entry, idx) => (
        <ResolvedEntry key={idx} entry={entry} index={idx} onReady={handleReady} />
      ))}

      {!isGroup ? (
        <img
          src={firstUrl}
          alt={firstEntry.alt || alt || ""}
          onClick={() => openAt(0)}
          className={`cursor-zoom-in rounded-none ${className || ""}`}
          {...props}
        />
      ) : (
        <span className="block">
          <span className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {visibleEntries.map((entry, idx) => {
              const url = resolvedUrls[idx];
              if (!url) {
                return (
                  <span
                    key={idx}
                    className="block h-44 w-full bg-neutral-100 dark:bg-neutral-800 rounded-none"
                  />
                );
              }

              return (
                <span
                  key={idx}
                  onClick={() => openAt(idx)}
                  className="relative block h-44 w-full cursor-zoom-in overflow-hidden rounded-none"
                >
                  <img
                    src={url}
                    alt={entry.alt || alt || ""}
                    className={`h-full w-full object-cover rounded-none ${
                      className || ""
                    }`}
                    {...props}
                  />
                </span>
              );
            })}
          </span>

          <span className="mt-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => openAt(0)}
              className="inline-flex items-center gap-2 rounded-md bg-neutral-900 dark:bg-neutral-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 dark:hover:bg-neutral-700 transition"
            >
              <Images className="h-3.5 w-3.5 shrink-0" />
              <span>{entries.length} images in collection</span>
            </button>
          </span>
        </span>
      )}

      <ImageDialog
        items={dialogItems}
        initialIndex={startIndex}
        isOpen={open}
        onOpenChange={setOpen}
        showTrigger={false}
      />
    </span>
  );
}