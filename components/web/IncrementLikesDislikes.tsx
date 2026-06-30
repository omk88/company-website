"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface IncrementLikesDislikesProps {
  postId: Id<"blogs">;
}

export function IncrementLikesDislikes({ postId }: IncrementLikesDislikesProps) {
    const incrementLikes = useMutation(api.blogs.incrementLikes);
    const incrementDislikes = useMutation(api.blogs.incrementDislikes);

    const [isPending, setIsPending] = useState(false);

    const handleLike = async () => {
        if (isPending) return;
        setIsPending(true);
        try {
        await incrementLikes({ postId });
        } catch (error) {
        console.error("Failed to register like:", error);
        } finally {
        setIsPending(false);
        }
    };

    const handleDislike = async () => {
        if (isPending) return;
        setIsPending(true);
        try {
        await incrementDislikes({ postId });
        } catch (error) {
        console.error("Failed to register dislike:", error);
        } finally {
        setIsPending(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button 
                variant="outline" 
                size="icon"
                onClick={handleLike} 
                disabled={isPending}
            >
                <ThumbsUp className="h-4 w-4" />
            </Button>
            
            <Button 
                variant="outline" 
                size="icon"
                onClick={handleDislike} 
                disabled={isPending}
            >
                <ThumbsDown className="h-4 w-4" />
            </Button>
        </div>
    )
}