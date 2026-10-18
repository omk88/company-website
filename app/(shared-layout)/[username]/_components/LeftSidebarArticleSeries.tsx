"use client";

import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarFooter 
} from "@/components/ui/sidebar";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface LeftSidebarArticleSeriesProps {
    slug: string;
}

export function LeftSidebarArticleSeries({ slug }: LeftSidebarArticleSeriesProps) {
  const seriesData = useQuery(api.series.getSeriesBySlug, { slug });

  const imageUrl = useQuery(
    api.series.getImageUrl,
    seriesData?.coverImage ? { storageId: seriesData.coverImage } : "skip"
  ) ?? "/noImage.png";

  if (seriesData === undefined) {
    return (
      <Sidebar className="flex flex-col !top-16 !z-40 border-r" bgClass="bg-background/95" collapsible="icon">
        <SidebarContent className="flex items-center justify-center h-40">
          <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
        </SidebarContent>
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
            
            <div className="relative w-full h-36 overflow-hidden rounded-lg">
              <Image
                src={imageUrl}
                alt={seriesData.title || "Series cover"}
                fill
                className="object-cover"
                sizes="300px"
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-bold text-lg text-foreground">{seriesData.title}</span>
              {seriesData.description && (
                <span className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {seriesData.description}
                </span>
              )}
            </div>

          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="hidden" />
    </Sidebar>
  );
}