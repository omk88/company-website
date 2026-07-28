import { ThumbsUp, Ellipsis, Copy } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { FaFacebook, FaXTwitter } from "react-icons/fa6";
import { toast } from "sonner";
import { RxLinkedinLogo } from "react-icons/rx";
import { ProfileHoverCard } from "./ProfileHoverCard";
import { api } from "@/convex/_generated/api";
import { Preloaded } from "convex/react";

interface ProfileCommentCardProps {
    id: string;
    authorName: string;
    blogTitle: string;
    body: string;
    likes: number;
    date: number;
    preloadedProfile: Preloaded<typeof api.profiles.getProfileByUsername>;
}

export function ProfileCommentCard({ id, authorName, blogTitle, body, likes, date, preloadedProfile }: ProfileCommentCardProps) {

    return (
        <div className="group flex flex-col md:flex-row h-auto md:h-[130px] border border-border/50 rounded-none transition-colors duration-100 hover:bg-muted/50 dark:bg-muted/30">

            <div className="flex flex-col flex-1 justify-start px-12 py-2 min-w-0">
                <div className="min-w-0">
                    <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-muted-foreground">
                        <ProfileHoverCard authorName={authorName} date={date} preloadedProfile={preloadedProfile}/> 
                        
                        <div className="flex flex-row items-center gap-8">
                            <span className="font-bold group-hover:text-blue-600 transition-colors duration-100">{blogTitle}</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button 
                                        variant="ghost"
                                        className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground pointer-events-auto cursor-pointer"
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

                <Link
                    href={`/insights/${id}`}
                    className="flex-1 my-1 flex items-start w-full group/text hover:no-underline"
                >
                    <p className="line-clamp-3 md:line-clamp-3 leading-relaxed text-sm break-words w-full">
                        {body}
                    </p>
                </Link>

                <div className="flex font-extralight items-center justify-between text-sm font-mono tracking-tight select-none w-full mt-auto">
                    
                    <div className="flex items-center">
                        <div className="flex items-center gap-1.5 min-w-[3rem] justify-start">
                            <ThumbsUp className="w-4 h-4 stroke-[2.3] shrink-0" />
                            <span>{likes}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}