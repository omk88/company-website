"use client";

import { useEffect, useState } from "react";
import { TabsSwitch, TabItem } from "@/components/web/TabsSwitch";
import { SidebarSort } from "./SidebarSort";
import { SidebarSearch } from "./SidebarSearch";
import { useLocalSearch } from "./SearchContext";
import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { Selector } from "./Selector";
import { ProfileBlogPosts } from "./ProfileBlogPosts";
import { ProfileComments } from "./ProfileComments";
import { Id } from "@/convex/_generated/dataModel";
import { SidebarTags } from "./SidebarTags";
import { DeleteBlogDialog } from "./DeleteBlogDialog";
import { DeleteCommentDialog } from "./DeleteCommentDialog";

interface ProfileContentWrapperProps {
  username: string;
  preloadedProfile: Preloaded<typeof api.profiles.getProfileByUsername>;
  preloadedCurrentUser: Preloaded<typeof api.auth.getCurrentUser>;
  preloadedInitialBlogs: Preloaded<typeof api.blogs.getPaginatedPostsByUsername>;
  preloadedInitialComments: Preloaded<typeof api.comments.getPaginatedCommentsByUsername>;
}

export function ProfileContentWrapper({ username, preloadedProfile, preloadedCurrentUser, preloadedInitialBlogs, preloadedInitialComments }: ProfileContentWrapperProps) {
  const [activeTab, setActiveTab] = useState("blog-articles"); 

  const [selectedBlogIds, setSelectedBlogIds] = useState<Id<"blogs">[]>([]);
  const [allBlogIds, setAllBlogIds] = useState<Id<"blogs">[]>([]);

  const [selectedCommentIds, setSelectedCommentIds] = useState<Id<"comments">[]>([]);
  const [allCommentIds, setAllCommentIds] = useState<Id<"comments">[]>([]);

  const { setSearchTerm, setSortOrder } = useLocalSearch();

  const currentUser = usePreloadedQuery(preloadedCurrentUser);
  const profileData = usePreloadedQuery(preloadedProfile);
  const profile = profileData.profile;

  const isOwnProfile = currentUser?.userId && profile?.userId && currentUser.userId === profile.userId;

  const isBlogTab = activeTab === "blog-articles";

  const currentSelectedIds = isBlogTab ? selectedBlogIds : selectedCommentIds;
  const currentAllIds = isBlogTab ? allBlogIds : allCommentIds;

  const isSomeSelected = currentSelectedIds.length > 0;
  const isAllSelected = currentAllIds.length > 0 && currentSelectedIds.length === currentAllIds.length;

  const handleToggleAll = (checked: boolean) => {
    if (isBlogTab) {
      setSelectedBlogIds(checked ? [...allBlogIds] : []);
    } else {
      setSelectedCommentIds(checked ? [...allCommentIds] : []);
    }
  }

  const tabs: TabItem[] = [
    { value: "blog-articles", label: "Blog Articles" },
    { value: "comments", label: "Comments" },
  ];

  useEffect(() => {
    setSearchTerm("");
    setSortOrder("new");
    setSelectedBlogIds([]);
    setSelectedCommentIds([]);
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

          {isOwnProfile && (
            isBlogTab ? (
              <Selector
                isAllSelected={isAllSelected}
                isSomeSelected={isSomeSelected}
                selectedIds={selectedBlogIds}
                onToggleAll={handleToggleAll}
                renderDeleteDialog={(ids, trigger) => (
                  <DeleteBlogDialog
                    blogIds={ids}
                    onSuccess={() => setSelectedBlogIds([])}
                    trigger={trigger}
                  />
                )}
              />
            ) : (
              <Selector
                isAllSelected={isAllSelected}
                isSomeSelected={isSomeSelected}
                selectedIds={selectedCommentIds}
                onToggleAll={handleToggleAll}
                renderDeleteDialog={(ids, trigger) => (
                  <DeleteCommentDialog
                    commentIds={ids}
                    onSuccess={() => setSelectedCommentIds([])}
                    trigger={trigger}
                  />
                )}
              />
            )
          )}
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
        {isBlogTab ? (
          <ProfileBlogPosts
            preloadedCurrentUser={preloadedCurrentUser}
            preloadedProfile={preloadedProfile}
            preloadedInitialBlogs={preloadedInitialBlogs}
            username={username}
            selectedIds={selectedBlogIds}
            setSelectedIds={setSelectedBlogIds}
            onLoadedIdsChange={setAllBlogIds}
          />
        ) : (
          <ProfileComments
            preloadedCurrentUser={preloadedCurrentUser}
            preloadedProfile={preloadedProfile}
            preloadedInitialComments={preloadedInitialComments}
            username={username}
            selectedIds={selectedCommentIds}
            setSelectedIds={setSelectedCommentIds}
            onLoadedIdsChange={setAllCommentIds}
          />
        )}
      </div>
    </div>
  );
}