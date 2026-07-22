"use client";

import { Sidebar, SidebarContent, SidebarGroup, SidebarFooter, SidebarGroupLabel } from "../ui/sidebar";
import { Cake, ChartNoAxesColumn, GraduationCap, Library, MapPin, MessageSquareText, SquareLibrary, Terminal, ThumbsUp, User } from "lucide-react";
import Link from "next/link";
import { EditProfileButton } from "./EditProfileButton";
import { ICON_MAP } from "@/lib/socials";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface profileProps {
  preloadedProfile: Preloaded<typeof api.profiles.getProfileByUsername>;
  preloadedCurrentUser: Preloaded<typeof api.auth.getCurrentUser>;
}

export function LeftSidebarProfile({ preloadedProfile, preloadedCurrentUser }: profileProps) {

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

  const isOwnProfile = 
    currentUser?.userId && 
    profile?.userId && 
    currentUser.userId === profile.userId;

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(profile._creationTime);

  return (
    <Sidebar 
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

        <div className="p-4 gap-6 flex flex-col font-extralight text-sm font-mono tracking-tight select-none w-full mt-auto">
          <div className="flex items-center justify-between w-full px-12">
            <div className="flex items-center gap-1.5 min-w-[3rem] justify-start">
              <User className="w-4 h-4 stroke-[2.3] shrink-0" />
              <span>{10}</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-[3rem] justify-start">
              <ThumbsUp className="w-4 h-4 stroke-[2.3] shrink-0" />
              <span>{23}</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-[3rem] justify-start">
              <Library className="w-4 h-4 stroke-[2.3] shrink-0" />
              <span>{75}</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-[3rem] justify-start">
              <MessageSquareText className="w-4 h-4 stroke-[2.3] shrink-0" />
              <span>{12}</span>
            </div>
          </div>

          <div>
            <p>-Masters in Adult Education & Masters in Human Relations. -Hall of Fame College Policy Debater -2X NAACP Award Nominee -Public Education is retreating. I'm filling the void. Teaching the histories, frameworks, & knowledge they're erasing.</p>
          </div>
        </div>

        {profile.skills?.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="w-full justify-center mb-1 mt-50">
              <h1 className="flex items-center justify-center gap-2 text-sm font-medium text-foreground">
                <Terminal className="w-4 h-4 stroke-[2.3] shrink-0" />
                <span>Skills/Languages</span>
              </h1>
            </SidebarGroupLabel>
            <div className="flex flex-col bg-muted rounded-sm p-3 gap-3">
              <div className="flex flex-col items-start gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                {profile.skills.map((skill, index) => (
                  <div key={index}>• {skill}</div>
                ))}
              </div>
            </div>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="w-full justify-center mb-1">
            <h1 className="flex items-center justify-center gap-2 text-sm font-medium text-foreground">
              <ChartNoAxesColumn className="w-4 h-4 stroke-[2.3] shrink-0" />
              <span>Metrics</span>
            </h1>
          </SidebarGroupLabel>
          <div className="flex flex-col bg-muted rounded-sm p-3 gap-3">
            <div className="flex flex-col items-start gap-2.5">
              <div className="flex flex-row items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                <Cake className="h-4 w-4 shrink-0" />
                <h1>{formattedDate}</h1>
              </div>
              <div className="flex flex-row items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                <ThumbsUp className="h-4 w-4 shrink-0" />
                <h1>{profile.totalLikes} Total Likes</h1>
              </div>
              <div className="flex flex-row items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                <SquareLibrary className="h-4 w-4 shrink-0" />
                <h1>{profile.articlesPublished} Insights Published</h1>
              </div>
              <div className="flex flex-row items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                <MessageSquareText className="h-4 w-4 shrink-0" />
                <h2>{profile.commentsPublished} Comments Written</h2>
              </div>
            </div>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="hidden" />
    </Sidebar>
  );
}