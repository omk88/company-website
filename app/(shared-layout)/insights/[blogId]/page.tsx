import { cache } from "react";
import { Metadata } from "next";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebarControls } from "@/components/web/LeftSidebarControls";
import { RightSidebarArticles } from "@/components/web/RightSidebarArticles";
import { BlogContent } from "@/components/web/Blogs/BlogContent";

interface BlogPageProps {
  params: Promise<{ blogId: Id<"blogs"> }>;
}

const getBlogData = cache(async (blogId: Id<"blogs">) => {
  return await fetchQuery(api.blogs.getBlogWithAuthorPosts, { blogId });
});

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { blogId } = await params;
  const blogData = await getBlogData(blogId);

  if (!blogData?.blog) {
    return {
      title: "Post not found",
    };
  }

  const { blog } = blogData;

  return {
    title: blog.title,
    description: blog.subtitle,
    openGraph: {
      title: blog.title,
      description: blog.subtitle,
      images: blog.imageUrl ? [blog.imageUrl] : [],
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { blogId } = await params;

  const [blogData, preloadedComments] = await Promise.all([
    getBlogData(blogId),
    preloadQuery(api.comments.getCommentsByBlog, { blogId }),
  ]);

  if (!blogData?.blog) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <h1 className="text-3xl font-bold text-red-500">Post not found</h1>
      </div>
    );
  }

  const { blog, authorPosts } = blogData;

  return (
    <SidebarProvider className="bg-white dark:bg-zinc-950 w-full min-h-screen relative block">
      <LeftSidebarControls blog={blog} />

      <div className="w-full pl-40 pr-75 pt-16 min-h-[calc(100vh-4rem)]">
        <BlogContent blog={blog} preloadedComments={preloadedComments} />
      </div>

      <RightSidebarArticles
        username={blog.username}
        displayName={blog.displayName}
        blogs={authorPosts}
      />
    </SidebarProvider>
  );
}