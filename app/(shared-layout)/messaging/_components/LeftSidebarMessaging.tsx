"use client";

import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMessageStore } from "@/stores/useMessageStore";
import { MessageSquare, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function LeftSidebarMessaging() {
  const { activeConversationId, setActiveConversation } = useMessageStore();

  const { results, status, loadMore } = usePaginatedQuery(
    api.messaging.listConversations,
    {},
    { initialNumItems: 15 }
  );

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
          {status === "LoadingFirstPage" ? (
            <div className="flex items-center justify-center p-8 text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              <span className="text-sm">Loading chats...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No conversations yet.
            </div>
          ) : (
            results.map((chat) => {
              const isActive = chat._id === activeConversationId;
              const profile = chat.otherUserProfile;

              const primaryName = profile?.displayName || (profile?.username ? `@${profile.username}` : "Unknown User");
              
              const secondaryHandle = profile?.displayName && profile?.username ? `@${profile.username}` : null;

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
                        {(profile?.displayName?.[0] ?? profile?.username?.[0] ?? "?").toUpperCase()}
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
                      <p className="text-xs text-slate-400 italic mt-0.5">
                        No messages yet
                      </p>
                    )}
                  </div>
                </button>
              );
            })
          )}

          {status === "CanLoadMore" && (
            <div className="p-2 text-center">
              <button
                onClick={() => loadMore(10)}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline py-1"
              >
                Load older conversations
              </button>
            </div>
          )}

          {status === "LoadingMore" && (
            <div className="flex items-center justify-center p-3 text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
              <span className="text-xs">Loading...</span>
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}