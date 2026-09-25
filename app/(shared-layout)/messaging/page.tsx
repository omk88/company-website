import { SidebarProvider } from "@/components/ui/sidebar";
import LeftSidebarMessaging from "./_components/LeftSidebarMessaging";

export default async function Messaging() {
    return (
        <div>
            <SidebarProvider className="flex-col md:flex-row">
                <aside 
                    className="hidden md:block shrink-0"
                    style={{ "--sidebar-width": "18rem" } as React.CSSProperties}
                >
                    <LeftSidebarMessaging />
                </aside>
            </SidebarProvider>
        </div>
    )
}