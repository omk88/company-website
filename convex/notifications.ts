import { paginationOptsValidator } from "convex/server";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUnreadPosts = query({
  args: {
    userId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!profile) {
      return { page: [], isDone: true, continueCursor: "" };
    }

    const lastChecked = profile.lastCheckedNotificationsAt ?? 0;

    const follows = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", args.userId))
      .collect();

    if (follows.length === 0) {
      return { page: [], isDone: true, continueCursor: "" };
    }

    const followingIds = follows.map((f) => f.followingId);

    const paginatedBlogs = await ctx.db
      .query("blogs")
      .withIndex("by_createdAt")
      .order("desc")
      .filter((q) =>
        q.and(
          q.gt(q.field("createdAt"), lastChecked),
          q.or(...followingIds.map((id) => q.eq(q.field("author"), id)))
        )
      )
      .paginate(args.paginationOpts);

    return {
      ...paginatedBlogs,
      page: paginatedBlogs.page.map((blog) => ({
        _id: blog._id,
        title: blog.title,
        imageUrl: blog.imageUrl,
        createdAt: blog.createdAt,
        author: blog.displayName || blog.username,
        authorAvatarUrl: blog.authorAvatarUrl,
      })),
    };
  },
});

export const markNotificationsAsRead = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!profile) {
      throw new Error("Profile not found.");
    }

    await ctx.db.patch(profile._id, {
      lastCheckedNotificationsAt: Date.now(),
    });
  },
});