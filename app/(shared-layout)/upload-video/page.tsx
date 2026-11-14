import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebarUploadVideo } from "./_components/LeftSidebarUploadVideo";
import VideoUpload from "./_components/VideoUpload";

export default function UploadVideoPage() {
  return (
    <SidebarProvider>
      <div className="flex flex-col md:flex-row w-full min-h-screen bg-white dark:bg-zinc-900">
        <div className="hidden md:block shrink-0">
          <LeftSidebarUploadVideo />
        </div>

        <div className="w-full flex-1 pt-10 md:pt-16">
          <VideoUpload />
        </div>

      </div>
    </SidebarProvider>
  );
}