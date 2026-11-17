"use client";

import { formatSmartDate, ProfileHoverCard } from "@/components/web/ProfileHoverCard";
import { Doc } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BookOpenText, Clock, Library } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { formatReadTime, getCurrencySymbol } from "./LeftSidebarArticleSeries";

type Series = Doc<"series"> & {
  imageUrl?: string | null;
  articleCount?: number;
  firstArticleId?: string | null;
  username?: string | null;
  displayName?: string | null;
  totalReadTime?: number;
};

interface ProfileArticleSeriesProps {
  series: Series;
  isCompact?: boolean;
  index?: number;
}

export default function SeriesCard({ series, isCompact = false }: ProfileArticleSeriesProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  
  const imageUrl = series.imageUrl;
  const articleCount = series.articleCount || 0;
  const targetArticleId = series.firstArticleId;
  const username = series.username || "";
  const displayName = series.displayName || username;
  const totalReadTime = series.totalReadTime || 0;

  if (isCompact) {
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
              unoptimized
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

  return (
    <div className="group flex flex-col md:flex-row h-auto md:h-[190px] border border-border/50 rounded-none transition-colors duration-100 hover:bg-muted bg-background/95">
      
      <Link 
        href={`/${username}/series/${series.slug}`}
        className="relative aspect-video md:aspect-auto w-full md:w-2/5 md:h-full overflow-hidden bg-muted border-b md:border-b-0 md:border-r border-border/50 shrink-0 block"
      >
        {imageUrl && 
            <div className="relative w-full aspect-[16/9] bg-zinc-100 dark:bg-zinc-800">
                <Image
                    unoptimized
                    src={imageUrl} 
                    alt={series.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
        }
      </Link>

      <div className="flex flex-col flex-1 justify-start p-4 min-w-0">
        <div className="min-w-0">
          <div className="font-roboto flex items-center justify-between text-xs uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-1">
                  <ProfileHoverCard authorUsername={username} displayName={displayName}>
                      <span className="cursor-pointer">{displayName}</span>
                  </ProfileHoverCard>
                  
                  <span>&middot;</span>
                  
                  <span>{formatSmartDate(series._creationTime, false)}</span>
              </div>
          </div>
        </div>

        <Link href={`/${username}/series/${series.slug}`} className="space-y-2 py-1 block hover:no-underline">
          <h3 className="leading-tight py-1 text-xl font-bold tracking-tight line-clamp-2 text-foreground transition-colors duration-100 group-hover:text-blue-600 break-words">
            {series.title}
          </h3>
          <p className="leading-snug text-zinc-600 dark:text-zinc-400 line-clamp-2 text-sm break-words">
            {series.description}
          </p>
        </Link>

        {series.price && series.currency &&
          <div className="flex font-sans font-semibold items-center justify-between text-sm tracking-tight select-none w-full mt-auto">
            <div className="flex items-center">
              <Badge variant={"outline"} className="py-1 px-2.5 text-green-600 dark:text-green-300">
                <span>{getCurrencySymbol(series.currency)}{series.price}</span>
              </Badge>
            </div>
            <div className="flex flex-row gap-1.5">
              <div className="flex items-center ml-auto">
                <Badge variant={"outline"} className="gap-1.5 py-1 px-2.5 text-zinc-600 dark:text-zinc-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatReadTime(totalReadTime)}</span>
                </Badge>
              </div>
              <div className="flex items-center ml-auto">
                <Badge variant={"outline"} className="gap-1.5 py-1 px-2.5 text-zinc-600 dark:text-zinc-300">
                  <Library className="w-3.5 h-3.5" />
                  <span>
                    {series.articleCount} {series.articleCount === 1 ? "Article" : "Articles"}
                  </span>
                </Badge>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
}