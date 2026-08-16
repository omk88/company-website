import { Suspense } from "react";
import { preloadAuthQuery } from "@/lib/auth-server";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import { ConvexClientProvider } from "@/app/ConvexClientProvider";

async function AuthDataLoader({ children }: { children: React.ReactNode }) {
  const token = await getToken();
  const preloadedUser = await preloadAuthQuery(api.auth.getCurrentUser, {});

  return (
    <ConvexClientProvider initialToken={token} preloadedUser={preloadedUser}>
      {children}
    </ConvexClientProvider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AuthDataLoader>{children}</AuthDataLoader>
    </Suspense>
  );
}