"use client";

import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { useRef } from "react";
import { CommentCard } from "./CommentCard";
import { Doc } from "@/convex/_generated/dataModel";
import { MessageSquareText } from "lucide-react";
import { cn } from "@/lib/utils";
import { FunctionReturnType } from "convex/server";
import { CompactCommentCardSkeleton } from "./LoadingSkeletons/CompactCommentCardSkeleton";
import { EmptyState } from "./EmptyState";

type ProfileData = FunctionReturnType<typeof api.profiles.getProfileByUsername>;

interface ProfileCommentsProps {
  profile: ProfileData;
}

export function ProfileComments({ profile }: ProfileCommentsProps) {
  const userId = profile?.profile?.userId;

  const { results, status } = usePaginatedQuery(
    api.comments.getPaginatedCommentsByAuthor,
    userId ? { author: userId } : "skip",
    { initialNumItems: 6 }
  );

  const isFirstLoad = !userId || status === "LoadingFirstPage";

  const lastResultsRef = useRef<Doc<"comments">[]>([]);
  if (results.length > 0) {
    lastResultsRef.current = results as Doc<"comments">[];
  }

  const displayResults = results.length > 0 ? (results as Doc<"comments">[]) : lastResultsRef.current;
  const loadMoreRef = useRef<HTMLDivElement>(null);

return (
    <div className="flex flex-col flex-1 h-full min-h-0 w-full">
      {/* Full-width border header */}
      <div className="flex items-center justify-start gap-4 w-full border-b border-border mb-4 px-6">
        <div
          className={cn(
            "relative flex items-center gap-1.5 pb-2 pt-1.5 px-1 font-sans text-sm font-medium text-foreground",
            "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-current"
          )}
        >
          <MessageSquareText className="w-4 h-4 stroke-[2.3] shrink-0" />
          <span>{profile?.commentCount ?? 0} Comments Published</span>
        </div>
      </div>

      {/* Constrained card container */}
      <div className="w-full max-w-2xl mx-auto px-6">
        {isFirstLoad && displayResults.length === 0 ? (
          <ul className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <li key={i}>
                <CompactCommentCardSkeleton />
              </li>
            ))}
          </ul>
        ) : displayResults.length === 0 ? (
          <div className="flex flex-col flex-1 h-full min-h-0">
            <EmptyState size="sm" title="No comments found" description="This user hasn't posted any comments yet." />
          </div>
        ) : (
          <>
            <ul className="flex flex-col gap-2">
              {displayResults.map((comment, index) => (
                <li key={comment._id}>
                  <CommentCard
                    comment={comment}
                    index={index}
                    variant="compact"
                  />
                </li>
              ))}
            </ul>
            <div ref={loadMoreRef} className="w-full" />
          </>
        )}
      </div>
    </div>
  );
}