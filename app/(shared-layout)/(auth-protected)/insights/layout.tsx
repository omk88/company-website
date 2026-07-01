import { ReactNode } from "react";
import { LeftSidebar } from "@/components/web/LeftSidebar";
import { RightSidebar } from "@/components/web/RightSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function InsightsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full flex relative items-stretch justify-between min-h-[calc(100vh-4rem)]">
        <SidebarProvider>
            <aside className="sticky top-16 h-[calc(100vh-4rem)] z-30">
                <LeftSidebar />
            </aside>

            <main className="flex-1">
                {children}
            </main>

            <aside className="sticky top-16 h-[calc(100vh-4rem)] z-30">
                <RightSidebar />
            </aside>
        </SidebarProvider>
    </div>
  );
}