import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebarControls } from "@/components/web/LeftSidebarControls";
import { RightSidebarArticles } from "@/components/web/RightSidebarArticles";
import { BlogContent } from "@/components/web/Blogs/BlogContent";

interface BlogPageProps {
    params: Promise<{ blogId: Id<"blogs"> }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
    const { blogId } = await params;
    const blog = await fetchQuery(api.blogs.getBlogById, { blogId });

    if (!blog) return { title: "Post not found" };
    return { title: blog.title, description: blog.subtitle };
}

export default async function BlogPage({ params }: BlogPageProps) {
    const { blogId } = await params;

    const blog = await fetchQuery(api.blogs.getBlogById, { blogId });

    const preloadedComments = await preloadQuery(api.comments.getCommentsByBlog, { blogId });

    if (!blog) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <h1 className="text-3xl font-bold text-red-500">Post not found</h1>
            </div>
        );
    }

    return (
        <SidebarProvider className="bg-white dark:bg-zinc-950 w-full min-h-screen relative block">
            <LeftSidebarControls blog={blog} />

            <div className="w-full pl-40 pr-75 pt-16 min-h-[calc(100vh-4rem)]">
                <BlogContent blog={blog} preloadedComments={preloadedComments} />
            </div>

            <RightSidebarArticles author={blog.author} username={blog.username} displayName={blog.displayName} />
        </SidebarProvider>
    )
}