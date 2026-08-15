import { Skeleton } from "@/components/ui/skeleton";
import { SidebarGroupLabel } from "@/components/ui/sidebar";
import { Library } from "lucide-react";

interface MoreFromSkeletonProps {
  count?: number;
  displayName?: string;
  username?: string;
}

export function MoreFromSkeleton({ count = 3, displayName, username }: MoreFromSkeletonProps) {
  const authorName = displayName || username;

  return (
    <div className="w-full flex flex-col">
      <SidebarGroupLabel className="w-full justify-center">
        <h1 className="flex justify-center items-center gap-2 p-4 text-sm font-medium text-foreground whitespace-nowrap">
          <Library className="size-4 stroke-[2.3] shrink-0 mt-0.5" />
          <span>More from</span>
          {authorName ? (
            <span>{authorName}</span>
          ) : (
            <Skeleton className="h-4 w-20 rounded-md" />
          )}
        </h1>
      </SidebarGroupLabel>

      <ul className="list-none w-full m-0 p-0 space-y-3">
        {Array.from({ length: count }).map((_, index) => (
          <li key={index} className="w-full block">
            <div className="w-full flex flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-muted">
              
              <div className="w-full flex flex-col gap-2 min-w-0">
                <Skeleton className="h-3.5 w-10/12 rounded-sm" />

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 min-w-[3rem]">
                    <Skeleton className="w-4 h-4 rounded-sm" />
                    <Skeleton className="h-3 w-5" />
                  </div>
                  <div className="flex items-center gap-1.5 min-w-[3rem]">
                    <Skeleton className="w-4 h-4 rounded-sm" />
                    <Skeleton className="h-3 w-5" />
                  </div>
                  <div className="flex items-center gap-1.5 min-w-[3rem]">
                    <Skeleton className="w-4 h-4 rounded-sm" />
                    <Skeleton className="h-3 w-5" />
                  </div>
                </div>
              </div>

              <Skeleton className="w-12 h-12 shrink-0 rounded-xl" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}