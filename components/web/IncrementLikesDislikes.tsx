"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { ThumbsUp, ThumbsDown, Star } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

interface IncrementLikesDislikesProps {
  postId: Id<"blogs">;
}

type VoteState = "none" | "liked" | "disliked";

export function IncrementLikesDislikes({ postId }: IncrementLikesDislikesProps) {
    const handleVoteMutation = useMutation(api.blogs.handleVote);
    const toggleFeaturedMutation = useMutation(api.blogs.toggleFeatured);

    const [isPending, setIsPending] = useState(false);
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

        setIsPending(true);

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
        } finally {
            setIsPending(false);
        }
    };

    const handleToggleFeatured = async () => {
        if (isPending) return;
        setIsPending(true);
        try {
            await toggleFeaturedMutation({ postId });
        } catch (error) {
            console.error("Failed to toggle featured status:", error);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="flex items-center gap-1 border border-border/60 rounded-full bg-muted/40 p-1 w-fit">
            <Button 
                variant="ghost" 
                size="icon"
                onClick={() => executeVoteChange("liked")} 
                disabled={isPending}
                className={`rounded-full transition-all ${
                    userVote === "liked" 
                        ? "text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 hover:text-emerald-600" 
                        : "text-muted-foreground hover:text-foreground"
                }`}
            >
                <ThumbsUp
                    className="h-4 w-4 transition-transform active:scale-90"
                    fill={userVote === "liked" ? "currentColor" : "none"}
                />
            </Button>
            
            <Button 
                variant="ghost" 
                size="icon"
                onClick={() => executeVoteChange("disliked")} 
                disabled={isPending}
                className={`rounded-full transition-all ${
                userVote === "disliked" 
                    ? "text-destructive bg-destructive/10 hover:bg-destructive/20 hover:text-destructive-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
            >
                <ThumbsDown
                    className="h-4 w-4 transition-transform active:scale-90"
                    fill={userVote === "disliked" ? "currentColor" : "none"}
                />
            </Button>


            <Button 
                variant="ghost" 
                size="icon"
                onClick={handleToggleFeatured} 
                disabled={isPending || featuredState === undefined}
                className={`rounded-full transition-all ${
                isFeatured 
                    ? "text-amber-500 bg-amber-500/10 hover:bg-amber-500/20" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
            >
                <Star
                    className="h-4 w-4 transition-transform active:scale-90"
                    fill={isFeatured ? "currentColor" : "none"}
                />
            </Button>
        </div>
    )
}