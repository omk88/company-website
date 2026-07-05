import { ReactNode } from "react";

export default function InsightsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full flex relative items-stretch justify-between min-h-[calc(100vh-4rem)]">
      <style dangerouslySetInnerHTML={{
        __html: `
          html {
            scroll-behavior: auto !important;
          }
        `
      }} />

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}