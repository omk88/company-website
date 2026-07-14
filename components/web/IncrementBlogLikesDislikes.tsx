"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "../ui/button";
import { useTransition } from "react";
import { toast } from "sonner";

interface IncrementBlogLikesDislikesProps {
  postId: Id<"blogs">;
  storageId: string;
  likes: number;
  dislikes: number;
  comments: number;
}

export function IncrementBlogLikesDislikes({ 
  postId, 
  likes, 
  dislikes 
}: IncrementBlogLikesDislikesProps) {
  const user = useQuery(api.auth.getCurrentUser);
  const [isVotePending, startVoteTransition] = useTransition();

  const currentVote = useQuery(api.blogs.getBlogVoteState, { blogId: postId }) ?? "none";
  
  const toggleBlogVoteMutation = useMutation(api.blogs.toggleBlogVote)
    .withOptimisticUpdate((localStore, args) => {
      const { blogId, targetVote } = args;
      const previousVote = localStore.getQuery(api.blogs.getBlogVoteState, { blogId });

      let predictedVote: "liked" | "disliked" | "none" = targetVote;
      if (previousVote === targetVote) {
        predictedVote = "none";
      }

      localStore.setQuery(
        api.blogs.getBlogVoteState,
        { blogId },
        predictedVote
      );
    });

  const handleVoteClick = async (target: "liked" | "disliked") => {
    if (isVotePending) return;

    if (!user) {
      toast.error("You must be logged in to rate an article.");
      return;
    }

    startVoteTransition(async () => {
      try {
        await toggleBlogVoteMutation({ blogId: postId, targetVote: target });
      } catch (error) {
        console.error("Failed to process vote:", error);
        toast.error("Failed to submit your vote.");
      }
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 text-muted-foreground text-xs">
      <Button 
        variant="ghost" 
        onClick={() => handleVoteClick("liked")}
        disabled={!user}
        className="h-12 w-12 rounded-full text-muted-foreground hover:text-foreground"
      >
        <ThumbsUp
          className={`!h-5 !w-5 transition-none ${
            currentVote === "liked" ? "text-emerald-500" : ""
          }`}
          fill={currentVote === "liked" ? "currentColor" : "none"}
        />
        <h1 className={currentVote === "liked" ? "text-emerald-500 font-bold" : ""}>
          {likes}
        </h1>
      </Button>
      
      <Button 
        variant="ghost" 
        onClick={() => handleVoteClick("disliked")}
        disabled={!user}
        className="h-12 w-12 rounded-full text-muted-foreground"
      >
        <ThumbsDown
          className={`!h-5 !w-5 transition-none ${
            currentVote === "disliked" ? "text-destructive" : ""
          }`}
          fill={currentVote === "disliked" ? "currentColor" : "none"}
        />
        <h1 className={currentVote === "disliked" ? "text-destructive font-bold" : ""}>
          {dislikes}
        </h1>
      </Button>
    </div>
  );
}