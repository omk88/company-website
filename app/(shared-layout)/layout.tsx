import GridBackground from "@/components/web/GridBackground";
import { isAuthenticated } from "@/lib/auth-server";
import dynamic from "next/dynamic";
import { ReactNode } from "react";

const Footer = dynamic(() => import("@/components/web/Footer"), {
  ssr: true,
});

const Navbar = dynamic(() => import("@/components/web/Navbar").then((mod) => mod.Navbar), {
  ssr: true,
});


export default async function SharedLayout({ children }: { children: ReactNode }) {
  const userIsAuthenticated = await isAuthenticated();
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 ease-in-out">
      <Navbar isAuth={userIsAuthenticated} />
      <GridBackground>
        {children} 
      </GridBackground>
      <Footer />
    </div>
  );
}