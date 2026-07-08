import { Sidebar, SidebarContent, SidebarGroup, SidebarFooter, SidebarGroupLabel } from "../ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChartNoAxesColumn, GraduationCap, MessageSquareText, SquareLibrary, Terminal, ThumbsUp } from "lucide-react";
import { AiOutlineInstagram } from "react-icons/ai";
import { FaXTwitter } from "react-icons/fa6";
import { RxLinkedinLogo } from "react-icons/rx";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";

interface profileRouteProps {
    profile: string;
}

export function LeftSidebarProfile({ profile }: profileRouteProps) {
  return (
    <Sidebar 
      className="flex flex-col !top-16 !z-40 overflow-hidden !p-0 bg-white"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <SidebarContent className="!p-0">
        <div className="p-2">
            <Avatar className="h-16 w-16 border-2 border-muted">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className="flex items-start justify-left gap-2 text-lg font-medium text-foreground mt-2">
              <span>{ profile }</span>
            </h1>
        </div>
        
        <SidebarGroup>
            <div className="flex flex-col bg-muted rounded-sm p-3 gap-3">
                <p className="text-sm leading-relaxed">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets.
                </p>
                <div className="flex flex-row items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    <GraduationCap className="h-4 w-4 shrink-0" />
                    <h2>BSc Computer Science, University of Bath</h2>
                </div>
                <div className="flex flex-row items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    <GraduationCap className="h-4 w-4 shrink-0" />
                    <h2>BSc Computer Science, University of Bath</h2>
                </div>
                <div className="flex flex-row items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    <GraduationCap className="h-4 w-4 shrink-0" />
                    <h2>BSc Computer Science, University of Bath</h2>
                </div>
                <div className="flex flex-row gap-3 items-center pt-1">
                    <Link href="https://x.com/TaQtiQ_tech" target="_blank" rel="noopener noreferrer">
                        <FaXTwitter className="h-4 w-4 transition-transform hover:scale-105 cursor-pointer opacity-80 hover:opacity-100" />
                    </Link>
                    
                    <Link href="https://www.instagram.com/taqtiq_tech" target="_blank" rel="noopener noreferrer">
                        <AiOutlineInstagram className="h-4.5 w-4.5 transition-transform hover:scale-105 cursor-pointer opacity-80 hover:opacity-100" />
                    </Link>
                    
                    <Link href="https://www.linkedin.com/company/taqtiq-tech" target="_blank" rel="noopener noreferrer">
                        <RxLinkedinLogo className="h-4.5 w-4.5 transition-transform hover:scale-105 cursor-pointer opacity-80 hover:opacity-100" />
                    </Link>

                    <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                        <FaGithub className="h-4.5 w-4.5 transition-transform hover:scale-105 cursor-pointer opacity-80 hover:opacity-100" />
                    </Link>
                </div>
            </div>
        </SidebarGroup>

        <SidebarGroup>
            <SidebarGroupLabel className="w-full justify-center mb-1">
                <h1 className="flex items-center justify-center gap-2 text-sm font-medium text-foreground">
                    <Terminal className="w-4 h-4 stroke-[2.3] shrink-0" />
                    <span>Skills/Languages</span>
                </h1>
            </SidebarGroupLabel>
            <div className="flex flex-col bg-muted rounded-sm p-3 gap-3">
                <div className="flex flex-col items-start gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    <div>• NextJS</div>
                    <div>• JavaScript</div>
                    <div>• TypeScript</div>
                </div>
            </div>
        </SidebarGroup>

        <SidebarGroup>
            <SidebarGroupLabel className="w-full justify-center mb-1">
                <h1 className="flex items-center justify-center gap-2 text-sm font-medium text-foreground">
                    <ChartNoAxesColumn className="w-4 h-4 stroke-[2.3] shrink-0" />
                    <span>Metrics</span>
                </h1>
            </SidebarGroupLabel>
            <div className="flex flex-col bg-muted rounded-sm p-3 gap-3">
                <div className="flex flex-col items-start gap-2.5">
                    <div className="flex flex-row items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                        <ThumbsUp className="h-4 w-4 shrink-0" />
                        <h1>143 Total Likes</h1>
                    </div>
                    <div className="flex flex-row items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                        <SquareLibrary className="h-4 w-4 shrink-0" />
                        <h1>21 Insights Published</h1>
                    </div>
                    <div className="flex flex-row items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                        <MessageSquareText className="h-4 w-4 shrink-0" />
                        <h2>493 Comments Written</h2>
                    </div>
                </div>
            </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="hidden" />
    </Sidebar>
  );
}