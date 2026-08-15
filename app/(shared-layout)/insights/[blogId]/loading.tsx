import { Skeleton } from "@/components/ui/skeleton";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import { LeftSidebarControlsSkeleton } from "@/components/web/LoadingSkeletons/LeftSidebarControlsSkeleton";
import { BlogContentSkeleton } from "@/components/web/LoadingSkeletons/BlogContentSkeleton";
import { RightSidebarArticlesSkeleton } from "@/components/web/LoadingSkeletons/RightSidebarArticlesSkeleton";

export default function BlogLoading() {
  return (
    <SidebarProvider className="bg-white dark:bg-zinc-950 w-full min-h-screen relative block">
      
      <LeftSidebarControlsSkeleton />

      <div className="w-full pl-40 pr-75 pt-16 min-h-[calc(100vh-4rem)]">
        <BlogContentSkeleton />
      </div>

      <RightSidebarArticlesSkeleton />

    </SidebarProvider>
  );
}