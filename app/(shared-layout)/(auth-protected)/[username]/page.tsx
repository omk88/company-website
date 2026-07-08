import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebarProfile } from "@/components/web/LeftSidebarProfile";
import { ProfileBlogGridContainer } from "@/components/web/ProfileBlogGridContainer";
import { SearchProvider } from "@/components/web/SearchContext";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";

interface profileRouteProps {
    params: Promise<{
        username: string;
    }>;
}

export default async function Profile({ params }: profileRouteProps) {
    const { username } = await params;

    const profile = await fetchQuery(api.profiles.getProfileByUsername, { 
        username: username 
    });

    return (
        <div>
            <SidebarProvider style={{ "--sidebar-width": "24rem" } as React.CSSProperties}>
                <SearchProvider>
                    <aside>
                        <LeftSidebarProfile username={profile?.username || ""} />
                    </aside>
                </SearchProvider>
                
                <div className="bg-white w-full pl-[var(--sidebar-width)] p-4 ml-2">
                    <ProfileBlogGridContainer authorName={profile?.userId || ""} />
                </div>
            </SidebarProvider>
        </div>
    );
}