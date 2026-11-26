import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const sendMessage = mutation({
  args: {
    email: v.string(),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("contactMessages", {
      email: args.email,
      subject: args.subject,
      message: args.message,
    });

    return { success: true, messageId };
  },
});