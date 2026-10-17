import { formatSmartDate } from "@/components/web/ProfileHoverCard";
import { Doc } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export type Series = Doc<"series">;

interface ProfileArticleSeriesProps {
  series: Series;
  index: number;
  articleCount?: number;
}

export default function SeriesCard({ series, index, articleCount = 0 }: ProfileArticleSeriesProps) {
    const imageUrl = "/noImage.png";

    return (
      <div className="group flex flex-col gap-2 p-2 bg-zinc-50/80 hover:bg-zinc-100/90 rounded-xl transition-colors duration-100 dark:bg-muted/30">
        <div className="flex items-start justify-between p-1 gap-2">
          {imageUrl && (
            <div className="relative w-14 h-14 shrink-0 overflow-hidden rounded-xl block">
              <Image
                src={imageUrl}
                alt={"TEST"}
                fill
                className="object-cover aspect-[4/3]"
                sizes="64px"
              />
            </div>
          )}

          <div className="w-full max-w-lg min-w-0 flex flex-col gap-1">
            
            <div className="flex items-center justify-between gap-2">
              <h3 className="leading-tight text-lg md:text-sm font-bold tracking-tight line-clamp-1 text-foreground transition-colors group-hover:text-blue-600 flex-1">
                {series.title}
              </h3>
              
              <span className="shrink-0 text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-200/60 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                {articleCount} {articleCount === 1 ? 'article' : 'articles'}
              </span>
            </div>

            <div className="flex items-end justify-between gap-4">
              <p className="leading-tight text-zinc-600 dark:text-zinc-400 line-clamp-2 text-base md:text-xs mt-0.5 flex-1">
                {series.description}
              </p>

              <Button 
                variant="default" 
                size="sm" 
                className="shrink-0 h-7 text-xs rounded-lg gap-1.5 px-3 shadow-none cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Play className="w-3 h-3 fill-current" />
                Start Reading
              </Button>
            </div>

          </div>
          
          <div className="flex-1" />
        </div>

        <div className="flex flex-col md:flex-row items-start font-semibold gap-2 justify-between text-lg md:text-xs tracking-tight select-none">
          <div className="flex items-center gap-4 px-1">
            <time className="capitalize text-base md:text-xs text-zinc-400">
              {formatSmartDate(series._creationTime, false)}
            </time>
          </div>
        </div>
      </div>
    );
}