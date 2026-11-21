import { SidebarProvider } from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";
import { preloadAuthQuery } from "@/lib/auth-server";
import { connection } from "next/server";
import { LeftSidebarLibrary } from "./_components/LeftSidebarLibrary";
import { LibraryContent } from "./_components/LibraryContent";
import { fetchQuery } from "convex/nextjs";

interface LibraryRouteProps {
  params: Promise<{ username: string }>;
}

export default async function Library({ params }: LibraryRouteProps) {
    const { username } = await params;
    await connection();

    const [preloadedProfile] = await Promise.all([
        preloadAuthQuery(api.profiles.getProfileByUsername, { username, getPurchasedCourses: true }),
    ]);

    const profileData = await fetchQuery(api.profiles.getProfileByUsername, { username });
    const userId = profileData?.profile?.userId;

    const preloadedCourses = userId
    ? await preloadAuthQuery(api.courses.getPaginatedPurchasesByAuthor, {
        userId,
        paginationOpts: { numItems: 6, cursor: null },
    })
    : null;

    return (
        <div className="min-h-screen w-full">

            <SidebarProvider className="w-full min-h-screen">
                <aside 
                    className="hidden md:block shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto"
                    style={{ "--sidebar-width": "20rem" } as React.CSSProperties}
                >
                    <LeftSidebarLibrary
                        preloadedProfile={preloadedProfile} 
                    />
                </aside>
                
                <div className="w-full md:flex-1 md:flex md:flex-row md:min-w-0 md:pt-16">
                    <section id="profile-content-section" className="w-full md:flex-1 md:min-w-0">
                        <LibraryContent
                            preloadedProfile={preloadedProfile} 
                            preloadedCourses={preloadedCourses}
                        />
                    </section>

                    <aside 
                        style={{ "--sidebar-width": "24rem" } as React.CSSProperties} 
                        className="hidden md:block w-[24rem] shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto"
                    >

                    </aside>
                </div>
            </SidebarProvider>
        </div>
    )
}