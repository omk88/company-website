"use client";

import { useEffect, useState } from "react";
import { TabsSwitch, TabItem } from "@/components/web/TabsSwitch";
import { SidebarSort } from "./SidebarSort";
import { SidebarSearch } from "./SidebarSearch";
import { useLocalSearch } from "./SearchContext";

interface ProfileContentWrapperProps {
  blogsSlot: React.ReactNode;
  commentsSlot: React.ReactNode;
}

export function ProfileContentWrapper({ commentsSlot, blogsSlot }: ProfileContentWrapperProps) {
  const [activeTab, setActiveTab] = useState("blog-articles"); 
  const { setSearchTerm, setSortOrder } = useLocalSearch();

  const tabs: TabItem[] = [
    { value: "blog-articles", label: "Blog Articles" },
    { value: "comments", label: "Comments" },
  ];

  useEffect(() => {
    setSearchTerm("");
    setSortOrder("new");
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [activeTab, setSearchTerm, setSortOrder]);

  const searchPlaceholder = activeTab === "blog-articles" ? "insights" : "comments";

  return (
    <div className="mr-4">
      <div className="sticky top-16 z-10 bg-background gap-4 py-4 px-4 flex flex-row items-center justify-between w-full">

        <TabsSwitch 
          tabs={tabs} 
          value={activeTab} 
          onTabChange={setActiveTab} 
        />

        <div className="flex flex-row w-1/2 justify-end gap-4">
          <div>
            <SidebarSort />
          </div>

          <div>
            <SidebarSearch placeholder={searchPlaceholder} />
          </div>
        </div>
      </div>

      <div className="w-full px-4 mb-8">
        {activeTab === "blog-articles" && blogsSlot}
        
        {activeTab === "comments" && commentsSlot}
      </div>
    </div>
  );
}