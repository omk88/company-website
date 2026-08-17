import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebarProfile } from "@/components/web/LeftSidebarProfile";
import { ProfileContentWrapper } from "@/components/web/ProfileContentWrapper";
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

    const preloadedProfilePromise = preloadQuery(api.profiles.getProfileByUsername, { username });
    const preloadedCurrentUserPromise = preloadAuthQuery(api.auth.getCurrentUser);
    
    const preloadedInitialBlogsPromise = preloadQuery(api.blogs.getPaginatedPostsByUsername, {
        username: username,
        paginationOpts: {
            numItems: 6,    
            cursor: null,   
            id: 0,
        }
    });

    const preloadedInitialCommentsPromise = preloadQuery(api.comments.getPaginatedCommentsByUsername, {
        username: username,
        paginationOpts: {
            numItems: 6,    
            cursor: null,   
            id: 0,
        }
    });

    const [preloadedProfile, preloadedCurrentUser, preloadedInitialBlogs, preloadedInitialComments] = await Promise.all([
        preloadedProfilePromise,
        preloadedCurrentUserPromise,
        preloadedInitialBlogsPromise,
        preloadedInitialCommentsPromise
    ]);

    return (
        <div>
            <SidebarProvider style={{ "--sidebar-width": "24rem" } as React.CSSProperties}>
                <aside>
                    <LeftSidebarProfile preloadedProfile={preloadedProfile} preloadedCurrentUser={preloadedCurrentUser} />
                </aside>

                {/*<div className="w-full bg-white">
                    <ProfileContentWrapper
                        username={username}
                        preloadedProfile={preloadedProfile}
                        preloadedCurrentUser={preloadedCurrentUser}
                        preloadedInitialBlogs={preloadedInitialBlogs}
                        preloadedInitialComments={preloadedInitialComments}
                    />
                </div>*/}
            </SidebarProvider>
        </div>
    );
}