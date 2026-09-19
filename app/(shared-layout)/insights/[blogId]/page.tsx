import { cache } from "react";
import { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebarControls } from "@/components/web/LeftSidebarControls";
import { RightSidebarArticles } from "@/components/web/RightSidebarArticles";
import { BlogContent } from "@/components/web/Blogs/BlogContent";
import { preloadAuthQuery } from "@/lib/auth-server";
import { BlogStoreHydrator } from "@/components/web/BlogStoreHydrator";
import { MobileControls } from "./_components/MobileControls";

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
      title: "Post Not Found",
      robots: { index: false, follow: false },
    };
  }

  const { blog } = blogData;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.taqtiq.tech";
  const postUrl = `${baseUrl}/insights/${blog._id}`;

  const imageUrl = blog.imageUrl?.startsWith("http")
    ? blog.imageUrl
    : `${baseUrl}${blog.imageUrl || "/noImage.png"}`;

  return {
    title: blog.title,
    description: blog.subtitle,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: blog.title,
      description: blog.subtitle,
      url: postUrl,
      type: "article",
      publishedTime: new Date(blog._creationTime).toISOString(),
      authors: [blog.displayName || blog.username],
      images: [
        {
          url: imageUrl,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.subtitle,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.taqtiq.tech";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.subtitle,
    image: blog.imageUrl ? [blog.imageUrl] : [],
    datePublished: new Date(blog._creationTime).toISOString(),
    author: {
      "@type": "Person",
      name: blog.displayName || blog.username,
      image: blog.authorAvatarUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${blog._id}`,
    },
  };

  return (
    <SidebarProvider className="bg-white dark:bg-zinc-950 w-full min-h-screen relative flex">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogStoreHydrator blog={blog} />

      <div className="hidden md:flex">
        <LeftSidebarControls blog={blog} interactionState={interactionState} />
      </div>

      <main className="flex-1 min-w-0 md:px-0 px-1 pt-8 md:pt-14 pb-16">
        <div className="max-w-3xl mx-auto">
          <BlogContent blog={blog} preloadedComments={preloadedComments} />
        </div>
      </main>

      <div className="hidden md:flex">
        <RightSidebarArticles
          username={blog.username}
          displayName={blog.displayName}
          blogs={authorPosts}
        />
      </div>

      <MobileControls blog={blog} interactionState={interactionState} />
    </SidebarProvider>
  );
}