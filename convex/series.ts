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

export const getSeriesWithArticleCounts = query({
  args: { author: v.string() },
  handler: async (ctx, args) => {
    const allSeries = await ctx.db
      .query("series")
      .withIndex("by_authorId", (q) => q.eq("authorId", args.author))
      .collect();

    const seriesWithCounts = await Promise.all(
      allSeries.map(async (series) => {
        const items = await ctx.db
          .query("seriesItems")
          .withIndex("by_series_and_order", (q) => q.eq("seriesId", series._id))
          .collect();
        return {
          ...series,
          articleCount: items.length,
        };
      })
    );

    return seriesWithCounts;
  },
});

export const addArticleToSeries = mutation({
  args: {
    seriesId: v.id("series"),
    articleId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated: You must be logged in.");
    }

    const existing = await ctx.db
      .query("seriesItems")
      .withIndex("by_series_and_order", (q) => q.eq("seriesId", args.seriesId))
      .collect();

    const alreadyExists = existing.some((item) => item.articleId === args.articleId);
    if (alreadyExists) {
      throw new Error("This article is already in the selected series.");
    }

    const nextOrder = existing.length > 0 ? Math.max(...existing.map((i) => i.order)) + 1 : 0;

    await ctx.db.insert("seriesItems", {
      seriesId: args.seriesId,
      articleId: args.articleId,
      order: nextOrder,
    });
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthenticated: You must be logged in to upload an image.");
  }
  return await ctx.storage.generateUploadUrl();
});

export const getImageUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});