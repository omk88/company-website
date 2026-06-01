import Footer from "@/components/web/Footer";
import { Navbar } from "@/components/web/Navbar";
import { ReactNode, Suspense } from "react";

export default function SharedLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Navbar />
            { children }
            <Footer />
        </>
    );
}