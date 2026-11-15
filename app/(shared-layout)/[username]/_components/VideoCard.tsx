"use client";

import { HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { formatSmartDate } from "@/components/web/ProfileHoverCard";
import { api } from "@/convex/_generated/api";
import { FunctionReturnType } from "convex/server";
import { Eye, ThumbsUp, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { HoverCard } from "@/components/ui/hover-card";

type Video = FunctionReturnType<typeof api.blogs.getPaginatedPostsByAuthor>["page"][number];

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
    <div className="group flex flex-col gap-2 p-2 bg-zinc-50/80 hover:bg-zinc-100/90 rounded-xl transition-colors duration-100 dark:bg-muted/30">
      <div className="flex items-center justify-between p-1 gap-2">
        <Link href={`/insights/${video.blogTitleId}`} className="block hover:no-underline flex-1 min-w-0">
          <h3 className="leading-tight text-lg md:text-sm font-bold tracking-tight line-clamp-1 text-foreground transition-colors group-hover:text-blue-600">
            {video.title}
          </h3>
          <p className="leading-tight text-zinc-600 dark:text-zinc-400 line-clamp-2 text-base md:text-xs mt-0.5">
            {video.subtitle}
          </p>
        </Link>

        {imageUrl && (
          <Link 
            href={`/insights/${video.blogTitleId}`}
            className="relative w-14 h-14 shrink-0 overflow-hidden rounded-xl block"
          >
            <Image
              src={imageUrl}
              alt={video.title}
              fill
              className="object-cover aspect-[4/3]"
              sizes="64px"
            />
          </Link>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-start font-semibold gap-2 justify-between text-lg md:text-xs tracking-tight select-none">
        <div className="flex items-center gap-4 px-1">
          <div className="flex items-center gap-1">
            <Eye className="size-4.5 md:size-3.5" />
            <span>{video.totalViews}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="size-4.5 md:size-3.5" />
            <span>{video.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="size-4.5 md:size-3.5" />
            <span>{video.commentCount}</span>
          </div>
          <time className="capitalize text-base md:text-xs text-zinc-400">
            {formatSmartDate(video._creationTime, false)}
          </time>
        </div>

        <div className="flex items-center gap-2 shrink-0 max-w-[55%] justify-end">
          {video.tags && video.tags.length > 0 ? (
            <>
              <div className="flex flex-row gap-1 items-center justify-end">
                {video.tags.slice(0, 2).map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="font-sans text-base md:text-[10px] px-2 py-1.5 md:px-1.5 md:py-0.5 whitespace-nowrap border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <span className="capitalize">{tag}</span>
                  </Badge>
                ))}
              </div>
              
              {video.tags.length > 2 && (
                <HoverCard openDelay={100} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <Badge 
                      variant="outline" 
                      className="font-mono text-base md:text-[10px] px-2 py-1.5 md:px-1.5 md:py-0.5 whitespace-nowrap border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 cursor-help hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
                    >
                      +{video.tags.length - 2}
                    </Badge>
                  </HoverCardTrigger>
                  
                  <HoverCardContent side="top" align="end" className="w-auto max-w-[220px] p-2.5">
                    <div className="space-y-1.5">
                      <h4 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">More Topics</h4>
                      <div className="flex flex-wrap gap-1 max-h-[120px] overflow-y-auto">
                        {video.tags.slice(2).map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className="font-mono text-[10px] px-1.5 py-0.5 whitespace-nowrap border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                          >
                            <span className="capitalize">{tag}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )}
            </>
          ) : (
            <Badge 
              variant="outline" 
              className="font-mono text-[10px] px-1.5 py-0.5 whitespace-nowrap border-zinc-200 dark:border-zinc-800 text-zinc-500"
            >
              General
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}