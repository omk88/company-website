import { SidebarProvider } from "@/components/ui/sidebar";
import { RightSidebarProfile } from "@/components/web/RightSidebarProfile";
import { api } from "@/convex/_generated/api";
import { preloadAuthQuery } from "@/lib/auth-server";
import { ProfileContent } from "@/components/web/ProfileContent";
import { LeftSidebarProfile } from "@/components/web/LeftSidebarProfile";

interface ProfileRouteProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function Profile({ params }: ProfileRouteProps) {
  const { username } = await params;

  const [preloadedProfile, preloadedCurrentUser] = await Promise.all([
    preloadAuthQuery(api.profiles.getProfileByUsername, { username }),
    preloadAuthQuery(api.auth.getCurrentUser),
  ]);

  return (
    <SidebarProvider>
      <aside 
        className="shrink-0"
        style={{ "--sidebar-width": "12.8rem" } as React.CSSProperties}
      >
        <LeftSidebarProfile
            preloadedProfile={preloadedProfile} 
            preloadedCurrentUser={preloadedCurrentUser} 
        />
      </aside>
      
      <div className="flex w-full min-h-screen">
        <main className="flex-1 bg-white pt-16 flex justify-center">
          <div className="w-full max-w-2xl px-6 mx-auto">
            <ProfileContent
              preloadedProfile={preloadedProfile} 
              preloadedCurrentUser={preloadedCurrentUser} 
            />
          </div>
        </main>

        <aside style={{ "--sidebar-width": "24rem" } as React.CSSProperties} className="w-96 shrink-0">
          <RightSidebarProfile 
            preloadedProfile={preloadedProfile} 
            preloadedCurrentUser={preloadedCurrentUser} 
          />
        </aside>
      </div>
    </SidebarProvider>
  );
}