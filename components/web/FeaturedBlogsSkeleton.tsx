import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedBlogsSkeleton() {
  return (
    <div className="flex flex-col gap-0 w-full overflow-hidden pointer-events-none select-none">
      
      <div className="w-full">
        <div className="relative aspect-video w-full bg-muted border border-border/50 rounded-none shrink-0">
          <Skeleton className="w-full h-full rounded-none" />
        </div>
      </div>
      
      <div className="py-2 px-0.5">
        
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-3 w-1/5" />
        </div>

        <div className="mt-2 flex flex-col h-[9.25rem] justify-start space-y-3">
          
          <div className="space-y-1.5 shrink-0">
            <Skeleton className="h-5 w-11/12" />
            <Skeleton className="h-5 w-2/3" />
          </div>
          
          <div className="flex-1 space-y-2 pt-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          
        </div>
      </div>

      <div className="flex flex-row justify-center items-center gap-2 mt-auto border-t pt-2 pb-2 border-border/40">
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-4 w-4 mx-1" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>

    </div>
  );
}