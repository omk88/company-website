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

export const getPaginatedSeriesItemsBySlug = query({
  args: {
    slug: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const series = await ctx.db
      .query("series")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!series) {
      return { page: [], isDone: true, continueCursor: "" };
    }

    const paginatedItems = await ctx.db
      .query("seriesItems")
      .withIndex("by_series_and_order", (q) => q.eq("seriesId", series._id))
      .paginate(args.paginationOpts);

    const blogs = await Promise.all(
      paginatedItems.page.map(async (item) => {
        const blog = await ctx.db.get(item.articleId);
        return blog;
      })
    );

    return {
      ...paginatedItems,
      page: blogs.filter(Boolean),
    };
  },
});

export const getSeriesBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const series = await ctx.db
      .query("series")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!series) return null;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", series.authorId))
      .first();

    let profilePicUrl = null;
    if (profile) {
      const storageIdToFetch = profile.profilePic ?? profile.defaultProfilePic;
      if (storageIdToFetch) {
        profilePicUrl = await ctx.storage.getUrl(storageIdToFetch);
      }
    }

    const seriesItems = await ctx.db
      .query("seriesItems")
      .withIndex("by_series_and_order", (q) => q.eq("seriesId", series._id))
      .collect();

    const blogs = await Promise.all(
      seriesItems.map(async (item) => {
        const blog = await ctx.db.get(item.articleId);
        return blog ? { ...blog, order: item.order } : null;
      })
    );

    return {
      ...series,
      profile: profile
        ? {
            ...profile,
            profilePicUrl,
          }
        : null,
      blogs: blogs.filter(Boolean),
    };
  },
});

export const getSeriesForBlog = query({
  args: { blogId: v.id("blogs") },
  handler: async (ctx, args) => {
    const seriesItemEntries = await ctx.db
      .query("seriesItems")
      .withIndex("by_article", (q) => q.eq("articleId", args.blogId))
      .collect();

    if (seriesItemEntries.length === 0) return [];

    const seriesWithNavigation = await Promise.all(
      seriesItemEntries.map(async (entry) => {
        const series = await ctx.db.get(entry.seriesId);
        if (!series) return null;

        const allItemsInSeries = await ctx.db
          .query("seriesItems")
          .withIndex("by_series_and_order", (q) => q.eq("seriesId", series._id))
          .collect();

        allItemsInSeries.sort((a, b) => a.order - b.order);

        const currentIndex = allItemsInSeries.findIndex(
          (item) => item.articleId === args.blogId
        );

        const prevItem = currentIndex > 0 ? allItemsInSeries[currentIndex - 1] : null;
        const nextItem = currentIndex < allItemsInSeries.length - 1 ? allItemsInSeries[currentIndex + 1] : null;

        const prevBlog = prevItem ? await ctx.db.get(prevItem.articleId) : null;
        const nextBlog = nextItem ? await ctx.db.get(nextItem.articleId) : null;

        return {
          series,
          currentIndex: currentIndex + 1,
          totalCount: allItemsInSeries.length,
          prev: prevBlog ? { title: prevBlog.title, id: prevBlog._id } : null,
          next: nextBlog ? { title: nextBlog.title, id: nextBlog._id } : null,
        };
      })
    );

    return seriesWithNavigation.filter(Boolean);
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