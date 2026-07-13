import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getCommentsByPost = query({
  args: {
    postId: v.id("blogs")
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_postId", (q) => q.eq("postId", args.postId))
      .order("desc")
      .collect();
  }
});

export const getCommentNumber = query({
  args: {
    postId: v.id("blogs")
  },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.postId);
    return blog?.commentCount ?? 0;
  }
});

export const createComment = mutation({
  args: {
    body: v.string(),
    postId: v.id("blogs")
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    const commentId = await ctx.db.insert("comments", {
      postId: args.postId,
      body: args.body,
      authorId: user._id,
      authorName: user.name,
      likes: 0,
      dislikes: 0
    });

    const blog = await ctx.db.get(args.postId);
    if (blog) {
      await ctx.db.patch(args.postId, {
        commentCount: (blog.commentCount ?? 0) + 1
      });
    }

    return commentId;
  }
});

export const handleVote = mutation({
  args: {
    commentId: v.id("comments"), 
    currentVote: v.union(v.literal("none"), v.literal("liked"), v.literal("disliked")),
    previousVote: v.union(v.literal("none"), v.literal("liked"), v.literal("disliked")),
  },
  handler: async (ctx, args) => {
    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new Error("Comment not found");

    let likesChange = 0;
    let dislikesChange = 0;

    if (args.previousVote === "liked") likesChange -= 1;
    if (args.previousVote === "disliked") dislikesChange -= 1;

    if (args.currentVote === "liked") likesChange += 1;
    if (args.currentVote === "disliked") dislikesChange += 1;

    const currentLikes = comment.likes ?? 0;
    const currentDislikes = comment.dislikes ?? 0;

    await ctx.db.patch(args.commentId, {
      likes: Math.max(0, currentLikes + likesChange),
      dislikes: Math.max(0, currentDislikes + dislikesChange)
    });

    return { success: true };
  }
});