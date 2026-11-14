"use client";

import { formatSmartDate } from "@/components/web/ProfileHoverCard";
import { Doc } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type Video = Doc<"blogs">;

interface VideoCardProps {
  video: Video;
  index: number;
}

export default function VideoCard({ video, index }: VideoCardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  
  const imageUrl = video.imageUrl;

  return (
    <div
      onClick={() => router.push(`${pathname}/insights/${video.blogTitleId}`)}
      className={`group relative flex flex-col sm:flex-row items-center gap-3 p-3 rounded-xl dark:bg-muted/30 cursor-pointer transition-colors ${
        isButtonHovered ? "bg-zinc-50/85" : "bg-zinc-50/85 hover:bg-zinc-100/90"
      }`}
    >
      {imageUrl === undefined ? (
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 overflow-hidden rounded-xl animate-pulse bg-muted-foreground/20" />
      ) : imageUrl ? (
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 overflow-hidden rounded-xl">
          <Image
            src={imageUrl}
            alt={video.title || "Series cover"}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 80px, 96px"
          />
        </div>
      ) : null}

      <div className="flex-1 min-w-0 flex flex-col gap-1 w-full">
        <div className="flex items-center justify-between gap-4 w-full">
          <h3 className="leading-tight text-lg md:text-sm font-bold tracking-tight line-clamp-1 text-foreground group-hover:text-blue-600 flex-1 min-w-0">
            {video.title}
          </h3>
          
        </div>

        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <p className="leading-tight text-zinc-600 dark:text-zinc-400 line-clamp-3 text-base md:text-xs max-w-md">
              {video.subtitle}
            </p>

            <time className="capitalize font-semibold text-lg md:text-xs tracking-tight text-zinc-400 mt-0.5 select-none">
              {formatSmartDate(video._creationTime, false)}
            </time>
          </div>
        </div>
      </div>
    </div>
  );
}