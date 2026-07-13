import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "../ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { useState, useTransition } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CommentPreview } from "./CommentCard";

type VoteState = "none" | "liked" | "disliked";

interface IncrementCommentLikesDislikesProps {
  comment: CommentPreview; 
}

export function IncrementCommentLikesDislikes({ comment }: IncrementCommentLikesDislikesProps) {

    const [isVotePending, startVoteTransition] = useTransition();
    const [userVotes, setUserVotes] = useState<Record<Id<"comments">, VoteState>>({});
    const handleVoteMutation = useMutation(api.comments.handleVote);

    const executeVoteChange = async (targetVote: VoteState, commentId: Id<"comments">) => {
        if (isVotePending) return;

        const currentCommentVote = userVotes[commentId] || "none";
        const nextVoteState = currentCommentVote === targetVote ? "none" : targetVote;
        const previousVoteState = currentCommentVote;

        startVoteTransition(async () => {
            try {
                await handleVoteMutation({
                    commentId,
                    currentVote: nextVoteState,
                    previousVote: previousVoteState,
                });

                localStorage.setItem(`vote_comment_${commentId}`, nextVoteState);
                setUserVotes((prev) => ({
                    ...prev,
                    [commentId]: nextVoteState,
                }));
            } catch (error) {
                console.error("Failed to update vote choice:", error);
            }
        });
    };

    const currentVote = userVotes[comment._id] || "none";

    return (
        <div className="flex flex-row items-center gap-4 text-muted-foreground text-xs">
            <Button 
                variant="ghost" 
                onClick={() => executeVoteChange("liked", comment._id)}
                disabled={isVotePending}
                className="h-12 w-12 rounded-full transition-all text-muted-foreground hover:text-foreground disabled:opacity-100"
            >
                <ThumbsUp
                    className={`!h-5 !w-5 transition-transform active:scale-90 ${
                        currentVote === "liked" ? "text-emerald-500" : ""
                    }`}
                    fill={currentVote === "liked" ? "currentColor" : "none"}
                />
                <h1>{comment.likes}</h1>
            </Button>

            <Button 
                variant="ghost" 
                onClick={() => executeVoteChange("disliked", comment._id)}
                disabled={isVotePending}
                className="h-12 w-12 rounded-full transition-all text-muted-foreground hover:text-foreground disabled:opacity-100"
            >
                <ThumbsDown
                    className={`!h-5 !w-5 transition-transform active:scale-90 ${
                        currentVote === "disliked" ? "text-destructive" : ""
                    }`}
                    fill={currentVote === "disliked" ? "currentColor" : "none"}
                />
                <h1 className={currentVote === "disliked" ? "text-destructive" : ""}>
                    {comment.dislikes}
                </h1>
            </Button>
        </div>
    )
}