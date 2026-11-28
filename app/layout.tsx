import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Lexend, Poppins, Roboto } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { BanProvider } from "@/components/web/BanProvider";
import ThemeInitialiser from "./(shared-layout)/_components/ThemeInitialiser";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-roboto",
});

const inter = Inter({
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.taqtiq.tech";

export const metadata: Metadata = {
  title: {
    default: "TaQtiQ | Software that pushes boundaries.",
    template: "%s | TaQtiQ",
  },
  alternates: {
    types: {
      "application/rss+xml": `${SITE_URL}/feed.xml`,
    },
  },
  description: "TaQtiQ is a London-based software development firm. We focus on driving progress within the technology sector with our innovative approach to problem solving.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth scroll-pt-16">
      <body
        className={`${inter.variable} ${poppins.variable} ${jetBrainsMono.variable} ${roboto.variable} font-sans flex flex-col bg-background text-foreground`}
      >
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              'gtm.start': new Date().getTime(),
              event: 'gtm.js'
            });
          `}
        </Script>
        <Script
          id="gtm-script"
          src="https://www.googletagmanager.com/gtm.js?id=GTM-NFR9W95N"
          strategy="afterInteractive"
        />

        <Script
          id="adsense-script"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5236028024537102"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <ThemeInitialiser />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main>
            <ConvexClientProvider>
              <BanProvider>{children}</BanProvider>
            </ConvexClientProvider>
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}