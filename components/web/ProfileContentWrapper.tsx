"use client";

import { useState } from "react";
import { TabsSwitch, TabItem } from "@/components/web/TabsSwitch";

interface ProfileContentWrapperProps {
  blogsSlot: React.ReactNode;
  commentsSlot: React.ReactNode;
}

export function ProfileContentWrapper({ commentsSlot, blogsSlot }: ProfileContentWrapperProps) {
  const [activeTab, setActiveTab] = useState("blog-articles");

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
      <div className="w-full pl-4 pr-4">
        {activeTab === "blog-articles" && blogsSlot}
        
        {activeTab === "comments" && commentsSlot}
      </div>
    </>
  );
}