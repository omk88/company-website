import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const createPost = mutation({
  args: {
    title: v.string(),
    subtitle: v.string(),
    content: v.string(),
    author: v.string(),
    tags: v.array(v.string()),
    storageId: v.string(), 
  },
  handler: async (ctx, args) => {
    const generatedImageUrl = await ctx.storage.getUrl(args.storageId);

    const newBlogId = await ctx.db.insert("blogs", {
      title: args.title,
      subtitle: args.subtitle,
      content: args.content,
      author: args.author,
      tags: args.tags,
      storageId: args.storageId,
      imageUrl: generatedImageUrl || "",
      views: 0,
      likes: 0,
      dislikes: 0,
      featured: false,
      createdAt: Date.now(),
    });

    return newBlogId;
  },
});

export const toggleFeatured = mutation({
  args: { postId: v.id("blogs") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const currentFeatured = post.featured ?? false; 

    await ctx.db.patch(args.postId, {
      featured: !currentFeatured,
    });

    return !currentFeatured;
  },
});

export const incrementViews = mutation({
  args: { postId: v.id("blogs") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const currentViews = post.views ?? 0; 

    await ctx.db.patch(args.postId, {
      views: currentViews + 1,
    });

    return currentViews + 1;
  },
});

export const handleVote = mutation({
  args: {
    postId: v.id("blogs"),
    currentVote: v.union(v.literal("none"), v.literal("liked"), v.literal("disliked")),
    previousVote: v.union(v.literal("none"), v.literal("liked"), v.literal("disliked")),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    let likesChange = 0;
    let dislikesChange = 0;

    if (args.previousVote === "liked") likesChange -= 1;
    if (args.previousVote === "disliked") dislikesChange -= 1;

    if (args.currentVote === "liked") likesChange += 1;
    if (args.currentVote === "disliked") dislikesChange += 1;

    const currentLikes = post.likes ?? 0;
    const currentDislikes = post.dislikes ?? 0;

    await ctx.db.patch(args.postId, {
      likes: Math.max(0, currentLikes + likesChange),
      dislikes: Math.max(0, currentDislikes + dislikesChange)
    });

    return { success: true };

  }
})

export const deletePost = mutation({
  args: {
    id: v.id("blogs"), 
    storageId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    if (args.storageId) {
      try {
        await ctx.storage.delete(args.storageId);
      } catch (error) {
        console.error("Failed to delete associated image from storage:", error);
      }
    }

    await ctx.db.delete(args.id);

    return { success: true };
  },
});

export const updatePost = mutation({
  args: {
    postId: v.id("blogs"),
    title: v.string(),
    subtitle: v.string(),
    content: v.string(),
    author: v.string(),
    tags: v.array(v.string()),
    storageId: v.string(), 
  },
  handler: async (ctx, args) => {
    const { postId, ...fieldsToUpdate } = args;

    const currentPost = await ctx.db.get(postId);
    if (!currentPost) {
      throw new Error("Update targeted a blog post that no longer exists.");
    }

    let finalImageUrl = currentPost.imageUrl;

    if (fieldsToUpdate.storageId !== currentPost.storageId) {
      const generatedImageUrl = await ctx.storage.getUrl(fieldsToUpdate.storageId);
      finalImageUrl = generatedImageUrl || "";

      if (currentPost.storageId) {
        try {
          await ctx.storage.delete(currentPost.storageId);
        } catch (e) {
          console.warn("Could not remove orphaned storage asset:", e);
        }
      }
    }

    await ctx.db.patch(postId, {
      ...fieldsToUpdate,
      imageUrl: finalImageUrl,
    });

    return postId;
  },
});

export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("blogs")
      .order("desc")
      .collect();

    return posts.map(({ content, ...previewFields }) => previewFields);
  },
});

export const getPostById = query({
    args: {
        postId: v.id("blogs")
    },
    handler: async (ctx, args) => {
        const post = await ctx.db.get(args.postId);

        if(!post) {
            return null;
        }

        const resolvedImageUrl = post?.storageId !== undefined ? await ctx.storage.getUrl(post.storageId) : null;

        return {
            ...post,
            imageUrl: resolvedImageUrl
        };
    }
});