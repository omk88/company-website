import { Separator } from "@/components/ui/separator";
import Footer from "@/components/web/Footer";
import { Navbar } from "@/components/web/Navbar";
import { PerformanceTracker } from "@/components/web/PerformanceTracker";
import { ReactNode } from "react";

export default function SharedLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <PerformanceTracker />
            <Navbar />
            { children }
            <Footer />
        </>
    );
}