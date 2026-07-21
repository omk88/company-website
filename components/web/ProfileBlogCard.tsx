import { Eye, ThumbsUp, MessageSquare, Ellipsis, Copy } from "lucide-react";
import Image from "next/image";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "../ui/hover-card";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { FaFacebook, FaXTwitter } from "react-icons/fa6";
import { toast } from "sonner";
import { RxLinkedinLogo } from "react-icons/rx";
import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";

interface ProfileBlogCardProps {
    id: string;
    imageUrl: string;
    authorName: string;
    title: string;
    subtitle: string;
    totalViews: number;
    likes: number;
    commentCount: number;
    date: number;
    readTime: number;
    tags: Array<string>;    
    preloadedProfile: Preloaded<typeof api.profiles.getProfileByUsername>;
}

export function ProfileBlogCard({ id, imageUrl, authorName, title, subtitle, totalViews, likes, commentCount, date, readTime, tags, preloadedProfile }: ProfileBlogCardProps) {

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
        <div className="group flex flex-col md:flex-row h-auto md:h-[190px] border border-border/50 rounded-none">
            
            <Link 
                href={`/insights/${id}`}
                className="relative aspect-video md:aspect-auto w-full md:w-2/5 md:h-full overflow-hidden bg-muted border-b md:border-b-0 md:border-r border-border/50 shrink-0 block"
            >
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                />
            </Link>

            <div className="flex flex-col flex-1 justify-start px-4 py-2 min-w-0">
                <div className="min-w-0 pointer-events-none">
                    <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-muted-foreground">
                        <div>
                            <HoverCard openDelay={100} closeDelay={100}>
                                <HoverCardTrigger asChild>
                                <span className="cursor-pointer hover:text-blue-600 font-medium pointer-events-auto">
                                    {authorName}
                                </span>
                                </HoverCardTrigger>
                                <HoverCardContent side="bottom" align="start" className="w-80">
                                <div className="flex flex-row gap-4">
                                    <div className="h-12 w-12 border-2 border-muted rounded-full overflow-hidden bg-muted relative shrink-0">
                                        <img
                                        src={avatarSrc || defaultAvatarSrc || ""}
                                        alt="profile"
                                        className="h-full w-full object-cover rounded-full"
                                        decoding="async" 
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <h4 className="text-base">{ authorName }</h4>
                                        <h4 className="text-md">{ profile?.username }</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pt-0.5">
                                    </div>
                                </div>
                                </HoverCardContent>
                            </HoverCard>
                            {" "}• {formattedDate}
                        </div>
                        
                        <div className="flex flex-row items-center gap-8">
                            <span>{readTime} min read</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button 
                                        variant="ghost"
                                        className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground pointer-events-auto"
                                    >
                                        <Ellipsis className="w-4 h-4 stroke-[2.3]" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-48">
                                    <DropdownMenuLabel>Share</DropdownMenuLabel>
                                    
                                    <DropdownMenuItem 
                                        className="font-bold cursor-pointer flex items-center gap-2 whitespace-nowrap"
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href);
                                            toast.success("Link copied to clipboard!");
                                        }}
                                    >
                                        <Copy className="h-4 w-4 shrink-0" strokeWidth={3} />
                                        <span>Copy link</span>
                                    </DropdownMenuItem>
                        
                                    <DropdownMenuItem 
                                        className="cursor-pointer flex items-center gap-2 whitespace-nowrap"
                                        onClick={() => {
                                            const shareUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent("Check out this article!")}`;
                                            window.open(shareUrl, "_blank", "noopener,noreferrer");
                                        }}
                                    >
                                        <FaXTwitter className="h-4 w-4 shrink-0" />
                                        <span>X (Twitter)</span>
                                    </DropdownMenuItem>


                                    <DropdownMenuItem 
                                        className="cursor-pointer flex items-center gap-2 whitespace-nowrap"
                                        onClick={() => {
                                            const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
                                            window.open(shareUrl, "_blank", "noopener,noreferrer");
                                        }}
                                    >
                                        <RxLinkedinLogo className="h-4 w-4 shrink-0" />
                                        <span>LinkedIn</span>
                                    </DropdownMenuItem>
                        
                                    <DropdownMenuItem 
                                        className="cursor-pointer flex items-center gap-2 whitespace-nowrap"
                                        onClick={() => {
                                            const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
                                            window.open(shareUrl, "_blank", "noopener,noreferrer");
                                        }}
                                    >
                                        <FaFacebook className="h-4 w-4 shrink-0" />
                                        <span>Facebook</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                <Link href={`/insights/${id}`} className="space-y-1.5 block hover:no-underline group/text">
                    <h3 className="text-2xl font-bold tracking-tight line-clamp-1 md:line-clamp-2 text-foreground transition-colors duration-200 group-hover/text:text-blue-600 uppercase break-words">
                        {title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3 md:line-clamp-3 leading-relaxed text-sm break-words">
                        {subtitle}
                    </p>
                </Link>

                <div className="flex font-extralight items-center justify-between text-sm font-mono tracking-tight select-none w-full mt-auto">
                    
                    <div className="flex items-center">
                        <div className="flex items-center gap-1.5 min-w-[3rem] justify-start">
                            <Eye className="w-4 h-4 stroke-[2.3] shrink-0" />
                            <span>{totalViews}</span>
                        </div>
                        <div className="flex items-center gap-1.5 min-w-[3rem] justify-start">
                            <ThumbsUp className="w-4 h-4 stroke-[2.3] shrink-0" />
                            <span>{likes}</span>
                        </div>
                        <div className="flex items-center gap-1.5 min-w-[3rem] justify-start">
                            <MessageSquare className="w-4 h-4 stroke-[2.3] shrink-0" />
                            <span>{commentCount}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 max-w-[55%] justify-end">
                        {tags && tags.length > 0 ? (
                            <>
                                <div className="flex flex-row gap-1 items-center justify-end">
                                    {tags.slice(0, 4).map((tag) => (
                                        <Badge 
                                            key={tag} 
                                            variant="outline" 
                                            className="font-mono text-[10px] px-1.5 py-0.5 whitespace-nowrap border-black dark:border-white"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                                
                                {tags.length > 4 && (
                                    <HoverCard openDelay={100} closeDelay={100}>
                                        <HoverCardTrigger asChild>
                                            <Badge 
                                                variant="outline" 
                                                className="font-mono text-[10px] px-1.5 py-0.5 whitespace-nowrap border-black dark:border-white cursor-help hover:bg-muted transition-colors shrink-0"
                                            >
                                                +{tags.length - 4}
                                            </Badge>
                                        </HoverCardTrigger>
                                        
                                        <HoverCardContent side="top" align="end">
                                            <div className="space-y-2">
                                                <h4 className="text-[12px]">All Topics</h4>
                                                <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pt-0.5">
                                                    {tags.map((tag) => (
                                                        <Badge key={tag} variant="outline" className="font-mono text-[10px] px-1.5 py-0.5 whitespace-nowrap border-black dark:border-white cursor-help hover:bg-muted transition-colors shrink-0">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </HoverCardContent>
                                    </HoverCard>
                                )}
                            </>
                        ) : (
                            <Badge variant="outline" className="shrink-0 text-[10px]">General</Badge>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}