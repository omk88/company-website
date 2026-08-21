"use client";

import { useState } from "react";
import { Sidebar, SidebarContent, SidebarFooter } from "../ui/sidebar";
import { 
  Cake, 
  Library, 
  MapPin, 
  MessageSquareText, 
  Zap, 
  Bookmark, 
  GraduationCap, 
  UserRound, 
  Wrench,
  Globe,
  Link as LinkIcon
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
import { useMetricStore } from "@/stores/useMetricStore";
import { ProfileSettingsButton } from "./ProfileSettingsButton";
import Link from "next/link";

interface LeftSidebarProfileProps {
  preloadedProfile: Preloaded<typeof api.profiles.getProfileByUsername>;
  preloadedCurrentUser: Preloaded<typeof api.auth.getCurrentUser>;
}

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

export function LeftSidebarProfile({ preloadedProfile, preloadedCurrentUser }: LeftSidebarProfileProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const profileData = usePreloadedQuery(preloadedProfile);
  const currentUser = usePreloadedQuery(preloadedCurrentUser);

  const profile = profileData.profile;
  const avatarSrc = profileData.profilePicture;
  const defaultAvatarSrc = profileData.defaultProfilePicture;

  const bookmarkCount = profileData.bookmarkCount;
  const articleCount = profileData.articleCount;
  const commentCount = profileData.commentCount;

  const isFollowing = profileData.viewerStatus.isFollowing;
  const isBell = profileData.viewerStatus.isBell;
  const isSelf = profileData.viewerStatus.isSelf;

  const anim = "relative no-underline hover:no-underline after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100";

  const selectedMetric = useMetricStore((state) => state.selectedMetric);
  const setSelectedMetric = useMetricStore((state) => state.setSelectedMetric);
  
  if (!profile) {
    return <div className="p-4 text-gray-500">Profile not found</div>;
  }

  const { username, displayName } = profile;
  const isOwnProfile = currentUser?.userId && profile?.userId && currentUser.userId === profile.userId;

  const additionalSocials = profile.socials?.slice(1) ?? [];
  const hasEducation = Boolean(profile.education && profile.education.length > 0);
  const hasSkills = Boolean(profile.skills && profile.skills.length > 0);
  const hasExtraSocials = additionalSocials.length > 0;

  const hasExpandableContent = hasEducation || hasSkills || hasExtraSocials;

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(profile._creationTime);

  return (
    <div>
      <Sidebar
        side="right" 
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
                <div className="flex flex-col w-full">
                  <h4 className="text-base font-semibold text-foreground tracking-tight">
                    {displayName || profile.username}
                  </h4>

                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm text-muted-foreground">{`@${profile.username}`}</p>

                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="inline-flex items-center gap-1 text-xs font-sans font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 cursor-help select-none">
                            <Zap className="w-3 h-3 fill-amber-500 stroke-amber-500 shrink-0" />
                            <span>{profile.totalLikes ?? 0}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" align="start">
                          <p className="text-xs font-medium">{profile.totalLikes} Total Likes</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {isOwnProfile && (
                  <div className="flex flex-row absolute right-0 top-0 items-center h-[1em]">
                    <ProfileSettingsButton />
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

          <div className="p-4 gap-4 flex flex-col text-sm font-sans tracking-tight w-full">
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

            {!isSelf && (
              <FollowButton
                targetProfileId={profile._id}
                displayName={displayName}
                username={profile.username}
                initialIsFollowing={isFollowing}
                initialIsBell={isBell}
              />
            )}

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
                          <div className="flex items-center gap-1.5 text-xs" key={index}>
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
                          <div className="flex items-start gap-1.5 text-xs text-muted-foreground" key={index}>
                            <GraduationCap className="w-4 h-4 stroke-[2.3] shrink-0 text-foreground mt-0.5" />
                            <div>
                              <p className="font-medium text-foreground">{item.degree} in {item.subject}</p>
                              <p>{item.institution}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {hasSkills && (
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                          <Wrench className="w-4 h-4 stroke-[2.3] shrink-0" />
                          <span>Skills</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {profile.skills?.map((skill, index) => (
                            <span 
                              key={index} 
                              className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-start gap-4 w-full border-b border-border">
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setSelectedMetric('insights')}
                        className={cn(
                          "flex items-center gap-1.5 pb-2 pt-1.5 px-1 font-sans text-sm font-medium transition-colors cursor-pointer text-foreground hover:opacity-70",
                          anim,
                          selectedMetric === 'insights' && "after:scale-x-100 after:origin-bottom-left"
                        )}
                      >
                        <Library className="w-4 h-4 stroke-[2.3] shrink-0" />
                        <span>{articleCount}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="center">
                      <p className="text-xs font-medium">{articleCount} Insights Published</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setSelectedMetric('comments')}
                        className={cn(
                          "flex items-center gap-1.5 pb-2 pt-1.5 px-1 font-sans text-sm font-medium transition-colors cursor-pointer text-foreground hover:opacity-70",
                          anim,
                          selectedMetric === 'comments' && "after:scale-x-100 after:origin-bottom-left"
                        )}
                      >
                        <MessageSquareText className="w-4 h-4 stroke-[2.3] shrink-0" />
                        <span>{commentCount}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="center">
                      <p className="text-xs font-medium">{commentCount} Comments Published</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setSelectedMetric('bookmarks')}
                        className={cn(
                          "flex items-center gap-1.5 pb-2 pt-1.5 px-1 font-sans text-sm font-medium transition-colors cursor-pointer text-foreground hover:opacity-70",
                          anim,
                          selectedMetric === 'bookmarks' && "after:scale-x-100 after:origin-bottom-left"
                        )}
                      >
                        <Bookmark className="w-4 h-4 stroke-[2.3] shrink-0" />
                        <span>{bookmarkCount}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="center">
                      <p className="text-xs font-medium">{bookmarkCount} Bookmarks</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setSelectedMetric('followers')}
                        className={cn(
                          "flex items-center gap-1.5 pb-2 pt-1.5 px-1 font-sans text-sm font-medium transition-colors cursor-pointer text-foreground hover:opacity-70",
                          anim,
                          selectedMetric === 'followers' && "after:scale-x-100 after:origin-bottom-left"
                        )}
                      >
                        <UserRound className="w-4 h-4 stroke-[2.3] shrink-0" />
                        <span>{profile.followerCount}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="center">
                      <p className="text-xs font-medium">{profile.followerCount} Followers</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

        </SidebarContent>
        <SidebarFooter className="hidden" />
      </Sidebar>
    </div>

  );
}