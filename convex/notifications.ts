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
    const blogItems = nestedPosts.flat();

    const profileBlogs = await ctx.db
      .query("blogs")
      .withIndex("by_author", (q) => q.eq("author", args.userId))
      .collect();

    const commentPromises = profileBlogs.map((blog) => 
      ctx.db
        .query("comments")
        .withIndex("by_blog", (q) => q.eq("blogId", blog._id))
        .order("desc")
        .take(10)
    );

    const nestedComments = await Promise.all(commentPromises);
    const commentItems = nestedComments
      .flat()
      .filter((comment) => comment.authorId !== args.userId);

    const [enrichedBlogs, enrichedComments] = await Promise.all([
      Promise.all(
        blogItems.map(async (blog) => {
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
            notificationType: "blog" as const,
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
      ),

      Promise.all(
        commentItems.map(async (comment) => {
          const authorProfile = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", comment.authorId))
            .unique();

          const profilePic = authorProfile?.profilePic
            ? await ctx.storage.getUrl(authorProfile.profilePic)
            : null;

          const defaultProfilePic = authorProfile?.defaultProfilePic
            ? await ctx.storage.getUrl(authorProfile.defaultProfilePic)
            : null;

          return {
            _id: comment._id,
            notificationType: "comment" as const,
            blogId: comment.blogId,
            blogTitle: comment.blogTitle,
            body: comment.body,
            createdAt: comment._creationTime,
            author: comment.authorId,
            authorUsername: comment.username,
            authorDisplayName: comment.displayName || comment.username,
            profilePic,
            defaultProfilePic,
            isUnread: comment._creationTime > lastRead,
          };
        })
      ),
    ]);

    const allNotifications = [...enrichedBlogs, ...enrichedComments].sort(
      (a, b) => b.createdAt - a.createdAt
    );

    const pageSize = args.paginationOpts.numItems;
    const selectedPage = allNotifications.slice(0, pageSize);

    return {
      page: selectedPage,
      isDone: allNotifications.length <= pageSize,
      continueCursor: "",
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

    if (profile) {
      await ctx.db.patch(profile._id, {
        lastReadNotificationsAt: Date.now(),
      });
    }
  },
});