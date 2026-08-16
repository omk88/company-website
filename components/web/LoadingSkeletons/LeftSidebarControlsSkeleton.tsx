"use client";

import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function LeftSidebarControlsSkeleton() {
  return (
    <aside 
      className="shrink-0"
      style={{ "--sidebar-width": "3.5rem" } as React.CSSProperties}
    >
      <Sidebar bgClass="bg-white dark:bg-zinc-950" showBorder={false} className="!top-16 !z-40">
        <SidebarHeader className="flex items-center justify-center p-2">
          <Skeleton className="h-11 w-11 rounded-full" />
        </SidebarHeader>

        <div className="w-8 h-[1px] bg-zinc-200 dark:bg-zinc-800 mx-auto my-1" />

        <SidebarContent className="p-0">
          <div className="flex flex-col items-center gap-2 py-2">
            <Skeleton className="h-11 w-11 rounded-full" />

            <Skeleton className="h-11 w-11 rounded-full" />

            <Skeleton className="h-11 w-11 rounded-full" />

            <Skeleton className="h-11 w-11 rounded-full" />

            <Skeleton className="h-11 w-11 rounded-full" />
          </div>
        </SidebarContent>

        <SidebarFooter />
      </Sidebar>
    </aside>
  );
}