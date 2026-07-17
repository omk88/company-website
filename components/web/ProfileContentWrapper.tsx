"use client";

import { useState } from "react";
import { TabsSwitch, TabItem } from "@/components/web/TabsSwitch";
import { CommentsContainer } from "./CommentsContainer";

interface ProfileContentWrapperProps {
  
}

export function ProfileContentWrapper({  }: ProfileContentWrapperProps) {
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
      <div className="pl-4 pr-4">
        {activeTab === "blog-articles" && ""}
        
        {activeTab === "comments" && (
          <div className="text-gray-500 text-center">
          </div>
        )}
      </div>
    </>
  );
}