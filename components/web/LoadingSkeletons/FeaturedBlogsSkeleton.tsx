import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedBlogsSkeleton() {
  return (
    <div className="flex flex-col justify-between w-full bg-zinc-50/80 dark:bg-zinc-900/50 rounded-xl p-3.5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
          <Sparkles className="w-3.5 h-3.5 shrink-0 opacity-40" />
          <span className="opacity-40">Featured</span>
        </div>
        <div className="flex items-center gap-0.5 text-zinc-500">
          <Button variant="ghost" size="icon" className="h-5 w-5 pointer-events-none opacity-30" disabled>
            <Skeleton className="h-3 w-3 rounded-xs" />
          </Button>
          <Skeleton className="h-3 w-7 mx-1" />
          <Button variant="ghost" size="icon" className="h-5 w-5 pointer-events-none opacity-30" disabled>
            <Skeleton className="h-3 w-3 rounded-xs" />
          </Button>
        </div>
      </div>

      <div className="flex items-start justify-between gap-3 w-full my-1">
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] mb-1 py-[1.5px]">
              <Skeleton className="h-2.5 w-16" />
              <span className="text-zinc-400 dark:text-zinc-600">•</span>
              <Skeleton className="h-2.5 w-12" />
            </div>

            <div className="space-y-1.5 pt-0.5">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-3/4" />
            </div>
          </div>
        </div>

        <Skeleton className="h-14 w-14 shrink-0 rounded-lg" />
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
  );
}