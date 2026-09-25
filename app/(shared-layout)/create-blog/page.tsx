import { SidebarProvider } from "@/components/ui/sidebar";
import BlogPostForm from "@/components/web/BlogPostForm";
import { LeftSidebarCreateBlog } from "@/components/web/LeftSidebarCreateBlog";
import { MobileCreateBlogBar } from "@/components/web/MobileCreateBlogBar";
import { MobilePublishBlogButton } from "@/components/web/MobilePublishBlogButton";
import { getServerAuth } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function CreateBlog() {

  const user = await getServerAuth();

  if (!user.isAuth) { 
    redirect("/sign-in");
  }
  
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

        <MobilePublishBlogButton />

      </div>
    </SidebarProvider>
  );
}