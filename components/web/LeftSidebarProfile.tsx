"use client";

import { useRouter } from "next/navigation";
import { Preloaded, usePreloadedQuery, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useProfileStore, ProfileMetricType } from "@/stores/useProfileStore";

import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarFooter 
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarSearch } from "@/components/web/SidebarSearch";
import { SidebarSort } from "@/components/web/SidebarSort";
import { SidebarTags } from "@/components/web/SidebarTags";

import { Library, MessageSquareText, Bookmark, UsersRound, Plus } from "lucide-react";

interface LeftSidebarProfileProps {
  preloadedProfile: Preloaded<typeof api.profiles.getProfileByUsername>;
  preloadedCurrentUser: Preloaded<typeof api.auth.getCurrentUser>;
}

const NAV_ITEMS = [
  { id: "insights", label: "Insights", icon: Library },
  { id: "comments", label: "Comments", icon: MessageSquareText },
  { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
  { id: "followers", label: "Followers", icon: UsersRound },
] as const;

export function LeftSidebarProfile({ preloadedProfile, preloadedCurrentUser }: LeftSidebarProfileProps) {
  const profileData = usePreloadedQuery(preloadedProfile);
  const currentUser = usePreloadedQuery(preloadedCurrentUser);

  const bookmarkCount = profileData.bookmarkCount ?? 0;
  const articleCount = profileData.articleCount ?? 0;
  const commentCount = profileData.commentCount ?? 0;
  const followerCount = profileData.profile?.followerCount ?? 0;

  const counts: Record<ProfileMetricType, number> = {
    insights: articleCount,
    comments: commentCount,
    bookmarks: bookmarkCount,
    followers: followerCount,
  };

  const selectedMetric = useProfileStore((state) => state.selectedMetric);
  const setSelectedMetric = useProfileStore((state) => state.setSelectedMetric);

  const router = useRouter();
  const userData = useQuery(api.auth.getCurrentUser);

  const handleCreatePostClick = () => {
    if (!userData) {
      toast.error("You must be logged in to create a post.", {
        action: {
          label: "Sign in",
          onClick: () => router.push("/sign-in"),
        },
      });
      return;
    }

    router.push("/create-blog");
  };

  return (
    <Sidebar 
      className="flex flex-col !top-16 !z-40 bg-white border-r"
      bgClass="bg-white" 
      collapsible="icon"
    >
      <SidebarContent className="!p-0 w-full bg-white">
        <SidebarGroup className="pt-3 !px-2 w-full">
          
          <SidebarMenu className="w-full flex flex-col gap-0.5">
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
                      group w-full !cursor-pointer justify-start px-2.5 py-1.5 rounded-lg text-[13px] transition-colors
                      ${
                        isActive 
                          ? "bg-zinc-100 text-foreground font-semibold" 
                          : "text-zinc-600 hover:text-foreground hover:bg-zinc-50 font-medium"
                      }
                    `}
                  >
                    <Icon 
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive ? "text-foreground" : "text-zinc-500 group-hover:text-foreground"
                      }`} 
                    />
                    
                    <span className="flex items-center gap-1">
                      <span className={isActive ? "text-foreground font-semibold" : "text-zinc-500 group-hover:text-foreground"}>
                        {count}
                      </span>
                      <span>{item.label}</span>
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>

          <div className="flex flex-col py-2 gap-2.5 items-start w-full">
            <div className="w-full px-1 py-1">
              <Separator />
            </div>
            <SidebarSearch placeholder="insights" fullWidth={true} showDropdown={true} />
            <SidebarSort fullWidth={true} />
            <SidebarTags fullWidth={true} />

            <div className="w-full pt-2">
              <Button 
                className="w-full h-9 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-[13px] font-medium cursor-pointer flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                onClick={handleCreatePostClick}
              >
                <Plus className="w-4 h-4 shrink-0 stroke-[2.2]" />
                <span>Create a Post</span>
              </Button>
            </div>
          </div>

        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="hidden" />
    </Sidebar>
  );
}