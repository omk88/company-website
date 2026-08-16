import type { Metadata } from "next";
import { JetBrains_Mono, Lexend, Poppins, Roboto } from "next/font/google"; 
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import GridBackground from "@/components/web/GridBackground"; 
import { ConvexClientProvider } from "./ConvexClientProvider";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { api } from "@/convex/_generated/api";
import { getToken, preloadAuthQuery } from "@/lib/auth-server";
import { AuthProvider } from "@/components/web/AuthProvider";

const Navbar = dynamic(() => import("@/components/web/Navbar").then((mod) => mod.Navbar), {
  ssr: true,
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-roboto",
});

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lexend",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: {
    default: "TaQtiQ | Software that pushes boundaries.",
    template: "%s | TaQtiQ",               
  },
  description: "Description"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${lexend.variable} ${poppins.variable} ${jetBrainsMono.variable} ${roboto.variable} font-sans flex flex-col bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GridBackground>
            <main>
              <AuthProvider>
                <Navbar />
                {children}
              </AuthProvider>
            </main>
          </GridBackground>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}