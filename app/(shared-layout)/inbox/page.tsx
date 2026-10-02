"use client";

import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import LeftSidebarMessaging from "./_components/LeftSidebarMessaging";
import MessagingContent from "./_components/MessagingContent";
import RightSidebarMessaging from "./_components/RightSidebarMessaging";

export default function Messaging() {
  return (
    <div className="h-screen w-full overflow-hidden">
      <SidebarProvider className="flex-col md:flex-row h-full">
        <aside 
          className="hidden md:block shrink-0 h-full"
          style={{ "--sidebar-width": "15rem" } as React.CSSProperties}
        >
          <LeftSidebarMessaging />
        </aside>

        <div className="w-full min-w-0 flex flex-col flex-1 h-full overflow-hidden pt-16">
          <section 
            id="messaging-content-section" 
            className="w-full flex-1 flex flex-col h-full min-h-0 overflow-hidden bg-white dark:bg-zinc-950"
          >
            <div className="flex flex-col flex-1 h-full min-h-0 overflow-hidden">
              <MessagingContent />
            </div>
          </section>
        </div>

        <aside 
          className="hidden md:block shrink-0 h-full"
          style={{ "--sidebar-width": "12rem" } as React.CSSProperties}
        >
          <RightSidebarMessaging />
        </aside>
      </SidebarProvider>
    </div>
  );
}