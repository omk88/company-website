import { SidebarProvider } from "@/components/ui/sidebar";
import { CompactBlogCardSkeleton } from "@/components/web/LoadingSkeletons/CompactBlogCardSkeleton";
import { LeftSidebarProfileSkeleton } from "@/components/web/LoadingSkeletons/LeftSidebarProfileSkeleton";
import { RightSidebarProfileSkeleton } from "@/components/web/LoadingSkeletons/RightSidebarProfileSkeleton";

export default function ProfileLoading() {
  return (
    <SidebarProvider>
      <LeftSidebarProfileSkeleton count={1} />

      <div className="flex-1 flex flex-row min-w-0 w-full min-h-screen pt-16">
        <section className="flex-1 min-w-0 flex flex-col h-full p-2">

        </section>

      </div>
    </SidebarProvider>
  );
}