import { Skeleton } from "@/components/ui/skeleton";

export function CompactBlogCardSkeleton() {
  return (
    <div className="flex flex-col p-3 bg-zinc-50/80 rounded-xl dark:bg-muted/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-14" />
        </div>
        <Skeleton className="h-4 w-4 rounded-full shrink-0" />
      </div>

      <div className="flex items-center justify-between gap-4 mt-1 mb-2">
        <div className="flex-1 min-w-0 space-y-1.5">
          <Skeleton className="h-4 w-10/12" />
          <Skeleton className="h-3 w-4/5" />
        </div>
        <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Skeleton className="w-3.5 h-3.5 rounded-sm" />
            <Skeleton className="h-3 w-4" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="w-3.5 h-3.5 rounded-sm" />
            <Skeleton className="h-3 w-4" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="w-3.5 h-3.5 rounded-sm" />
            <Skeleton className="h-3 w-4" />
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Skeleton className="h-4 w-12 rounded-sm" />
          <Skeleton className="h-4 w-10 rounded-sm" />
        </div>
      </div>
    </div>
  );
}