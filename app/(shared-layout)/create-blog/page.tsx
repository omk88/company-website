import { SidebarProvider } from "@/components/ui/sidebar";
import BlogPostForm from "@/components/web/BlogPostForm";
import { LeftSidebarCreateBlog } from "@/components/web/LeftSidebarCreateBlog";

export default function Blog() {

  return (
    <div>
      <SidebarProvider>
        <LeftSidebarCreateBlog />
        <div className="w-full bg-white dark:bg-zinc-900 pt-16 min-h-[calc(100vh-4rem)]">
          <BlogPostForm />
        </div>
      </SidebarProvider>
    </div>
  );
}