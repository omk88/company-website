"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TabsSwitch() {

    const [activeTab, setActiveTab] = useState("team");

    const handleTabChange = (value: string) => {
        setActiveTab(value);
    };
    
    return (
        <div className="p-4">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="flex w-max gap-1 p-1">
                <TabsTrigger value="team" className="flex items-center gap-1.5 px-4 whitespace-nowrap">
                <span>Team</span>
                </TabsTrigger>
                
                <TabsTrigger value="community" className="flex items-center gap-1.5 px-4 whitespace-nowrap">
                <span>Community</span>
                </TabsTrigger>
            </TabsList>
            </Tabs>
        </div>
    )
}