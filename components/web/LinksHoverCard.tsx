import { Globe, Link as LinkIcon } from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "../ui/hover-card";
import { Doc } from "@/convex/_generated/dataModel";
import { 
  FaGithub, 
  FaTwitter, 
  FaXTwitter, 
  FaLinkedin, 
  FaInstagram,
  FaYoutube, 
  FaBluesky
} from "react-icons/fa6";
import { ComponentType } from "react";
import { FaFacebook, FaTiktok, FaTwitch } from "react-icons/fa";
import { SiSubstack } from "react-icons/si";

const PLATFORM_ICONS: Record<string, ComponentType<{ className?: string }>> = {
    website: LinkIcon,
    github: FaGithub,
    twitter: FaTwitter,
    x: FaXTwitter,
    linkedin: FaLinkedin,
    instagram: FaInstagram,
    youtube: FaYoutube,
    bluesky: FaBluesky,
    facebook: FaFacebook,
    twitch: FaTwitch,
    substack: SiSubstack,
    tiktok: FaTiktok,
}

interface LinksHoverCardProps {
    socials: Doc<"profiles">["socials"];
}

export function LinksHoverCard({ socials }: LinksHoverCardProps) {

    const getPlatformIcon = (platform: string) => {
        const key = platform.toLowerCase();
        return PLATFORM_ICONS[key] || Globe;
    };

    return (
        <div>
            <HoverCard openDelay={100} closeDelay={100}>
                <HoverCardTrigger asChild>
                <button className="bg-zinc-200 text-muted-foreground p-2 rounded-2xl flex items-center gap-1.5 min-w-[3rem] justify-start cursor-pointer hover:bg-zinc-300 transition-colors">
                    <LinkIcon className="w-4 h-4 stroke-[2.3] shrink-0" />
                    <span className="text-sm font-medium">{socials?.length ?? 0}</span>
                </button>
                </HoverCardTrigger>

                <HoverCardContent side="bottom" align="start">
                <ul className="flex flex-col gap-0.5">
                    {socials?.map((social) => {
                    const Icon = getPlatformIcon(social.platform);

                    return (
                        <li key={social.platform}>
                        <a 
                            href={social.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-4 p-2.5 rounded-md hover:bg-zinc-100 transition-colors group"
                        >
                            <div className="mt-0.5 shrink-0 text-zinc-700 group-hover:text-black">
                                <Icon className="w-4 h-4" />
                            </div>

                            <div className="flex flex-col min-w-0 flex-1 leading-tight">
                                <span className="text-xs font-semibold text-zinc-900 capitalize truncate">
                                    {social.platform}
                                </span>
                                <span className="text-xs text-zinc-500 truncate font-normal">
                                    {social.url}
                                </span>
                            </div>
                        </a>
                        </li>
                    );
                    })}
                </ul>
                </HoverCardContent>
            </HoverCard>
        </div>
    )
}