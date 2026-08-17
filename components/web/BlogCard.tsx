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
import { ProfileHoverCard, formatSmartDate } from "./ProfileHoverCard";

interface BlogCardProps {
  id: string;
  imageUrl: string;
  displayName: string | undefined;
  username: string;
  title: string;
  subtitle: string;
  totalViews: number;
  likes: number;
  commentCount: number;
  date: number;
  readTime: number;
  tags: Array<string>;
  variant?: "default" | "compact";
}

export function BlogCard({
  id,
  imageUrl,
  displayName,
  title,
  subtitle,
  totalViews,
  likes,
  commentCount,
  date,
  readTime,
  tags,
  username,
  variant = "default",
}: BlogCardProps) {
  const isCompact = variant === "compact";

  const ShareMenu = () => (
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
            toast.success("Link copied to clipboard.");
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
  );

  if (isCompact) {
    return (
      <div className="group flex flex-col p-3 bg-zinc-50/80 hover:bg-zinc-100/90 rounded-xl transition-colors duration-100 dark:bg-muted/30">
        <div className="flex items-center justify-between text-[11px] font-sans uppercase tracking-wider text-zinc-600 dark:text-zinc-400 leading-none">
          <div>
            {formatSmartDate(date, false)} • {readTime} min read
          </div>
          <div className="shrink-0 -mr-2 -my-1.5">
            <ShareMenu />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 mt-1 mb-2">
          <Link href={`/insights/${id}`} className="block hover:no-underline flex-1 min-w-0">
            <h3 className="leading-tight text-sm font-bold tracking-tight line-clamp-1 text-foreground transition-colors group-hover:text-blue-600">
              {title}
            </h3>
            <p className="leading-tight text-zinc-600 dark:text-zinc-400 line-clamp-1 text-xs mt-0.5">
              {subtitle}
            </p>
          </Link>

          {imageUrl && (
            <Link 
              href={`/insights/${id}`} 
              className="relative w-12 h-12 shrink-0 overflow-hidden rounded-xl block"
            >
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="64px"
              />
            </Link>
          )}
        </div>

        <div className="flex items-center justify-between text-xs font-extralight tracking-tight select-none">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{totalViews}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{commentCount}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 max-w-[55%] justify-end">
            {tags && tags.length > 0 ? (
              <>
                <div className="flex flex-row gap-1 items-center justify-end">
                  {tags.slice(0, 2).map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="font-sans text-[10px] px-1.5 py-0.5 whitespace-nowrap border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <span className="capitalize">{tag}</span>
                    </Badge>
                  ))}
                </div>
                
                {tags.length > 2 && (
                  <HoverCard openDelay={100} closeDelay={100}>
                    <HoverCardTrigger asChild>
                      <Badge 
                        variant="outline" 
                        className="font-mono text-[10px] px-1.5 py-0.5 whitespace-nowrap border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 cursor-help hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
                      >
                        +{tags.length - 2}
                      </Badge>
                    </HoverCardTrigger>
                    
                    <HoverCardContent side="top" align="end" className="w-auto max-w-[220px] p-2.5">
                      <div className="space-y-1.5">
                        <h4 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">More Topics</h4>
                        <div className="flex flex-wrap gap-1 max-h-[120px] overflow-y-auto">
                          {tags.slice(2).map((tag) => (
                            <Badge 
                              key={tag} 
                              variant="outline" 
                              className="font-mono text-[10px] px-1.5 py-0.5 whitespace-nowrap border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                            >
                              <span className="capitalize">{tag}</span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                )}
              </>
            ) : (
              <Badge 
                variant="outline" 
                className="font-mono text-[10px] px-1.5 py-0.5 whitespace-nowrap border-zinc-200 dark:border-zinc-800 text-zinc-500"
              >
                General
              </Badge>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col md:flex-row h-auto md:h-[190px] border border-border/50 rounded-none transition-colors duration-100 hover:bg-muted dark:bg-muted/30">
      <Link 
        href={`/insights/${id}`}
        className="relative aspect-video md:aspect-auto w-full md:w-2/5 md:h-full overflow-hidden bg-muted border-b md:border-b-0 md:border-r border-border/50 shrink-0 block"
      >
        <div className="relative w-full aspect-[16/9] bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className="flex flex-col flex-1 justify-start px-4 py-2 min-w-0">
        <div className="min-w-0">
          <div className="font-roboto flex items-center justify-between text-xs uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            <div>
              <ProfileHoverCard authorUsername={username} displayName={displayName || username}>
                <span className="cursor-pointer">{displayName || username}</span>
              </ProfileHoverCard>
              {" "}• {formatSmartDate(date, false)}
            </div>
            <div className="flex flex-row items-center gap-8">
              <span>{readTime} min read</span>
              <ShareMenu />
            </div>
          </div>
        </div>

        <Link href={`/insights/${id}`} className="space-y-2 block hover:no-underline">
          <h3 className="leading-tight text-xl font-bold tracking-tight line-clamp-2 text-foreground transition-colors duration-100 group-hover:text-blue-600 break-words">
            {title}
          </h3>
          <p className="leading-tight text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed text-sm break-words">
            {subtitle}
          </p>
        </Link>

        <div className="flex font-sans items-center justify-between text-sm font-extralight tracking-tight select-none w-full mt-auto">
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
                      className="font-sans text-[10px] px-1.5 py-0.5 whitespace-nowrap border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <span className="capitalize">{tag}</span>
                    </Badge>
                  ))}
                </div>
                
                {tags.length > 4 && (
                  <HoverCard openDelay={100} closeDelay={100}>
                    <HoverCardTrigger asChild>
                      <Badge 
                        variant="outline" 
                        className="font-mono text-[10px] px-1.5 py-0.5 whitespace-nowrap border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 cursor-help hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
                      >
                        +{tags.length - 4}
                      </Badge>
                    </HoverCardTrigger>
                    
                    <HoverCardContent side="top" align="end" className="w-auto max-w-[220px] p-2.5">
                      <div className="space-y-1.5">
                        <h4 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">More Topics</h4>
                        <div className="flex flex-wrap gap-1 max-h-[120px] overflow-y-auto">
                          {tags.slice(4).map((tag) => (
                            <Badge 
                              key={tag} 
                              variant="outline" 
                              className="font-mono text-[10px] px-1.5 py-0.5 whitespace-nowrap border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                            >
                              <span className="capitalize">{tag}</span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                )}
              </>
            ) : (
              <Badge 
                variant="outline" 
                className="font-mono text-[10px] px-1.5 py-0.5 whitespace-nowrap border-zinc-200 dark:border-zinc-800 text-zinc-500"
              >
                General
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}