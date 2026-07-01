import { ReactNode } from "react";
import { LeftSidebar } from "@/components/web/LeftSidebar";
import { RightSidebar } from "@/components/web/RightSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function InsightsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full flex relative items-stretch justify-between">
        <SidebarProvider>
            <aside className="z-10">
                <LeftSidebar />
            </aside>

            <main className="flex-1">
                {children}
            </main>

            <aside className="z-10">
                <RightSidebar />
            </aside>
        </SidebarProvider>
    </div>
  );
}