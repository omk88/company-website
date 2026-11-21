"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useLibraryStore, LibraryMetricType } from "@/stores/useLibraryStore";

import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarFooter 
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

import { GraduationCap } from "lucide-react";
import { useCurrentUser } from "@/app/ConvexClientProvider";

interface LeftSidebarLibraryProps {
  preloadedProfile: Preloaded<typeof api.profiles.getProfileByUsername>;
}

const NAV_ITEMS = [
  { id: "courses", label: "Courses", icon: GraduationCap },
] as const;

export function LeftSidebarLibrary({ preloadedProfile }: LeftSidebarLibraryProps) {
  const profileData = usePreloadedQuery(preloadedProfile);

  const coursesCount = profileData.bookmarkCount;

  const counts: Record<LibraryMetricType, number> = {
    courses: coursesCount,
  };

  const selectedMetric = useLibraryStore((state) => state.selectedMetric);
  const setSelectedMetric = useLibraryStore((state) => state.setSelectedMetric);

  const currentUser = useCurrentUser();
  const isOwnProfile = Boolean(currentUser?.userId && profileData.profile?.userId && currentUser.userId === profileData.profile.userId);

  const buttonStyleClass = "group !cursor-pointer justify-start px-2.5 py-1.5 rounded-lg text-lg md:text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 transition-colors w-full";

  return (
    <Sidebar 
      className="flex flex-col !top-16 !z-40 border-r"
      bgClass="bg-background/95" 
      collapsible="icon"
    >
      <SidebarContent className="!p-0 w-full">
        <SidebarGroup className="pt-3 !px-2 w-full">
          
          <SidebarMenu className="w-full flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = selectedMetric === item.id;
              const count = counts[item.id as LibraryMetricType];

              return (
                <SidebarMenuItem key={item.id} className="w-full">
                  <SidebarMenuButton
                    isActive={isActive}
                    onClick={() => setSelectedMetric(item.id as LibraryMetricType)}
                    className={`
                      group w-full !cursor-pointer justify-start px-2.5 py-1.5 rounded-lg text-[13px] transition-colors
                      ${
                        isActive 
                          ? "bg-accent text-accent-foreground font-semibold" 
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50 dark:hover:bg-zinc-800/60 font-medium"
                      }
                    `}
                  >
                    <Icon className="h-4 w-4 shrink-0 stroke-[2.5] transition-colors" />
                    
                    <span className="flex items-center gap-1">
                      <span>{count}</span>
                      <span>{item.label}</span>
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>

          <div className="flex flex-col py-2 gap-2.5 items-start w-full">
            <div className="w-full px-1 py-1">
              <Separator />
            </div>
          </div>

        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="hidden" />
    </Sidebar>
  );
}