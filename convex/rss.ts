import { query } from "./_generated/server";
import { v } from "convex/values";

export const listForFeed = query({
  args: {
    postType: v.optional(v.union(v.literal("community"), v.literal("team"))),
  },
  handler: async (ctx, args) => {
    const baseQuery = args.postType
      ? ctx.db
          .query("blogs")
          .withIndex("by_type", (q) => q.eq("postType", args.postType!))
          .order("desc")
      : ctx.db
          .query("blogs")
          .withIndex("by_createdAt")
          .order("desc");

    const posts = await baseQuery.take(50);

    return posts.map((post) => ({
      _id: post._id,
      blogTitleId: post.blogTitleId,
      title: post.title,
      subtitle: post.subtitle,
      content: post.content,
      author: post.displayName ?? post.author,
      tags: post.tags,
      createdAt: post.createdAt,
      imageUrl: post.imageUrl,
      audioUrl: post.audioUrl,
      postType: post.postType,
    }));
  },
});