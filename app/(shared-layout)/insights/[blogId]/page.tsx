import { cache } from "react";
import { Metadata } from "next";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebarControls } from "@/components/web/LeftSidebarControls";
import { RightSidebarArticles } from "@/components/web/RightSidebarArticles";
import { BlogContent } from "@/components/web/Blogs/BlogContent";
import { fetchAuthQuery, preloadAuthQuery } from "@/lib/auth-server";

interface BlogPageProps {
  params: Promise<{ blogId: Id<"blogs"> }>;
}

const getBlogData = cache(async (blogId: Id<"blogs">) => {
  return await fetchAuthQuery(api.blogs.getBlogWithAuthorPosts, { blogId });
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
    preloadAuthQuery(api.comments.getCommentsByBlog, { blogId }),
  ]);

  if (!blogData?.blog) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <h1 className="text-3xl font-bold text-red-500">Post not found</h1>
      </div>
    );
  }

  const { blog, authorPosts, interactionState } = blogData;

  return (
    <SidebarProvider className="bg-white dark:bg-zinc-950 w-full min-h-screen relative flex">
      <LeftSidebarControls blog={blog} interactionState={interactionState} />

      <main className="flex-1 min-w-0 pt-16">
        <div className="max-w-3xl mx-auto">
          <BlogContent blog={blog} preloadedComments={preloadedComments} />
        </div>
      </main>

      <RightSidebarArticles
        username={blog.username}
        displayName={blog.displayName}
        blogs={authorPosts}
      />
    </SidebarProvider>
  );
}