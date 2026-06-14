import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 relative">
      <Skeleton className="h-10 w-32 mb-4 bg-neutral-200/80" />
      
      <Skeleton className="w-full h-[400px] mb-8 rounded-none bg-neutral-200/80" />
      
      <div className="space-y-4 flex flex-col w-full">
        <Skeleton className="h-10 w-3/4 bg-neutral-200/80" />
        
        <div className="flex flex-col gap-2 w-full">
          <Skeleton className="h-6 w-1/2 bg-neutral-200/60" />
          <Skeleton className="h-4 w-1/4 bg-neutral-200/40" />
        </div>
      </div>

      <Separator className="my-8" />

      <div className="space-y-6 w-full">
        <div className="space-y-2">
          <Skeleton className="h-5 w-full bg-neutral-200/60" />
          <Skeleton className="h-5 w-full bg-neutral-200/60" />
          <Skeleton className="h-5 w-11/12 bg-neutral-200/60" />
          <Skeleton className="h-5 w-4/5 bg-neutral-200/60" />
        </div>
        
        <div className="space-y-2">
          <Skeleton className="h-5 w-full bg-neutral-200/60" />
          <Skeleton className="h-5 w-full bg-neutral-200/60" />
          <Skeleton className="h-5 w-5/6 bg-neutral-200/60" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-5 w-full bg-neutral-200/60" />
          <Skeleton className="h-5 w-3/4 bg-neutral-200/60" />
        </div>
      </div>

      <Separator className="my-8" />
      
      <Skeleton className="w-full h-[180px] rounded-2xl bg-neutral-200/50" />
    </div>
  );
}