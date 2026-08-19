import { Skeleton } from "@/components/ui/skeleton";

export function CompactCommentCardSkeleton() {
  return (
    <div className="flex flex-col px-3 pt-1.5 pb-3 bg-zinc-50/80 rounded-xl dark:bg-muted/30">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-5/12 rounded-xs" />
        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
      </div>

      <div className="space-y-1.5 my-1">
        <Skeleton className="h-3.5 w-full rounded-xs" />
        <Skeleton className="h-3.5 w-11/12 rounded-xs" />
        <Skeleton className="h-3.5 w-3/4 rounded-xs" />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Skeleton className="w-3.5 h-3.5 rounded-xs" />
          <Skeleton className="h-3 w-4 rounded-xs" />
        </div>
      </div>
    </div>
  );
}