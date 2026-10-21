"use client";

import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarFooter 
} from "@/components/ui/sidebar";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Clock } from "lucide-react";
import Image from "next/image";
import { formatSmartDate, ProfileHoverCard } from "@/components/web/ProfileHoverCard";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface LeftSidebarArticleSeriesProps {
  slug: string;
}

function formatReadTime(totalMinutes: number): string {
  if (!totalMinutes || totalMinutes <= 0) return "0 min read";

  if (totalMinutes < 60) {
    return `${totalMinutes} min read`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  if (hours < 24) {
    if (remainingMinutes === 0) {
      return `${hours} hr read`;
    }
    return `${hours} hr ${remainingMinutes} min read`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (remainingHours === 0) {
    return `${days} day read`;
  }
  return `${days} day ${remainingHours} hr read`;
} 

export function LeftSidebarArticleSeries({ slug }: LeftSidebarArticleSeriesProps) {
  const seriesData = useQuery(api.series.getSeriesBySlug, { slug });

  const imageUrl = useQuery(
    api.series.getImageUrl,
    seriesData?.coverImage ? { storageId: seriesData.coverImage } : "skip"
  );

  const avatarSrc = seriesData?.profile?.profilePicUrl;

  const isImageLoading = seriesData?.coverImage && imageUrl === undefined;

  if (seriesData === undefined) {
    return (
      <Sidebar 
        className="flex flex-col !top-16 !z-40 border-r"
        bgClass="bg-background/95" 
        collapsible="icon"
      >
        <SidebarContent className="!p-0 w-full">
          <SidebarGroup className="pt-3 !px-2 w-full">
            <div className="relative p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/50 flex flex-col gap-3">
              
              <Skeleton className="w-full h-64 rounded-lg" />

              <div className="relative rounded-xl bg-zinc-50/80 dark:bg-zinc-900/50 flex flex-col gap-3">
                <div className="flex flex-row gap-2 items-center">
                  <Skeleton className="h-6 w-6 rounded-full shrink-0" />
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-4 w-12 rounded ml-auto" />
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <Skeleton className="h-6 w-4/5 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
              </div>

              <div className="flex items-center pt-1">
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>

            </div>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="hidden" />
      </Sidebar>
    );
  }

  if (seriesData === null) {
    return (
      <Sidebar className="flex flex-col !top-16 !z-40 border-r" bgClass="bg-background/95" collapsible="icon">
        <SidebarContent className="p-4 text-xs text-zinc-500">
          Series not found.
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar 
      className="flex flex-col !top-16 !z-40 border-r"
      bgClass="bg-background/95" 
      collapsible="icon"
    >
      <SidebarContent className="!p-0 w-full">
        <SidebarGroup className="pt-3 !px-2 w-full">
          <div className="relative p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/50 flex flex-col gap-3">
            
            <div className="relative w-full h-64 overflow-hidden rounded-lg">
              {isImageLoading ? (
                <Skeleton className="w-full h-full rounded-lg" />
              ) : imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={seriesData.title || "Series cover"}
                  fill
                  className="object-cover"
                  sizes="300px"
                />
              ) : null}
            </div>

            <div className="relative rounded-xl bg-zinc-50/80 dark:bg-zinc-900/50 flex flex-col gap-3">
              {avatarSrc &&
                <div className="flex flex-row gap-2 items-center">
                  <div className="h-6 w-6 border border-border rounded-full overflow-hidden bg-muted shrink-0">
                    <img
                      src={avatarSrc}
                      alt="profile"
                      className="h-full w-full object-cover"
                      decoding="async"
                    />
                  </div>
                  <div className="flex flex-col">
                    <ProfileHoverCard displayName={seriesData.profile?.displayName} authorUsername={seriesData.profile?.username || ""}><span className="text-sm truncate leading-tight cursor-pointer">{seriesData.profile?.displayName || seriesData.profile?.username}</span></ProfileHoverCard>
                  </div>

                  <time className="capitalize font-semibold text-lg md:text-xs tracking-tight text-zinc-400 mt-0.5 select-none ml-auto">
                    {formatSmartDate(seriesData._creationTime, false)}
                  </time>
                </div>
              }
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-bold text-lg text-foreground">{seriesData.title}</span>
              {seriesData.description && (
                <span className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {seriesData.description}
                </span>
              )}
            </div>

            <div className="flex items-center">
              <Badge variant={"outline"} className="gap-1.5 py-1 px-2.5 text-zinc-600 dark:text-zinc-300">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>{formatReadTime(seriesData.totalReadTime)}</span>
              </Badge>
            </div>

          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="hidden" />
    </Sidebar>
  );
}