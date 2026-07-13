"use client";

import { Loader2, MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema } from "@/app/schemas/comment";
import { Field, FieldLabel, FieldError } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import z from "zod";
import { toast } from "sonner";
import { useEffect, useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

type VoteState = "none" | "liked" | "disliked";

export function CommentSection(props: { preloadedComments: Preloaded<typeof api.comments.getCommentsByPost> }) {
    const params = useParams<{ postId: Id<"blogs"> }>();
    const data = usePreloadedQuery(props.preloadedComments);
    
    const [isCommentPending, startCommentTransition] = useTransition();
    const [isVotePending, startVoteTransition] = useTransition();
    
    const createComment = useMutation(api.comments.createComment);
    const handleVoteMutation = useMutation(api.comments.handleVote);

    const [userVotes, setUserVotes] = useState<Record<Id<"comments">, VoteState>>({});

    const form = useForm({ 
        resolver: zodResolver(commentSchema),
        defaultValues: {
            body: "",
            postId: params.postId
        }
    });

    useEffect(() => {
        if (!data) return;
        const savedVotes: Record<string, VoteState> = {};
        data.forEach((comment) => {
            const saved = localStorage.getItem(`vote_comment_${comment._id}`) as VoteState;
            if (saved) {
                savedVotes[comment._id] = saved;
            }
        });
        setUserVotes(savedVotes);
    }, [data]);

    function onSubmit(formData: z.infer<typeof commentSchema>) {
        startCommentTransition(async () => {
            try {
                await createComment(formData);
                form.reset();
                toast.success("Comment posted");
            } catch {
                toast.error("Failed to create post");
            }
        });
    }

    if (data === undefined) {
        return <p>Loading...</p>;
    }

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

    return (
        <Card className="rounded-none">
            <CardHeader className="flex flex-row items-center gap-2 border-b">
                <MessageSquare className="size-5" />
                <h2 className="text-xl font-bold">{data.length} Comments</h2>
            </CardHeader>
            <CardContent className="space-y-8">
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <Controller
                        name="body"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Comment</FieldLabel>
                                <Textarea aria-invalid={fieldState.invalid} placeholder="Share your thoughts" {...field}/>
                                { fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                ) }
                            </Field>
                        )}
                    />
                    <Button disabled={isCommentPending}>
                        {isCommentPending ? (
                            <>
                                <Loader2 className="size-4 animate-spin"/>
                                <span>Loading...</span>
                            </>
                        ) : (
                            <span>Comment</span>
                        )}
                    </Button>
                </form>

                { data?.length > 0 && <Separator /> }

                <section className="space-y-6"> 
                    {data?.map((comment) => {
                        const currentVote = userVotes[comment._id] || "none";
                        
                        return (
                            <div key={comment._id} className="flex gap-4">
                                <Avatar className="size-10 shrink-0">
                                    <AvatarImage src={`https://avatar.vercel.sh/${comment.authorName}`} alt={comment.authorName} />
                                    <AvatarFallback>
                                        {comment.authorName.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-sm">{comment.authorName}</p>
                                        <p className="text-muted-foreground text-xs">
                                            {new Date(comment._creationTime).toLocaleDateString("en-US")}
                                        </p>
                                    </div>

                                    <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                                        {comment.body}
                                    </p>
                                    
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
                                </div>
                            </div>
                        );
                    })}
                </section>
            </CardContent>
        </Card>
    );
}