import { Skeleton } from "@/components/ui/skeleton";
import { SidebarGroupLabel } from "@/components/ui/sidebar";
import { TrendingUp } from "lucide-react";

interface TrendingBlogsSkeletonProps {
  count?: number;
}

export function TrendingBlogsSkeleton({ count = 3 }: TrendingBlogsSkeletonProps) {
  return (
    <div className="w-full flex flex-col">
      <SidebarGroupLabel className="w-full justify-center mb-1">
        <h1 className="flex items-center justify-center gap-2 text-sm font-medium text-foreground">
          <TrendingUp className="w-4 h-4 stroke-[2.3] shrink-0" />
          <span>Trending</span>
        </h1>
      </SidebarGroupLabel>

      <ul className="list-none w-full m-0 p-0 space-y-2">
        {Array.from({ length: count }).map((_, index) => (
          <li key={index} className="w-full block">
            <div className="w-full flex flex-row items-center justify-between gap-3 p-2 px-3 rounded-xl bg-muted/50 dark:bg-muted/30">
              
              <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
                <Skeleton className="h-3.5 w-10/12 rounded-sm" />

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 min-w-[3rem]">
                    <Skeleton className="w-4 h-4 rounded-sm" />
                    <Skeleton className="h-3 w-5" />
                  </div>
                  <div className="flex items-center gap-1.5 min-w-[3rem]">
                    <Skeleton className="w-4 h-4 rounded-sm" />
                    <Skeleton className="h-3 w-5" />
                  </div>
                  <div className="flex items-center gap-1.5 min-w-[3rem]">
                    <Skeleton className="w-4 h-4 rounded-sm" />
                    <Skeleton className="h-3 w-5" />
                  </div>
                </div>
              </div>

              <Skeleton className="w-12 h-12 shrink-0 rounded-lg" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}