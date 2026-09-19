import { connection } from "next/server";
import { SidebarProvider } from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";
import { preloadAuthQuery } from "@/lib/auth-server";
import { fetchQuery } from "convex/nextjs";
import { LeftSidebarProfile } from "@/components/web/LeftSidebarProfile";
import { ProfileContent } from "@/components/web/ProfileContent";
import { RightSidebarProfile } from "@/components/web/RightSidebarProfile";
import { MobileProfileSection } from "./_components/MobileProfileSection";
import { MobileProfileSwitchBar } from "./_components/MobileProfileSwitchBar";

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

  const profileData = await fetchQuery(api.profiles.getProfileByUsername, { username });
  const userId = profileData?.profile?.userId;

  const preloadedBlogs = userId
    ? await preloadAuthQuery(api.blogs.getPaginatedPostsByAuthor, {
        author: userId,
        paginationOpts: { numItems: 6, cursor: null },
      })
    : null;

  return (
    <div className="min-h-screen w-full md:h-screen md:overflow-hidden">
      <div className="pt-10 w-full md:hidden shrink-0">
        <MobileProfileSection
          preloadedProfile={preloadedProfile} 
          preloadedCurrentUser={preloadedCurrentUser} 
        />
      </div>

      <SidebarProvider className="w-full md:flex-1 md:min-h-0">
        <aside 
          className="shrink-0 hidden md:flex"
          style={{ "--sidebar-width": "20rem" } as React.CSSProperties}
        >
          <LeftSidebarProfile 
            preloadedProfile={preloadedProfile} 
            preloadedCurrentUser={preloadedCurrentUser} 
          />
        </aside>
        
        <div className="w-full md:flex-1 md:flex md:flex-row md:min-w-0 md:h-full md:min-h-0 md:pt-16">
          <section id="profile-content-section" className="w-full md:flex-1 md:min-w-0 md:flex md:flex-col md:h-full md:min-h-0">
            <div className="sticky top-[48px] z-20 bg-background shrink-0 md:static">
              <MobileProfileSwitchBar
                preloadedProfile={preloadedProfile} 
                preloadedCurrentUser={preloadedCurrentUser} 
              />
            </div>

            <ProfileContent 
              preloadedProfile={preloadedProfile} 
              preloadedCurrentUser={preloadedCurrentUser}
              preloadedBlogs={preloadedBlogs}
            />
          </section>

          <aside style={{ "--sidebar-width": "24rem" } as React.CSSProperties} className="w-[24rem] shrink-0 hidden md:flex">
            <RightSidebarProfile 
              preloadedProfile={preloadedProfile} 
              preloadedCurrentUser={preloadedCurrentUser} 
            />
          </aside>
        </div>
      </SidebarProvider>
    </div>
  );
}