"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sidebar, SidebarContent, SidebarFooter } from "../ui/sidebar";
import { 
  Cake, 
  MapPin, 
  Zap, 
  GraduationCap, 
  Wrench,
  Globe,
  Link as LinkIcon,
} from "lucide-react";
import { 
  FaInstagram, 
  FaXTwitter, 
  FaLinkedin, 
  FaGithub, 
  FaYoutube 
} from "react-icons/fa6";
import { EditProfileButton } from "./EditProfileButton";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { FollowButton } from "./FollowButton";
import { cn } from "@/lib/utils";
import { ProfileSettingsButton } from "./ProfileSettingsButton";
import { Badge } from "../ui/badge";

interface RightSidebarProfileProps {
  preloadedProfile: Preloaded<typeof api.profiles.getProfileByUsername>;
  preloadedCurrentUser: Preloaded<typeof api.auth.getCurrentUser>;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function SocialPlatformIcon({ platform, className }: { platform?: string; className?: string }) {
  const normalized = platform?.toLowerCase().trim();

  switch (normalized) {
    case "instagram":
      return <FaInstagram className={className} />;
    case "twitter":
    case "x":
      return <FaXTwitter className={className} />;
    case "linkedin":
      return <FaLinkedin className={className} />;
    case "github":
      return <FaGithub className={className} />;
    case "youtube":
      return <FaYoutube className={className} />;
    default:
      return <Globe className={className} />;
  }
}

export function RightSidebarProfile({ preloadedProfile, preloadedCurrentUser }: RightSidebarProfileProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const profileData = usePreloadedQuery(preloadedProfile);
  const currentUser = usePreloadedQuery(preloadedCurrentUser);

  const profile = profileData.profile;
  const avatarSrc = profileData.profilePicture;
  const defaultAvatarSrc = profileData.defaultProfilePicture;

  console.log("Resolved Storage URLs:", { avatarSrc, defaultAvatarSrc });

  const displayAvatar = avatarSrc || defaultAvatarSrc;

  const isFollowing = profileData.viewerStatus.isFollowing;
  const isBell = profileData.viewerStatus.isBell;
  const isSelf = profileData.viewerStatus.isSelf;
  
  if (!profile) {
    return <div className="p-4 text-gray-500">Profile not found</div>;
  }

  const { displayName } = profile;
  const isOwnProfile = Boolean(currentUser?.userId && profile?.userId && currentUser.userId === profile.userId);

  const additionalSocials = profile.socials?.slice(1) ?? [];
  const hasEducation = Boolean(profile.education && profile.education.length > 0);
  const hasSkills = Boolean(profile.skills && profile.skills.length > 0);
  const hasExtraSocials = additionalSocials.length > 0;

  const hasExpandableContent = hasEducation || hasSkills || hasExtraSocials;
  const formattedDate = dateFormatter.format(profile._creationTime);

  return (
    <Sidebar
      side="right" 
      bgClass="bg-white" 
      className="flex flex-col !top-16 !z-40 overflow-hidden !p-0 bg-white"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <SidebarContent className="!p-0 bg-white">
        <div className="relative m-3 p-3 rounded-xl bg-zinc-50/80">

          <div className="p-2 pb-0">
            <div className="flex flex-row items-center gap-4 w-full">
              <div className="relative h-16 w-16 shrink-0 rounded-full overflow-hidden border-2 border-muted bg-muted">
                {displayAvatar ? (
                  <Image
                    src={displayAvatar}
                    alt={`${displayName || profile.username}'s avatar`}
                    fill
                    sizes="64px"
                    priority
                    className="object-cover rounded-full"
                    unoptimized
                  />
                ) : (
                  <div className="h-full w-full bg-zinc-200" />
                )}
              </div>

              <div className="flex flex-row justify-between w-full">
                <div className="flex flex-col w-full">
                  <h4 className="text-base font-semibold text-foreground tracking-tight">
                    {displayName || profile.username}
                  </h4>

                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm text-muted-foreground">{`@${profile.username}`}</p>
                  </div>
                </div>

                {isOwnProfile && (
                  <div className="flex items-center z-10">
                    <ProfileSettingsButton />
                    <EditProfileButton
                      profile={profile}
                      avatarSrc={avatarSrc || ""}
                      defaultAvatarSrc={defaultAvatarSrc || ""}
                    />
                  </div>
                )}

                {!isSelf && (
                  <FollowButton
                    userId={profile.userId}
                    displayName={displayName}
                    username={profile.username}
                    initialIsFollowing={isFollowing}
                    initialIsBell={isBell}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="p-2 pt-4 gap-4 flex flex-col text-sm font-sans tracking-tight w-full">
            
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-flex w-fit items-center gap-1 text-xs font-sans font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 cursor-help select-none">
                    <Zap className="w-3 h-3 fill-amber-500 stroke-amber-500 shrink-0" />
                    <span>{profile.totalLikes ?? 0}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="start">
                  <p className="text-xs font-medium">{profile.totalLikes} Total Likes</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {profile.bio && (
              <div>
                <span>{profile.bio}</span>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 min-w-[3rem] justify-start">
                <Cake className="w-4 h-4 stroke-[2.3] shrink-0" />
                <p>{formattedDate}</p>
              </div>

              {profile.location && (
                <div className="flex items-center gap-1.5 min-w-[3rem] justify-start">
                  <MapPin className="w-4 h-4 stroke-[2.3] shrink-0" />
                  <p>{profile.location}</p>
                </div>
              )}

              {profile.socials && profile.socials.length > 0 && (
                <div className="flex items-center gap-1.5 min-w-[3rem] justify-start">
                  <LinkIcon className="w-4 h-4 stroke-[2.3] shrink-0 text-foreground" />
                  <Link 
                    href={profile.socials[0].url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="underline text-blue-600 break-all"
                  >
                    {profile.socials[0].url}
                  </Link>
                </div>
              )}
            </div>

            {hasExpandableContent && (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpanded((prev) => !prev)}
                  className="text-sm font-medium text-left cursor-pointer hover:text-blue-600 transition-colors w-fit"
                >
                  {isExpanded ? "Show less" : "Read more"}
                </button>

                <div
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isExpanded ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden flex flex-col gap-3">
                    {hasExtraSocials && (
                      <div className="flex flex-col gap-1.5">
                        {additionalSocials.map((social, index) => (
                          <div className="flex items-center gap-1.5 text-sm" key={index}>
                            <SocialPlatformIcon 
                              platform={social.platform} 
                              className="w-4 h-4 shrink-0 text-foreground" 
                            />
                            <Link 
                              href={social.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="underline text-blue-600 break-all"
                            >
                              {social.url}
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}

                    {hasEducation && (
                      <div className="flex flex-col gap-2">
                        {profile.education?.map((item, index) => (
                          <div className="flex items-start gap-1.5 text-sm text-muted-foreground" key={index}>
                            <GraduationCap className="w-4 h-4 stroke-[2.3] shrink-0 text-foreground mt-0.5" />
                            <div>
                              <p className="text-foreground">{item.degree} in {item.subject}</p>
                              <p>{item.institution}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {hasSkills && (
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                          <Wrench className="w-4 h-4 stroke-[2.3] shrink-0" />
                          <span>Skills</span>
                        </div>

                        <div className="flex flex-wrap gap-2 items-center">
                          {profile.skills?.map((skill, index) => (
                            <Badge 
                              key={skill} 
                              variant="outline" 
                              className="font-mono text-[10px] px-1.5 py-0.5 whitespace-nowrap border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                            >
                              <span className="capitalize">{skill}</span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarContent>
      <SidebarFooter className="hidden" />
    </Sidebar>
  );
}