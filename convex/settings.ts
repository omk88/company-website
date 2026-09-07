import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const updateProfileSettings = mutation({
  args: {
    userId: v.string(),
    emailNotifications: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const settings = await ctx.db
      .query("profileSettings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    if (!settings) {
      throw new Error(`Profile settings for user ${args.userId} not found`);
    }

    const updates: Partial<{ emailNotifications: boolean }> = {};
    
    if (args.emailNotifications !== undefined) {
      updates.emailNotifications = args.emailNotifications;
    }

    await ctx.db.patch(settings._id, updates);

    return settings._id;
  },
});

export const getProfileSettings = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {

    const settings = await ctx.db
      .query("profileSettings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    return settings;
  },
});