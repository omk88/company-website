"use client";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { Button } from "../ui/button";
import { useTransition } from "react";
import { toast } from "sonner";
import { FunctionReturnType } from "convex/server";

interface IncrementBlogLikesProps {
  post: Doc<"blogs">;
  preloadedUserData: FunctionReturnType<typeof api.auth.getCurrentUser>;
  preloadedVoteStateData: FunctionReturnType<typeof api.blogs.getBlogVoteState>;
  preloadedCommentCountData: FunctionReturnType<typeof api.comments.getCommentNumber>;
}

export function IncrementBlogLikesDislikes({ 
  post, 
  preloadedUserData,
  preloadedVoteStateData, 
  preloadedCommentCountData 
}: IncrementBlogLikesProps) {
  const user = useQuery(api.auth.getCurrentUser);
  const [isVotePending, startVoteTransition] = useTransition();

  const currentUser = user !== undefined ? user : preloadedUserData;

  const voteState = useQuery(api.blogs.getBlogVoteState, { blogId: post._id });
  
  const hasLiked = voteState !== undefined 
    ? voteState.hasVoted 
    : preloadedVoteStateData.hasVoted;

  const likesCount = voteState !== undefined 
    ? voteState.likes 
    : preloadedVoteStateData.likes; 

  const liveCommentCount = useQuery(api.comments.getCommentNumber, { postId: post._id });
  
  const displayComments = liveCommentCount !== undefined 
    ? liveCommentCount 
    : preloadedCommentCountData;
  
  const toggleBlogVoteMutation = useMutation(api.blogs.toggleBlogVote)
    .withOptimisticUpdate((localStore, args) => {
      const { blogId } = args;
      
      const previous = localStore.getQuery(api.blogs.getBlogVoteState, { blogId });
      
      const currentHasVoted = previous?.hasVoted ?? false;
      const currentLikes = previous?.likes ?? post.likes;

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

    if (currentUser === null) {
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

  const scrollToView = () => {
    document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col items-center gap-2 p-6 text-muted-foreground text-xs">
      <Button 
        variant="ghost" 
        onClick={handleLikeClick}
        disabled={currentUser === null}
        className="h-12 w-12 rounded-full text-muted-foreground hover:text-foreground"
      >
        <ThumbsUp
          className={`!h-5 !w-5 transition-none ${
            hasLiked ? "text-emerald-500" : ""
          }`}
          fill={hasLiked ? "currentColor" : "none"}
        />
        <span className={hasLiked ? "text-emerald-500 font-bold" : ""}>
          {likesCount}
        </span>
      </Button>

      <Button 
        variant="ghost" 
        className="h-12 w-12 rounded-full transition-all text-muted-foreground hover:text-foreground"
        onClick={scrollToView}
      >
        <MessageSquare className="!h-5 !w-5 transition-transform active:scale-90" />
        <span>{displayComments}</span>
      </Button>
    </div>
  );
}