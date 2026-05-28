import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createPost = mutation({
  args: {
    title: v.string(),
    subtitle: v.string(),
    imageUrl: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("blogs", {
      title: args.title,
      subtitle: args.subtitle,
      imageUrl: args.imageUrl,
      content: args.content,
      tags: args.tags, 
      createdAt: Date.now(),
    });
  },
});

export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("blogs")
      .order("desc")
      .collect();
  },
});