import type { Metadata } from "next";
import { JetBrains_Mono, Poppins } from "next/font/google"; 
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import GridBackground from "@/components/web/GridBackground"; 
import { ConvexClientProvider } from "./ConvexClientProvider";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

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
              <ConvexClientProvider>
                <Navbar />
                {children}
              </ConvexClientProvider>
            </main>
          </GridBackground>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}