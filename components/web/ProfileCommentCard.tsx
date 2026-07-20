import { Eye, ThumbsUp, MessageSquare } from "lucide-react";
import Image from "next/image";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "../ui/hover-card";
import { Badge } from "../ui/badge";
import Link from "next/link";

interface ProfileCommentCardProps {
    id: string;
    authorName: string;
    blogTitle: string;
    likes: number;
    date: number;
}

export function ProfileCommentCard({ id, authorName, blogTitle, likes, date }: ProfileCommentCardProps) {

    const formattedDate = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(date));

    return (
        <div className="group flex flex-col md:flex-row h-auto md:h-[240px] border border-border/50 rounded-none">
            
            <Link 
                href={`/insights/${id}`}
                className="relative aspect-video md:aspect-auto w-full md:w-2/5 md:h-full overflow-hidden bg-muted border-b md:border-b-0 md:border-r border-border/50 shrink-0 block"
            >
            </Link>

            <div className="flex flex-col flex-1 justify-start gap-3 p-6 min-w-0">
                <div className="min-w-0">
                    <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-muted-foreground">
                        <div>
                            {authorName} • {formattedDate}
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
                                
                                {tags.length > 2 && (
                                    <HoverCard openDelay={100} closeDelay={100}>
                                        <HoverCardTrigger asChild>
                                            <Badge 
                                                variant="outline" 
                                                className="font-mono text-[10px] px-1.5 py-0.5 whitespace-nowrap border-black dark:border-white cursor-help hover:bg-muted transition-colors shrink-0"
                                            >
                                                +{tags.length - 2}
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