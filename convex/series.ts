import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getPaginatedSeriesByAuthor = query({
  args: {
    author: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const paginatedSeries = await ctx.db
      .query("series")
      .withIndex("by_authorId", (q) => q.eq("authorId", args.author))
      .order("desc")
      .paginate(args.paginationOpts);

    return paginatedSeries;
  },
});

export const createSeries = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    coverImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated: You must be logged in to create a series.");
    }

    const userId = identity.subject;

    const seriesId = await ctx.db.insert("series", {
      title: args.title,
      slug: args.slug,
      description: args.description,
      coverImage: args.coverImage,
      authorId: userId,
    });

    return seriesId;
  },
});