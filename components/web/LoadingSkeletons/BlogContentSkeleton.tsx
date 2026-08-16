"use client";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function BlogContentSkeleton() {
  return (
    <div className="p-2">
      <div className="relative w-full h-[400px] mb-6 rounded-lg overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>

      <div className="flex flex-col space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-3/4 rounded-md" />
          <Skeleton className="h-10 w-1/2 rounded-md" />
        </div>

        <div className="flex items-center justify-between my-4">
          <div className="flex items-center gap-2">
            <Skeleton className="w-5 h-5 rounded-full shrink-0" />
            <Skeleton className="h-4 w-28 rounded" />
            <span className="text-zinc-400">&middot;</span>
            <Skeleton className="h-4 w-24 rounded" />
          </div>

          <Skeleton className="h-4 w-16 rounded" />
        </div>

        <div className="flex items-center gap-1.5 mb-4">
          <Skeleton className="h-7 w-12 rounded-full" />
          <Skeleton className="h-7 w-14 rounded-full" />
          <Skeleton className="h-7 w-10 rounded-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-6 w-full rounded" />
          <Skeleton className="h-6 w-4/5 rounded" />
        </div>
      </div>

      <Separator className="my-8" />

      <div className="space-y-4 max-w-none">
        <Skeleton className="h-5 w-full rounded" />
        <Skeleton className="h-5 w-[98%] rounded" />
        <Skeleton className="h-5 w-[95%] rounded" />
        <Skeleton className="h-5 w-[90%] rounded" />
        <Skeleton className="h-5 w-[96%] rounded" />
        
        <div className="py-2" />

        <Skeleton className="h-5 w-full rounded" />
        <Skeleton className="h-5 w-[97%] rounded" />
        <Skeleton className="h-5 w-[93%] rounded" />
        <Skeleton className="h-5 w-[85%] rounded" />
      </div>

      <div className="my-12 p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 w-full max-w-md">
          <Skeleton className="h-6 w-36 rounded" />
          <Skeleton className="h-4 w-full rounded" />
        </div>
        <div className="w-full sm:w-auto shrink-0">
          <Skeleton className="h-10 w-64 rounded-xl" />
        </div>
      </div>

      <Separator className="my-10" />

      <div className="space-y-8 my-8">
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5 rounded" />
          <Skeleton className="h-7 w-36 rounded" />
        </div>

        <div className="space-y-3">
          <Skeleton className="min-h-[100px] w-full rounded-xl" />
          <div className="flex justify-end">
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 pt-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-start gap-3 py-4">
              <Skeleton className="w-8 h-8 rounded-full shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-28 rounded" />
                  <span className="text-xs text-zinc-400">&middot;</span>
                  <Skeleton className="h-3 w-16 rounded" />
                </div>
                <Skeleton className="h-4 w-11/12 rounded" />
                <Skeleton className="h-4 w-3/4 rounded" />
                <div className="pt-1 flex items-center gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}