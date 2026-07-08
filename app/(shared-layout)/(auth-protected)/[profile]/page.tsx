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
            <SidebarProvider>
                <SearchProvider>
                    <aside>
                        <LeftSidebarProfile profile={decodedProfile} />
                    </aside>
                </SearchProvider>
                <div>
                    <ProfileBlogGridContainer authorName={profile} />
                </div>
            </SidebarProvider>
        </div>
    );
}