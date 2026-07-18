"use client";

import { useState } from "react";
import { TabsSwitch, TabItem } from "@/components/web/TabsSwitch";
import { CommentsContainer } from "./CommentsContainer";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface ProfileContentWrapperProps {
  blogGridSlot: React.ReactNode;
  preloadedProfile: Preloaded<typeof api.profiles.getProfileByUsername>;
}

export function ProfileContentWrapper({ blogGridSlot, preloadedProfile }: ProfileContentWrapperProps) {
  const [activeTab, setActiveTab] = useState("blog-articles");

  const profileData = usePreloadedQuery(preloadedProfile);

  const tabs: TabItem[] = [
    { value: "blog-articles", label: "Blog Articles" },
    { value: "comments", label: "Comments" },
  ];

  return (
    <>
      <div>
        <TabsSwitch 
          tabs={tabs} 
          value={activeTab} 
          onTabChange={setActiveTab} 
        />
      </div>
      <div className="pl-4 pr-4">
        {activeTab === "blog-articles" && blogGridSlot}
        
        {activeTab === "comments" && profileData.profile?._id && (
          <div className="text-gray-500 text-center">
            <CommentsContainer authorId={profileData.profile?._id} />
          </div>
        )}
      </div>
    </>
  );
}