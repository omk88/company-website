"use client";

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function RightSidebarArticlesSkeleton() {
  return (
    <aside 
      className="shrink-0"
      style={{ "--sidebar-width": "18rem" } as React.CSSProperties}
    >
      <Sidebar bgClass="bg-white dark:bg-zinc-950" side="right" className="!top-16 !z-40">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="w-full flex flex-col pt-2">
                <div className="flex items-center gap-1.5 px-3.5 mb-2.5">
                  <Skeleton className="w-3.5 h-3.5 rounded-sm shrink-0" />
                  <Skeleton className="h-3 w-28 rounded" />
                </div>

                <div className="w-full space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-full p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/50"
                    >
                      <div className="w-full flex flex-row items-center justify-between gap-3">
                        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                          <Skeleton className="h-4 w-3/4 rounded" />
                          
                          <div className="flex items-center gap-3 pt-1">
                            <div className="flex items-center gap-1">
                              <Skeleton className="w-3 h-3 rounded-full shrink-0" />
                              <Skeleton className="h-2.5 w-6 rounded" />
                            </div>
                            <div className="flex items-center gap-1">
                              <Skeleton className="w-3 h-3 rounded-full shrink-0" />
                              <Skeleton className="h-2.5 w-6 rounded" />
                            </div>
                            <div className="flex items-center gap-1">
                              <Skeleton className="w-3 h-3 rounded-full shrink-0" />
                              <Skeleton className="h-2.5 w-6 rounded" />
                            </div>
                          </div>
                        </div>

                        <Skeleton className="w-11 h-11 shrink-0 rounded-lg" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </aside>
  );
}