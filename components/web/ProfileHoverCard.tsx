import { MapPin, Cake, ThumbsUp, MessageSquareText, Library, User } from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "../ui/hover-card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import Link from "next/link";

interface ProfileHoverCardProps {
    authorName: string;
    authorUsername: string;
    date: number;
}

function formatSmartDate(date: Date | number, timeDifference: boolean): string {
  const targetDate = typeof date === "number" ? new Date(date) : date;
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

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(targetDate);
}

export function ProfileHoverCard({ authorName, authorUsername, date }: ProfileHoverCardProps) {

    const profileData = useQuery(api.profiles.getProfileByUsername, { username: authorUsername });

    const profile = profileData?.profile;
    const avatarSrc = profileData?.profilePicture;
    const defaultAvatarSrc = profileData?.defaultProfilePicture;

    const profileUsername = profileData?.profile?.username;
    const profileLink = profileUsername ? `/${profileUsername}` : "/profile";

    const formattedBlogDate = formatSmartDate(date, false);
    const formattedProfileDate = profile?._creationTime ? formatSmartDate(profile._creationTime, true) : null;

    return (
        <div>
            <HoverCard openDelay={100} closeDelay={100}>
                <HoverCardTrigger asChild>
                    <Link href={profileLink}>
                        <span className="cursor-pointer hover:text-blue-600 font-medium pointer-events-auto">
                            {authorName}
                        </span>
                    </Link>
                </HoverCardTrigger>
                <HoverCardContent side="bottom" align="start" className="w-80 p-0 overflow-hidden">
                    <div className="flex flex-col p-2">
                        <div className="flex flex-row items-center gap-2 w-full">
                            <div className="h-12 w-12 border-2 border-muted rounded-full overflow-hidden bg-muted relative shrink-0">
                                <img
                                    src={avatarSrc || defaultAvatarSrc || ""}
                                    alt="profile"
                                    className="h-full w-full object-cover rounded-full"
                                    decoding="async" 
                                />
                            </div>

                            <div className="relative w-full">
                                <div className="flex flex-col">
                                    <h4 className="text-base font-semibold leading-none">{authorName}</h4>
                                    <p className="text-sm text-muted-foreground leading-none mt-1">{`@${profile?.username}`}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 gap-4 flex flex-col font-extralight text-[14px] font-mono tracking-tight select-none w-full">
                            <div>
                                <div className="flex items-start gap-1.5 min-w-[3rem] justify-start">
                                    <Cake className="w-4 h-4 stroke-[2.3] shrink-0 mt-0.5" />
                                    <p>{ formattedProfileDate }</p>
                                </div>
                    
                                {profile?.location && (
                                    <div className="flex items-start gap-1.5 min-w-[3rem] justify-start">
                                        <MapPin className="w-4 h-4 stroke-[2.3] shrink-0 mt-0.5" />
                                        <p>{ profile?.location }</p>
                                    </div>
                                )}
                            </div>

                            {profile?.bio && (
                                <div>
                                    <p>{ profile?.bio }</p>
                                </div>
                            )}
                            <div className="flex items-center justify-between w-full -m-2">
                                <div className="flex items-center gap-1.5 min-w-[3rem] justify-start p-2 rounded-2xl hover:bg-zinc-100 transition-colors cursor-pointer">
                                    <User className="w-4 h-4 stroke-[2.3] shrink-0 mt-0.5" />
                                    <span>{10}</span>
                                </div>
                                <TooltipProvider delayDuration={200}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                        <div className="flex items-center gap-1.5 min-w-[3rem] justify-start p-2 rounded-2xl hover:bg-zinc-100 transition-colors cursor-pointer">
                                            <ThumbsUp className="w-4 h-4 stroke-[2.3] shrink-0" />
                                            <span>{ profile?.totalLikes }</span>
                                        </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom" align="center">
                                        <p className="text-xs font-medium">{ profile?.totalLikes } Total Likes</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    </TooltipProvider>
                                    <TooltipProvider delayDuration={200}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                        <div className="flex items-center gap-1.5 min-w-[3rem] justify-start p-2 rounded-2xl hover:bg-zinc-100 transition-colors cursor-pointer">
                                            <Library className="w-4 h-4 stroke-[2.3] shrink-0" />
                                            <span>{ profile?.articlesPublished }</span>
                                        </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom" align="center">
                                        <p className="text-xs font-medium">{ profile?.articlesPublished } Insights Published</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    </TooltipProvider>
                                    <TooltipProvider delayDuration={200}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                        <div className="flex items-center gap-1.5 min-w-[3rem] justify-start p-2 rounded-2xl hover:bg-zinc-100 transition-colors cursor-pointer">
                                            <MessageSquareText className="w-4 h-4 stroke-[2.3] shrink-0" />
                                            <span>{ profile?.commentsPublished }</span>
                                        </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom" align="center">
                                        <p className="text-xs font-medium">{ profile?.commentsPublished } Comments Published</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    </TooltipProvider>
                                </div>
                        </div>
                    </div>
                </HoverCardContent>
            </HoverCard>
            {" "}• {formattedBlogDate}
        </div>
    )
}