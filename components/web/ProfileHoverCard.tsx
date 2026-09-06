"use client";

import { MapPin, Cake, ThumbsUp, MessageSquareText, Library, User, ArrowUpRight, Zap, MessageSquare, UsersRound } from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "../ui/hover-card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { ReactNode } from "react";
import Link from "next/link";
import { FollowButton } from "./FollowButton";

interface ProfileHoverCardProps {
    displayName: string | undefined;
    authorUsername: string;
    date?: number;

    children: ReactNode;
    align?: "start" | "center" | "end";
    side?: "top" | "right" | "bottom" | "left";
}

export function formatSmartDate(date: Date | number, profileDate: boolean): string {
  const targetDate = typeof date === "number" ? new Date(date) : date;

  if (!profileDate) {
    const now = new Date();
    
    const diffInMs = now.getTime() - targetDate.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays < 3) {
        const rtf = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });

        if (diffInMinutes < 1) {
        return "just now";
        }
        if (diffInMinutes < 60) {
        return rtf.format(-diffInMinutes, "minute");
        }
        if (diffInHours < 24) {
        return rtf.format(-diffInHours, "hour");
        }
        return rtf.format(-diffInDays, "day");
    }
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(targetDate);
}

export function ProfileHoverCard({ displayName, authorUsername, children, align = "start", side = "bottom" }: ProfileHoverCardProps) {

    const profileData = useQuery(api.profiles.getProfileByUsername, { username: authorUsername });

    const profile = profileData?.profile;
    const avatarSrc = profileData?.profilePicture;
    const defaultAvatarSrc = profileData?.defaultProfilePicture;

    const profileUsername = profileData?.profile?.username;

    const formattedProfileDate = profile?._creationTime ? formatSmartDate(profile._creationTime, true) : null;

    return (
        <div className="inline-block">
            <HoverCard openDelay={100} closeDelay={100}>
                <HoverCardTrigger asChild>
                    {children}
                </HoverCardTrigger>
                <HoverCardContent side="bottom" align="start" className="w-80 p-0 overflow-hidden">
                    <div className="flex flex-col p-2">
                        <Link 
                            href={`/${profileUsername}`}
                            className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-accent hover:text-accent-foreground transition-colors duration-100 cursor-pointer"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="h-10 w-10 border border-border rounded-full overflow-hidden bg-muted shrink-0">
                                    <img
                                        src={avatarSrc || defaultAvatarSrc || ""}
                                        alt="profile"
                                        className="h-full w-full object-cover"
                                        decoding="async" 
                                    />
                                </div>

                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-semibold truncate leading-tight">
                                        {displayName || profile?.username}
                                    </span>
                                    <span className="text-xs text-zinc-600 dark:text-zinc-400 group-hover:text-accent-foreground/80 truncate mt-0.5">
                                        @{profile?.username}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-accent-foreground shrink-0 pl-2">
                                <span className="hidden sm:inline">View</span>
                                <ArrowUpRight className="w-4 h-4 stroke-[2] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </div>
                        </Link>

                        <div className="gap-4 p-2 flex flex-col font-extralight text-[14px] font-sans tracking-tight select-none w-full">
                            <TooltipProvider delayDuration={200}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex flex-row items-center">
                                            <div className="inline-flex w-fit items-center gap-1 text-xs font-sans font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 cursor-help select-none">
                                                <Zap className="w-3 h-3 fill-amber-500 stroke-amber-500 shrink-0" />
                                                <span>{profileData?.profile?.totalLikes}</span>
                                            </div>
                                            <div className="ml-auto">
                                                <FollowButton userId={profileData?.profile?.userId || ""} username={profileData?.profile?.username || ""} displayName={profileData?.profile?.displayName || ""} initialIsFollowing={profileData?.viewerStatus.isFollowing} initialIsBell={profileData?.viewerStatus.isBell} isSelf={profileData?.viewerStatus.isSelf} />
                                            </div>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" align="start">
                                        <p className="text-xs font-medium">{profileData?.profile?.totalLikes} Total Likes</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <div className="flex flex-row">
                                <div className="flex items-start gap-1.5 min-w-[3rem] justify-start">
                                    <Cake className="w-4 h-4 stroke-[2.3] shrink-0 mt-0.5" />
                                    <p>{ formattedProfileDate }</p>
                                </div>
                                <div className="flex flex-row ml-auto">
                                    <div className="flex items-start gap-1.5 min-w-[3rem] justify-start">
                                        <Library className="w-4 h-4 stroke-[2.3] shrink-0 mt-0.5" />
                                        <p>{ profileData?.articleCount }</p>
                                    </div>
                                    <div className="flex items-start gap-1.5 min-w-[3rem] justify-start">
                                        <MessageSquare className="w-4 h-4 stroke-[2.3] shrink-0 mt-0.5" />
                                        <p>{ profileData?.commentCount }</p>
                                    </div>
                                    <div className="flex items-start gap-1.5 min-w-[3rem] justify-start">
                                        <UsersRound className="w-4 h-4 stroke-[2.3] shrink-0 mt-0.5" />
                                        <p>{ profileData?.profile?.followerCount }</p>
                                    </div>
                                </div>
                            </div>

                            {profile?.bio && (
                                <div>
                                    <p>{ profile?.bio }</p>
                                </div>
                            )}
                        </div>
                    </div>
                </HoverCardContent>
            </HoverCard>
        </div>
    )
}