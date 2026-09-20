import { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RightSidebar } from "@/components/web/RightSidebar";
import { PageBlogPosts } from "@/components/web/PageBlogPosts";
import { LeftSidebar } from "@/components/web/LeftSidebar";
import { Suspense } from "react";
import { BlogCardSkeleton } from "@/components/web/LoadingSkeletons/BlogCardSkeleton";
import CreatePostButton from "@/components/web/CreatePostButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Insights",
};

export default function InsightsPage() {
  return (
    <SidebarProvider className="flex-col md:flex-row">
      <aside 
        className="hidden md:block shrink-0"
        style={{ "--sidebar-width": "12.8rem" } as React.CSSProperties}
      >
        <LeftSidebar />
      </aside>

      <div className="w-full min-w-0 flex flex-col flex-1 min-h-[calc(100vh-4rem)] pt-16 pb-16 md:pb-0">
        <div className="block md:hidden">
          <LeftSidebar />
        </div>

        <section 
          id="blog-grid-section" 
          className="w-full flex-1 flex flex-col h-full min-h-0 bg-white dark:bg-zinc-950 pt-16 md:pt-0"
        >
          <div className="flex flex-col flex-1 h-full min-h-0">
            <Suspense fallback={
              <ul className="flex flex-col gap-2 p-2">
                {[1, 2, 3].map((i) => (
                  <li key={i}><BlogCardSkeleton /></li>
                ))}
              </ul>
            }>
              <PageBlogPosts />
            </Suspense>
          </div>
        </section>
      </div>

      <aside 
        className="hidden md:block shrink-0"
        style={{ "--sidebar-width": "18rem" } as React.CSSProperties}
      >
        <RightSidebar />
      </aside>

      <div className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-center justify-center h-16 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4">
        <div className="w-fit flex">
          <CreatePostButton />
        </div>
      </div>
    </SidebarProvider>
  );
}