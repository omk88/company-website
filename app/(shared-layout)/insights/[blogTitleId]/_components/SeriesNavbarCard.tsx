"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Layers } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <div className="my-8 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs font-medium text-zinc-500">
        <div className="flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Part of the series: <strong className="text-foreground">{series.title}</strong></span>
        </div>
        <span>Article {currentIndex} of {totalCount}</span>
      </div>

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-800">
        {prev ? (
          <Button variant="outline" size="sm" asChild className="h-8 text-xs gap-1">
            <Link href={`#`}> 
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="truncate max-w-[120px] sm:max-w-[200px]">{prev.title}</span>
            </Link>
          </Button>
        ) : <div />}

        {next ? (
          <Button variant="outline" size="sm" asChild className="h-8 text-xs gap-1 ml-auto">
            <Link href={`#`}>
              <span className="truncate max-w-[120px] sm:max-w-[200px]">{next.title}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        ) : <div />}
      </div>
    </div>
  );
}