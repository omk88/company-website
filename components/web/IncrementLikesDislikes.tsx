"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { ThumbsUp, ThumbsDown, Star, MessageSquare, Ellipsis, SquarePen, Trash2, Copy, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState, useTransition } from "react";
import { revalidateFeaturedBlogs } from "@/app/actions/blog";
import { Separator } from "../ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";


interface IncrementLikesDislikesProps {
    postId: Id<"blogs">;
    storageId: string;
}

type VoteState = "none" | "liked" | "disliked";

export function IncrementLikesDislikes({ postId, storageId }: IncrementLikesDislikesProps) {
    const handleVoteMutation = useMutation(api.blogs.handleVote);
    const toggleFeaturedMutation = useMutation(api.blogs.toggleFeatured);
    const deleteBlog = useMutation(api.blogs.deletePost);

    const router = useRouter(); 

    const [isDeleting, setIsDeleting] = useState(false);

    let initialViews = 0;
    let initialLikes = 0;
    let initialDislikes = 0;

    const post = useQuery(api.blogs.getPostById, { postId: postId as Id<"blogs"> });
    const commentCount = useQuery(api.comments.getCommentNumber, { postId: postId as Id<"blogs"> });

    const { totalViews = initialViews, likes = initialLikes, dislikes = initialDislikes } = post ?? {};

    const user = useQuery(api.auth.getCurrentUser);
    const userEmail = user?.email || "";
    const companyDomain = "@taqtiq.tech";
    const isCompanyUser = userEmail.endsWith(companyDomain);

    const [isPending, startTransition] = useTransition(); 
    const [userVote, setUserVote] = useState<VoteState>("none");

    const featuredState = useQuery(api.blogs.getFeaturedState, { postId });
    const isFeatured = featuredState?.isFeatured ?? false;
    
    useEffect(() => {
        const savedVote = localStorage.getItem(`vote_${postId}`) as VoteState;
        
        if (savedVote) {
            setUserVote(savedVote);
        }
    }, [postId]);

    const executeVoteChange = async (targetVote: VoteState) => {
        if (isPending) return;

        const nextVoteState = userVote === targetVote ? "none" : targetVote;
        const previousVoteState = userVote;

        startTransition(async () => {
            try {
                await handleVoteMutation({
                    postId,
                    currentVote: nextVoteState,
                    previousVote: previousVoteState,
                });

                localStorage.setItem(`vote_${postId}`, nextVoteState);
                setUserVote(nextVoteState);
            } catch (error) {
                console.error("Failed to update vote choice:", error);
            }
        });
    };

    const handleToggleFeatured = () => {
        if (isPending) return;
        
        startTransition(async () => {
            try {
                await toggleFeaturedMutation({ postId });
                
                await revalidateFeaturedBlogs();
            } catch (error) {
                console.error("Failed to toggle featured status:", error);
            }
        });
    };

    const scrollToView = () => {
        document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" });
    }

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.");
        if (!confirmed) return;

        try {
            setIsDeleting(true);
            
            await deleteBlog({ 
                id: postId as Id<"blogs">, 
                storageId: storageId 
            });

            toast.success("Blog article deleted successfully!");

            try {
                const revalidateRes = await fetch("/api/revalidate", { method: "POST" });
                if (!revalidateRes.ok) {
                    console.error("Server-side tag revalidation returned an error status.");
                }
            } catch (err) {
                console.error("Background revalidation network failure:", err);
            }

            router.push("/insights"); 
            router.refresh(); 

        } catch (error) {
            console.error("Failed to delete the post:", error);
            toast.error("Something went wrong while deleting the post.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 p-6">
            <Button 
                variant="ghost" 
                onClick={() => executeVoteChange("liked")} 
                disabled={isPending}
                className="h-12 w-12 rounded-full transition-all text-muted-foreground hover:text-foreground disabled:opacity-100"
            >
                <ThumbsUp
                    className={`!h-5 !w-5 transition-transform active:scale-90 ${
                        userVote === "liked" ? "text-emerald-500" : ""
                    }`}
                    fill={userVote === "liked" ? "currentColor" : "none"}
                />
                <h1>{ likes }</h1>
            </Button>
            
            <Button 
                variant="ghost" 
                onClick={() => executeVoteChange("disliked")} 
                disabled={isPending}
                className="h-12 w-12 rounded-full transition-all text-muted-foreground hover:text-foreground disabled:opacity-100"
            >
                <ThumbsDown
                    className={`!h-5 !w-5 transition-transform active:scale-90 ${
                        userVote === "disliked" ? "text-destructive" : ""
                    }`}
                    fill={userVote === "disliked" ? "currentColor" : "none"}
                />
                <h1 className={userVote === "disliked" ? "text-destructive" : ""}>{ dislikes }</h1>
            </Button>

            <Button 
                variant="ghost" 
                disabled={isPending}
                className="h-12 w-12 rounded-full transition-all text-muted-foreground hover:text-foreground disabled:opacity-100"
                onClick={() => scrollToView()}
            >
                <MessageSquare className="!h-5 !w-5 transition-transform active:scale-90" />
                <h1>{ commentCount }</h1>
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                        variant="ghost" 
                        disabled={isPending}
                        className="h-12 w-12 rounded-full transition-all text-muted-foreground hover:text-foreground disabled:opacity-100"
                    >
                        <Ellipsis
                            className="!h-5 !w-5 transition-transform active:scale-90"
                            fill={isFeatured ? "currentColor" : "none"}
                        />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                    <DropdownMenuLabel>Share</DropdownMenuLabel>
                    <DropdownMenuItem className="font-bold">
                        <Copy className="h-4 w-4" strokeWidth={3} />Copy link
                    </DropdownMenuItem>
                    <DropdownMenuItem>X</DropdownMenuItem>
                    <DropdownMenuItem>LinkedIn</DropdownMenuItem>
                    <DropdownMenuItem>Facebook</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {isCompanyUser && (
                <>
                    <div className="w-1/2 mx-auto">
                        <Separator />
                    </div>

                    <Button 
                        variant="ghost" 
                        onClick={handleToggleFeatured} 
                        disabled={isPending || featuredState === undefined}
                        className="h-12 w-12 rounded-full transition-all text-muted-foreground hover:text-foreground disabled:opacity-100"
                    >
                        <Star
                            className={`!h-5 !w-5 transition-all active:scale-90 ${
                                isFeatured ? "text-amber-500 fill-amber-500" : ""
                            }`}
                        />
                    </Button>

                    <Button 
                        variant="ghost" 
                        disabled={isPending}
                        className="h-12 w-12 rounded-full transition-all text-muted-foreground hover:text-foreground disabled:opacity-100"
                        asChild
                    >
                        <Link href={`/company/blog?id=${postId}`}>
                            <SquarePen className="!h-5 !w-5 transition-transform active:scale-90" />
                        </Link>
                    </Button>

                    <Button 
                        variant="ghost" 
                        disabled={isDeleting || isPending}
                        className="h-12 w-12 rounded-full transition-all text-muted-foreground hover:text-destructive disabled:opacity-100"
                        onClick={handleDelete}
                    >
                        {isDeleting ? (
                            <Loader2 className="!h-5 !w-5 animate-spin text-destructive" />
                        ) : (
                            <Trash2 className="!h-5 !w-5 transition-transform active:scale-90" />
                        )}
                    </Button>
                </>
            )}
        </div>
    );
}