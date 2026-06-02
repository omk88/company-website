import type { Metadata } from "next";
import { JetBrains_Mono, Poppins } from "next/font/google"; 
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

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
      <body className={`${jetBrainsMono.variable} ${poppins.variable} min-h-full flex flex-col bg-white transition-colors duration-300 font-sans antialiased text-neutral-950`}>
        <main className="max-w-7xl mx-auto w-full flex-1">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}