import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebarCreateArticleSeries } from "./_components/LeftSidebarCreateArticleSeries";
import { AddSeriesItems } from "./_components/AddSeriesItems";
import { RightSidebarCreateArticleSeries } from "./_components/RightSidebarCreateArticleSeries";

export default function CreateArticleSeriesPage() {
    return (
        <div className="min-h-screen w-full">
            <SidebarProvider className="w-full min-h-screen">
                <aside 
                    className="hidden md:block shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto"
                    style={{ "--sidebar-width": "24rem" } as React.CSSProperties}
                >
                    <LeftSidebarCreateArticleSeries />
                </aside>

                <div className="w-full md:flex-1 md:flex md:flex-row md:min-w-0 md:pt-16 p-2">
                    <AddSeriesItems />

                    <aside 
                        style={{ "--sidebar-width": "20rem" } as React.CSSProperties} 
                        className="hidden md:block w-[20rem] shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto"
                    >
                        <RightSidebarCreateArticleSeries />
                    </aside>
                </div>
            </SidebarProvider>
        </div>
    );
}