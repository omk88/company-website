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
      authorName: user.name
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