import { formatSmartDate } from "@/components/web/ProfileHoverCard";
import { Doc } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Series = Doc<"series">;

interface ProfileArticleSeriesProps {
  series: Series;
  index: number;
  articleCount?: number;
}

export default function SeriesCard({ series, index, articleCount = 0 }: ProfileArticleSeriesProps) {
  const pathname = usePathname();
  
  const imageUrl = useQuery(
    api.series.getImageUrl, 
    series.coverImage ? { storageId: series.coverImage } : "skip"
  ) ?? "/noImage.png";

  return (
    <Link
      href={`${pathname}/series/${series.slug}`}
      className="group flex flex-col sm:flex-row items-center gap-3 p-3 bg-zinc-50/80 hover:bg-zinc-100/90 rounded-xl dark:bg-muted/30"
    >
      
      {imageUrl && (
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 overflow-hidden rounded-xl">
          <Image
            src={imageUrl}
            alt={series.title || "Series cover"}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 80px, 96px"
          />
        </div>
      )}

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
            variant="default" 
            size="sm" 
            className="shrink-0 h-7 text-xs rounded-lg gap-1.5 px-3 shadow-none cursor-pointer self-center"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Play className="w-3 h-3 fill-current" />
            Start Reading
          </Button>
        </div>

      </div>
    </Link>
  );
}