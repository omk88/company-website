"use client";

import { FollowButton } from "@/components/web/FollowButton";
import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { Cake, Globe, GraduationCap, MapPin, Wrench, Zap } from "lucide-react";
import Image from "next/image"
import { useState } from "react";
import { FaInstagram, FaLinkedin, FaGithub, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { EditProfileButton } from "@/components/web/EditProfileButton";
import { ProfileSettingsButton } from "@/components/web/ProfileSettingsButton";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

interface MobileProfileSectionProps {
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

export function MobileProfileSection({ preloadedProfile, preloadedCurrentUser }: MobileProfileSectionProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const profileData = usePreloadedQuery(preloadedProfile);
    const currentUser = usePreloadedQuery(preloadedCurrentUser);

    const profile = profileData.profile;
    const avatarSrc = profileData.profilePicture;
    const defaultAvatarSrc = profileData.defaultProfilePicture;

    const displayAvatar = avatarSrc || defaultAvatarSrc;

    const isFollowing = profileData.viewerStatus.isFollowing;
    const isBell = profileData.viewerStatus.isBell;
    const isSelf = profileData.viewerStatus.isSelf;
    
    if (!profile) {
        return <div className="p-4 text-gray-500">Profile not found</div>;
    }

    const { displayName } = profile;
    const isOwnProfile = Boolean(currentUser?.userId && profile?.userId && currentUser.userId === profile.userId);

    const primarySocial = profile.socials?.find((s) => s.isPrimary) ?? profile.socials?.[0];
    const additionalSocials = profile.socials?.filter((s) => s !== primarySocial) ?? [];

    const hasEducation = Boolean(profile.education && profile.education.length > 0);
    const hasSkills = Boolean(profile.skills && profile.skills.length > 0);
    const hasExtraSocials = additionalSocials.length > 0;

    const hasExpandableContent = hasEducation || hasSkills || hasExtraSocials;
    const formattedDate = dateFormatter.format(profile._creationTime);

    return (
        <div className="flex flex-col gap-4 p-2 h-fit border-b bg-zinc-50/80 dark:bg-zinc-900/50 fixed w-full">
            {isOwnProfile && (
                <div className="flex flex-row gap-2 absolute -top-1 -right-1 p-4 flex items-center z-10">
                    <ProfileSettingsButton userId={profile.userId} />
                    <EditProfileButton
                        profile={profile}
                        avatarSrc={avatarSrc || ""}
                        defaultAvatarSrc={defaultAvatarSrc || ""}
                    />
                </div>
            )}
            <div className="flex flex-row items-center gap-2 w-full">
                <div className="relative h-20 w-20 shrink-0 rounded-full overflow-hidden border-2 border-muted bg-muted">
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
                        <h4 className="text-2xl font-semibold text-foreground tracking-tight">
                            {displayName || profile.username}
                        </h4>

                        <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-xl text-muted-foreground">{`@${profile.username}`}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-row items-center">
                <div className="inline-flex w-fit items-center gap-1 text-lg font-sans font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-800/50 cursor-help select-none">
                    <Zap className="w-4 h-4 fill-amber-500 stroke-amber-500 dark:fill-amber-400 dark:stroke-amber-400 shrink-0" />
                    <span>{profile.totalLikes ?? 0}</span>
                </div>
                {!isSelf && (
                    <div className="ml-auto">
                        <FollowButton
                            userId={profile.userId}
                            displayName={displayName}
                            username={profile.username}
                            initialIsFollowing={isFollowing}
                            initialIsBell={isBell}
                        />
                    </div>
                )}
            </div>

            {profile.bio && (
                <div>
                    <span>{profile.bio}</span>
                </div>
            )}

            <div className="space-y-1 text-lg">
                <div className="flex items-center gap-1.5 min-w-[3rem] justify-start">
                    <Cake className="w-5 h-5 stroke-[2.3] shrink-0" />
                    <p>{formattedDate}</p>
                </div>

                {profile.location && (
                    <div className="flex items-center gap-1.5 min-w-[3rem] justify-start">
                        <MapPin className="w-5 h-5 stroke-[2.3] shrink-0" />
                        <p>{profile.location}</p>
                    </div>
                )}

                {primarySocial && (
                    <div className="flex items-center gap-1.5 min-w-[3rem] justify-start">
                        <SocialPlatformIcon platform={primarySocial.platform} className="w-5 h-5 shrink-0 text-foreground" />
                        <Link 
                            href={primarySocial.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="underline text-blue-600 break-all"
                        >
                            {primarySocial.url}
                        </Link>
                    </div>
                )}
            </div>
            {hasExpandableContent && (
                <div className="flex flex-col gap-2">
                    <button
                        type="button"
                        onClick={() => setIsExpanded((prev) => !prev)}
                        className="text-lg font-medium text-left cursor-pointer hover:text-blue-600 transition-colors w-fit"
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
                                        <div className="flex items-center gap-1.5 text-lg" key={index}>
                                            <SocialPlatformIcon 
                                                platform={social.platform} 
                                                className="w-5 h-5 shrink-0 text-foreground" 
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
                                        {profile.skills?.map((skill) => (
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
    )
}