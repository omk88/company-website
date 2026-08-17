"use client";

import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { useRef } from "react";
import { CommentCard } from "./CommentCard";
import { Doc } from "@/convex/_generated/dataModel";

interface ProfileCommentsProps {
  author: string | undefined;
}

export function ProfileComments({ author }: ProfileCommentsProps) {
  const { results, status } = usePaginatedQuery(
    api.comments.getPaginatedCommentsByAuthor,
    author ? { author } : "skip",
    { initialNumItems: 6 }
  );

  const isFirstLoad = !author || status === "LoadingFirstPage";

  const lastResultsRef = useRef<Doc<"comments">[]>([]);
  if (results.length > 0) {
    lastResultsRef.current = results as Doc<"comments">[];
  }

  const displayResults = results.length > 0 ? (results as Doc<"comments">[]) : lastResultsRef.current;
  const loadMoreRef = useRef<HTMLDivElement>(null);

  if (isFirstLoad && displayResults.length === 0) {
    return (
      <div className="flex flex-col flex-1 h-full min-h-0 w-full">
        <ul className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <li key={i}>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 w-full">
      {displayResults.length === 0 ? (
        <div className="flex flex-col flex-1 h-full min-h-0">
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
  );
}