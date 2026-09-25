import { SidebarProvider } from "@/components/ui/sidebar";
import LeftSidebarMessaging from "./_components/LeftSidebarMessaging";
import MessagingContent from "./_components/MessagingContent";
import RightSidebarMessaging from "./_components/RightSidebarMessaging";

export default function Messaging() {
    return (
        <div>
            <SidebarProvider className="flex-col md:flex-row">
                <aside 
                    className="hidden md:block shrink-0"
                    style={{ "--sidebar-width": "15rem" } as React.CSSProperties}
                >
                    <LeftSidebarMessaging />
                </aside>
                <div className="w-full min-w-0 flex flex-col flex-1 min-h-[calc(100vh-4rem)] pt-16 pb-16 md:pb-0">
                    <section 
                        id="messaging-content-section" 
                        className="w-full flex-1 flex flex-col h-full min-h-0 bg-white dark:bg-zinc-950 pt-24 md:pt-0"
                    >
                        <div className="flex flex-col flex-1 h-full min-h-0">
                            <MessagingContent />
                        </div>
                    </section>
                </div>

                <aside 
                    className="hidden md:block shrink-0"
                    style={{ "--sidebar-width": "12rem" } as React.CSSProperties}
                >
                    <RightSidebarMessaging />
                </aside>
            </SidebarProvider>
        </div>
    )
}