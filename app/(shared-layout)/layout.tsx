import dynamic from "next/dynamic";
import { ReactNode } from "react";

const Footer = dynamic(() => import("@/components/web/Footer"), {
  ssr: true,
});

const Navbar = dynamic(() => import("@/components/web/Navbar").then((mod) => mod.Navbar), {
  ssr: true,
});

export default function SharedLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Navbar />
            { children }
            <Footer />
        </>
    );
}