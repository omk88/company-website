
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function LeftSidebarArticleSeriesSkeleton() {
  return (
    <Sidebar
      className="flex flex-col !top-16 !z-40 border-r"
      bgClass="bg-background/95"
      collapsible="icon"
    >
      <SidebarContent className="!p-0 w-full">
        <SidebarGroup className="pt-3 !px-2 w-full">
          <div className="flex flex-col gap-3 w-full pb-6">
            <div className="relative p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/50 flex flex-col gap-3">
              <div className="relative w-full h-64 overflow-hidden rounded-lg">
                <Skeleton className="w-full h-full rounded-lg" />
              </div>

              <div className="flex flex-row gap-2 items-center">
                <Skeleton className="h-6 w-6 rounded-full shrink-0" />
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-4 w-12 rounded ml-auto" />
              </div>

              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-6 w-4/5 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
              </div>

              <div className="flex flex-row items-center gap-1.5 pt-1">
                <Skeleton className="h-6 w-12 rounded-full" />
                <div className="flex gap-1.5 items-center ml-auto">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="hidden" />
    </Sidebar>
  );
}