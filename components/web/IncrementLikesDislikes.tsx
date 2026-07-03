"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { ThumbsUp, ThumbsDown, Star, MessageSquare, Ellipsis, SquarePen, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState, useTransition } from "react";
import { revalidateFeaturedBlogs } from "@/app/actions/blog";
import { Separator } from "../ui/separator";

interface IncrementLikesDislikesProps {
  postId: Id<"blogs">;
}

type VoteState = "none" | "liked" | "disliked";

export function IncrementLikesDislikes({ postId }: IncrementLikesDislikesProps) {
    const handleVoteMutation = useMutation(api.blogs.handleVote);
    const toggleFeaturedMutation = useMutation(api.blogs.toggleFeatured);

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

    return (
        <div className="flex flex-col items-center gap-4 p-6">
            <Button 
                variant="ghost" 
                onClick={() => executeVoteChange("liked")} 
                disabled={isPending}
                className={`h-12 w-12 rounded-full transition-all ${
                    userVote === "liked" 
                        ? "text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 hover:text-emerald-600" 
                        : "text-muted-foreground hover:text-foreground"
                }`}
            >
                <ThumbsUp
                    className="!h-5 !w-5 transition-transform active:scale-90"
                    fill={userVote === "liked" ? "currentColor" : "none"}
                />
                <h1>0</h1>
            </Button>
            
            <Button 
                variant="ghost" 
                onClick={() => executeVoteChange("disliked")} 
                disabled={isPending}
                className={`h-12 w-12 rounded-full transition-all ${
                userVote === "disliked" 
                    ? "text-destructive bg-destructive/10 hover:bg-destructive/20 hover:text-destructive-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
            >
                <ThumbsDown
                    className="!h-5 !w-5 transition-transform active:scale-90"
                    fill={userVote === "disliked" ? "currentColor" : "none"}
                />
                <h1>0</h1>
            </Button>

            <Button 
                variant="ghost" 
                disabled={isPending || featuredState === undefined}
                className={`h-12 w-12 rounded-full transition-all ${
                isFeatured 
                    ? "text-amber-500 bg-amber-500/10 hover:bg-amber-500/20" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
            >
                <MessageSquare
                    className="!h-5 !w-5 transition-transform active:scale-90"
                    fill={isFeatured ? "currentColor" : "none"}
                />
                <h1>0</h1>
            </Button>

            <Button 
                variant="ghost" 
                disabled={isPending || featuredState === undefined}
                className={`h-12 w-12 rounded-full transition-all ${
                isFeatured 
                    ? "text-amber-500 bg-amber-500/10 hover:bg-amber-500/20" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
            >
                <Ellipsis
                    className="!h-5 !w-5 transition-transform active:scale-90"
                    fill={isFeatured ? "currentColor" : "none"}
                />
            </Button>

            <Separator />

            <Button 
                variant="ghost" 
                onClick={handleToggleFeatured} 
                disabled={isPending || featuredState === undefined}
                className={`h-12 w-12 rounded-full transition-all ${
                isFeatured 
                    ? "text-amber-500 bg-amber-500/10 hover:bg-amber-500/20" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
            >
                <Star
                    className="!h-5 !w-5 transition-transform active:scale-90"
                    fill={isFeatured ? "currentColor" : "none"}
                />
            </Button>

            <Button 
                variant="ghost" 
                onClick={handleToggleFeatured} 
                disabled={isPending || featuredState === undefined}
                className={`h-12 w-12 rounded-full transition-all ${
                isFeatured 
                    ? "text-amber-500 bg-amber-500/10 hover:bg-amber-500/20" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
            >
                <SquarePen
                    className="!h-5 !w-5 transition-transform active:scale-90"
                    fill={isFeatured ? "currentColor" : "none"}
                />
            </Button>

            <Button 
                variant="ghost" 
                onClick={handleToggleFeatured} 
                disabled={isPending || featuredState === undefined}
                className={`h-12 w-12 rounded-full transition-all ${
                isFeatured 
                    ? "text-amber-500 bg-amber-500/10 hover:bg-amber-500/20" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
            >
                <Trash2
                    className="!h-5 !w-5 transition-transform active:scale-90"
                    fill={isFeatured ? "currentColor" : "none"}
                />
            </Button>
        </div>
    );
}