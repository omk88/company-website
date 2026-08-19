import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebarProfile } from "@/components/web/LeftSidebarProfile";
import { api } from "@/convex/_generated/api";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { preloadAuthQuery } from "@/lib/auth-server";
import { ProfileContent } from "@/components/web/ProfileContent";

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
    <SidebarProvider style={{ "--sidebar-width": "24rem" } as React.CSSProperties}>
      <div className="flex w-full min-h-screen">
        <aside>
          <LeftSidebarProfile 
            preloadedProfile={preloadedProfile} 
            preloadedCurrentUser={preloadedCurrentUser} 
          />
        </aside>

        <main className="flex-1 flex bg-white pt-16">
          <ProfileContent
            preloadedProfile={preloadedProfile} 
            preloadedCurrentUser={preloadedCurrentUser} 
          />
        </main>
      </div>
    </SidebarProvider>
  );
}