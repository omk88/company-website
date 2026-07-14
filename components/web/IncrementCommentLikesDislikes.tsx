"use client";

import { ThumbsUp } from "lucide-react";
import { Button } from "../ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTransition } from "react";
import { CommentPreview } from "./CommentCard";

interface IncrementCommentLikesProps {
  comment: CommentPreview; 
}

export function IncrementCommentLikesDislikes({ comment }: IncrementCommentLikesProps) {
  const user = useQuery(api.auth.getCurrentUser);
  const [isVotePending, startVoteTransition] = useTransition();

  const voteState = useQuery(api.comments.getCommentVoteState, { commentId: comment._id });
  const hasLiked = voteState?.hasVoted ?? false;
  const likesCount = voteState?.likes ?? comment.likes;
  
  const toggleVoteMutation = useMutation(api.comments.toggleCommentVote)
    .withOptimisticUpdate((localStore, args) => {
      const { commentId } = args;
      
      const previous = localStore.getQuery(api.comments.getCommentVoteState, { commentId });
      
      const currentHasVoted = previous ? previous.hasVoted : false;
      const currentLikes = previous ? previous.likes : comment.likes;

      const nextHasVoted = !currentHasVoted;
      const nextLikes = nextHasVoted ? currentLikes + 1 : Math.max(0, currentLikes - 1);

      localStore.setQuery(
        api.comments.getCommentVoteState,
        { commentId },
        {
          hasVoted: nextHasVoted,
          likes: nextLikes,
        }
      );
    });

  const handleLikeClick = async () => {
    if (isVotePending || user === undefined) return;

    if (user === null) {
      alert("You must be logged in to like a comment.");
      return;
    }

    startVoteTransition(async () => {
      try {
        await toggleVoteMutation({ commentId: comment._id });
      } catch (error) {
        console.error("Failed to process like:", error);
      }
    });
  };

  return (
    <div className="flex flex-row items-center gap-4 text-muted-foreground text-xs">
      <Button 
        variant="ghost" 
        onClick={handleLikeClick}
        disabled={user === null}
        className="h-12 w-12 rounded-full text-muted-foreground hover:text-foreground"
      >
        <ThumbsUp
          className={`!h-5 !w-5 transition-none ${
            hasLiked ? "text-emerald-500" : ""
          }`}
          fill={hasLiked ? "currentColor" : "none"}
        />
        <h1 className={hasLiked ? "text-emerald-500 font-bold" : ""}>
          {likesCount}
        </h1>
      </Button>
    </div>
  );
}