"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "../ui/sidebar";
import { useSearchStore, FeedType } from "@/stores/useSearchStore";
import { LucideIcon, Users2, Globe, Library, UserRoundCheck } from "lucide-react";
import { useCurrentUser } from "@/app/ConvexClientProvider";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  requiresAuth?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: "all", label: "All Insights", icon: Library },
  { id: "feed", label: "My Feed", icon: UserRoundCheck, requiresAuth: true },
  { id: "team", label: "Team", icon: Users2 },
  { id: "community", label: "Community", icon: Globe },
];

export function SidebarNav() {
  const router = useRouter();
  const feedType = useSearchStore((state) => state.feedType);
  const setFeedType = useSearchStore((state) => state.setFeedType);

  const currentUser = useCurrentUser();

  const handleNavClick = (item: NavItem) => {
    if (item.requiresAuth && !currentUser) {
      toast.error("You must be logged in to view your feed.", {
        action: {
          label: "Sign in",
          onClick: () => router.push("/sign-in"),
        },
      });
      return;
    }

    setFeedType(item.id as FeedType);
  };

  return (
    <SidebarMenu className="w-full flex flex-col gap-0.5">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = feedType === item.id;

        return (
          <SidebarMenuItem key={item.id} className="w-full">
            <SidebarMenuButton
              isActive={isActive}
              onClick={() => handleNavClick(item)}
              className={`
                group w-full !cursor-pointer justify-start px-2.5 py-1.5 rounded-lg text-[13px] transition-colors
                ${
                  isActive
                    ? "bg-zinc-100 text-foreground font-semibold"
                    : "text-zinc-600 hover:text-foreground hover:bg-zinc-50 font-medium"
                }
              `}
            >
              <Icon className="h-4 w-4 shrink-0 stroke-[2.5] transition-colors currentColor" />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}