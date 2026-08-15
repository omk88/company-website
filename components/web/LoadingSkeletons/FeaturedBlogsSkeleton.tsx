import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedBlogsSkeleton() {
  return (
    <div className="flex flex-col justify-between w-full bg-muted/50 rounded-2xl p-4">
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-3.5 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-6 w-14 rounded-md" />
        </div>
      </div>

      <div className="flex items-start justify-between gap-4 w-full mb-4">
        <div className="flex flex-col justify-between flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-1.5 py-0.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>

          <div className="space-y-1.5 pt-0.5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        <Skeleton className="h-20 w-20 shrink-0 rounded-xl" />
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 min-w-[3rem]">
          <Skeleton className="h-4 w-4 rounded-sm" />
          <Skeleton className="h-3 w-6" />
        </div>
        <div className="flex items-center gap-1.5 min-w-[3rem]">
          <Skeleton className="h-4 w-4 rounded-sm" />
          <Skeleton className="h-3 w-6" />
        </div>
        <div className="flex items-center gap-1.5 min-w-[3rem]">
          <Skeleton className="h-4 w-4 rounded-sm" />
          <Skeleton className="h-3 w-6" />
        </div>
      </div>

    </div>
  );
}