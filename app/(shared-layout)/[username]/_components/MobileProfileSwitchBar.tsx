"use client";

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";
import { ProfileMetricType, useProfileStore } from "@/stores/useProfileStore";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { Library, MessageSquareText, Bookmark, UsersRound, UserRoundCheck } from "lucide-react";

interface MobileProfileSwitchBarProps {
  preloadedProfile: Preloaded<typeof api.profiles.getProfileByUsername>;
  preloadedCurrentUser: Preloaded<typeof api.auth.getCurrentUser>;
}

const NAV_ITEMS = [
  { id: "insights", label: "Insights", icon: Library },
  { id: "comments", label: "Comments", icon: MessageSquareText },
  { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
  { id: "followers", label: "Followers", icon: UsersRound },
  { id: "following", label: "Following", icon: UserRoundCheck },
] as const;

export function MobileProfileSwitchBar({ preloadedProfile }: MobileProfileSwitchBarProps) {
    const profileData = usePreloadedQuery(preloadedProfile);

    const bookmarkCount = profileData.bookmarkCount;
    const articleCount = profileData.articleCount;
    const commentCount = profileData.commentCount;
    const followerCount = profileData.profile?.followerCount ?? 0;
    const followingCount = profileData.profile?.followingCount ?? 0;

    const counts: Record<ProfileMetricType, number> = {
        insights: articleCount,
        comments: commentCount,
        bookmarks: bookmarkCount,
        followers: followerCount,
        following: followingCount,
    };

    const selectedMetric = useProfileStore((state) => state.selectedMetric);
    const setSelectedMetric = useProfileStore((state) => state.setSelectedMetric);

    return (
        <div>
            <nav className="flex md:hidden flex-col w-full py-1.5 gap-2 sticky top-16 z-30 border-b">
                <SidebarMenu 
                    className={"flex w-full gap-1 flex-row items-center gap-2 overflow-x-auto no-scrollbar px-2 min-w-full"}
                >
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = selectedMetric === item.id;
                        const count = counts[item.id as ProfileMetricType];

                        return (
                            <SidebarMenuItem key={item.id} className="w-full">
                                <SidebarMenuButton
                                    isActive={isActive}
                                    onClick={() => setSelectedMetric(item.id as ProfileMetricType)}
                                    className={`
                                        group w-full !cursor-pointer justify-start px-2.5 py-1.5 rounded-lg text-lg transition-colors
                                        ${
                                            isActive 
                                            ? "bg-accent text-accent-foreground font-semibold" 
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50 dark:hover:bg-zinc-800/60 font-medium"
                                        }
                                    `}
                                >
                                    <Icon className="!size-5 stroke-[2.5]" />

                                    <span className="flex items-center gap-1">
                                        <span>{count}</span>
                                        <span>{item.label}</span>
                                    </span>
                                    
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </nav>
        </div>
    )
}