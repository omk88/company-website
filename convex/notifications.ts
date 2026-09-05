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

    const followers = await ctx.db
      .query("follows")
      .withIndex("by_following", (q) => q.eq("followingId", args.userId))
      .collect();

    const profileBlogs = await ctx.db
      .query("blogs")
      .withIndex("by_author", (q) => q.eq("author", args.userId))
      .collect();

    let blogItems: Array<any> = [];
    if (follows.length > 0) {
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
      blogItems = nestedPosts.flat();
    }

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

    // Fetch likes (blogVotes) for the user's blogs
    const votePromises = profileBlogs.map((blog) =>
      ctx.db
        .query("blogVotes")
        .withIndex("by_blog", (q) => q.eq("blogId", blog._id))
        .order("desc")
        .take(20)
    );
    const nestedVotes = await Promise.all(votePromises);
    const voteItems = nestedVotes
      .flat()
      .filter((vote) => vote.userId !== args.userId);

    const reactionPromises = profileBlogs.map((blog) =>
      ctx.db
        .query("blogReactions")
        .withIndex("by_blog", (q) => q.eq("blogId", blog._id))
        .order("desc")
        .take(20)
    );
    const nestedReactions = await Promise.all(reactionPromises);
    const rawReactions = nestedReactions
      .flat()
      .filter((reaction) => reaction.userId !== args.userId);

    const groupedReactionsMap = new Map<string, {
      userId: string;
      blogId: any;
      reactions: string[];
      latestCreationTime: number;
    }>();

    for (const rx of rawReactions) {
      const groupKey = `${rx.userId}_${rx.blogId}`;
      const existing = groupedReactionsMap.get(groupKey);

      if (existing) {
        existing.reactions.push(rx.type);
        if (rx._creationTime > existing.latestCreationTime) {
          existing.latestCreationTime = rx._creationTime;
        }
      } else {
        groupedReactionsMap.set(groupKey, {
          userId: rx.userId,
          blogId: rx.blogId,
          reactions: [rx.type],
          latestCreationTime: rx._creationTime,
        });
      }
    }

    const groupedReactions = Array.from(groupedReactionsMap.values());

    const [
      enrichedBlogs,
      enrichedComments,
      enrichedFollowers,
      enrichedVotes,
      enrichedReactions,
    ] = await Promise.all([
      Promise.all(
        blogItems.map(async (blog) => {
          const authorProfile = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", blog.author))
            .unique();

          return {
            _id: blog._id,
            notificationType: "blog" as const,
            title: blog.title,
            imageUrl: blog.imageUrl,
            createdAt: blog.createdAt,
            author: blog.author,
            authorUsername: authorProfile?.username ?? "",
            authorDisplayName: authorProfile?.displayName ?? "",
            profilePic: authorProfile?.profilePic
              ? await ctx.storage.getUrl(authorProfile.profilePic)
              : null,
            defaultProfilePic: authorProfile?.defaultProfilePic
              ? await ctx.storage.getUrl(authorProfile.defaultProfilePic)
              : null,
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
            profilePic: authorProfile?.profilePic
              ? await ctx.storage.getUrl(authorProfile.profilePic)
              : null,
            defaultProfilePic: authorProfile?.defaultProfilePic
              ? await ctx.storage.getUrl(authorProfile.defaultProfilePic)
              : null,
            isUnread: comment._creationTime > lastRead,
          };
        })
      ),

      Promise.all(
        followers.map(async (follow) => {
          const followerProfile = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", follow.followerId))
            .unique();

          const isSelf = Boolean(
            followerProfile && followerProfile.userId === profile.userId
          );

          const followRecord =
            followerProfile && !isSelf
              ? await ctx.db
                  .query("follows")
                  .withIndex("by_follower_and_following", (q) =>
                    q
                      .eq("followerId", profile.userId)
                      .eq("followingId", followerProfile.userId)
                  )
                  .unique()
              : null;

          return {
            _id: follow.followerId,
            notificationType: "follow" as const,
            username: followerProfile?.username ?? "",
            displayName:
              followerProfile?.displayName || followerProfile?.username || "",
            profilePicUrl: followerProfile?.profilePic
              ? await ctx.storage.getUrl(followerProfile.profilePic)
              : null,
            defaultProfilePicUrl: followerProfile?.defaultProfilePic
              ? await ctx.storage.getUrl(followerProfile.defaultProfilePic)
              : null,
            createdAt: follow._creationTime,
            viewerStatus: {
              isFollowing: Boolean(followRecord),
              isBell: followRecord?.isBell ?? false,
              isSelf,
            },
            isUnread: follow._creationTime > lastRead,
          };
        })
      ),

      Promise.all(
        voteItems.map(async (vote) => {
          const targetBlog = profileBlogs.find((b) => b._id === vote.blogId);
          const actorProfile = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", vote.userId))
            .unique();

          return {
            _id: vote._id,
            notificationType: "like" as const,
            blogId: vote.blogId,
            blogTitle: targetBlog?.title ?? "",
            createdAt: vote._creationTime,
            author: vote.userId,
            authorUsername: actorProfile?.username ?? "",
            authorDisplayName:
              actorProfile?.displayName || actorProfile?.username || "",
            profilePic: actorProfile?.profilePic
              ? await ctx.storage.getUrl(actorProfile.profilePic)
              : null,
            defaultProfilePic: actorProfile?.defaultProfilePic
              ? await ctx.storage.getUrl(actorProfile.defaultProfilePic)
              : null,
            isUnread: vote._creationTime > lastRead,
          };
        })
      ),

      Promise.all(
        groupedReactions.map(async (group) => {
          const targetBlog = profileBlogs.find((b) => b._id === group.blogId);

          const actorProfile = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", group.userId))
            .unique();

          return {
            _id: `${group.userId}_${group.blogId}`,
            notificationType: "reaction" as const,
            blogId: group.blogId,
            blogTitle: targetBlog?.title ?? "",
            reactions: group.reactions,
            createdAt: group.latestCreationTime,
            author: group.userId,
            authorUsername: actorProfile?.username ?? "",
            authorDisplayName:
              actorProfile?.displayName || actorProfile?.username || "",
            profilePic: actorProfile?.profilePic
              ? await ctx.storage.getUrl(actorProfile.profilePic)
              : null,
            defaultProfilePic: actorProfile?.defaultProfilePic
              ? await ctx.storage.getUrl(actorProfile.defaultProfilePic)
              : null,
            isUnread: group.latestCreationTime > lastRead,
          };
        })
      ),
    ]);

    const allNotifications = [
      ...enrichedBlogs,
      ...enrichedComments,
      ...enrichedFollowers,
      ...enrichedVotes,
      ...enrichedReactions,
    ].sort((a, b) => b.createdAt - a.createdAt);

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