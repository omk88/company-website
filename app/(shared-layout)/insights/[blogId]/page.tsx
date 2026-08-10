import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import ReactMarkdown from 'react-markdown';
import { BlogCTA } from "@/components/web/BlogCTA";
import { CommentSection } from "@/components/web/CommentSection";
import { ViewTracker } from "@/components/web/ViewTracker";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebarControls } from "@/components/web/LeftSidebarControls";
import { RightSidebarArticles } from "@/components/web/RightSidebarArticles";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogEmojiReactions } from "@/components/web/BlogEmojiReactions";
import Link from "next/link";
import { ProfileHoverCard } from "@/components/web/ProfileHoverCard";

interface blogIdRouteProps {
    params: Promise<{
        blogId: Id<"blogs">;
    }>
}

export async function generateMetadata({ params }: blogIdRouteProps): Promise<Metadata> {
    const { blogId } = await params;
    const blog = await fetchQuery(api.blogs.getBlogById, { blogId: blogId });
    if (!blog) return { title: "Post not found" };
    return { title: blog.title, description: blog.subtitle }
}

export default async function blogIdRoute({ params }: blogIdRouteProps) {
    const { blogId } = await params;

    const blogPromise = fetchQuery(api.blogs.getBlogById, { blogId: blogId });
    const preloadedCommentsPromise = preloadQuery(api.comments.getCommentsByBlog, { blogId: blogId });

    const blog = await blogPromise;

    if (!blog) {   
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-4xl font-extrabold text-red-500">No post found</h1>
            </div>
        )
    }

    return (
        <SidebarProvider className="bg-white dark:bg-zinc-950 w-full min-h-screen relative block">
            <LeftSidebarControls blog={blog} />
            
            <div className="w-full pl-40 pr-75 pt-16 min-h-[calc(100vh-4rem)]">
                <Suspense fallback={<MainContentSkeleton />}>
                    <BlogContent blogPromise={blogPromise} preloadedCommentsPromise={preloadedCommentsPromise} />
                </Suspense>
            </div>

            <RightSidebarArticles author={blog.author} displayName={blog.displayName} username={blog.username} blogId={blogId}  />
        </SidebarProvider>
    )
}

async function BlogContent({ 
    blogPromise, 
    preloadedCommentsPromise 
}: { 
    blogPromise: Promise<any>; 
    preloadedCommentsPromise: Promise<any> 
}) {
    const blog = await blogPromise;
    const preloadedComments = await preloadedCommentsPromise;

    return (
        <main className="w-full max-w-4xl mx-auto py-3 px-3 animate-in fade-in duration-500">
            <ViewTracker blogId={blog._id} />

            <div className="relative w-full h-[400px] mb-3 overflow-hidden rounded-lg">
                <Image 
                    src={blog.imageUrl || "/brain.png"} 
                    alt={blog.title} 
                    fill 
                    priority 
                    className="object-cover transition duration-500"
                />
            </div>
            
            <div className="px-1 sm:px-6 md:px-2">
                <div className="flex flex-col">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between w-full">
                        <h1 className="text-4xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50">
                            {blog.title}
                        </h1>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="text-muted-foreground font-light">
                            <ProfileHoverCard authorUsername={blog.username} displayName={blog.displayName}>
                                <Link 
                                    href={`/${blog.username}`} 
                                    className="cursor-pointer hover:text-blue-600 inline-block"
                                >
                                    {blog.displayName || blog.username}
                                </Link>
                            </ProfileHoverCard>
                            <span>
                                {" • "}
                                {new Date(blog._creationTime).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                })}
                            </span>
                        </div>
                        <BlogEmojiReactions initialBlog={blog} />
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 font-medium">
                            {blog.subtitle}
                        </p>
                    </div>
                </div>

                <Separator className="my-8" />

                <div className="prose prose-neutral dark:prose-invert max-w-none text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
                    <ReactMarkdown>{blog.content}</ReactMarkdown>
                </div>

                <Separator className="my-10" />
                <BlogCTA />
                <Separator className="my-10" />

                <div id="comments" >
                    <CommentSection preloadedComments={preloadedComments} />
                </div>
            </div>
        </main>
    );
}

function MainContentSkeleton() {
    return (
        <main className="w-full max-w-4xl mx-auto py-3 px-3">
            <div className="w-full h-[400px] mb-3 overflow-hidden rounded-lg">
                <Skeleton className="w-full h-full bg-neutral-200/80" />
            </div>
            <div className="px-1 sm:px-6 md:px-2 space-y-4">
                <Skeleton className="h-10 w-3/4 bg-neutral-200/80 mt-2" />
                <div className="flex flex-col gap-3 w-full">
                    <Skeleton className="h-5 w-1/3 bg-neutral-200/60" />
                    <Skeleton className="h-6 w-1/2 bg-neutral-200/50" />
                </div>
                <Separator className="my-8" />
                <div className="space-y-2">
                    <Skeleton className="h-5 w-full bg-neutral-200/60" />
                    <Skeleton className="h-5 w-full bg-neutral-200/60" />
                    <Skeleton className="h-5 w-5/6 bg-neutral-200/60" />
                </div>
            </div>
        </main>
    );
}