import { Suspense } from "react";
import { ConvexClientProvider } from "@/app/ConvexClientProvider";

export default function AuthProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConvexClientProvider>
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </ConvexClientProvider>
  );
}