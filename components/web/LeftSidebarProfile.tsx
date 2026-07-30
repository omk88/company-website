"use client";

import { Sidebar, SidebarContent, SidebarGroup, SidebarFooter, SidebarGroupLabel } from "../ui/sidebar";
import { Cake, ChartNoAxesColumn, GraduationCap, Library, MapPin, MessageSquareText, SquareLibrary, Terminal, ThumbsUp, User, Link } from "lucide-react";
import { EditProfileButton } from "./EditProfileButton";
import { ICON_MAP } from "@/lib/socials";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LinksHoverCard } from "./LinksHoverCard";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { SkillsHoverCard } from "./SkillsHoverCard";
import { EducationHoverCard } from "./EducationHoverCard";
import { FollowButton } from "./FollowButton";
import { FollowsDialog } from "./FollowsDialog";
import { useState } from "react";

interface profileProps {
  preloadedProfile: Preloaded<typeof api.profiles.getProfileByUsername>;
  preloadedCurrentUser: Preloaded<typeof api.auth.getCurrentUser>;
}

export function LeftSidebarProfile({ preloadedProfile, preloadedCurrentUser }: profileProps) {

  const [shouldPrefetchFollowers, setShouldPrefetchFollowers] = useState(false);
  
  const profileData = usePreloadedQuery(preloadedProfile);
  const currentUser = usePreloadedQuery(preloadedCurrentUser);

  const profile = profileData.profile;
  const avatarSrc = profileData.profilePicture;
  const defaultAvatarSrc = profileData.defaultProfilePicture;
  
  if (!profile) {
    return <div className="p-4 text-gray-500">Profile not found</div>;
  }

  const { username, firstName, lastName } = profile;
  const displayName = (firstName && lastName) ? `${firstName} ${lastName}` : username;
  const hasContent = profile.bio.trim() || profile.education.length > 0 || profile.socials.length > 0;

  const isOwnProfile = currentUser?.userId && profile?.userId && currentUser.userId === profile.userId;

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(profile._creationTime);

  return (
    <Sidebar 
      bgClass="bg-white" 
      className="flex flex-col !top-16 !z-40 overflow-hidden !p-0 bg-white"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <SidebarContent className="!p-0">
        <div className="p-2 pb-0">
          <div className="flex flex-row items-center gap-4 w-full">
            <div className="h-16 w-16 border-2 border-muted rounded-full overflow-hidden bg-muted relative shrink-0">
              <img
                src={avatarSrc || defaultAvatarSrc || ""}
                alt="profile"
                className="h-full w-full object-cover rounded-full"
                decoding="async" 
              />
            </div>

            <div className="relative w-full">
              <div className="flex flex-col">
                <h4 className="text-base font-semibold leading-none">{displayName}</h4>
                <p className="text-sm text-muted-foreground leading-none mt-1">{`@${profile.username}`}</p>
              </div>

              {isOwnProfile && (
                <div className="absolute right-0 top-0 flex items-center h-[1em]">
                  <EditProfileButton
                    profile={profile}
                    avatarSrc={avatarSrc || ""}
                    defaultAvatarSrc={defaultAvatarSrc || ""}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 gap-4 flex flex-col font-extralight text-sm font-mono tracking-tight select-none w-full">
              
          <div>
            <div className="flex items-start gap-1.5 min-w-[3rem] justify-start">
              <Cake className="w-4 h-4 stroke-[2.3] shrink-0" />
              <p>{ formattedDate }</p>
            </div>

            { profile.location && (
              <div className="flex items-start gap-1.5 min-w-[3rem] justify-start">
                <MapPin className="w-4 h-4 stroke-[2.3] shrink-0 mt-0.5" />
                <p>{ profile.location }</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between w-full px-12 -m-2">
            <FollowsDialog
              profileId={profile._id}
              onMouseEnter={() => setShouldPrefetchFollowers(true)}
              trigger={
                <div 
                  onMouseEnter={() => setShouldPrefetchFollowers(true)}
                  className="flex items-center gap-1.5 min-w-[3rem] justify-start p-2 rounded-2xl hover:bg-zinc-100 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 stroke-[2.3] shrink-0 mt-0.5" />
                  <span>{profile.followerCount}</span>
                </div>
              }
            />
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 min-w-[3rem] justify-start p-2 rounded-2xl hover:bg-zinc-100 transition-colors cursor-pointer">
                    <ThumbsUp className="w-4 h-4 stroke-[2.3] shrink-0" />
                    <span>{ profile.totalLikes }</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="center">
                  <p className="text-xs font-medium">{ profile.totalLikes } Total Likes</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 min-w-[3rem] justify-start p-2 rounded-2xl hover:bg-zinc-100 transition-colors cursor-pointer">
                    <Library className="w-4 h-4 stroke-[2.3] shrink-0" />
                    <span>{ profile.articlesPublished }</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="center">
                  <p className="text-xs font-medium">{ profile.articlesPublished } Insights Published</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 min-w-[3rem] justify-start p-2 rounded-2xl hover:bg-zinc-100 transition-colors cursor-pointer">
                    <MessageSquareText className="w-4 h-4 stroke-[2.3] shrink-0" />
                    <span>{ profile.commentsPublished }</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="center">
                  <p className="text-xs font-medium">{ profile.commentsPublished } Comments Published</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {profile.bio && (
            <div>
              <p>{ profile.bio }</p>
            </div>
          )}

          <div className="flex flex-row gap-4">
            {profile.socials.length > 0 && (
              <LinksHoverCard socials={profile.socials} />
            )}

            {profile.education.length > 0 && (
              <EducationHoverCard education={profile.education} />
            )}
            
            {profile.skills.length > 0 && (
              <SkillsHoverCard skills={profile.skills} />
            )}
          </div>
        </div>

        { currentUser && !isOwnProfile && (
          <FollowButton targetProfileId={profile._id} displayName={displayName} />
          )
        }

      </SidebarContent>
      <SidebarFooter className="hidden" />
    </Sidebar>
  );
}