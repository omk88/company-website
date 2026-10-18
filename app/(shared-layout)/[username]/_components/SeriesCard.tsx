"use client";

import { formatSmartDate } from "@/components/web/ProfileHoverCard";
import { Doc } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BookOpenText } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type Series = Doc<"series"> & {
  imageUrl?: string | null;
  articleCount?: number;
  firstArticleId?: string | null;
};

interface ProfileArticleSeriesProps {
  series: Series;
  index: number;
}

export default function SeriesCard({ series, index }: ProfileArticleSeriesProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  
  const imageUrl = series.imageUrl;
  const articleCount = series.articleCount || 0;
  const targetArticleId = series.firstArticleId;

  return (
    <div
      onClick={() => router.push(`${pathname}/series/${series.slug}`)}
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
            alt={series.title || "Series cover"}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 80px, 96px"
          />
        </div>
      ) : null}

      <div className="flex-1 min-w-0 flex flex-col gap-1 w-full">
        <div className="flex items-center justify-between gap-4 w-full">
          <h3 className="leading-tight text-lg md:text-sm font-bold tracking-tight line-clamp-1 text-foreground group-hover:text-blue-600 flex-1 min-w-0">
            {series.title}
          </h3>
          
          <span className="shrink-0 text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-200/60 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
            {articleCount} {articleCount === 1 ? 'article' : 'articles'}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <p className="leading-tight text-zinc-600 dark:text-zinc-400 line-clamp-3 text-base md:text-xs max-w-md">
              {series.description}
            </p>

            <time className="capitalize font-semibold text-lg md:text-xs tracking-tight text-zinc-400 mt-0.5 select-none">
              {formatSmartDate(series._creationTime, false)}
            </time>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className="shrink-0 h-7 text-xs rounded-lg gap-1.5 px-3 shadow-none cursor-pointer self-center z-10"
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Link href={targetArticleId ? `/insights/${targetArticleId}` : `${pathname}/series/${series.slug}`}>
              <BookOpenText className="w-3 h-3" />
              Start Reading
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}