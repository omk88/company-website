"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface TabItem {
  value: string;
  label: string;
}

interface TabsSwitchProps {
  tabs: TabItem[];
  defaultValue?: string;
  onTabChange?: (value: string) => void;
}

export function TabsSwitch({ tabs, defaultValue, onTabChange }: TabsSwitchProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0]?.value || "");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (onTabChange) {
      onTabChange(value); 
    }
  };

  if (tabs.length === 0) return null;

  return (
    <div className="p-4">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="flex w-max gap-1 p-1">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-1.5 px-4 whitespace-nowrap"
            >
              <span>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}