"use client";

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { NavItem } from "@/components/web/SidebarNav";
import { Id } from "@/convex/_generated/dataModel";
import { useMessageStore } from "@/stores/useMessageStore";
import { Trash2 } from "lucide-react";
import { DeleteConversationDialog } from "./DeleteConversationDialog";

type MessagingNavItem = NavItem & {
  requiresConversation?: boolean;
};

const NAV_ITEMS: MessagingNavItem[] = [
  { id: "delete", label: "Delete Conversation", icon: Trash2, requiresConversation: true },
];

export default function RightSidebarMessaging() {
  const conversationId = useMessageStore((state) => state.activeConversationId) as Id<"conversations"> | null;

  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (item.requiresConversation && !conversationId) {
      return false;
    }
    return true;
  });

  return (
    <Sidebar
      side="right"
      className="hidden md:flex flex-col !top-16 !z-40 border-r"
      bgClass="bg-background/95" 
      collapsible="icon"
    >
      <SidebarContent className="!p-0 w-full overflow-x-hidden">
        <SidebarGroup className="pt-3 !px-2 w-full flex flex-col">
          <SidebarMenu className="flex w-full gap-1 flex-col gap-0.5">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;

              if (item.id === "delete" && conversationId) {
                return (
                  <SidebarMenuItem key={item.id} className="w-full">
                    <DeleteConversationDialog
                      conversationId={conversationId}
                      onSuccess={() => {}}
                      trigger={
                        <SidebarMenuButton
                          className="group !cursor-pointer justify-start px-2.5 py-1.5 rounded-lg text-lg md:text-sm transition-colors"
                        >
                          <Icon className="h-4 w-4 shrink-0 stroke-[2.5] transition-colors" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      }
                    />
                  </SidebarMenuItem>
                );
              }

              return (
                <SidebarMenuItem key={item.id} className="w-full">
                  <SidebarMenuButton
                    className="group !cursor-pointer justify-start px-2.5 py-1.5 rounded-lg text-lg md:text-sm transition-colors"
                  >
                    <Icon className="h-4 w-4 shrink-0 stroke-[2.5] transition-colors" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="hidden" />
    </Sidebar>
  );
}