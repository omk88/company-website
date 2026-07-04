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

interface postIdRouteProps {
    params: Promise<{
        postId: Id<"blogs">;
    }>
}

export async function generateMetadata({ params }: postIdRouteProps): Promise<Metadata> {
    const { postId } = await params;
    const post = await fetchQuery(api.blogs.getPostById, { postId: postId });
    if (!post) return { title: "Post not found" };
    return { title: post.title, description: post.subtitle }
}

export default async function postIdRoute({ params }: postIdRouteProps) {
    const { postId } = await params;

    const postPromise = fetchQuery(api.blogs.getPostById, { postId: postId });
    const preloadedCommentsPromise = preloadQuery(api.comments.getCommentsByPost, { postId: postId });

    const post = await postPromise;

    if (!post) {   
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-4xl font-extrabold text-red-500">No post found</h1>
            </div>
        )
    }

    return (
        <SidebarProvider className="bg-white grid grid-cols-[10rem_1fr_18.75rem] w-full min-h-screen items-start">
            <LeftSidebarControls postId={postId} storageId={post.storageId} />
            
            <Suspense fallback={<MainContentSkeleton />}>
                <PostContent postPromise={postPromise} preloadedCommentsPromise={preloadedCommentsPromise} />
            </Suspense>

            <RightSidebarArticles authorName={post.author}  />
        </SidebarProvider>
    )
}

async function PostContent({ 
    postPromise, 
    preloadedCommentsPromise 
}: { 
    postPromise: Promise<any>; 
    preloadedCommentsPromise: Promise<any> 
}) {
    const post = await postPromise;
    const preloadedComments = await preloadedCommentsPromise;

    return (
        <main className="w-full max-w-4xl mx-auto py-3 px-3 animate-in fade-in duration-500">
            <ViewTracker postId={post._id} />

            <div className="relative w-full h-[400px] mb-3 overflow-hidden rounded-lg">
                <Image 
                    src={post.imageUrl || "/brain.png"} 
                    alt={post.title} 
                    fill 
                    priority 
                    className="object-cover transition duration-500"
                />
            </div>
            
            <div className="px-1 sm:px-6 md:px-2">
                <div className="flex flex-col">
                    <h1 className="text-4xl font-bold tracking-tight text-neutral-950">{post.title}</h1>
                    <div className="flex flex-col gap-6">
                        <p className="text-lg text-muted-foreground">
                            Posted by {post.author} on {new Date(post._creationTime).toLocaleDateString("en-US")}
                        </p>
                        <p className="text-lg text-neutral-600 font-medium">{post.subtitle}</p>
                    </div>
                </div>

                <Separator className="my-8" />

                <div className="prose prose-neutral max-w-none text-lg leading-relaxed text-neutral-800">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
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