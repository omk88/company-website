import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebarProfileSkeleton } from "@/components/web/LoadingSkeletons/LeftSidebarProfileSkeleton";
import { ProfileContentSkeleton } from "@/components/web/LoadingSkeletons/ProfileContentSkeleton";
import { RightSidebarProfileSkeleton } from "@/components/web/LoadingSkeletons/RightSidebarProfileSkeleton";

export default function ProfileLoading() {
  return (
    <SidebarProvider>
      <LeftSidebarProfileSkeleton />

      <div className="flex w-full min-h-screen">
        <main className="flex-1 bg-white pt-16 flex justify-center">
          <div className="w-full max-w-2xl px-6 mx-auto">
            <ProfileContentSkeleton />
          </div>
        </main>

        <RightSidebarProfileSkeleton />
      </div>
    </SidebarProvider>
  );
}