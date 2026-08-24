import { api } from "@/convex/_generated/api";
import { QueryCtx, MutationCtx } from "@/convex/_generated/server";
import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";

export const {
  handler,
  preloadAuthQuery,
  isAuthenticated,
  getToken,
  fetchAuthQuery,
  fetchAuthMutation,
  fetchAuthAction,
} = convexBetterAuthNextJs({
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
  convexSiteUrl: process.env.NEXT_PUBLIC_CONVEX_SITE_URL!,
});

export async function getServerAuth() {
  try {
    const user = await fetchAuthQuery(api.auth.getCurrentUser, {});
    return {
      isAuth: !!user,
      initialImage: user?.profile?.profilePicUrl || null,
      initialProfile: user?.profile ? {
        username: user.profile.username,
        displayName: user.profile.displayName,
      } : null,
    };
  } catch (error) {
    return { isAuth: false, initialImage: null, initialProfile: null };
  }
}

export async function getCurrentUserProfile(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }
  
  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_userId", (q) => q.eq("userId", identity.subject as any))
    .unique();

  return {
    ...profile,
  }}