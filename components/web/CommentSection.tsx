"use client";

import { Loader2, MessageSquare } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema } from "@/app/schemas/comment";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import z from "zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { IncrementCommentLikesDislikes } from "./IncrementCommentLikesDislikes"; 
import { formatSmartDate } from "./ProfileHoverCard";

export function CommentSection(props: { preloadedComments: Preloaded<typeof api.comments.getCommentsByBlog> }) {
  const params = useParams<{ blogId: Id<"blogs"> }>();
  const data = usePreloadedQuery(props.preloadedComments);
  
  const [isCommentPending, startCommentTransition] = useTransition();
  const createComment = useMutation(api.comments.createComment);

  const form = useForm({ 
    resolver: zodResolver(commentSchema),
    defaultValues: {
      body: "",
      blogId: params.blogId
    }
  });

  function onSubmit(formData: z.infer<typeof commentSchema>) {
    startCommentTransition(async () => {
      try {
        await createComment(formData);
        form.reset();
        toast.success("Comment posted");
      } catch {
        toast.error("Failed to post comment");
      }
    });
  }

  if (data === undefined) return null;

  return (
    <div className="space-y-8 my-8">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Comments ({data.length})
        </h2>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <Controller
          name="body"
          control={form.control}
          render={({ field, fieldState }) => (
            <div>
              <Textarea 
                aria-invalid={fieldState.invalid} 
                placeholder="What are your thoughts?" 
                className="bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 rounded-xl min-h-[100px] p-4 text-sm focus-visible:ring-1 focus-visible:ring-zinc-400 resize-y"
                {...field}
              />
              {fieldState.invalid && (
                <p className="text-xs text-red-500 mt-1">{fieldState.error?.message}</p>
              )}
            </div>
          )}
        />
        
        <div className="flex justify-end">
          <Button 
            disabled={isCommentPending}
            className="rounded-lg h-9 px-4 text-xs font-medium cursor-pointer"
          >
            {isCommentPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                Posting...
              </>
            ) : (
              "Post comment"
            )}
          </Button>
        </div>
      </form>

      <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 pt-4">
        {data.map((comment) => (
            <div key={comment._id} className="flex items-start gap-3 py-4 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0">
                <Avatar className="w-8 h-8 shrink-0 mt-0.5">
                    <AvatarImage src={comment.authorProfilePicUrl || comment.defaultAuthorProfilePicUrl || undefined} />
                </Avatar>
            
                <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                            {comment.displayName || comment.username}
                        </span>
                        <span className="text-xs text-zinc-400">&middot;</span>
                        <time className="text-xs text-zinc-400">
                            {formatSmartDate(comment._creationTime, false)}
                        </time>
                    </div>

                    <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                        {comment.body}
                    </p>
                
                    <div className="pt-1 flex items-center gap-2 text-xs text-zinc-500">
                        <IncrementCommentLikesDislikes comment={comment} />
                    </div>
                </div>
            </div>
            ))}
      </div>
    </div>
  );
}