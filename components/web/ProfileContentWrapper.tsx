"use client";

import { useEffect, useState } from "react";
import { TabsSwitch, TabItem } from "@/components/web/TabsSwitch";
import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { useLocalSearch } from "./SearchContext";
import { SidebarSort } from "./SidebarSort";
import { SidebarSearch } from "./SidebarSearch";

interface ProfileContentWrapperProps {
  blogsSlot: React.ReactNode;
  commentsSlot: React.ReactNode;
}

export function ProfileContentWrapper({ commentsSlot, blogsSlot }: ProfileContentWrapperProps) {
  const [activeTab, setActiveTab] = useState("blog-articles");

  const { searchTerm, setSearchTerm } = useLocalSearch();
  const [localValue, setLocalValue] = useState(searchTerm);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(localValue);
    }, 200);
  
      return () => clearTimeout(timer);
    }, [localValue, setSearchTerm]);
  
  useEffect(() => {
    setLocalValue(searchTerm);
  }, [searchTerm]);

  const tabs: TabItem[] = [
    { value: "blog-articles", label: "Blog Articles" },
    { value: "comments", label: "Comments" },
  ];

  return (
    <>
      <div className="gap-4 pr-4 flex flex-row items-center justify-between w-full">

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
            <SidebarSearch />
          </div>
        </div>
      </div>

      <div className="w-full pl-4 pr-4">
        {activeTab === "blog-articles" && blogsSlot}
        
        {activeTab === "comments" && commentsSlot}
      </div>
    </>
  );
}