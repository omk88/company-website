import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getProxyUserStatus = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();

    if (!profile) return null;

    const isCurrentlyBanned =
      profile.isBanned &&
      (profile.bannedUntil === null || 
       profile.bannedUntil === undefined || 
       profile.bannedUntil > Date.now());

    return {
      isBanned: isCurrentlyBanned,
      banReason: profile.banReason,
      bannedUntil: profile.bannedUntil ?? null,
    };
  },
});

export const banUser = mutation({
  args: {
    userId: v.string(),
    reason: v.string(),
    violations: v.array(v.string()),
    durationMs: v.union(v.number(), v.null()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: Must be logged in");
    }

    const targetProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!targetProfile) {
      throw new Error("User profile not found");
    }

    const now = Date.now();
    const bannedUntil = args.durationMs !== null ? now + args.durationMs : null;

    await ctx.db.patch(targetProfile._id, {
      isBanned: true,
      banReason: args.reason,
      banViolations: args.violations,
      bannedAt: now,
      bannedUntil: bannedUntil,
    });

    return { success: true };
  },
});