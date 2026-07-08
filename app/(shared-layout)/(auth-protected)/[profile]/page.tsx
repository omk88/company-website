import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebarProfile } from "@/components/web/LeftSidebarProfile";
import { ProfileBlogGridContainer } from "@/components/web/ProfileBlogGridContainer";
import { SearchProvider } from "@/components/web/SearchContext";

interface profileRouteProps {
    params: Promise<{
        profile: string;
    }>;
}

export default async function Profile({ params }: profileRouteProps) {
    const { profile } = await params;
    const decodedProfile = decodeURIComponent(profile);

    return (
        <div>
            <SidebarProvider style={{ "--sidebar-width": "24rem" } as React.CSSProperties}>
                <SearchProvider>
                    <aside>
                        <LeftSidebarProfile profile={decodedProfile} />
                    </aside>
                </SearchProvider>
                
                <div className="w-full pl-[var(--sidebar-width)] pt-16">
                    <ProfileBlogGridContainer authorName={profile} />
                </div>
            </SidebarProvider>
        </div>
    );
}