import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const recordCompletedPurchase = internalMutation({
  args: {
    seriesId: v.id("series"),
    userId: v.string(),
    authorId: v.string(),
    amountPaid: v.number(),
    currency: v.string(),
    stripeSessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("purchases")
      .withIndex("by_user_and_series", (q) =>
        q.eq("userId", args.userId).eq("seriesId", args.seriesId)
      )
      .unique();

    if (existing) return;

    await ctx.db.insert("purchases", {
      userId: args.userId,
      seriesId: args.seriesId,
      authorId: args.authorId,
      amountPaid: args.amountPaid,
      currency: args.currency,
      stripeSessionId: args.stripeSessionId,
      status: "completed",
    });
  },
});