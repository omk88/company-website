"use client";

import { useEffect, useRef } from "react";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMessageStore } from "@/stores/useMessageStore";
import { MessageSquare, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

function ConversationSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl">
      <Skeleton className="w-10 h-10 rounded-full shrink-0" />
      <div className="flex flex-col flex-1 gap-2 min-w-0">
        <div className="flex justify-between items-center w-full">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-10" />
        </div>
        <Skeleton className="h-3 w-40" />
      </div>
    </div>
  );
}

export default function LeftSidebarMessaging() {
  const { activeConversationId, setActiveConversation } = useMessageStore();

  const { results, status, loadMore } = usePaginatedQuery(
    api.messaging.listConversations,
    {},
    { initialNumItems: 15 }
  );

  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  const hasLoadedDataRef = useRef(false);

  if (results.length > 0 || status === "Exhausted") {
    hasLoadedDataRef.current = true;
  }

  const isInitialLoading = !hasLoadedDataRef.current;
  const isLoadingMore = status === "LoadingMore";
  const isDone = status === "Exhausted";

  useEffect(() => {
    if (!activeConversationId && results.length > 0) {
      const firstChat = results[0];
      setActiveConversation(firstChat._id, firstChat.otherUserProfile);
    }
  }, [activeConversationId, results, setActiveConversation]);

  useEffect(() => {
    if (isDone || isLoadingMore || isInitialLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && status === "CanLoadMore") {
          loadMore(10);
        }
      },
      { rootMargin: "100px" }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [isDone, isLoadingMore, isInitialLoading, status, loadMore]);

  return (
    <aside className="w-80 h-full border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-500" />
        <h2 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">
          Messages
        </h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {isInitialLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <ConversationSkeleton key={i} />
            ))
          ) : results.length === 0 ? (
            null
          ) : (
            <>
              {results.map((chat) => {
                const isActive = chat._id === activeConversationId;
                const profile = chat.otherUserProfile;

                const primaryName =
                  profile?.displayName ||
                  (profile?.username ? `@${profile.username}` : "Unknown User");

                const secondaryHandle =
                  profile?.displayName && profile?.username
                    ? `@${profile.username}`
                    : null;

                return (
                  <button
                    key={chat._id}
                    onClick={() => setActiveConversation(chat._id, profile)}
                    className={`cursor-pointer w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                      isActive
                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60"
                    }`}
                  >
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 border border-slate-200 dark:border-slate-700">
                      {profile?.avatarUrl ? (
                        <img
                          src={profile.avatarUrl}
                          alt={primaryName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-300">
                          {(
                            profile?.displayName?.[0] ??
                            profile?.username?.[0] ??
                            "?"
                          ).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex justify-between items-baseline w-full">
                        <span className="text-sm font-semibold truncate">
                          {primaryName}
                        </span>
                        {chat.updatedAt && (
                          <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                            {new Date(chat.updatedAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>

                      {secondaryHandle && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {secondaryHandle}
                        </p>
                      )}

                      {chat.lastMessageContent ? (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {chat.lastMessageContent}
                        </p>
                      ) : (
                        null
                      )}
                    </div>
                  </button>
                );
              })}

              <div ref={loadMoreRef} className="w-full">
                {isLoadingMore && (
                  <div className="flex items-center justify-center p-3 text-slate-400">
                    <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                    <span className="text-xs">Loading older chats...</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}