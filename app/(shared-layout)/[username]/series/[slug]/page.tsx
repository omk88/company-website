import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebarArticleSeries } from "../../_components/LeftSidebarArticleSeries";
import { RightSidebarArticleSeries } from "../../_components/RightSidebarArticleSeries";

interface ArticleSeriesPageProps {
  params: Promise<{ slug: string }>;
}

export default function ArticleSeries({ params }: ArticleSeriesPageProps) {
    return (
        <div className="min-h-screen w-full">
            <SidebarProvider className="w-full min-h-screen">
                <aside 
                    className="hidden md:block shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto"
                    style={{ "--sidebar-width": "20rem" } as React.CSSProperties}
                >
                    <LeftSidebarArticleSeries />
                </aside>

                <div className="w-full md:flex-1 md:flex md:flex-row md:min-w-0 md:pt-16">
        
                    <aside 
                        style={{ "--sidebar-width": "24rem" } as React.CSSProperties} 
                        className="hidden md:block w-[24rem] shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto"
                    >
                        <RightSidebarArticleSeries />
                    </aside>
                </div>
            </SidebarProvider>
        </div>
    )
}