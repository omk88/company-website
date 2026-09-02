import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUnreadPosts = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.profileId);
    if (!profile) return { count: 0, notifications: [] };

    const lastChecked = profile.lastCheckedNotificationsAt ?? 0;

    const unreadBlogs = await ctx.db
      .query("blogs")
      .withIndex("by_createdAt", (q) => q.gt("createdAt", lastChecked))
      .order("desc")
      .take(10);

    return {
      count: unreadBlogs.length,
      notifications: unreadBlogs.map((blog) => ({
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