"use client";

import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useParams } from "next/navigation";
import { UIEvent } from "react";

export default function LeftSidebarMessaging() {
  const params = useParams();
  const activeConversationId = params?.id as string | undefined;

  const { results, status, loadMore } = usePaginatedQuery(
    api.messaging.listConversations,
    {},
    { initialNumItems: 15 }
  );

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const bottomReached =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 50;

    if (bottomReached && status === "CanLoadMore") {
      loadMore(10);
    }
  };

  return (
    <Sidebar
      className="hidden md:flex flex-col !top-16 !z-40 border-r"
      bgClass="bg-background/95"
      collapsible="icon"
    >
      <SidebarContent className="!p-0 w-full overflow-x-hidden">
        <SidebarGroup className="pt-3 !px-2 w-full flex flex-col h-[calc(100vh-4rem)]">
          <h2 className="px-3 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Messages
          </h2>

          <ScrollArea
            className="flex-1 w-full pr-1"
            onScrollCapture={handleScroll}
          >
            <div className="flex flex-col gap-1">
              {status === "LoadingFirstPage" && (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  Loading conversations...
                </div>
              )}

              {status !== "LoadingFirstPage" && results.length === 0 && (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  No conversations yet.
                </div>
              )}

              {results.map((chat) => {
                const isActive = chat._id === activeConversationId;
                const profile = chat.otherUserProfile;

                return (
                  <Link
                    key={chat._id}
                    href={`/messaging/${chat._id}`}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-accent/50 ${
                      isActive ? "bg-accent font-medium" : ""
                    }`}
                  >
                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-muted shrink-0">
                      {profile?.avatarUrl ? (
                        <img
                          src={profile.avatarUrl}
                          alt={profile.displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-xs">
                          {profile?.displayName?.[0]?.toUpperCase() ?? "?"}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex justify-between items-center w-full">
                        <span className="text-sm font-medium truncate">
                          {profile?.displayName ?? (profile?.username ? `@${profile.username}` : "Unknown User")}
                        </span>
                        <span className="text-[10px] text-muted-foreground shrink-0 ml-1">
                          {new Date(chat.updatedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {chat.lastMessageContent && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {chat.lastMessageContent}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}

              {status === "LoadingMore" && (
                <div className="py-2 text-center text-xs text-muted-foreground">
                  Loading more...
                </div>
              )}
            </div>
          </ScrollArea>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="hidden" />
    </Sidebar>
  );
}