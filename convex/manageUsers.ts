import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const banUser = mutation({
  args: {
    userId: v.id("profiles"),
    reason: v.string(),
    violations: v.array(v.string()),
    durationMs: v.union(v.number(), v.null()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: Must be logged in");
    }

    const targetUser = await ctx.db.get(args.userId);
    if (!targetUser) {
      throw new Error("User not found");
    }

    const now = Date.now();
    const bannedUntil = args.durationMs !== null ? now + args.durationMs : null;

    await ctx.db.patch(args.userId, {
      isBanned: true,
      banReason: args.reason,
      banViolations: args.violations,
      bannedAt: now,
      bannedUntil: bannedUntil,
    });

    return { success: true };
  },
});