import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const subscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("subscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existing) return "Already subscribed!";

    await ctx.db.insert("subscribers", {
      email: args.email,
      subscribedAt: Date.now(),
    });
    
    return "Success!";
  },
});

export const getAllSubscribers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("subscribers").collect();
  },
});