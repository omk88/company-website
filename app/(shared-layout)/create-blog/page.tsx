import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import BlogPostForm from "@/components/web/BlogPostForm";
import { LeftSidebarCreateBlog } from "@/components/web/LeftSidebarCreateBlog";
import { MobileCreateBlogBar } from "@/components/web/MobileCreateBlogBar";
import { cn } from "cn";
import { Loader2 } from "lucide-react";

export default function CreateBlog() {
  return (
    <SidebarProvider>
      <div className="flex flex-col md:flex-row w-full min-h-screen bg-white dark:bg-zinc-900">
        <div className="hidden md:block shrink-0">
          <LeftSidebarCreateBlog />
        </div>

        <div className="block md:hidden w-full shrink-0 pt-10">
          <MobileCreateBlogBar />
        </div>

        <div className="w-full flex-1 pt-10 md:pt-16">
          <BlogPostForm />
        </div>

        <div className="md:hidden flex justify-end fixed bottom-4 right-4 z-50 border-t bg-white w-full">
          <Button
            form="blog-post-form"
            type="submit"
            size="lg"
            className={cn(
              "rounded-full text-sm bg-zinc-800 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900",
            )}
          >
            Publish
          </Button>
        </div>
      </div>
    </SidebarProvider>
  );
}