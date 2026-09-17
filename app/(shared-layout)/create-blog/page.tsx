import { SidebarProvider } from "@/components/ui/sidebar";
import BlogPostForm from "@/components/web/BlogPostForm";
import { LeftSidebarCreateBlog } from "@/components/web/LeftSidebarCreateBlog";

export default function CreateBlog() {
  return (
    <div>
      <SidebarProvider>
        <div className="hidden md:flex">
          <LeftSidebarCreateBlog />
        </div>
        <div className="w-full min-h-screen bg-white dark:bg-zinc-900 pt-10 md:pt-16">
          <BlogPostForm />
        </div>
      </SidebarProvider>
    </div>
  );
}