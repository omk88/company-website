"use client";

import { TrendingUp, Users2, Globe, Plus, Library } from "lucide-react";
import { Separator } from "../ui/separator";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarFooter, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
} from "../ui/sidebar";
import { SidebarSearch } from "./SidebarSearch";
import { SidebarSort } from "./SidebarSort";
import { SidebarTags } from "./SidebarTags";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSearchStore, FeedType } from "@/stores/useSearchStore";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { id: "all", label: "All Insights", icon: Library },
  { id: "popular", label: "Popular", icon: TrendingUp },
  { id: "team", label: "Team", icon: Users2 },
  { id: "community", label: "Community", icon: Globe },
];

export function LeftSidebar() {
  const feedType = useSearchStore((state) => state.feedType);
  const setFeedType = useSearchStore((state) => state.setFeedType);

  const router = useRouter();

  const userData = useQuery(api.auth.getCurrentUser);

  const handleCreatePostClick = () => {
    if (!userData) {
      toast.error("You must be logged in to create a post.", {
        action: {
          label: "Sign in",
          onClick: () => router.push("/sign-in"),
        },
      });
      return;
    }

    router.push("/create-blog");
  };

  return (
    <Sidebar 
      className="flex flex-col !top-16 !z-40 bg-white border-r"
      bgClass="bg-white" 
      collapsible="icon"
    >
      <SidebarContent className="!p-0 w-full">
        <SidebarGroup className="pt-3 !px-2 w-full">
          
          <SidebarMenu className="w-full flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = feedType === item.id;

              return (
                <SidebarMenuItem key={item.id} className="w-full">
                  <SidebarMenuButton
                    isActive={isActive}
                    onClick={() => setFeedType(item.id as FeedType)}
                    className={`
                      group w-full !cursor-pointer justify-start px-2.5 py-1.5 rounded-lg text-[13px] transition-colors
                      ${
                        isActive 
                          ? "bg-zinc-100 text-foreground font-semibold" 
                          : "text-zinc-600 hover:text-foreground hover:bg-zinc-50 font-medium"
                      }
                    `}
                  >
                    <Icon 
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive ? "text-foreground" : "text-zinc-500 group-hover:text-foreground"
                      }`} 
                    />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>

          <div className="flex flex-col py-2 gap-2.5 items-start w-full">
            <div className="w-full px-1 py-1">
              <Separator />
            </div>
            <SidebarSearch placeholder="insights" fullWidth={true} showDropdown={true} />
            <SidebarSort fullWidth={true} />
            <SidebarTags fullWidth={true} />

            <div className="w-full pt-2">
              <Button 
                className="w-full h-9 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-[13px] font-medium cursor-pointer flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                onClick={handleCreatePostClick}
              >
                <Plus className="w-4 h-4 shrink-0 stroke-[2.2]" />
                <span>Create a Post</span>
              </Button>
            </div>
          </div>

        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="hidden" />
    </Sidebar>
  );
}