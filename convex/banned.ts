import { ConvexError } from "convex/values";
import { MutationCtx, QueryCtx } from "./_generated/server";

export async function requireActiveUser(ctx: MutationCtx | QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError({
      code: "UNAUTHENTICATED",
      message: "You must be logged in to perform this action.",
    });
  }

  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
    .unique();

  if (!profile) {
    throw new ConvexError({
      code: "PROFILE_NOT_FOUND",
      message: "User profile could not be found.",
    });
  }

  const isCurrentlyBanned =
    profile.isBanned &&
    (profile.bannedUntil === null ||
     profile.bannedUntil === undefined ||
     profile.bannedUntil > Date.now());

  if (isCurrentlyBanned) {
    throw new ConvexError({
      code: "USER_BANNED",
      message: "Your account is currently suspended.",
      banReason: profile.banReason ?? "Violation of community guidelines.",
      banViolations: profile.banViolations ?? [],
      bannedAt: profile.bannedAt ?? null,
      bannedUntil: profile.bannedUntil ?? null,
    });
  }

  return {
    identity,
    profile,
  };
}