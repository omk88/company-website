import { ThemeProvider } from "@/components/ui/theme-provider"
import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { JetBrains_Mono, Poppins } from "next/font/google"; 
import { Toaster } from "@/components/ui/sonner"

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
  title: "TaQtiQ",
  description: "TaQtiQ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={`${jetBrainsMono.variable} ${poppins.variable} min-h-full flex flex-col bg-[#f8f9fa] transition-colors duration-300 font-sans antialiased text-neutral-950`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="light" 
            enableSystem
        >
          <main className="max-w-7xl mx-auto w-full flex-1">
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