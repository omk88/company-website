import { paginationOptsValidator } from "convex/server";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getNotifications = query({
  args: {
    userId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!profile) return { page: [], isDone: true, continueCursor: "" };

    const lastRead = profile.lastReadNotificationsAt ?? 0;

    const follows = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", args.userId))
      .collect();

    if (follows.length === 0) return { page: [], isDone: true, continueCursor: "" };

    const postPromises = follows.map((follow) =>
      ctx.db
        .query("blogs")
        .withIndex("by_author_createdAt", (q) =>
          q.eq("author", follow.followingId).gt("createdAt", follow._creationTime)
        )
        .order("desc")
        .take(15)
    );

    const nestedPosts = await Promise.all(postPromises);
    const allPosts = nestedPosts.flat().sort((a, b) => b.createdAt - a.createdAt);

    const pageSize = args.paginationOpts.numItems;
    const selectedPosts = allPosts.slice(0, pageSize);

    const postsWithAuthors = await Promise.all(
      selectedPosts.map(async (blog) => {
        const authorProfile = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", blog.author))
          .unique();

        const profilePic = authorProfile?.profilePic 
          ? await ctx.storage.getUrl(authorProfile.profilePic) 
          : null;

        const defaultProfilePic = authorProfile?.defaultProfilePic 
          ? await ctx.storage.getUrl(authorProfile.defaultProfilePic) 
          : null;

        return {
          _id: blog._id,
          title: blog.title,
          imageUrl: blog.imageUrl,
          createdAt: blog.createdAt,
          author: blog.author,
          authorUsername: authorProfile?.username ?? "",
          authorDisplayName: authorProfile?.displayName ?? "",
          profilePic,
          defaultProfilePic,
          isUnread: blog.createdAt > lastRead,
        };
      })
    );

    return { page: postsWithAuthors, isDone: allPosts.length <= pageSize, continueCursor: "" };
  },
});

export const markNotificationsAsRead = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (profile) {
      await ctx.db.patch(profile._id, {
        lastReadNotificationsAt: Date.now(),
      });
    }
  },
});