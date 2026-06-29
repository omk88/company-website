import type { Metadata } from "next";
import { JetBrains_Mono, Poppins } from "next/font/google"; 
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import GridBackground from "@/components/web/GridBackground"; 
import { Suspense } from "react";

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
    default: "TaQtiQ | Digital Solutions",
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
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={`${jetBrainsMono.variable} ${poppins.variable} min-h-full flex flex-col bg-background text-foreground transition-colors duration-300 font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GridBackground>
            <main className="w-full flex-1 flex flex-col">
              {children}
            </main>
          </GridBackground>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}