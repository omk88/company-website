"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ProfileContentSkeleton() {
  return (
    <div className="flex flex-col flex-1 w-full max-w-[600px] p-2 space-y-4">
      {[...Array(3)].map((_, i) => (
        <div 
          key={i} 
          className="p-5 border rounded-xl bg-white space-y-3.5 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <Skeleton className="h-5 w-3/4 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
          </div>

          <Skeleton className="h-48 w-full rounded-lg" />

          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-4">
              <Skeleton className="h-4 w-12 rounded" />
              <Skeleton className="h-4 w-12 rounded" />
            </div>
            <Skeleton className="h-4 w-8 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}