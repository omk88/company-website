import { Id } from "./_generated/dataModel";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUnreadPosts = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.profileId);
    if (!profile) return { count: 0, notifications: [] };

    const lastChecked = profile.lastCheckedNotificationsAt ?? 0;

    const follows = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", args.profileId as Id<"profiles">))
      .collect();

    if (follows.length === 0) {
      return { count: 0, notifications: [] };
    }

    const followedIds = new Set(follows.map((f) => f.followingId.toString()));

    const recentBlogs = await ctx.db
      .query("blogs")
      .withIndex("by_createdAt", (q) => q.gt("createdAt", lastChecked))
      .order("desc")
      .collect();

    return {
      count: recentBlogs.length,
      notifications: recentBlogs.map((blog) => ({
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