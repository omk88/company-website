import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebarProfile } from "@/components/web/LeftSidebarProfile";
import { ProfileContentWrapper } from "@/components/web/ProfileContentWrapper";
import { ProfileBlogGridContainer } from "@/components/web/ProfileBlogGridContainer"; 
import { SearchProvider } from "@/components/web/SearchContext";
import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { preloadAuthQuery } from "@/lib/auth-server";

interface profileRouteProps {
    params: Promise<{
        username: string;
    }>;
}

export default async function Profile({ params }: profileRouteProps) {

    const { username } = await params;

    const preloadedProfilePromise = await preloadQuery(api.profiles.getProfileByUsername, { username: username });
    const preloadedCurrentUserPromise = await preloadAuthQuery(api.auth.getCurrentUser);

    const [preloadedProfile, preloadedCurrentUser] = await Promise.all([
        preloadedProfilePromise,
        preloadedCurrentUserPromise
    ]);

    return (
        <div>
            <SidebarProvider style={{ "--sidebar-width": "24rem" } as React.CSSProperties}>
                <SearchProvider>
                    <aside>
                        <LeftSidebarProfile preloadedProfile={preloadedProfile} preloadedCurrentUser={preloadedCurrentUser} />
                    </aside>
                </SearchProvider>

                <div className="bg-white w-full pl-[var(--sidebar-width)] ml-2">
                    <ProfileContentWrapper preloadedProfile={preloadedProfile} blogGridSlot={<ProfileBlogGridContainer username={username}  />} />
                </div>
            </SidebarProvider>
        </div>
    );
}