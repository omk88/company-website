import { api } from "@/convex/_generated/api";
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
    };
  } catch (error) {
    return { isAuth: false, initialImage: null };
  }
}