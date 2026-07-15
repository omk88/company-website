import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebarProfile } from "@/components/web/LeftSidebarProfile";
import { ProfileContentWrapper } from "@/components/web/ProfileContentWrapper";
import { ProfileBlogGridContainer } from "@/components/web/ProfileBlogGridContainer"; 
import { SearchProvider } from "@/components/web/SearchContext";
import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";

interface profileRouteProps {
    params: Promise<{
        username: string;
    }>;
}

export default async function Profile({ params }: profileRouteProps) {

    const { username } = await params;

    const preloadedProfilePromise = await preloadQuery(api.profiles.getProfileByUsername, { username: username });

    const [preloadedProfile] = await Promise.all([
        preloadedProfilePromise
    ]);

    return (
        <div>
            <SidebarProvider style={{ "--sidebar-width": "24rem" } as React.CSSProperties}>
                <SearchProvider>
                    <aside>
                        <LeftSidebarProfile 
                            preloadedProfile={preloadedProfile} 
                        />
                    </aside>
                </SearchProvider>

                { /*
                <div className="bg-white w-full pl-[var(--sidebar-width)] ml-2">
                    <ProfileContentWrapper authorId={authorId} blogGridSlot={<ProfileBlogGridContainer author={authorId} />} />
                </div> */}
            </SidebarProvider>
        </div>
    );
}