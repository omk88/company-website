import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function BlogContentSkeleton() {
  return (
    <main className="w-full max-w-4xl mx-auto py-3 px-3">
      <Skeleton className="w-full h-[400px] mb-3 rounded-lg bg-neutral-200/80 dark:bg-zinc-800" />
      
      <div className="px-1 sm:px-6 space-y-4">
        <Skeleton className="h-10 w-3/4 bg-neutral-200/80 dark:bg-zinc-800 mt-2" />
        <Skeleton className="h-5 w-1/3 bg-neutral-200/60 dark:bg-zinc-800/80" />
        <Separator className="my-8" />
        
        <div className="space-y-3">
          <Skeleton className="h-5 w-full bg-neutral-200/60 dark:bg-zinc-800/80" />
          <Skeleton className="h-5 w-full bg-neutral-200/60 dark:bg-zinc-800/80" />
          <Skeleton className="h-5 w-5/6 bg-neutral-200/60 dark:bg-zinc-800/80" />
        </div>
      </div>
    </main>
  );
}