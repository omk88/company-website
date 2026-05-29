import { ThemeProvider } from "@/components/ui/theme-provider"

import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { Poppins } from "next/font/google"; 


import { Toaster } from "@/components/ui/sonner"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], 
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "TaQtiQ",
  description: "TaQtiQ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} min-h-full flex flex-col transition-colors duration-300 font-sans`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
        >
          <main className="max-w-7xl mx-auto w-full">
            <ConvexClientProvider>
              {children}
            </ConvexClientProvider>
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}