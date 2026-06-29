import GridBackground from "@/components/web/GridBackground";
import { isAuthenticated } from "@/lib/auth-server";
import dynamic from "next/dynamic";
import { ReactNode, Suspense } from "react";

const Footer = dynamic(() => import("@/components/web/Footer"), {
  ssr: true,
});

const Navbar = dynamic(() => import("@/components/web/Navbar").then((mod) => mod.Navbar), {
  ssr: true,
});


export default async function SharedLayout({ children }: { children: ReactNode }) {
    
  return (
      <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 ease-in-out">
        <Suspense>
          <Navbar/>
        </Suspense>
        <div className="flex-1 pt-16">
          <GridBackground>
            {children} 
          </GridBackground>
        </div>
      <Footer />
    </div>
  );
}