import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebarProfile } from "@/components/web/LeftSidebarProfile";
import { ProfileContentWrapper } from "@/components/web/ProfileContentWrapper";
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

    let resolvedAvatarUrl = "";
    if (profile?.profilePic) {
        if (profile.profilePic.startsWith("http")) {
            resolvedAvatarUrl = profile.profilePic;
        } else {
            const storageUrl = await fetchQuery(api.profiles.getImageUrl, {
                storageId: profile.profilePic,
            });
            resolvedAvatarUrl = storageUrl || "";
        }
    }

    const authorId = profile?.userId || "";

    return (
        <div>
            <SidebarProvider style={{ "--sidebar-width": "24rem" } as React.CSSProperties}>
                <SearchProvider>
                    <aside>
                        <LeftSidebarProfile 
                            profile={profile} 
                            avatarSrc={resolvedAvatarUrl} 
                        />
                    </aside>
                </SearchProvider>

                <div className="bg-white w-full pl-[var(--sidebar-width)] ml-2">
                    <ProfileContentWrapper blogGridSlot={<ProfileBlogGridContainer author={authorId} />} />
                </div>
            </SidebarProvider>
        </div>
    );
}