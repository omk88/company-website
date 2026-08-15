import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarFooter, SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { IncrementBlogLikesDislikesSkeleton } from "./IncrementBlogLikesDislikesSkeleton";

export function LeftSidebarControlsSkeleton() {
  return (
    <Sidebar bgClass="bg-white" showBorder={false} className="!w-40 !top-16 !z-40">
        <SidebarHeader>
            <Skeleton className="h-8 w-full rounded-md" />
        </SidebarHeader>

        <div className="w-1/2 mx-auto">
            <Separator />
        </div>

        <SidebarContent>
            <IncrementBlogLikesDislikesSkeleton />
            <SidebarGroup />
        </SidebarContent>

        <SidebarFooter />
    </Sidebar>
  );
}