import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createPost = mutation({
  args: {
    title: v.string(),
    subtitle: v.string(),
    imageUrl: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {

    const newBlogId = await ctx.db.insert("blogs", {
      title: args.title,
      subtitle: args.subtitle,
      imageUrl: args.imageUrl,
      content: args.content,
      createdAt: Date.now(),
    });

    return newBlogId;
  },
});