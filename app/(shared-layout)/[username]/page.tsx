import { connection } from "next/server";
import { SidebarProvider } from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";
import { preloadAuthQuery } from "@/lib/auth-server";
import { LeftSidebarProfile } from "@/components/web/LeftSidebarProfile";
import { ProfileContent } from "@/components/web/ProfileContent";
import { RightSidebarProfile } from "@/components/web/RightSidebarProfile";

interface ProfileRouteProps {
  params: Promise<{ username: string }>;
}

export default async function Profile({ params }: ProfileRouteProps) {
  const { username } = await params;
  await connection();

  const [preloadedProfile, preloadedCurrentUser] = await Promise.all([
    preloadAuthQuery(api.profiles.getProfileByUsername, { username }),
    preloadAuthQuery(api.auth.getCurrentUser),
  ]);

  return (
    <SidebarProvider>
      <aside 
        className="shrink-0"
        style={{ "--sidebar-width": "20rem" } as React.CSSProperties}
      >
        <LeftSidebarProfile 
          preloadedProfile={preloadedProfile} 
          preloadedCurrentUser={preloadedCurrentUser} 
        />
      </aside>
      
      <div className="flex-1 flex flex-row min-w-0 w-full min-h-screen pt-16">
        <section
          id="profile-content-section" 
          className="flex-1 min-w-0 flex flex-col h-full"
        >
          <ProfileContent 
            preloadedProfile={preloadedProfile} 
            preloadedCurrentUser={preloadedCurrentUser} 
          />
        </section>

        <aside style={{ "--sidebar-width": "24rem" } as React.CSSProperties} className="w-[24rem] shrink-0">
          <RightSidebarProfile 
            preloadedProfile={preloadedProfile} 
            preloadedCurrentUser={preloadedCurrentUser} 
          />
        </aside>
      </div>
    </SidebarProvider>
  );
}