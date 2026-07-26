"use client";

import { useEffect, useState } from "react";
import { TabsSwitch, TabItem } from "@/components/web/TabsSwitch";
import { SidebarSort } from "./SidebarSort";
import { SidebarSearch } from "./SidebarSearch";
import { useLocalSearch } from "./SearchContext";
import { api } from "@/convex/_generated/api";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { Selector } from "./Selector";
import { ProfileBlogPosts } from "./ProfileBlogPosts";
import { ProfileComments } from "./ProfileComments";
import { Id } from "@/convex/_generated/dataModel";
import { SidebarTags } from "./SidebarTags";

interface ProfileContentWrapperProps {
  username: string;
  preloadedProfile: Preloaded<typeof api.profiles.getProfileByUsername>;
  preloadedCurrentUser: Preloaded<typeof api.auth.getCurrentUser>;
  preloadedInitialBlogs: Preloaded<typeof api.blogs.getPaginatedPostsByUsername>;
  preloadedInitialComments: Preloaded<typeof api.comments.getPaginatedCommentsByUsername>;
}

export function ProfileContentWrapper({ username, preloadedProfile, preloadedCurrentUser, preloadedInitialBlogs, preloadedInitialComments }: ProfileContentWrapperProps) {
  const [activeTab, setActiveTab] = useState("blog-articles"); 
  const [selectedIds, setSelectedIds] = useState<Id<"blogs">[]>([]);
  const { setSearchTerm, setSortOrder } = useLocalSearch();

  const currentUser = usePreloadedQuery(preloadedCurrentUser);
  const profileData = usePreloadedQuery(preloadedProfile);
  const profile = profileData.profile;

  const isOwnProfile = currentUser?.userId && profile?.userId && currentUser.userId === profile.userId;

  const [allBlogIds, setAllBlogIds] = useState<Id<"blogs">[]>([]);

  const isSomeSelected = selectedIds.length > 0;
  const isAllSelected = allBlogIds.length > 0 && selectedIds.length === allBlogIds.length;

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds([...allBlogIds]);
    } else {
      setSelectedIds([]); 
    }
  };

  const tabs: TabItem[] = [
    { value: "blog-articles", label: "Blog Articles" },
    { value: "comments", label: "Comments" },
  ];

  useEffect(() => {
    setSearchTerm("");
    setSortOrder("new");
    setSelectedIds([]);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [activeTab, setSearchTerm, setSortOrder]);

  const searchPlaceholder = activeTab === "blog-articles" ? "insights" : "comments";

  return (
    <div className="mr-4">
      <div className="sticky top-16 z-10 bg-background gap-4 py-4 px-4 flex flex-row items-center justify-between w-full">

        <div className="flex flex-row items-center gap-2 shrink-0">
          <TabsSwitch 
            tabs={tabs} 
            value={activeTab} 
            onTabChange={setActiveTab} 
          />

          <Selector
            isAllSelected={isAllSelected}
            isSomeSelected={isSomeSelected}
            selectedIds={selectedIds}
            onToggleAll={handleToggleAll}
            onSuccess={() => setSelectedIds([])}
          />
        </div>

        <div className="flex flex-1 min-w-0 flex-row items-center justify-end gap-3">
          <div className="shrink-0">
            <SidebarTags />
          </div>

          <div className="shrink-0">
            <SidebarSort />
          </div>

          <div className="shrink-0 w-64">
            <SidebarSearch placeholder={searchPlaceholder} />
          </div>
        </div>

      </div>

      <div className="w-full px-4 mb-8">
        {activeTab === "blog-articles" && (
          <ProfileBlogPosts
            preloadedCurrentUser={preloadedCurrentUser}
            preloadedProfile={preloadedProfile}
            preloadedInitialBlogs={preloadedInitialBlogs}
            username={username}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            onLoadedIdsChange={setAllBlogIds}
          />
        )}
        
        {activeTab === "comments" && (
          <ProfileComments
            preloadedInitialComments={preloadedInitialComments}
            username={username}
          />
        )}
      </div>
    </div>
  );
}