"use client";

import { useState, useEffect, UIEvent } from "react";
import { useMutation, usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, X, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSearchStore } from "@/stores/useSearchStore";

interface FollowersPopoverProps {
  userId: string | undefined;
  onSelectUser?: (user: any) => void;
}

export function SearchFollowers({ userId, onSelectUser }: FollowersPopoverProps) {
  const [open, setOpen] = useState(false);
  const searchTerm = useSearchStore((state) => state.searchTerm);
  const setSearchTerm = useSearchStore((state) => state.setSearchTerm);
  const [localValue, setLocalValue] = useState(searchTerm);

  const startConversation = useMutation(api.messaging.getOrCreateAndStartConversation);
  
  const handleFollowerClick = async (recipientId: string) => {
    try {
        const conversationId = await startConversation({
            participantId: recipientId
        });

    } catch (error) {
        console.error("Failed to start conversation:", error);
    }
  };

  useEffect(() => {
    setLocalValue(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (localValue === searchTerm) return;
    const timer = setTimeout(() => {
      setSearchTerm(localValue);
    }, 200);
    return () => clearTimeout(timer);
  }, [localValue, searchTerm, setSearchTerm]);

  const { results, status, loadMore } = usePaginatedQuery(
    api.profiles.getProfileFollowers,
    userId ? { userId, search: searchTerm } : "skip",
    { initialNumItems: 10 }
  );

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isNearBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 40;

    if (isNearBottom && status === "CanLoadMore") {
      loadMore(10);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={`
            group flex items-center bg-white dark:bg-zinc-900 
            border border-zinc-200 dark:border-zinc-800 rounded-lg 
            px-2.5 md:px-3 h-9 
            focus-within:ring-1 focus-within:ring-zinc-400 transition-colors
            w-full flex-1 min-w-0 cursor-pointer
          `}
        >
          <Search className="h-5 w-5 md:h-4 md:w-4 text-zinc-400 md:text-zinc-500 shrink-0 mr-2 translate-y-[0.5px]" />

          <Input
            type="text"
            placeholder="Start a new chat…"
            value={localValue}
            onChange={(e) => {
              setLocalValue(e.target.value);
              if (!open) setOpen(true);
            }}
            className="h-full border-0 bg-transparent px-0 text-lg md:text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 md:placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:border-0 shadow-none w-full min-w-0 flex-1"
          />

          {localValue && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLocalValue("");
                setSearchTerm("");
              }}
              type="button"
              className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer ml-1 shrink-0"
            >
              <X className="h-3 w-3 md:h-3.5 md:w-3.5 stroke-[2]" />
            </button>
          )}
        </div>
      </PopoverTrigger>

    <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] p-0 shadow-lg"
        onOpenAutoFocus={(e) => e.preventDefault()}
    >
        <ScrollArea className="max-h-64 w-full" onScroll={handleScroll}>
          <div className="p-2 space-y-1">
            {status === "LoadingFirstPage" ? (
              <div className="flex items-center justify-center p-6 text-zinc-400">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span className="text-xs">Loading followers...</span>
              </div>
            ) : results.length === 0 ? (
              <div className="p-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
                No followers found.
              </div>
            ) : (
              results.map((follower) => (
                <div
                  key={follower._id}
                  onClick={() => {
                    if (onSelectUser) onSelectUser(follower);
                    handleFollowerClick(follower.userId);
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800/60 cursor-pointer transition-colors"
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={follower.profilePicUrl || follower.defaultProfilePic || ""} />
                    <AvatarFallback>{follower.username?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                      {follower.displayName || follower.username}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                      @{follower.username}
                    </span>
                  </div>
                </div>
              ))
            )}

            {status === "LoadingMore" && (
              <div className="flex items-center justify-center p-2 text-zinc-400">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}