import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getCommentsByBlog = query({
  args: {
    blogId: v.id("blogs")
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_blog", (q) => q.eq("blogId", args.blogId))
      .order("desc")
      .collect();
  }
});

export const getCommentsByAuthor = query({
  args: {
    authorId: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_authorId", (q) => q.eq("authorId", args.authorId))
      .order("desc")
      .collect();
  }
})

export const getCommentNumber = query({
  args: {
    blogId: v.id("blogs")
  },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.blogId);
    return blog?.commentCount ?? 0;
  }
});

export const createComment = mutation({
  args: {
    body: v.string(),
    blogId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    const blog = await ctx.db.get(args.blogId);
    if (!blog) { return null; }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    if (!profile) {
      throw new ConvexError("User profile not found");
    }

    const [commentId] = await Promise.all([
      ctx.db.insert("comments", {
        blogId: args.blogId,
        body: args.body,
        authorId: user._id,
        authorName: user.name ?? profile.username, 
        authorProfilePic: profile.profilePic,  
        blogTitle: blog.title,                 
        likes: 0,
      }),
      ctx.db.patch(args.blogId, {
        commentCount: (blog.commentCount ?? 0) + 1,
      }),
      ctx.db.patch(profile._id, {
        commentsPublished: (profile.commentsPublished || 0) + 1,
      })
    ]);

    return commentId;
  },
});

export const getCommentVoteState = query({
  args: { commentId: v.id("comments") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const comment = await ctx.db.get(args.commentId);
    if (!comment) return null; 

    let hasVoted = false;
    if (identity) {
      const vote = await ctx.db
        .query("commentVotes")
        .withIndex("by_user_and_comment", (q) =>
          q.eq("userId", identity.subject).eq("commentId", args.commentId)
        )
        .unique();
      hasVoted = !!vote;
    }

    return {
      hasVoted,
      likes: comment.likes ?? 0,
    };
  },
});

export const toggleCommentVote = mutation({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("You must be logged in to vote.");
    const userId = identity.subject;

    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new ConvexError("Comment not found.");

    const existingVote = await ctx.db
      .query("commentVotes")
      .withIndex("by_user_and_comment", (q) =>
        q.eq("userId", userId).eq("commentId", args.commentId)
      )
      .unique();

    let newLikes = comment.likes ?? 0;
    let likesChange = 0;

    if (existingVote) {
      await ctx.db.delete(existingVote._id);
      newLikes = Math.max(0, newLikes - 1);
      likesChange = -1;
    } else {
      await ctx.db.insert("commentVotes", {
        userId,
        commentId: args.commentId,
      });
      newLikes += 1;
      likesChange = 1;
    }

    await ctx.db.patch(args.commentId, {
      likes: newLikes,
    });

    if (likesChange !== 0) {
      const authorProfile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", comment.authorId))
        .unique();

      if (authorProfile) {
        const currentProfileLikes = authorProfile.totalLikes ?? 0;
        await ctx.db.patch(authorProfile._id, {
          totalLikes: Math.max(0, currentProfileLikes + likesChange),
        });
      }
    }
  },
});