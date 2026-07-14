"use client";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { ThumbsUp } from "lucide-react";
import { Button } from "../ui/button";
import { useTransition } from "react";
import { toast } from "sonner";

interface IncrementBlogLikesProps {
  post: Doc<"blogs">;
}

export function IncrementBlogLikesDislikes({ post }: IncrementBlogLikesProps) {
  const user = useQuery(api.auth.getCurrentUser);
  const [isVotePending, startVoteTransition] = useTransition();

  const voteState = useQuery(api.blogs.getBlogVoteState, { blogId: post._id });
  const hasLiked = voteState?.hasVoted ?? false;
  const likesCount = voteState?.likes ?? post.likes; 
  
  const toggleBlogVoteMutation = useMutation(api.blogs.toggleBlogVote)
    .withOptimisticUpdate((localStore, args) => {
      const { blogId } = args;
      
      const previous = localStore.getQuery(api.blogs.getBlogVoteState, { blogId });
      
      const currentHasVoted = previous ? previous.hasVoted : false;
      const currentLikes = previous ? previous.likes : post.likes;

      const nextHasVoted = !currentHasVoted;
      const nextLikes = nextHasVoted ? currentLikes + 1 : currentLikes - 1;

      localStore.setQuery(
        api.blogs.getBlogVoteState,
        { blogId },
        {
          hasVoted: nextHasVoted,
          likes: nextLikes,
        }
      );
    });

  const handleLikeClick = async () => {
    if (isVotePending) return;

    if (!user) {
      toast.error("You must be logged in to like an article.");
      return;
    }

    startVoteTransition(async () => {
      try {
        await toggleBlogVoteMutation({ blogId: post._id });
      } catch (error) {
        console.error("Failed to process like:", error);
        toast.error("Failed to update your like.");
      }
    });
  };

  return (
    <div className="flex flex-col items-center gap-2 p-6 text-muted-foreground text-xs">
      <Button 
        variant="ghost" 
        onClick={handleLikeClick}
        disabled={!user}
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