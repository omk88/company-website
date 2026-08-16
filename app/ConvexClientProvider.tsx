"use client";

import { createContext, useContext } from "react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient, Preloaded, usePreloadedQuery } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { api } from "@/convex/_generated/api";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const PreloadedUserContext = createContext<Preloaded<typeof api.auth.getCurrentUser> | null>(null);

export function ConvexClientProvider({
  children,
  initialToken,
  preloadedUser,
}: {
  children: React.ReactNode;
  initialToken?: string | null;
  preloadedUser?: Preloaded<typeof api.auth.getCurrentUser>;
}) {
  return (
    <ConvexBetterAuthProvider
      client={convex}
      authClient={authClient}
      initialToken={initialToken}
    >
      <PreloadedUserContext.Provider value={preloadedUser ?? null}>
        {children}
      </PreloadedUserContext.Provider>
    </ConvexBetterAuthProvider>
  );
}

export function useCurrentUser() {
  const preloaded = useContext(PreloadedUserContext);
  if (!preloaded) {
    return null;
  }
  return usePreloadedQuery(preloaded);
}