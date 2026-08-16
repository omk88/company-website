import { Skeleton } from "@/components/ui/skeleton";

export function BlogCardSkeleton() {
  return (
    <div className="group flex flex-col md:flex-row h-auto md:h-[190px] border border-border/50 rounded-none dark:bg-muted/30">
      
      <div className="relative aspect-video md:aspect-auto w-full md:w-2/5 md:h-full overflow-hidden bg-muted border-b md:border-b-0 md:border-r border-border/50 shrink-0 block">
        <Skeleton className="h-full w-full rounded-none" />
      </div>

      <div className="flex flex-col flex-1 justify-start px-4 py-2 min-w-0">
        <div className="min-w-0">
          
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-muted-foreground">
            
            <div className="flex items-center gap-1.5 py-1">
              <Skeleton className="h-3 w-24" />
              <span className="text-muted-foreground">•</span>
              <Skeleton className="h-3 w-16" />
            </div>

            <div className="flex flex-row items-center gap-8">
              <Skeleton className="h-3 w-16" />
              
              <div className="flex flex-row items-center">
                <div className="h-8 w-8 flex items-center justify-center">
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="space-y-2 mt-1">
          <div className="space-y-1.5 pt-0.5">
            <Skeleton className="h-5 w-11/12" />
            <Skeleton className="h-5 w-3/4" />
          </div>

          <div className="space-y-1 pt-1">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-4/5" />
          </div>
        </div>

        <div className="flex font-extralight items-center justify-between text-sm font-mono tracking-tight select-none w-full mt-auto pt-2">
          
          <div className="flex items-center">
            <div className="flex items-center gap-1.5 min-w-[3rem] justify-start">
              <Skeleton className="w-4 h-4 rounded-sm" />
              <Skeleton className="h-3 w-6" />
            </div>
            
            <div className="flex items-center gap-1.5 min-w-[3rem] justify-start">
              <Skeleton className="w-4 h-4 rounded-sm" /> 
              <Skeleton className="h-3 w-6" /> 
            </div>

            <div className="flex items-center gap-1.5 min-w-[3rem] justify-start">
              <Skeleton className="w-4 h-4 rounded-sm" />
              <Skeleton className="h-3 w-6" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 max-w-[55%] justify-end">
            <Skeleton className="h-4 w-12 rounded-sm" />
            <Skeleton className="h-4 w-14 rounded-sm" />
            <Skeleton className="h-4 w-10 rounded-sm" />
          </div>

        </div>
      </div>
    </div>
  );
}