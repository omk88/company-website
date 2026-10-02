import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebarControlsSkeleton } from "@/components/web/LoadingSkeletons/LeftSidebarControlsSkeleton";
import { BlogContentSkeleton } from "@/components/web/LoadingSkeletons/BlogContentSkeleton";
import { RightSidebarArticlesSkeleton } from "@/components/web/LoadingSkeletons/RightSidebarArticlesSkeleton";

export default function BlogLoading() {
  return (
    <SidebarProvider className="bg-white dark:bg-zinc-950 w-full min-h-screen relative flex">
      <LeftSidebarControlsSkeleton />

      <main className="flex-1 min-w-0 pt-16">
        <div className="max-w-3xl mx-auto">
          <BlogContentSkeleton />
        </div>
      </main>

      <RightSidebarArticlesSkeleton />
    </SidebarProvider>
  );
}