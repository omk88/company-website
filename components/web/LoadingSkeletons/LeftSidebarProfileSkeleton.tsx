"use client";

import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function LeftSidebarProfileSkeleton() {
  return (
    <aside 
      className="shrink-0"
      style={{ "--sidebar-width": "12.8rem" } as React.CSSProperties}
    >
      <Sidebar 
        className="flex flex-col !top-16 !z-40 bg-white border-r"
        bgClass="bg-white" 
        collapsible="icon"
      >
        <SidebarContent className="!p-0 w-full bg-white">
          <SidebarGroup className="pt-3 !px-2 w-full">
            
            <SidebarMenu className="w-full flex flex-col gap-0.5">
              {[...Array(4)].map((_, i) => (
                <SidebarMenuItem key={i} className="w-full">
                  <div className="flex items-center gap-2.5 px-2.5 py-2 w-full rounded-lg">
                    <Skeleton className="h-4 w-4 shrink-0 rounded" />
                    <Skeleton className="h-4 w-24 rounded" />
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            <div className="flex flex-col py-2 gap-2.5 items-start w-full">
              <div className="w-full px-1 py-1">
                <Separator />
              </div>

              <div className="w-full">
                <Skeleton className="w-full h-9 rounded-lg" />
              </div>
            </div>

          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </aside>
  );
}