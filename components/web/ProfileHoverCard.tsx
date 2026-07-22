import { MapPin, Cake, ThumbsUp, SquareLibrary, MessageSquareText } from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "../ui/hover-card";
import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";

interface ProfileHoverCardProps {
    authorName: string;
    date: number;
    preloadedProfile: Preloaded<typeof api.profiles.getProfileByUsername>;
}

export function ProfileHoverCard({ authorName, date, preloadedProfile }: ProfileHoverCardProps) {
    const profileData = usePreloadedQuery(preloadedProfile);

    const profile = profileData.profile;
    const avatarSrc = profileData.profilePicture;
    const defaultAvatarSrc = profileData.defaultProfilePicture;

    const formattedDate = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(date));

    return (
        <div>
            <HoverCard openDelay={100} closeDelay={100}>
                <HoverCardTrigger asChild>
                    <span className="cursor-pointer hover:text-blue-600 font-medium pointer-events-auto">
                        {authorName}
                    </span>
                </HoverCardTrigger>
                <HoverCardContent side="bottom" align="start" className="w-80 p-0 overflow-hidden">
                    <div className="flex flex-col">
                        <div 
                            className="h-24 w-full bg-cover bg-center bg-no-repeat relative p-3" 
                            style={{ backgroundImage: `url(${"/tech_banner_preview.png"})` }}
                        >
                            <div className="absolute -bottom-6 left-3 h-14 w-14 border-2 border-background rounded-full overflow-hidden bg-muted shrink-0">
                                <img
                                    src={avatarSrc || defaultAvatarSrc || ""}
                                    alt="profile"
                                    className="h-full w-full object-cover rounded-full"
                                    decoding="async" 
                                />
                            </div>
                        </div>

                        <div className="pt-8 px-4 pb-3 flex flex-col gap-2">
                            <div className="flex flex-col">
                                <h4 className="text-base font-semibold leading-tight">{authorName}</h4>
                                <p className="text-sm text-muted-foreground">{profile?.username}</p>
                            </div>

                            <p className="flex flex-row items-center gap-1 text-[0.675rem] font-mono uppercase tracking-wider text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5 shrink-0" /> 
                                {profile?.location}
                            </p>
                        </div>

                        <div className="w-full bg-muted p-4 border-t">
                            <div className="flex flex-col items-start gap-2.5">
                                <div className="flex flex-row items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                                    <Cake className="h-4 w-4 shrink-0" />
                                    <h1>{formattedDate}</h1>
                                </div>
                                <div className="flex flex-row items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                                    <ThumbsUp className="h-4 w-4 shrink-0" />
                                    <h1>{profile?.totalLikes} Total Likes</h1>
                                </div>
                                <div className="flex flex-row items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                                    <SquareLibrary className="h-4 w-4 shrink-0" />
                                    <h1>{profile?.articlesPublished} Insights Published</h1>
                                </div>
                                <div className="flex flex-row items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                                    <MessageSquareText className="h-4 w-4 shrink-0" />
                                    <h2>{profile?.commentsPublished} Comments Written</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </HoverCardContent>
            </HoverCard>
            {" "}• {formattedDate}
        </div>
    )
}