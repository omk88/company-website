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

    return await Promise.all(
      posts.map(async (post) => {
        const memberships = await ctx.db
          .query("seriesItems")
          .withIndex("by_article", (q) => q.eq("articleId", post._id))
          .collect();

        const seriesDocs = await Promise.all(
          memberships.map((item) => ctx.db.get(item.seriesId))
        );

        const isPaid = seriesDocs.some(
          (series) => series !== null && series.price > 0
        );

        return {
          _id: post._id,
          blogTitleId: post.blogTitleId,
          title: post.title,
          subtitle: post.subtitle,
          content: isPaid ? undefined : post.content,
          author: post.displayName ?? post.author,
          tags: post.tags,
          createdAt: post.createdAt,
          imageUrl: post.imageUrl,
          audioUrl: isPaid ? undefined : post.audioUrl,
          postType: post.postType,
          isPaid,
        };
      })
    );
  },
});