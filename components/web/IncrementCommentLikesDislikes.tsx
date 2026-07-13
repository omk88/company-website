"use client";

import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "../ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTransition } from "react";
import { CommentPreview } from "./CommentCard";

interface IncrementCommentLikesDislikesProps {
  comment: CommentPreview; 
}

export function IncrementCommentLikesDislikes({ comment }: IncrementCommentLikesDislikesProps) {
  const user = useQuery(api.auth.getCurrentUser);
  const [isVotePending, startVoteTransition] = useTransition();

  const currentVote = useQuery(api.comments.getCommentVoteState, { commentId: comment._id }) ?? "none";
  
  const toggleVoteMutation = useMutation(api.comments.toggleCommentVote);

  const handleVoteClick = async (target: "liked" | "disliked") => {
    if (isVotePending) return;

    if (!user) {
      alert("You must be logged in to rate a comment.");
      return;
    }

    startVoteTransition(async () => {
      try {
        await toggleVoteMutation({ commentId: comment._id, targetVote: target });
      } catch (error) {
        console.error("Failed to process vote:", error);
      }
    });
  };

  return (
    <div className="flex flex-row items-center gap-4 text-muted-foreground text-xs">
      <Button 
        variant="ghost" 
        onClick={() => handleVoteClick("liked")}
        disabled={isVotePending || !user}
        className="h-12 w-12 rounded-full transition-all text-muted-foreground hover:text-foreground disabled:opacity-50"
      >
        <ThumbsUp
          className={`!h-5 !w-5 transition-transform active:scale-90 ${
            currentVote === "liked" ? "text-emerald-500" : ""
          }`}
          fill={currentVote === "liked" ? "currentColor" : "none"}
        />
        <h1 className={currentVote === "liked" ? "text-emerald-500 font-bold" : ""}>
          {comment.likes}
        </h1>
      </Button>

      <Button 
        variant="ghost" 
        onClick={() => handleVoteClick("disliked")}
        disabled={isVotePending || !user}
        className="h-12 w-12 rounded-full transition-all text-muted-foreground hover:text-foreground disabled:opacity-50"
      >
        <ThumbsDown
          className={`!h-5 !w-5 transition-transform active:scale-90 ${
            currentVote === "disliked" ? "text-destructive" : ""
          }`}
          fill={currentVote === "disliked" ? "currentColor" : "none"}
        />
        <h1 className={currentVote === "disliked" ? "text-destructive font-bold" : ""}>
          {comment.dislikes}
        </h1>
      </Button>
    </div>
  );
}