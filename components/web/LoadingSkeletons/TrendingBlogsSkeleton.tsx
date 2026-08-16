import { TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface TrendingBlogsSkeletonProps {
  count?: number;
}

export function TrendingBlogsSkeleton({ count = 3 }: TrendingBlogsSkeletonProps) {
  return (
    <div className="w-full flex flex-col pt-2">
      <div className="flex items-center gap-1.5 px-3.5 mb-2.5 text-zinc-800 dark:text-zinc-200 font-semibold text-xs tracking-tight">
        <TrendingUp className="w-3.5 h-3.5 shrink-0 opacity-40" />
        <span className="opacity-40">Trending</span>
      </div>

      <ul className="list-none w-full m-0 p-0 space-y-2">
        {Array.from({ length: count }).map((_, index) => (
          <li key={index} className="w-full block">
            <div className="block w-full p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/50">
              <div className="w-full flex flex-row items-center justify-between gap-3">
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-full" />
                    <Skeleton className="h-3.5 w-2/3" />
                  </div>

                  <div className="flex items-center gap-3 text-[11px] pt-1">
                    <div className="flex items-center gap-1">
                      <Skeleton className="w-3 h-3 rounded-full shrink-0" />
                      <Skeleton className="h-2.5 w-6" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Skeleton className="w-3 h-3 rounded-full shrink-0" />
                      <Skeleton className="h-2.5 w-6" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Skeleton className="w-3 h-3 rounded-full shrink-0" />
                      <Skeleton className="h-2.5 w-6" />
                    </div>
                  </div>
                </div>

                <Skeleton className="w-11 h-11 shrink-0 rounded-lg" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}