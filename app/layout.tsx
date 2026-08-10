import type { Metadata } from "next";
import { JetBrains_Mono, Poppins } from "next/font/google"; 
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import GridBackground from "@/components/web/GridBackground"; 
import { Suspense } from "react";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { BookmarksProvider } from "@/providers/BookmarksProvider";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import dynamic from "next/dynamic";


const Navbar = dynamic(() => import("@/components/web/Navbar").then((mod) => mod.Navbar), {
  ssr: true,
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['700'],
  variable: "--font-poppins"
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: "--font-jetbrains-mono"
});

export const metadata: Metadata = {
  title: {
    default: "TaQtiQ | Software that pushes boundaries.",
    template: "%s | TaQtiQ",               
  },
  description: "Description"
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  const userIsAuthenticated = !!session?.data?.user;
  const initialImage = session?.data?.user?.image || null;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jetBrainsMono.variable} ${poppins.variable} flex flex-col bg-background text-foreground font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GridBackground>
            <main>
              <Suspense>
                <ConvexClientProvider>
                  <BookmarksProvider>
                    <Navbar isAuth={userIsAuthenticated} initialImage={initialImage} />
                    {children}
                  </BookmarksProvider>
                </ConvexClientProvider>
              </Suspense>
            </main>
          </GridBackground>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}