import { Sidebar, SidebarContent, SidebarGroup, SidebarFooter, SidebarGroupLabel } from "../ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { GraduationCap, MessageSquareText, SquareLibrary } from "lucide-react";
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
      className="flex flex-col !top-16 !z-40 overflow-hidden !p-0"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <SidebarContent className="!p-0">
        <div className="p-2">
            <Avatar className="h-16 w-16 border-2 border-muted">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className="flex items-start justify-left gap-2 text-sm font-medium text-foreground">
              <span>{ profile }</span>
            </h1>
        </div>
        <SidebarGroup className="!pt-0 !pl-0 !pl-2 !pr-0">
            <div className="flex flex-col bg-muted rounded-sm p-3 gap-3">
                <h1>Hello my name is NAME and I am a tech professional</h1>
                <div className="flex flex-row items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                    <GraduationCap/>
                    <h2>BSc Computer Science, University of Bath</h2>
                </div>
                <div className="flex flex-row gap-3 items-center">
                    <Link href="https://x.com/TaQtiQ_tech" target="_blank" rel="noopener noreferrer">
                        <FaXTwitter className="h-4 w-4 transition-transform hover:scale-105 cursor-pointer opacity-80 hover:opacity-100" />
                    </Link>
                    
                    <Link href="https://www.instagram.com/taqtiq_tech" target="_blank" rel="noopener noreferrer">
                        <AiOutlineInstagram className="h-4.5 w-4.5 transition-transform hover:scale-105 cursor-pointer opacity-80 hover:opacity-100" />
                    </Link>
                    
                    <Link href="https://www.linkedin.com/company/taqtiq-tech" target="_blank" rel="noopener noreferrer">
                        <RxLinkedinLogo className="h-4.5 w-4.5 transition-transform hover:scale-105 cursor-pointer opacity-80 hover:opacity-100" />
                    </Link>

                    <Link href="https://www.linkedin.com/company/taqtiq-tech" target="_blank" rel="noopener noreferrer">
                        <FaGithub className="h-4.5 w-4.5 transition-transform hover:scale-105 cursor-pointer opacity-80 hover:opacity-100" />
                    </Link>
                </div>
            </div>
        </SidebarGroup>
        <SidebarGroup>
            <div className="flex flex-col bg-muted rounded-sm p-3 gap-3">
                <div className="flex flex-col items-start gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    <h1>• NextJS</h1>
                    <h2>• JavaScript</h2>
                    <h3>• TypeScript</h3>
                </div>
            </div>
        </SidebarGroup>
        <SidebarGroup>
            <div className="flex flex-col bg-muted rounded-sm p-3 gap-3">
                <div className="flex flex-col items-start gap-2">
                    <div className="flex flex-row items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                        <SquareLibrary />
                        <h1>21 Insights Published</h1>
                    </div>
                    <div className="flex flex-row items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                        <MessageSquareText />
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