import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUnreadPostsCount = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.profileId);
    if (!profile) return 0;

    const lastRead = profile.lastCheckedNotificationsAt ?? 0;

    const follows = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", args.profileId))
      .filter((q) => q.eq(q.field("isBell"), true))
      .collect();

    if (follows.length === 0) return 0;

    let unreadCount = 0;

    for (const follow of follows) {
      const followedProfile = await ctx.db.get(follow.followingId);
      if (!followedProfile) continue;

      const newPosts = await ctx.db
        .query("blogs")
        .withIndex("by_author", (q) =>
          q.eq("author", followedProfile.userId)
        )
        .filter((q) => q.gt(q.field("createdAt"), lastRead))
        .collect();

      unreadCount += newPosts.length;
    }

    return unreadCount;
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