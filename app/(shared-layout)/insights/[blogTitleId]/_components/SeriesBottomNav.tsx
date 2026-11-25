"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface SeriesBottomNavProps {
  blogId: Doc<"blogs">["_id"];
}

export function SeriesBottomNav({ blogId }: SeriesBottomNavProps) {
  const seriesList = useQuery(api.series.getSeriesForBlog, { blogId });

  if (!seriesList || seriesList.length === 0) return null;

  const currentSeriesData = seriesList[0];

  if (!currentSeriesData) return null;

  const { prev, next } = currentSeriesData;

  return (
    <div className="flex flex-col gap-3 w-full">
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