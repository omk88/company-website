import { Sidebar, SidebarContent, SidebarGroup, SidebarFooter, SidebarGroupLabel } from "../ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChartNoAxesColumn, GraduationCap, MessageSquareText, SquareLibrary, Terminal, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { Doc } from "@/convex/_generated/dataModel";
import { EditProfileButton } from "./EditProfileButton";
import { ICON_MAP } from "@/lib/socials";

interface profileRouteProps {
  profile: Doc<"profiles"> | null;
  avatarSrc: string;
}

export function LeftSidebarProfile({ profile, avatarSrc }: profileRouteProps) {
  
  if (!profile) {
    return <div className="p-4 text-gray-500">Profile not found</div>;
  }

  const { username, firstName, lastName } = profile;
  const displayName = (firstName && lastName) ? `${firstName} ${lastName}` : username;
  
  return (
    <Sidebar 
      className="flex flex-col !top-16 !z-40 overflow-hidden !p-0 bg-white"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <SidebarContent className="!p-0">
        <div className="p-2">
          <Avatar className="h-16 w-16 border-2 border-muted">
            <AvatarImage src={avatarSrc} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="flex w-full items-center justify-between gap-2 text-lg font-medium text-foreground mt-2">
            <span>{displayName}</span>
            <EditProfileButton profile={profile} avatarSrc={avatarSrc} />
          </h1>
        </div>
        
        <SidebarGroup>
          <div className="flex flex-col bg-muted rounded-sm p-3 gap-3">
            {profile.bio && profile.bio.trim() !== "" ? (
              <p className="text-sm leading-relaxed text-foreground">
                {profile.bio}
              </p>
            ) : (
              <p className="text-sm italic text-muted-foreground/70">
                No bio added.
              </p>
            )}
            {profile.location && profile.location.trim() !== "" ? (
              <p className="flex flex-row items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                {profile.location}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No location added.
              </p>
            )}
            {profile.education && profile.education.length > 0 ? (
              profile.education.map((item, index) => (
                <div 
                  key={index} 
                  className="flex flex-row items-start gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground"
                >
                  <GraduationCap className="h-4 w-4 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <h2 className="font-semibold text-foreground">
                      {item.degree} in {item.subject}
                    </h2>
                    <p className="text-[11px] lowercase first-letter:uppercase text-muted-foreground">
                      {item.institution}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground italic">No education added.</p>
            )}
            <div className="flex flex-row gap-3 items-center pt-1">
              {profile.socials && profile.socials.length > 0 ? (
                profile.socials.map((social, index) => {
                  const normalizedPlatform = social.platform.toLowerCase().trim();
                  const IconComponent = ICON_MAP[normalizedPlatform];

                  if (!IconComponent || !social.url) return null;

                  const iconSizeClass = normalizedPlatform === "x" ? "h-4 w-4" : "h-4.5 w-4.5";

                  return (
                    <Link 
                      key={index} 
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <IconComponent 
                        className={`${iconSizeClass} transition-transform hover:scale-105 cursor-pointer opacity-80 hover:opacity-100`} 
                      />
                    </Link>
                  );
                })
              ) : (
                <span className="text-xs text-muted-foreground italic">No links connected.</span>
              )}
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
              {profile.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill, index) => (
                  <div key={index}>• {skill}</div>
                ))
              ) : (
                <div className="italic text-muted-foreground/70">No skills added.</div>
              )}
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
                <h1>{profile.totalLikes} Total Likes</h1>
              </div>
              <div className="flex flex-row items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                <SquareLibrary className="h-4 w-4 shrink-0" />
                <h1>{profile.articlesPublished} Insights Published</h1>
              </div>
              <div className="flex flex-row items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                <MessageSquareText className="h-4 w-4 shrink-0" />
                <h2>{profile.commentsPublished} Comments Written</h2>
              </div>
            </div>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="hidden" />
    </Sidebar>
  );
}