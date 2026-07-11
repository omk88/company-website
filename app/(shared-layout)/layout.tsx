import GridBackground from "@/components/web/GridBackground";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import dynamic from "next/dynamic";
import { ReactNode } from "react";

const Footer = dynamic(() => import("@/components/web/Footer"), {
  ssr: true,
});

const Navbar = dynamic(() => import("@/components/web/Navbar").then((mod) => mod.Navbar), {
  ssr: true,
});

export default async function SharedLayout({ children }: { children: ReactNode }) {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  const userIsAuthenticated = !!session?.data?.user;
  const initialImage = session?.data?.user?.image || null;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 ease-in-out">
      <Navbar isAuth={userIsAuthenticated} initialImage={initialImage} />
      <GridBackground>
        {children} 
      </GridBackground>
    </div>
  );
}