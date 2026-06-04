import { buttonVariants } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import ReactMarkdown from 'react-markdown';
import { EditBlogButton } from "@/components/web/EditBlogButton";
import { BlogCTA } from "@/components/web/BlogCTA";
import { CommentSection } from "@/components/web/CommentSection";

interface postIdRouteProps {
    params: Promise<{
        postId: Id<"blogs">;
    }>
}

export async function generateMetadata({ params }: postIdRouteProps): Promise<Metadata> {
    const { postId } = await params;

    const post = await fetchQuery(api.blogs.getPostById, { postId: postId });

    if (!post) {
        return {
            title: "Post not found"
        };
    }

    return {
        title: post.title,
        description: post.subtitle
    }
}

export default async function postIdRoute({ params }: postIdRouteProps) {
    const { postId } = await params;


    const [post, preloadedComments] = await Promise.all([
        fetchQuery(api.blogs.getPostById, { postId: postId }),
        preloadQuery(api.comments.getCommentsByPost, { postId: postId }),
    ]);

    if (!post) {   
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-4xl font-extrabold text-red-500">No post found</h1>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
            <Link className={buttonVariants({variant: "outline", className: "mb-4"})} href="/insights">
                <ArrowLeft className="size-4" />
                Back to blog
            </Link>
            
            <EditBlogButton blogId={postId} />

            <div className="relative w-full h-[400px] mb-8 overflow-hidden">
                <Image 
                    src={post.imageUrl || "/brain.png"} 
                    alt={post.title} 
                    fill 
                    priority 
                    className="object-cover hover:scale-105 transition duration-500"
                />
            </div>
            
            <div className="space-y-4 flex flex-col">
                <h1 className="text-4xl font-bold tracking-tight text-neutral-950">{post.title}</h1>
                <div className="flex flex-col gap-1">
                    <p className="text-lg text-neutral-600 font-medium">{post.subtitle}</p>
                    <p className="text-xs text-neutral-400">
                        Posted by {post.author} on {new Date(post._creationTime).toLocaleDateString("en-US")}
                    </p>
                </div>
            </div>

            <Separator className="my-8" />

            <div className="prose prose-neutral max-w-none text-lg leading-relaxed text-neutral-800">
                <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            <Separator className="my-8" />
            <BlogCTA />
            <Separator className="my-8" />

            <CommentSection preloadedComments={preloadedComments} />
        </div>
    )
}