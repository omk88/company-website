import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import { profile } from "console";
import { cubeTexture } from "three/src/nodes/accessors/CubeTextureNode.js";

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
    postId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    const blog = await ctx.db.get(args.postId);
    if (!blog) {
      throw new ConvexError("Blog post not found");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    if (!profile) {
      throw new ConvexError("User profile not found");
    }

    const commentId = await ctx.db.insert("comments", {
      postId: args.postId,
      body: args.body,
      authorId: user._id,
      authorName: user.name ?? profile.username, 
      authorProfilePic: profile.profilePic,  
      blogTitle: blog.title,                 
      likes: 0,
      dislikes: 0,
    });

    await ctx.db.patch(args.postId, {
      commentCount: (blog.commentCount ?? 0) + 1,
    });

    return commentId;
  },
});

export const getCommentVoteState = query({
  args: { commentId: v.id("comments") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return "none";

    const vote = await ctx.db
      .query("commentVotes")
      .withIndex("by_user_and_comment", (q) =>
        q.eq("userId", identity.subject).eq("commentId", args.commentId)
      )
      .unique();

    return vote ? vote.type : "none";
  },
});

export const toggleCommentVote = mutation({
  args: {
    commentId: v.id("comments"),
    targetVote: v.union(v.literal("liked"), v.literal("disliked")),
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
    let newDislikes = comment.dislikes ?? 0;
    
    let likesChange = 0;

    if (existingVote) {
      if (existingVote.type === args.targetVote) {
        await ctx.db.delete(existingVote._id);
        if (args.targetVote === "liked") {
          newLikes = Math.max(0, newLikes - 1);
          likesChange = -1;
        }
        if (args.targetVote === "disliked") {
          newDislikes = Math.max(0, newDislikes - 1);
        }
      } else {
        await ctx.db.patch(existingVote._id, { type: args.targetVote });
        if (args.targetVote === "liked") {
          newLikes += 1;
          newDislikes = Math.max(0, newDislikes - 1);
          likesChange = 1;
        } else {
          newDislikes += 1;
          newLikes = Math.max(0, newLikes - 1);
          likesChange = -1;
        }
      }
    } else {
      await ctx.db.insert("commentVotes", {
        userId,
        commentId: args.commentId,
        type: args.targetVote,
      });
      if (args.targetVote === "liked") {
        newLikes += 1;
        likesChange = 1;
      }
      if (args.targetVote === "disliked") {
        newDislikes += 1;
      }
    }

    await ctx.db.patch(args.commentId, {
      likes: newLikes,
      dislikes: newDislikes,
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