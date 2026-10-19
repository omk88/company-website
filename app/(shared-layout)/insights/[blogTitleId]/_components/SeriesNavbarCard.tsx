"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Layers, List } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SeriesHoverCard } from "./SeriesHoverCard";

interface BlogSeriesNavbarProps {
  blogId: Doc<"blogs">["_id"];
}

export function BlogSeriesNavbar({ blogId }: BlogSeriesNavbarProps) {
  const seriesList = useQuery(api.series.getSeriesForBlog, { blogId });
  const pathname = usePathname();

  if (!seriesList || seriesList.length === 0) return null;

  const currentSeriesData = seriesList[0];

  if (!currentSeriesData) return null;

  const { series, currentIndex, totalCount, prev, next } = currentSeriesData;

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-row items-center gap-2 justify-between text-sm font-medium text-zinc-500">
        <div className="flex flex-row items-center gap-1.5">
          <List className="w-4 h-4" />
          <span>Part of the series:</span>
          <SeriesHoverCard slug={"demystifying-2231e"} username={"info"}>
            <strong className="text-foreground cursor-pointer">
              {series.title}
            </strong>
          </SeriesHoverCard>
        </div>
        <span>Article {currentIndex} of {totalCount}</span>
      </div>

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-800">
        {prev ? (
          <Button variant="outline" size="sm" asChild className="h-8 text-xs gap-1">
            <Link href={`/insights/${prev.blogTitleId}`}> 
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="truncate max-w-[120px] sm:max-w-[200px]">{prev.title}</span>
            </Link>
          </Button>
        ) : <div />}

        {next ? (
          <Button variant="outline" size="sm" asChild className="h-8 text-xs gap-1 ml-auto">
            <Link href={`/insights/${next.blogTitleId}`}>
              <span className="truncate max-w-[120px] sm:max-w-[200px]">{next.title}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        ) : <div />}
      </div>
    </div>
  );
}