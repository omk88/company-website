"use client";

import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function RightSidebarProfileSkeleton() {
  return (
    <aside 
      style={{ "--sidebar-width": "24rem" } as React.CSSProperties} 
      className="w-96 shrink-0"
    >
      <Sidebar
        side="right" 
        bgClass="bg-white" 
        className="flex flex-col !top-16 !z-40 overflow-hidden !p-0 bg-white"
        style={{ height: "calc(100vh - 4rem)" }}
      >
        <SidebarContent className="!p-0 bg-white">
          <div className="relative m-3 p-3 rounded-xl bg-zinc-50/80 space-y-4">
            
            <div className="p-2 pb-0">
              <div className="flex flex-row items-center gap-4 w-full">
                <Skeleton className="h-16 w-16 rounded-full shrink-0" />

                <div className="w-full pr-14 space-y-2">
                  <Skeleton className="h-5 w-32 rounded" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-20 rounded" />
                    <Skeleton className="h-5 w-12 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2 pt-2 space-y-4 w-full">
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-full rounded" />
                <Skeleton className="h-3.5 w-4/5 rounded" />
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-3.5 w-28 rounded" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-3.5 w-24 rounded" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-3.5 w-36 rounded" />
                </div>
              </div>

              <Skeleton className="h-9 w-full rounded-lg" />
            </div>

          </div>
        </SidebarContent>
      </Sidebar>
    </aside>
  );
}