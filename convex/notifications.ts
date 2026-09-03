import { paginationOptsValidator } from "convex/server";
import { Id } from "./_generated/dataModel";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUnreadPosts = query({
  args: {
    profileId: v.id("profiles"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.profileId);
    if (!profile) {
      return { page: [], isDone: true, continueCursor: "" };
    }

    const lastChecked = profile.lastCheckedNotificationsAt ?? 0;

    console.log("Cheii", lastChecked);

    const follows = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) =>
        q.eq("followerId", args.profileId as Id<"profiles">)
      )
      .collect();

    if (follows.length === 0) {
      return { page: [], isDone: true, continueCursor: "" };
    }

    const followingIds = follows.map((f) => f.followingId);

    console.log("FOLLOWIDS", followingIds);

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

    console.log("FOLLOWEE", paginatedBlogs);

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
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.profileId, {
      lastCheckedNotificationsAt: Date.now(),
    });
  },
});